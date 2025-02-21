import { useState } from "react";
import { Link } from "react-router";

const banners = [
  {
    id: 1,
    image: "/banner/1.png",
    title: "Discover the Best Deals!",
    subtitle: "Shop now and save big on your favorite products.",
    description:
      "Get ready to elevate your style with our latest collection. Discover the perfect blend of fashion and comfort. Shop now and experience the ultimate shopping experience.",
  },
  {
    id: 2,
    image: "/banner/2.png",
    title: "New Arrivals Are Here!",
    subtitle: "Check out the latest trends in our collection.",
    description:
      "Explore our latest arrivals and stay ahead of the fashion curve. From classic pieces to trendy styles, we have something for everyone. Shop now and elevate your wardrobe.",
  },
  {
    id: 3,
    image: "/banner/3.avif",
    title: "Limited Time Offer!",
    subtitle: "Hurry up! Exclusive discounts on selected items.",
    description:
      "Don't miss out on our limited-time offer! Get exclusive discounts on selected items. Shop now and enjoy amazing savings.",
  },
  {
    id: 4,
    image: "/banner/4.png",
    title: "Shop Now and Save!",
    subtitle: "Don't miss out on our amazing deals.",
    description:
      "Take advantage of our amazing deals and save big on your favorite products. Shop now and enjoy incredible discounts.",
  },
  {
    id: 5,
    image: "/banner/1.png",
    title: "Hurry Up!",
    subtitle: "Hurry up! Exclusive discounts on selected items.",
    description:
      "Don't miss out on our limited-time offer! Get exclusive discounts on selected items. Shop now and enjoy amazing savings.",
  },
  {
    id: 6,
    image: "/banner/3.avif",
    title: "Shop Now and Save!",
    subtitle: "Don't miss out on our amazing deals.",
    description:
      "Take advantage of our amazing deals and save big on your favorite products. Shop now and enjoy incredible discounts.",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent(current === 0 ? banners.length - 1 : current - 1);
  };

  const nextSlide = () => {
    setCurrent(current === banners.length - 1 ? 0 : current + 1);
  };

  return (
    <div className="relative w-full h-[500px] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full  object-contain"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
            <h1 className="text-4xl font-bold mb-2 text-primary bg-base-100 rounded-lg p-2">
              {banner.title}
            </h1>
            <p className="text-2xl mb-2 max-w-xl mx-auto text-white">{banner.subtitle}</p>
            <p className="text-lg text-white max-w-xl mx-auto">{banner.description}</p>
            <Link
              to="/product"
              className="btn btn-primary mt-4"
            >
              Shop Now
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 btn btn-sm btn-outline"
      >
        ❮
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 btn btn-sm btn-outline"
      >
        ❯
      </button>
    </div>
  );
}
