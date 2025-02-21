import Footer from "components/shared/Footer";
import NavBar from "components/shared/NavBar";
import { useEffect, useState } from "react";
import { Outlet } from "react-router";

export default function PublicLayout() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <div>Loading...</div>;

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
