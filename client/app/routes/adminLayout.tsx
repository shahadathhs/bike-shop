import { Link, Outlet } from "react-router";

export default function DashboardAdminLayout() {
  return (
    <main className="min-h-screen w-full flex justify-between">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-start">
          {/* Page content here */}
          <Outlet />

          {/* button to open drawer in mobile view */}
          <div className="fixed top-4 right-4 z-50">
            <label
              htmlFor="my-drawer-2"
              className="btn btn-primary drawer-button lg:hidden"
            >
              Open Menu
            </label>
          </div>
        </div>

        {/* Drawer side content here */}
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-40 p-4">
            {/* Sidebar content here */}
            <li>
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.route}
                  className="btn btn-ghost text-md"
                >
                  {item.label}
                </Link>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
const navItems = [
  { label: "Home", route: "/" },
  { label: "Admin", route: "/dashboard/admin" },
  { label: "Users", route: "/dashboard/admin/users" },
  { label: "Analytics", route: "/dashboard/admin/analytics" },
  { label: "Orders", route: "/dashboard/admin/projects" },
];