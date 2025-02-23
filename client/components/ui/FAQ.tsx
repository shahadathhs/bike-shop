export default function FAQ() {
  const faqData = [
    {
      question: "How do I place an order?",
      answer:
        "To place an order, simply browse our products, select the quantity, and proceed to checkout. From there, you can enter your payment details and finalize your order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards via Stripe, as well as other secure online payment methods. You can choose your preferred method during checkout.",
    },
    {
      question: "Can I cancel my order after purchasing?",
      answer:
        "Orders can only be canceled within 24 hours after purchase. Please contact our support team as soon as possible to process your cancellation.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we offer international shipping to most countries. Shipping fees and delivery times will vary based on your location, which you can check during checkout.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach out to our customer support team via email, phone, or our live chat feature on the website. We're happy to assist you with any inquiries!",
    },
  ];

  return (
    <div className="py-16 ">
      <div className="max-w-screen-xl mx-auto ">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqData.map((item) => (
            <div
              key={item.question}
              className="border p-6 rounded-lg shadow-md"
            >
              <h3 className="text-xl font-semibold mb-2">{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
