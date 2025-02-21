export default function WhyChooseUs() {
  return (
    <div className="py-16">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
            <p className="text-gray-500">
              We guarantee fast and reliable delivery so you can enjoy your new products as soon as possible.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Premium Quality</h3>
            <p className="text-gray-500">
              We offer only the highest quality products sourced from trusted manufacturers.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-lg">
            <h3 className="text-xl font-semibold mb-4">24/7 Customer Support</h3>
            <p className="text-gray-500">
              Our dedicated customer service team is available 24/7 to assist you with any inquiries.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
