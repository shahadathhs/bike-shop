import { Link, redirect, useLoaderData } from "react-router";
import { getToken } from "utils/getToken";

export const clientLoader = async ({ params }: { params: { id: string } }) => {
  const token = getToken();

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

  return productData;
};

export default function ProductDetailsPage() {
  const loaderData = useLoaderData();
  const product = loaderData.data;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Product Image */}
        <div className="md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover rounded"
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="mb-2 text-gray-600">
            <span className="font-semibold">Brand:</span> {product.brand}
          </p>
          <p className="mb-2 text-gray-600">
            <span className="font-semibold">Model:</span> {product.model}
          </p>
          <p className="mb-2 text-gray-600">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="mb-2 text-gray-600">
            <span className="font-semibold">Price:</span> ${product.price}
          </p>
          <p className="mb-2 text-gray-600">
            <span className="font-semibold">Available Quantity:</span>{" "}
            {product.quantity}
          </p>
          <p className="mb-4 text-gray-700">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to={`/product/${product._id}/checkout`}
              className="btn btn-primary"
            >
              Buy Now
            </Link>
            <Link to="/product" className="btn btn-secondary">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
