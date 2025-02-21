import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import Cookies from "js-cookie";
import type { IUser } from "provider/auth/AuthProvider";
import { redirect, useFetcher, useLoaderData } from "react-router";
import { getToken } from "utils/getToken";

// * Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const clientLoader = async ({ params }: { params: { id: string } }) => {
  const user = Cookies.get("user");
  if (!user) {
    return redirect("/auth/login");
  }

  const parsedUser: IUser = JSON.parse(user);
  const token = parsedUser.token;

  const productId = params.id;
  if (!productId) return redirect("/product");

  const product = await fetch(
    `${import.meta.env.VITE_API_URL}/bikes/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!product.ok) return redirect("/product");

  const productData = await product.json();

  return {
    product: productData.data,
    user: parsedUser,
  };
};

export const clientAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const quantity = Number(formData.get("quantity"));
  const price = Number(formData.get("price"));
  const productId = formData.get("productId") as string;
  const productName = formData.get("productName") as string;
  const email = formData.get("email") as string;

  const token = getToken();

  try {
    // * Create session using the API
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/payments/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quantity,
          price,
          productId,
          productName,
          email,
        }),
      }
    );

    if (!response.ok) {
      return { error: "Failed to create checkout session" }; 
    }

    const responseData = await response.json();
    const { session } = responseData;
    console.log("Session:", session);

    // * Redirect to checkout
    const stripe = await stripePromise;
    if (!stripe) throw new Error("Stripe not loaded");

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (err: any) {
    console.error("Payment error:", err);
    return { error: err.message };
  }
};

export default function CheckoutPage() {
  const { product, user } = useLoaderData();

  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(product.price);

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const error = fetcher.data?.error;

  return (
    <div className="container max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <fetcher.Form
        method="POST"
        className="bg-white rounded-lg shadow-md p-6 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between mb-4">
          <span>Product:</span>
          <span>{product.name}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span>Quantity:</span>
          <input
            type="number"
            name="quantity"
            id="quantity"
            defaultValue={quantity}
            required
            min={1}
            className="input input-bordered w-full max-w-xs"
            onChange={(e) => {
              setQuantity(parseInt(e.target.value));
              setTotal(product.price * parseInt(e.target.value));
            }}
          />
        </div>

        <input type="hidden" name="price" value={product.price} />
        <input type="hidden" name="productId" value={product.id} />
        <input type="hidden" name="productName" value={product.name} />
        <input type="hidden" name="email" value={user.email} />

        <div className="flex justify-between mb-4">
          <span>Price:</span>
          <span>${total}</span>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? "Processing..." : "Proceed to Payment"}
        </button>
      </fetcher.Form>
    </div>
  );
}
