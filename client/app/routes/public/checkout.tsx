import Cookies from "js-cookie";
import { redirect } from "react-router";

export const clientLoader = () => {
  const user = Cookies.get("user");
  if (!user) {
    return redirect("/auth/login");
  }

  return null;
};

export default function CheckoutPage() {
  return <div>CheckoutPage</div>;
}
