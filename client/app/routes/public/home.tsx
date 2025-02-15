import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bike Store - Home" },
    { name: "description", content: "Welcome to Bike Store" },
  ];
}

export default function Home() {
  return <h1 className="text-primary">Home Page</h1>;
}
