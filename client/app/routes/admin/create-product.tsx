import { useEffect, useState } from "react";
import {
  Form,
  useFetcher,
  useNavigate,
  type ClientActionFunctionArgs,
} from "react-router";
import { brands, categories, models } from "utils/bikeUtils";
import toast from "react-hot-toast";
import { getToken } from "utils/getToken";

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const modelName = formData.get("model") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;

  const formDataObject = {
    name,
    brand,
    modelName,
    price: Number(price),
    quantity: Number(quantity),
    description,
    category,
    image,
  };

  const token = getToken();
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formDataObject),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message,
        errorDetails: errorData,
      };
    }
  } catch (error: any) {
    console.error("Error creating product:", error);
    return {
      error: error.message || "Failed to create product",
      errorDetails: error,
    };
  }
};

export default function CreateProduct() {
  const fetcher = useFetcher();
  // console.log("fetcher", fetcher);
  const isSubmitting = fetcher.state === "submitting";

  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.dismiss();
      toast.success("Product created successfully");

      // * wait for 1 second before navigating
      const timer = setTimeout(() => {
        navigate("/dashboard/admin/products");
      }, 1000);

      return () => clearTimeout(timer);
    } else if (fetcher.data?.error) {
      toast.dismiss();
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, navigate]);

  const [image, setImage] = useState("");

  // * Convert selected image to base64 string
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      if (file.type === "image/jpeg" || file.type === "image/png") {
        reader.onload = () => {
          setImage(reader.result as string);
        };
      } else {
        toast.dismiss();
        toast.error("Please select a valid image file (JPEG or PNG)");
      }
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold my-4 text-center">
        Store New Bike data
      </h1>
      <fetcher.Form method="post" className="max-w-lg mx-auto space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="brand" className="block mb-1">
            Brand
          </label>
          <select
            id="brand"
            name="brand"
            className="select select-bordered w-full"
            required
          >
            {brands.map((brand) => (
              <option key={brand.value} value={brand.value}>
                {brand.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="model" className="block mb-1">
            Model
          </label>
          <select
            id="model"
            name="model"
            className="select select-bordered w-full"
            required
          >
            {models.map((model) => (
              <option key={model.value} value={model.value}>
                {model.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block mb-1">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            className="input input-bordered w-full"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            className="select select-bordered w-full"
            required
          >
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            className="textarea textarea-bordered w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="quantity" className="block mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            className="input input-bordered w-full"
            min="10"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block mb-1">
            Product Image
          </label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
            accept="image/*"
          />
          <input type="hidden" name="image" value={image} />
          {image && (
            <img
              src={image}
              alt="Product Preview"
              className="mt-2 w-32 h-32 object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Creating..." : "Create Product"}
        </button>
      </fetcher.Form>
    </div>
  );
}
