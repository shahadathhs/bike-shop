import Banner from "components/ui/Banner";
import type { Route } from "./+types/home";
import { useLoaderData } from "react-router";
import Product from "components/ui/Product";
import Testimonials from "components/ui/Testimonials";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bike Store - Home" },
    { name: "description", content: "Welcome to Bike Store" },
  ];
}

export const clientLoader = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes`);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Failed to fetch products");
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    return {
      error: "Failed to fetch products",
      errorDetails: err,
    };
  }
};

export default function Home() {
  const loaderData = useLoaderData();
  const products = loaderData.data.bikes;
  console.log("products", products);
  return (
    <div>
      <Banner />

      {/* Products section */}
      <Product products={products} />

      <Testimonials />
    </div>
  );
}
