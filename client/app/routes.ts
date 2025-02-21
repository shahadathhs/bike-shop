import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // * Home Layout routes
  layout("routes/publicLayout.tsx", [
    index("routes/public/home.tsx"),
    route("/about", "routes/public/about.tsx"),
    route("/product", "routes/public/product.tsx"),
    route("/product/:id", "routes/public/productDetails.tsx"), // * protected route
    route("/product/:id/checkout", "routes/public/checkout.tsx"), // * protected route
    route("/checkout/success", "routes/public/checkoutSuccess.tsx"), // * protected route
    route("/checkout/cancel", "routes/public/checkoutCancel.tsx"), // * protected route
  ]),

  //* Auth routes
  layout("routes/authLayout.tsx", [
    route("/auth/register", "routes/auth/register.tsx"),
    route("/auth/login", "routes/auth/login.tsx"),
  ]),

  // * Admin routes
  layout("routes/adminLayout.tsx", [
    ...prefix("dashboard/admin", [
      index("routes/admin/admin.tsx"),
      route("/users", "routes/admin/users.tsx"),
      route("/analytics", "routes/admin/analytics.tsx"),
      route("/products", "routes/admin/products.tsx"),
      route("/create-product", "routes/admin/create-product.tsx"),
      route("/update-product/:id", "routes/admin/update-product.tsx"),
      route("/orders", "routes/admin/orders.tsx"),
    ]),
  ]),

  // * customer routes
  layout("routes/customerLayout.tsx", [
    ...prefix("dashboard/customer", [
      index("routes/customer/customer.tsx"),
      route("/orders", "routes/customer/orders.tsx"),
      route("/profile", "routes/customer/profile.tsx"),
      route("/tracking", "routes/customer/tracking.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
