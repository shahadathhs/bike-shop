import React from "react";
import { Link, redirect, useLocation } from "react-router";
import { XCircleIcon } from "lucide-react";
import { getToken } from "utils/getToken";

export const clientLoader = async ({ params }: { params: { id: string } }) => {
  const token = getToken();

  if (!token) return redirect("/auth/login");

  return null;
};

export default function CheckoutCancel() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productId = searchParams.get("productId");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm text-center">
        <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-4">
          Your checkout was canceled. Please try again or contact support for
          assistance.
        </p>

        <div className="flex justify-between">
          <Link to="/product" className="btn btn-sm btn-primary">
            Back to Products
          </Link>

          {productId && (
            <Link to={`/product/${productId}`} className="btn btn-sm btn-error">
              View Product Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
