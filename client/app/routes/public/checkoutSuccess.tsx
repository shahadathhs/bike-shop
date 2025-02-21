import { useLocation } from "react-router";

export default function CheckoutOutSuccess() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const product = searchParams.get("productId");
  const email = searchParams.get("email");
  const totalPrice = searchParams.get("price");
  const quantity = searchParams.get("quantity");

  console.log(product, email, totalPrice, quantity);

  return (
    <div>CheckoutOutSuccess</div>
  )
}
