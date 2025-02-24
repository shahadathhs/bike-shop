import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  type ActionFunctionArgs,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { brands, categories, models } from "utils/bikeUtils";
import { getToken } from "utils/getToken";
import { parseFormData, type FileUpload } from "@mjackson/form-data-parser";
import { v2 as cloudinary } from "cloudinary";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  const id = params.id;

  const token = getToken();

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/bikes/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        product: data,
      };
    } else {
      throw new Error("Failed to fetch product");
    }
  } catch (err) {
    console.error("Error fetching product:", err);
    return {
      error: "Failed to fetch product",
      errorDetails: err,
    };
  }
};

export const action = async ({ request }: ActionFunctionArgs) => {
  // * step 1:  Configure Cloudinary
  cloudinary.config({
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
    api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  });

  // * step 2: Custom upload handler that streams the file to Cloudinary
  async function uploadHandler(fileUpload: FileUpload) {
    if (fileUpload.fieldName === "image") {
      return new Promise<string>((resolve, reject) => {
        // Start Cloudinary upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "bikes" }, // Optional: specify a folder in Cloudinary
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              return resolve("");
            }
            // Resolve with the secure URL from Cloudinary
            if (!error && result && result.secure_url) {
              resolve(result.secure_url);
            } else {
              reject(new Error("Cloudinary upload failed"));
            }
          }
        );
        // Pipe the file stream into Cloudinary's upload stream
        fileUpload.stream().pipeTo(
          new WritableStream({
            write(chunk) {
              uploadStream.write(chunk);
            },
            close() {
              uploadStream.end();
            },
          })
        );
      });
    }
    // * For other fields/files, simply pass the raw data
  }

  // * step 3: Parse the form data using the custom upload handler
  const formData = await parseFormData(request, uploadHandler);

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const brand = formData.get("brand") as string;
  const modelName = formData.get("modelName") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const previousImage = formData.get("prev_image") as string;
  const image = formData.get("image") as string;
  const token = formData.get("csrf_token") as string;

  const formDataObject = {
    name,
    brand,
    modelName,
    price: Number(price),
    quantity: Number(quantity),
    description,
    category,
    image: image ? image : previousImage,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/bikes/${id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObject),
      }
    );

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data,
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.message,
        errorDetails: errorData,
      };
    }
  } catch (err) {
    console.error("Error updating product:", err);
    return {
      error: "Failed to update product",
      errorDetails: err,
    };
  }
};

export default function UpdateProduct() {
  const loaderData = useLoaderData();
  const product = loaderData.product.data;

  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const token = getToken() as string;
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.dismiss();
      toast.success("Product Updated successfully");

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

  const [image, setImage] = useState(product.image);

  // * Convert selected image to base64 string
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
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
      <h1 className="text-3xl font-bold my-4 text-center">Update Product</h1>
      <fetcher.Form
        method="post"
        encType="multipart/form-data"
        className="max-w-lg mx-auto space-y-4"
      >
        <input type="hidden" name="csrf_token" value={token} />
        <input type="hidden" name="id" value={product._id} />

        <div>
          <label htmlFor="name" className="block mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={product.name}
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
            defaultValue={product.brand}
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
          <label htmlFor="modelName" className="block mb-1">
            Model
          </label>
          <select
            id="modelName"
            name="modelName"
            defaultValue={product.modelName}
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
            defaultValue={product.price}
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
            defaultValue={product.category}
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
            defaultValue={product.description}
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
            defaultValue={product.quantity}
            className="input input-bordered w-full"
            min="10"
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block mb-1">
            Product Image
          </label>
          <input type="hidden" name="prev_image" value={product.image} />
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            className="file-input file-input-bordered w-full"
            accept="image/*"
          />

          {image && (
            <img
              src={image}
              alt="Product Preview"
              className="mt-2 w-32 h-32 object-contain"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
      </fetcher.Form>
    </div>
  );
}
