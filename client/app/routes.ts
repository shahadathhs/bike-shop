import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // * Public routes
  layout("routes/publicLayout.tsx", [
    index("routes/public/home.tsx"),
    route("/about", "routes/public/about.tsx"),
    route("/product", "routes/public/product.tsx"),
    route("/product/:id", "routes/public/productDetails.tsx"),
  ]),

  //* Auth routes
  layout("routes/authLayout.tsx", [
    route("/auth/register", "routes/auth/register.tsx"),
    route("/auth/login", "routes/auth/login.tsx"),
  ])
] satisfies RouteConfig;
