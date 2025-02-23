import { isRouteErrorResponse } from "react-router";
import type { Route } from "./+types/about";

export function meta() {
  return [
    { title: "Bike Store - About Us" },
    { name: "description", content: "Know more about us" },
  ];
}

export default function About() {
  return (
    <main className="pt-16 pb-4 container mx-auto">
      <h1 className="text-primary text-4xl font-bold mb-4 text-center">
        Know About Us
      </h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Our Mission</h2>
        <p className="mt-2 text-gray-400">
          At Bike Store, our mission is to provide high-quality, reliable, and
          innovative bicycles for riders of all levels. Whether you're a casual
          commuter or an adventure enthusiast, we are dedicated to enhancing
          your cycling experience with cutting-edge technology, sustainable
          practices, and exceptional customer service.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Who We Are</h2>
        <p className="mt-2 text-gray-400">
          Founded in 2020, we started as a small team of passionate cyclists who
          wanted to revolutionize the biking industry. Over the years, we've
          grown into a trusted brand, known for our commitment to quality and
          customer satisfaction. Our team consists of experienced engineers,
          designers, and cycling enthusiasts who work tirelessly to create
          innovative and durable bikes for every kind of rider.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">What We Offer</h2>
        <ul className="mt-2 text-gray-400 list-disc pl-5">
          <li>Wide range of bicycles, from road bikes to mountain bikes</li>
          <li>Custom bike configurations tailored to your needs</li>
          <li>High-quality parts and accessories</li>
          <li>Eco-friendly and sustainable manufacturing practices</li>
          <li>Expert maintenance and repair services</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Why Choose Us?</h2>
        <p className="mt-2 text-gray-400">
          We believe that a great biking experience starts with a great bike.
          That’s why we prioritize superior craftsmanship, advanced technology,
          and customer-focused solutions. Our commitment to quality ensures that
          every ride you take is smooth, safe, and enjoyable.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Join Our Community</h2>
        <p className="mt-2 text-gray-400">
          Cycling is more than just a mode of transportation; it’s a lifestyle.
          Join our community of riders who share a love for adventure,
          sustainability, and innovation. Follow us on social media, participate
          in local events, and stay updated on the latest biking trends!
        </p>
      </section>
    </main>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto text-center">
      <h1 className="text-xl font-bold">{message}</h1>
      <p className="text-lg">{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code className="text-sm">{stack}</code>
        </pre>
      )}
    </main>
  );
}
