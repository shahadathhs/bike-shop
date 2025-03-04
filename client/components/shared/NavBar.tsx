import { useAuth } from "provider/auth/AuthContext";
import ThemeToggle from "provider/theme/ThemeToggle";
import { Link, NavLink } from "react-router";
import logoImg from "assets/logo.png";

function RouterNavLink({
  to,
  children,
  className = "",
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${className} ${isActive ? "btn btn-primary" : "btn btn-ghost"}`
      }
    >
      {children}
    </NavLink>
  );
}

const navItems = [
  {
    name: "Home",
    to: "/",
  },
  {
    name: "Products",
    to: "/product",
  },
  {
    name: "About Us",
    to: "/about",
  },
];

export default function NavBar() {
  const { user } = useAuth();

  return (
    <div className="navbar bg-base-100 shadow-sm">
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Dropdown Menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {navItems.map((item) => (
              <li key={item.name} className="my-1">
                <RouterNavLink to={item.to}>{item.name}</RouterNavLink>
              </li>
            ))}
          </ul>
        </div>
        {/* Logo */}
        <Link to="/">
          <img src={logoImg} alt="logo" className="max-h-16" />
        </Link>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.name} className="mx-1">
              <RouterNavLink to={item.to}>{item.name}</RouterNavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end flex items-center gap-3">
        {/* Dashboard or login Link */}
        {user ? (
          user.role === "admin" ? (
            <Link to="/dashboard/admin" className="btn btn-primary btn-outline">
              Dashboard
            </Link>
          ) : (
            <Link
              to="/dashboard/customer"
              className="btn btn-primary btn-outline"
            >
              Dashboard
            </Link>
          )
        ) : (
          <Link to="/auth/login" className="btn btn-primary btn-outline">
            Login
          </Link>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />
      </div>
    </div>
  );
}
