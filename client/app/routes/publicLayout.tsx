import Footer from "components/shared/Footer";
import NavBar from "components/shared/NavBar";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <main className="container mx-auto">
      <NavBar />
      <div className="min-h-[calc(100vh-10rem)] py-2">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
}
