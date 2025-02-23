import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "utils/getToken";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = getToken();

  // Fetch users with pagination and optional email filtering.
  const fetchUsers = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/auth/getAll?page=${page}&limit=${limit}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch users");
      }
      const responseData = await response.json();
      setUsers(responseData.data.users);
      setMetadata(responseData.data.metadata);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch users");
      toast.error(err.message || "Failed to fetch users");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchUsers(metadata.page, metadata.limit);
    }
  }, [token, metadata.page, metadata.limit]);

  // Calculate total pages for pagination
  const totalPages = Math.ceil(metadata.total / metadata.limit);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className=" w-full table table-zebra">
            <thead className="bg-gray-200">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user: any) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.isActive ? "Active" : "Inactive"}
                  </td>
                  <td className="flex gap-2">
                    {user.isActive && (
                      <button className="btn btn-error btn-sm">
                        Deactivate
                      </button>
                    )}
                    {!user.isActive && (
                      <button className="btn btn-success btn-sm">
                        Activate
                      </button>
                    )}
                    {user.role === "admin" && (
                      <button className="btn btn-warning btn-sm">
                        Make User
                      </button>
                    )}
                    {user.role === "customer" && (
                      <button className="btn btn-info btn-sm">
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-end gap-4 items-center mt-4">
        <button
          onClick={() =>
            setMetadata((prev) => ({
              ...prev,
              page: Math.max(prev.page - 1, 1),
            }))
          }
          className="btn btn-outline btn-sm"
          disabled={metadata.page === 1}
        >
          Previous
        </button>
        <span className="text-secondary">
          Page {metadata.page} of {totalPages}
        </span>
        <button
          onClick={() =>
            setMetadata((prev) => ({
              ...prev,
              page: prev.page < totalPages ? prev.page + 1 : prev.page,
            }))
          }
          className="btn btn-outline btn-sm"
          disabled={metadata.page >= totalPages}
        >
          Next
        </button>
        <div>
          <select
            value={metadata.limit}
            onChange={(e) =>
              setMetadata((prev) => ({
                ...prev,
                limit: parseInt(e.target.value),
                page: 1,
              }))
            }
            className="select select-bordered btn-sm"
          >
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>
    </div>
  );
}
