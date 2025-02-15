import React from "react";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <main className="min-h-screen container mx-auto">
      <nav>Navbar</nav>
      <Outlet />
      <footer>Footer</footer>
    </main>
  );
}
