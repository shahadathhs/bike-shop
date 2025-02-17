import Cookies from "js-cookie";
import type { IUser } from "provider/auth/AuthProvider";
import { useEffect } from "react";
import toast from "react-hot-toast";
import {
  Link,
  redirect,
  useFetcher,
  useLoaderData,
  type ClientActionFunctionArgs,
} from "react-router";
import { getToken } from "utils/getToken";

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

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const action = formData.get("action");

  const token = getToken();

  if (action === "delete") {
    const productId = formData.get("id");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bikes/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        return {
          success: true,
          message: "Product deleted successfully",
        };
      } else {
        const errorData = await response.json();
        return {
          error: errorData.message || "Failed to delete product",
          errorDetails: errorData,
        };
      }
    } catch (err: any) {
      console.error("Error deleting product:", err);
      return {
        error: err.message || "Failed to delete product",
        errorDetails: err,
      };
    }
  }

  if (action === "restock") {
    const productId = formData.get("id");
    const newQuantity = formData.get("quantity");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/bikes/${productId}/restock`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newQuantity }),
        }
      );

      if (response.ok) {
        return {
          success: true,
          message: "Product restocked successfully",
        };
      } else {
        const errorData = await response.json();
        return {
          error: errorData.message || "Failed to restock product",
          errorDetails: errorData,
        };
      }
    } catch (err: any) {
      console.error("Error restocking product:", err);
      return {
        error: err.message || "Failed to restock product",
        errorDetails: err,
      };
    }
  }
};

export default function Products() {
  const loaderData = useLoaderData();
  const products = loaderData.products.data;

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.dismiss();
      toast.success(fetcher.data.message || "Operation successful");
    } else if (fetcher.data?.error) {
      toast.dismiss();
      toast.error(fetcher.data.error);
    }
  }, []);

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
                    <td className="space-x-2 flex items-center gap-2 justify-center">
                      {/* Edit button */}
                      <Link
                        to={`/dashboard/admin/update-product/${product._id}`}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </Link>
                      {/* restock form */}
                      <fetcher.Form method="post">
                        <input type="hidden" name="action" value="restock" />
                        <input type="hidden" name="id" value={product._id} />
                        <button type="submit" className="btn btn-info btn-sm">
                          {isSubmitting ? "Restocking..." : "Restock"}
                        </button>
                      </fetcher.Form>
                      {/* Delete from */}
                      <fetcher.Form method="delete">
                        <input type="hidden" name="action" value="delete" />
                        <input type="hidden" name="id" value={product._id} />
                        <button type="submit" className="btn btn-error btn-sm">
                          {isSubmitting ? "Deleting..." : "Delete"}
                        </button>
                      </fetcher.Form>
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
