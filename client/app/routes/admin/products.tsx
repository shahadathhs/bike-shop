import Cookies from "js-cookie";
import type { IUser } from "provider/auth/AuthProvider";
import { Link, redirect, useLoaderData } from "react-router";

export const clientLoader = async () => {
  const user = Cookies.get("user");
  if (!user) {
    return redirect("/auth/login");
  }

  const parsedUser: IUser = JSON.parse(user);
  if (parsedUser.role !== "admin") {
    return redirect("/");
  }
  const token = parsedUser.token as string;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        products: data,
      };
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    return {
      error: "Failed to fetch products",
      products: [],
      errorDetails: err,
    };
  }
};
export default function Products() {
  const loaderData = useLoaderData();
  console.log("loaderData", loaderData);
  const products = loaderData.products.data;

  // Delete product handler
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this product?"))
  //     return;
  //   try {
  //     await axios.delete(`${import.meta.env.VITE_API_URL}/bikes/${id}`);
  //     setProducts(products.filter((product) => product._id !== id));
  //   } catch (err) {
  //     alert("Error deleting product");
  //   }
  // };

  // Restock product handler
  // const handleRestock = async (id) => {
  //   const newQuantity = prompt("Enter new quantity for restocking:");
  //   if (newQuantity === null) return;
  //   try {
  //     await axios.patch(`${import.meta.env.VITE_API_URL}/bikes/${id}/restock`, {
  //       quantity: Number(newQuantity),
  //     });
  //     setProducts(
  //       products.map((product) =>
  //         product._id === id
  //           ? { ...product, quantity: Number(newQuantity) }
  //           : product
  //       )
  //     );
  //   } catch (err) {
  //     alert("Error restocking product");
  //   }
  // };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Products</h1>
      <div className="mb-4">
        <Link to="/dashboard/admin/create-product" className="btn btn-primary">
          Create New Product
        </Link>
      </div>

      <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
        <table className=" w-full table table-zebra">
          {products.length > 0 ? (
            <>
              <thead className="text-center">
                <tr>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Model</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {products.map((product: any) => (
                  <tr key={product._id}>
                    <td>{product.name}</td>
                    <td>{product.brand}</td>
                    <td>{product.modelName}</td>
                    <td>{product.category}</td>
                    <td>${product.price}</td>
                    <td>{product.quantity}</td>
                    <td className="space-x-2">
                      <Link
                        to={`/dashboard/admin/update-product/${product._id}`}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        // onClick={() => handleRestock(product._id)}
                        className="btn btn-info btn-sm"
                      >
                        Restock
                      </button>
                      <button
                        // onClick={() => handleDelete(product._id)}
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          ) : (
            <tbody>
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No products found.
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
