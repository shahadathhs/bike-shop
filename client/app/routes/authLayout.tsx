import NavBar from "components/shared/NavBar";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <main className="min-h-screen container mx-auto">
      <NavBar />
      <Outlet />
    </main>
  );
}
