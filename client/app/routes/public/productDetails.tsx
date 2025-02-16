import { useParams, redirect } from "react-router";
import Cookies from "js-cookie";

export const clientLoader = () => {
  const user = Cookies.get("user");
  if (!user) {
    return redirect("/auth/login");
  }

  return null;
};

export default function ProductDetailsPage() {
  const params = useParams();
  console.log("params", params);
  return (
    <div>ProductDetailsPage</div>
  )
}
