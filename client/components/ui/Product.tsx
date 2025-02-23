import { Link } from "react-router";

export default function Product({ products }: any) {
  if (products.length === 0) return null;

  return (
    <div className="py-16">
       <h2 className="text-3xl font-bold mb-6 text-center">Popular Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.slice(0, 5).map((product: any) => (
          <div
            key={product._id}
            className="card bg-base-100 image-full w-96 shadow-xl"
          >
            <figure>
              <img src={product.image} alt="Product" />
            </figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p>{product.description.slice(0, 100) + "..."}</p>
              <div className="card-actions justify-end">
                <Link
                  to={`/product/${product._id}`}
                  className="btn btn-primary"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <Link to="/product" className="btn btn-primary">
          View All Products
        </Link>
      </div>
    </div>
  );
}
