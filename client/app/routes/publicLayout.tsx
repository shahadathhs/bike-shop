import NavBar from "components/shared/NavBar";
import React from "react";
import { Outlet } from "react-router";

export default function PublicLayout() {
  return (
    <main className="min-h-screen container mx-auto">
      <NavBar />
      <Outlet />
      <footer>Footer</footer>
    </main>
  );
}
