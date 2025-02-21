import { useEffect } from "react";
import { redirect, useFetcher, useLocation, useNavigate } from "react-router";
import { getToken } from "utils/getToken";
import toast from "react-hot-toast";

export const clientLoader = async ({ params }: { params: { id: string } }) => {
  const token = getToken();

  if (!token) return redirect("/auth/login");

  return null;
};

export const clientAction = async ({ request }: { request: Request }) => {
  const token = getToken();

  if (!token) return redirect("/auth/login");

  const formData = await request.formData();
  const product = formData.get("productId") as string;
  const email = formData.get("email") as string;
  const totalPrice = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product,
        email,
        totalPrice: Number(totalPrice),
        quantity: Number(quantity),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create order");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      error: "Failed to create order",
      errorDetails: error,
    };
  }
};

export default function CheckoutOutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  // * Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("productId") as string;
  const email = searchParams.get("email") as string;
  const price = searchParams.get("price") as string;
  const quantity = searchParams.get("quantity") as string;

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.error) {
      toast.dismiss();
      toast.error(fetcher.data.error);
    } else if (fetcher.data?.success) {
      toast.dismiss();
      toast.success("Order created successfully");

      // * wait for 1 second before navigating
      setTimeout(() => {
        // Clear the query parameters from the URL
        navigate("/");
      }, 1000);
    }
  }, [fetcher.data]);

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">Checkout Successful</h1>
      <p className="text-lg text-green-600">Your payment was successful!</p>
      <p>Order details:</p>
      <ul className="text-left mx-auto w-1/2">
        <li>Product ID: {price}</li>
        <li>Email: {email}</li>
        <li>Total Price: ${price}</li>
        <li>Quantity: {quantity}</li>
      </ul>

      <fetcher.Form method="post" className="mt-6">
        <input type="hidden" name="productId" value={productId} />
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="price" value={price} />
        <input type="hidden" name="quantity" value={quantity} />
        <button
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Order..." : "Create Order"}
        </button>
      </fetcher.Form>
    </div>
  );
}
