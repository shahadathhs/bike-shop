import c1 from "assets/customer/john.png";
import c2 from "assets/customer/jane.png";
import c3 from "assets/customer/mark.png";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      text: "Amazing service! I found exactly what I needed and the shopping experience was fantastic.",
      image: c1,
    },
    {
      id: 2,
      name: "Jane Smith",
      text: "Love the quality of the products! I'll definitely be shopping here again.",
      image: c2,
    },
    {
      id: 3,
      name: "Mark Lee",
      text: "Great prices and fast shipping! Highly recommend this store.",
      image: c3,
    },
  ];

  return (
    <div className="py-16">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-6">What Our Customers Say</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="w-full sm:w-1/3 p-4 bg-white rounded-lg shadow-lg">
              <div className="flex justify-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <p className="text-lg italic text-gray-700 mb-4">"{testimonial.text}"</p>
              <p className="text-md font-semibold">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
