// MarksheetScanner.jsx
import React, { useState, useEffect, useRef } from "react";

/**
 * MarksheetScanner Component
 * Allows users to upload a marksheet image. It then uses the Gemini API (simulated here via fetch)
 * to extract CGPA, subjects, and grades. It determines eligibility based on CGPA,
 * saves data to local storage, and communicates the result back to the parent.
 *
 * @param {object} props - Component props.
 * @param {function} props.onEligibilityDetermined - Callback function to send scanned data and eligibility status to the parent.
 * @param {function} props.showInfoModal - Function provided by the parent to display modal messages.
 */
const MarksheetScanner = ({ onEligibilityDetermined, showInfoModal }) => {
  // State to hold the currently selected image file
  const [selectedImage, setSelectedImage] = useState(null);
  // State to store the extracted marksheet data (CGPA, semester, subjects)
  const [scannedData, setScannedData] = useState(null);
  // State to indicate if the scanning process is currently active
  const [loading, setLoading] = useState(false);

  // Ref for the file input element, allowing programmatic clicks if needed
  const fileInputRef = useRef(null);

  /**
   * Converts a File object to a Base64 string.
   * @param {File} file - The image file to convert.
   * @returns {Promise<string>} A promise that resolves with the Base64 string.
   */
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the "data:image/png;base64," prefix
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  /**
   * Handles the change event for the file input.
   * Validates the selected file is an image and updates the state.
   * @param {Event} event - The DOM event from the file input.
   */
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Check if the selected file is an image type
      if (file.type.startsWith("image/")) {
        setSelectedImage(file);
      } else {
        // If not an image, clear selection and show an error modal
        setSelectedImage(null);
        showInfoModal("Please upload an image file (e.g., JPG, PNG).");
      }
    } else {
      // If no file is selected (e.g., user cancels), clear selection
      setSelectedImage(null);
    }
  };

  /**
   * Handles the marksheet scanning process using the Gemini API.
   * Converts the image to Base64, constructs a prompt, sends it to Gemini API,
   * parses the response, and determines eligibility.
   */
  const handleScanMarksheet = async () => {
    // Prevent scanning if no image is selected
    if (!selectedImage) {
      showInfoModal("Please select a marksheet image to scan.");
      return;
    }

    setLoading(true); // Start loading state
    setScannedData(null); // Clear previous scanned data

    try {
      // Convert the selected image file to a Base64 string
      const base64ImageData = await fileToBase64(selectedImage);

      // Define the prompt for the Gemini API
      const prompt = `Extract the following academic details from this marksheet image in JSON format:
            - "cgpa": The cumulative grade point average (number).
            - "semester": The semester number (number).
            - "subjects": An array of objects, where each object has:
                - "name": The subject name (string).
                - "grade": The grade obtained in that subject (string, e.g., "A+", "O", "B").
            If any information is not found, use appropriate default values (e.g., 0 for numbers, "N/A" for strings, empty array for subjects).`;

      // Prepare the payload for the Gemini API call
      let chatHistory = [];
      chatHistory.push({ role: "user", parts: [{ text: prompt }] });
      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: selectedImage.type, // Use the actual MIME type of the uploaded image
                  data: base64ImageData,
                },
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              cgpa: { type: "NUMBER" },
              semester: { type: "NUMBER" },
              subjects: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    grade: { type: "STRING" },
                  },
                  propertyOrdering: ["name", "grade"],
                },
              },
            },
            propertyOrdering: ["cgpa", "semester", "subjects"],
          },
        },
      };

      // API key is handled by the Canvas environment when left as an empty string
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

      // Make the API call
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API error: ${response.status} ${response.statusText} - ${
            errorData.error.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();

      // Extract the generated JSON string from the API response
      let extractedData = null;
      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const jsonText = result.candidates[0].content.parts[0].text;
        try {
          extractedData = JSON.parse(jsonText);
        } catch (parseError) {
          console.error("Failed to parse JSON from API response:", parseError);
          showInfoModal(
            "Failed to parse marksheet data. The API returned an invalid format."
          );
          setLoading(false);
          return;
        }
      } else {
        showInfoModal(
          "Could not extract marksheet data. The API response was empty or malformed."
        );
        setLoading(false);
        return;
      }

      // Ensure extractedData has default structure if not all fields are found
      const finalExtractedData = {
        cgpa: extractedData.cgpa || 0,
        semester: extractedData.semester || 0,
        subjects: extractedData.subjects || [],
      };

      setScannedData(finalExtractedData); // Update state with scanned data

      // Determine the eligibility status based on CGPA
      let status = "no"; // Default status
      let isEligible = false;
      if (finalExtractedData.cgpa > 8.5) {
        status = "yes";
        isEligible = true;
      } else {
        status = "Access Denied"; // As per user requirement: "Access Denied" if CGPA <= 8.5
      }

      // Save the extracted data and eligibility status to local storage
      try {
        localStorage.setItem(
          "marksheetScannedData",
          JSON.stringify(finalExtractedData)
        );
        localStorage.setItem("marksheetEligibilityStatus", status);
        showInfoModal(
          `Marksheet scanned! CGPA: ${finalExtractedData.cgpa}. Status: ${status}. Data saved to local storage.`
        );
      } catch (e) {
        console.error("Failed to save to local storage:", e);
        showInfoModal(
          "Could not save data to local storage. Please check browser settings."
        );
      }

      // Call the parent's callback function with the results
      onEligibilityDetermined({ isEligible, status, data: finalExtractedData });
    } catch (error) {
      console.error("Error during marksheet scan:", error);
      showInfoModal(
        `Failed to scan marksheet: ${
          error.message || "An unexpected error occurred."
        }`
      );
      // Set status to "Access Denied" on error as the scan was unsuccessful
      onEligibilityDetermined({
        isEligible: false,
        status: "Access Denied",
        data: null,
      });
    } finally {
      setLoading(false); // End loading state regardless of success or failure
    }
  };

  /**
   * useEffect hook to load previously scanned data and status from local storage
   * when the component mounts.
   */
  useEffect(() => {
    try {
      const storedData = localStorage.getItem("marksheetScannedData");
      const storedStatus = localStorage.getItem("marksheetEligibilityStatus");
      if (storedData && storedStatus) {
        const parsedData = JSON.parse(storedData);
        setScannedData(parsedData); // Set scanned data from local storage
        const isEligible = storedStatus === "yes";
        // Inform the parent component about the loaded data and status
        onEligibilityDetermined({
          isEligible,
          status: storedStatus,
          data: parsedData,
        });
      }
    } catch (e) {
      console.error("Failed to load from local storage:", e);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="space-y-4">
      {/* Input for uploading marksheet image */}
      <div>
        <label
          htmlFor="marksheet-upload"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Upload Marksheet Image
        </label>
        <input
          id="marksheet-upload"
          type="file"
          accept="image/*" // Accept any image file type
          onChange={handleImageChange}
          ref={fileInputRef} // Assign ref to the input
          className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
        />
        {selectedImage && (
          <p className="mt-2 text-sm text-gray-600">
            Selected file:{" "}
            <span className="font-medium">{selectedImage.name}</span>
          </p>
        )}
      </div>

      {/* Button to trigger the scanning process */}
      <button
        onClick={handleScanMarksheet}
        disabled={!selectedImage || loading} // Disable if no image or while loading
        className={`w-full py-2 px-4 rounded-md font-semibold transition duration-300
                            ${
                              !selectedImage || loading
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed" // Disabled styling
                                : "bg-green-600 hover:bg-green-700 text-white shadow-md" // Enabled styling
                            }`}
      >
        {loading ? ( // Show loading spinner and text when scanning
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Scanning with AI...
          </span>
        ) : (
          "Scan Marksheet with AI" // Default button text
        )}
      </button>

      {/* Explanation for the AI scanning behavior */}
      <p className="text-sm text-gray-500 italic mt-4">
        Note: This scanner now uses a large language model (LLM) via the Gemini
        API to attempt to extract data from your marksheet image. The accuracy
        of extraction depends on the clarity of the image and the model's
        capabilities.
      </p>

      {/* Display the extracted scanned data if available */}
      {scannedData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6 shadow-sm">
          <h4 className="text-xl font-bold text-blue-800 mb-3">
            Scanned Academic Data (from AI)
          </h4>
          <p className="text-lg font-medium text-gray-700 mb-2">
            CGPA:{" "}
            <span
              className={`font-bold ${
                scannedData.cgpa > 8.5 ? "text-green-600" : "text-red-600"
              }`}
            >
              {scannedData.cgpa}
            </span>
          </p>
          <p className="text-md text-gray-600 mb-3">
            Semester:{" "}
            <span className="font-medium">{scannedData.semester}</span>
          </p>

          <h5 className="text-md font-semibold text-gray-700 mb-2">
            Subjects & Grades:
          </h5>
          {scannedData.subjects && scannedData.subjects.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              {scannedData.subjects.map((subject, index) => (
                <li key={index}>
                  <span className="font-medium">{subject.name || "N/A"}:</span>{" "}
                  {subject.grade || "N/A"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No subjects and grades extracted.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MarksheetScanner;
