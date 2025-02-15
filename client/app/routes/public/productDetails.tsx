import { useParams } from "react-router";

export default function ProductDetailsPage() {
  const params = useParams();
  console.log("params", params);
  return (
    <div>ProductDetailsPage</div>
  )
}
