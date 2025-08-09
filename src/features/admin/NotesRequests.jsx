// src/features/admin/NotesRequests.jsx
import React, { useState, useEffect } from "react";
import {
  getAllNotesAdmin,
  approveNote,
  denyNote,
  updateNote,
} from "../../services/adminService";

function NotesRequests() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    subject: "",
    branch: "",
    year: "",
    semester: "",
    driveLink: "",
  });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    const { notes: allNotes } = await getAllNotesAdmin();
    setNotes(allNotes || []);
    setLoading(false);
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setEditForm({
      title: note.title || "",
      subject: note.subject || "",
      branch: note.branch || "",
      year: note.year || "",
      semester: note.semester || "",
      driveLink: note.driveLink || "",
    });
  };

  const handleEditSave = async () => {
    if (!editingNote) return;
    setActionLoading(editingNote.id);

    const payload = {
      title: editForm.title.trim(),
      subject: editForm.subject.trim(),
      branch: editForm.branch.trim(),
      year: editForm.year.trim(),
      semester: editForm.semester.trim(),
      driveLink: editForm.driveLink.trim(),
      updatedAt: new Date(),
    };

    const { error } = await updateNote(editingNote.id, payload);
    if (!error) {
      await fetchNotes();
      setEditingNote(null);
    }
    setActionLoading(null);
  };

  const handleApprove = async (noteId) => {
    setActionLoading(noteId);
    const { error } = await approveNote(noteId);
    if (!error) {
      await fetchNotes();
    }
    setActionLoading(null);
  };

  const handleDeny = async (noteId) => {
    const reason = prompt("Enter denial reason (optional):");
    setActionLoading(noteId);
    const { error } = await denyNote(noteId, reason);
    if (!error) {
      await fetchNotes();
    }
    setActionLoading(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: "bg-yellow-100 text-yellow-800 px-2 py-1 rounded",
      approved: "bg-green-100 text-green-800 px-2 py-1 rounded",
      "access denied": "bg-red-100 text-red-800 px-2 py-1 rounded",
    };
    return badges[status] || "bg-gray-100 text-gray-800 px-2 py-1 rounded";
  };

  if (loading) return <div>Loading notes...</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Notes Upload Requests</h2>

      {editingNote && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Edit Note</h3>
            <input
              type="text"
              placeholder="Title"
              value={editForm.title}
              onChange={(e) =>
                setEditForm({ ...editForm, title: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Subject"
              value={editForm.subject}
              onChange={(e) =>
                setEditForm({ ...editForm, subject: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Branch"
              value={editForm.branch}
              onChange={(e) =>
                setEditForm({ ...editForm, branch: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Year"
              value={editForm.year}
              onChange={(e) =>
                setEditForm({ ...editForm, year: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Semester"
              value={editForm.semester}
              onChange={(e) =>
                setEditForm({ ...editForm, semester: e.target.value })
              }
              className="w-full border p-2 mb-2 rounded"
            />
            <input
              type="text"
              placeholder="Drive Link"
              value={editForm.driveLink}
              onChange={(e) =>
                setEditForm({ ...editForm, driveLink: e.target.value })
              }
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingNote(null)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={actionLoading === editingNote.id}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                {actionLoading === editingNote.id ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <p>No notes uploaded yet.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Title</th>
              <th className="border border-gray-300 p-2">Subject</th>
              <th className="border border-gray-300 p-2">Branch</th>
              <th className="border border-gray-300 p-2">Year/Semester</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Submitted</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note) => (
              <tr key={note.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{note.title}</td>
                <td className="border border-gray-300 p-2">{note.subject}</td>
                <td className="border border-gray-300 p-2">{note.branch}</td>
                <td className="border border-gray-300 p-2">
                  {note.year} / {note.semester}
                </td>
                <td className="border border-gray-300 p-2">
                  <span className={getStatusBadge(note.status)}>
                    {note.status}
                  </span>
                </td>
                <td className="border border-gray-300 p-2">
                  {note.createdAt?.toDate
                    ? new Date(note.createdAt.toDate()).toLocaleDateString()
                    : "-"}
                </td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {note.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(note.id)}
                        disabled={actionLoading === note.id}
                        className="text-green-600 hover:underline disabled:opacity-50"
                      >
                        {actionLoading === note.id
                          ? "Processing..."
                          : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDeny(note.id)}
                        disabled={actionLoading === note.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Deny
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleEditClick(note)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NotesRequests;
