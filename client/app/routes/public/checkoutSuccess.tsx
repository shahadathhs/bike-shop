import { useEffect } from "react";
import { redirect, useFetcher, useLocation, useNavigate } from "react-router";
import { getToken } from "utils/getToken";
import toast from "react-hot-toast";
import type { Route } from "./+types/checkoutSuccess";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bike Store - Checkout Success" },
    { name: "description", content: "Checkout Success" },
  ];
}

export const clientLoader = async () => {
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
    return { error: "Failed to create order", errorDetails: error };
  }
};

export default function CheckoutOutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
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

      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [fetcher.data]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="rounded-xl p-4 shadow-lg w-full max-w-md  border border-white/30">
        <h1 className="text-2xl font-bold mb-2 text-center">
          🎉 Payment Successful!
        </h1>
        <p className="text-lg  mb-2">
          Your order is pending. Confirm your order details below:
        </p>

        <p>
          <strong>Product ID:</strong> {productId}
        </p>
        <p>
          <strong>Email:</strong> {email}
        </p>
        <p>
          <strong>Total Price:</strong> ${price}
        </p>
        <p>
          <strong>Quantity:</strong> {quantity}
        </p>
        <fetcher.Form method="post" className="mt-4 text-center">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="price" value={price} />
          <input type="hidden" name="quantity" value={quantity} />

          <button
            className="btn btn-active btn-success"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Order..." : "Confirm Order"}
          </button>
        </fetcher.Form>
      </div>
    </div>
  );
}
