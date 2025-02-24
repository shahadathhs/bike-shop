import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useFetcher } from "react-router";
import { getToken } from "utils/getToken";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();

  const action = formData.get("action") as string;
  const token = formData.get("token") as string;

  if (action === "delete") {
    const orderId = formData.get("orderId") as string;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "Order deleted successfully",
          data: data,
        };
      } else {
        const errorData = await response.json();
        return {
          error: errorData.message || "Failed to delete order",
          errorDetails: errorData,
        };
      }
    } catch (err: any) {
      console.error(err);
      return {
        error: err.message || "Failed to delete order",
      };
    }
  }

  if (action === "markAsDelivered") {
    const orderId = formData.get("orderId") as string;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "delivered" }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "Order marked as delivered successfully",
          data: data,
        };
      } else {
        const errorData = await response.json();
        return {
          error: errorData.message || "Failed to mark order as delivered",
          errorDetails: errorData,
        };
      }
    } catch (err: any) {
      console.error(err);
      return {
        error: err.message || "Failed to mark order as delivered",
      };
    }
  }

  if (action === "cancel") {
    const orderId = formData.get("orderId") as string;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          message: "Order canceled successfully",
          data: data,
        };
      } else {
        const errorData = await response.json();
        return {
          error: errorData.message || "Failed to cancel order",
          errorDetails: errorData,
        };
      }
    } catch (err: any) {
      console.error(err);
      return {
        error: err.message || "Failed to cancel order",
      };
    }
  }

  return null;
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetcher = useFetcher();

  const token = getToken();

  // Fetch orders with pagination and optional filtering.
  const fetchOrders = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      if (search) {
        queryParams.append("searchTerm", search);
      }

      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/orders/admin/getAll?${queryParams.toString()}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to fetch orders");
      }
      const responseData = await response.json();
      setOrders(responseData.data.orders);
      setTotal(responseData.data.metadata.total);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch orders");
      toast.error(err.message || "Failed to fetch orders");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) {
      fetchOrders(page, limit, searchTerm);
    }
  }, [token, page, limit, searchTerm, fetcher.state]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          placeholder="Search orders by name, category, or brand"
          className="input input-bordered max-w--xl"
        />
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      {!loading && orders.length > 0 && (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
          <table className="w-full table table-zebra">
            <thead className="bg-gray-200">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Product</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order: any, index: number) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order._id}</td>
                  <td>{order?.product?.name}</td>
                  <td>{order?.totalPrice}</td>
                  <td>{order?.status}</td>
                  <td className="flex gap-2">
                    {/* mark as delivered */}
                    {order?.status !== "delivered" && !order?.isDeleted && (
                      <fetcher.Form method="patch">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input
                          type="hidden"
                          name="action"
                          value="markAsDelivered"
                        />
                        <input
                          type="hidden"
                          name="token"
                          value={token as string}
                        />
                        <button type="submit" className="btn btn-info btn-sm">
                          Mark as Delivered
                        </button>
                      </fetcher.Form>
                    )}

                    {/* delete order */}
                    {order?.status === "delivered" || order?.isDeleted && (
                      <fetcher.Form method="delete">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="action" value="delete" />
                        <input
                          type="hidden"
                          name="token"
                          value={token as string}
                        />
                        <button type="submit" className="btn btn-info btn-sm">
                          Delete Order
                        </button>
                      </fetcher.Form>
                    )}

                    {/* cancel order */}
                    {order?.status !== "delivered" && !order?.isDeleted && (
                      <fetcher.Form method="patch">
                        <input type="hidden" name="orderId" value={order._id} />
                        <input type="hidden" name="action" value="cancel" />
                        <input
                          type="hidden"
                          name="token"
                          value={token as string}
                        />
                        <button type="submit" className="btn btn-info btn-sm">
                          Cancel Order
                        </button>
                      </fetcher.Form>
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
              setPage(1);
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
