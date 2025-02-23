import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getToken } from "utils/getToken";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const token = getToken();

  // Fetch users with pagination and optional email filtering.
  const fetchUsers = async (page = 1, limit = 10, email = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      // Append the email query parameter if provided.
      if (email) {
        queryParams.append("email", email);
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/getAll?${queryParams.toString()}`,
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
      setTotal(responseData.data.metadata.total);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch users");
      toast.error(err.message || "Failed to fetch users");
    }
    setLoading(false);
  };

  // Fetch users on state changes.
  useEffect(() => {
    if (token) {
      fetchUsers(page, limit, emailFilter);
    }
  }, [token, page, limit, emailFilter]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      {/* Email Filter Input */}
      <div className="mb-4">
        <input
          type="email"
          value={emailFilter}
          onChange={(e) => {
            setPage(1); // Reset to first page on filter change.
            setEmailFilter(e.target.value);
          }}
          placeholder="Filter by email"
          className="input input-bordered"
        />
      </div>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && users.length === 0 && <p>No users found.</p>}
      {!loading && users.length > 0 && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="w-full table table-zebra">
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
                  <td>{user.isActive ? "Active" : "Inactive"}</td>
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
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="btn btn-outline btn-sm"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="text-secondary">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
          className="btn btn-outline btn-sm"
          disabled={page >= totalPages}
        >
          Next
        </button>
        <div>
          <select
            value={limit}
            onChange={(e) => {
              setPage(1); // Reset page when limit changes.
              setLimit(parseInt(e.target.value));
            }}
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
