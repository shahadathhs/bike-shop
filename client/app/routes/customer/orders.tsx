import { useAuth } from "provider/auth/AuthContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CustomerOrders() {
  const { user } = useAuth();
  console.log("user", user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch orders for the logged in user
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/orders/myOrders/${user.email}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const responseData = await response.json();
        console.log("responseData", responseData);
        setOrders(responseData?.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch orders");
        toast.error(err.response?.data?.error || "Failed to fetch orders");
      }
      setLoading(false);
    };

    if (user && user.token) {
      fetchOrders();
    }
  }, [user]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">My Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && orders?.length === 0 && <p>No orders found.</p>}
      {!loading && orders?.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Order ID</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Total Price</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order: any) => (
                <tr key={order._id}>
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">${order.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
