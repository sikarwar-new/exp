// src/features/admin/AccessRequests.jsx
import React, { useState, useEffect } from "react";
import {
  getAllAccessRequests,
  approveAccessRequest,
  denyAccessRequest,
} from "../../services/adminService";

function AccessRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { requests: allRequests } = await getAllAccessRequests();
    setRequests(allRequests || []);
    setLoading(false);
  };

  const handleApprove = async (requestId) => {
    setActionLoading(requestId);
    const { error } = await approveAccessRequest(requestId);
    if (!error) {
      await fetchRequests();
    }
    setActionLoading(null);
  };

  const handleDeny = async (requestId) => {
    const reason = prompt("Enter denial reason (optional):");
    setActionLoading(requestId);
    const { error } = await denyAccessRequest(requestId, reason);
    if (!error) {
      await fetchRequests();
    }
    setActionLoading(null);
  };

  if (loading) return <div>Loading access requests...</div>;

  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Access Requests</h2>

      {requests.length === 0 ? (
        <p>No access requests at the moment.</p>
      ) : (
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">User Email</th>
              <th className="border border-gray-300 p-2">Requested Notes</th>
              <th className="border border-gray-300 p-2">Requested At</th>
              <th className="border border-gray-300 p-2">Status</th>
              <th className="border border-gray-300 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 p-2">{req.userEmail}</td>
                <td className="border border-gray-300 p-2">
                  <ul className="list-disc list-inside">
                    {req.requestedNotes.map((item) => (
                      <li key={item.title}>
                        {item.title} (x{item.quantity || 1})
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="border border-gray-300 p-2">
                  {new Date(
                    req.createdAt?.toDate
                      ? req.createdAt.toDate()
                      : req.createdAt
                  ).toLocaleString()}
                </td>

                <td className="border border-gray-300 p-2">{req.status}</td>
                <td className="border border-gray-300 p-2 space-x-2">
                  {req.status === "pending" ? (
                    <>
                      <button
                        onClick={() => handleApprove(req.id)}
                        disabled={actionLoading === req.id}
                        className="text-green-600 hover:underline disabled:opacity-50"
                      >
                        {actionLoading === req.id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleDeny(req.id)}
                        disabled={actionLoading === req.id}
                        className="text-red-600 hover:underline disabled:opacity-50"
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <span className="italic text-gray-600">{req.status}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AccessRequests;
