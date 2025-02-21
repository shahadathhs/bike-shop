import Cookies from "js-cookie";
import type { IUser } from "provider/auth/AuthProvider";
import { redirect, useLoaderData } from "react-router";

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
    product: productData,
    user: parsedUser,
  };
};

export default function CheckoutPage() {
  const loaderData = useLoaderData();
  const { product, user } = loaderData;
  console.log("loaderData", loaderData);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>
      <p>This is the checkout page.</p>
    </div>
  );
}
