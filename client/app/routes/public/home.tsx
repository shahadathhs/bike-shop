import Banner from "components/ui/Banner";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Bike Store - Home" },
    { name: "description", content: "Welcome to Bike Store" },
  ];
}

export default function Home() {
  return (
    <div>
      <Banner />
    </div>
  );
}
