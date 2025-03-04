import Cookies from "js-cookie";
import { useAuth } from "provider/auth/AuthContext";
import ThemeToggle from "provider/theme/ThemeToggle";
import { Link, Outlet, redirect } from "react-router";

export const clientLoader = ({ request }: { request: Request }) => {
  const user = Cookies.get("user");
  if (!user) {
    return redirect("/auth/login");
  }

  const parsedUser = JSON.parse(user);
  if (parsedUser.role !== "customer") {
    return redirect("/");
  }

  const url = new URL(request.url)
  const pathname = url.pathname
  // console.log('pathname', pathname)
  if (pathname === "/dashboard/customer") {
    return redirect("/dashboard/customer/orders")
  }

  return null;
};

export default function DashboardCustomerLayout() {
  const { logout } = useAuth();

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
          <ul className="menu bg-base-200 text-base-content min-h-full flex flex-col justify-between w-40 p-4">
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

            {/* Logout button and Theme toggle */}
            <li>
              {/* Logout button */}
              <button onClick={logout} className="btn btn-error mb-2">
                Logout
              </button>

              {/* Theme toggle */}
              <ThemeToggle />
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
const navItems = [
  { label: "Home", route: "/" },
  // { label: "Customer", route: "/dashboard/customer" },
  { label: "Orders", route: "/dashboard/customer/orders" },
  { label: "Profile", route: "/dashboard/customer/profile" },
  // { label: "Orders Tracking", route: "/dashboard/customer/tracking" },
];
