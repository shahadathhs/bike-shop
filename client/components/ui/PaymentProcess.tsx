import { Link } from "react-router";

export default function PaymentProcess() {
  return (
    <div className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">
          How Our Payment Process Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Step 1: Select Your Product
            </h3>
            <p className="text-gray-500">
              Choose the product you’d like to purchase and select the quantity.
              Once you've made your selection, proceed to the checkout page to
              finalize your order.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Step 2: Go to Checkout
            </h3>
            <p className="text-gray-500">
              After selecting your quantity, you’ll be directed to our secure
              checkout page. Here, you can review your order before proceeding.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Step 3: Secure Stripe Payment
            </h3>
            <p className="text-gray-500">
              On the Stripe checkout page, enter your payment details. Once
              payment is successful, you’ll be redirected to the order
              confirmation page.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              Step 4: Order Confirmation
            </h3>
            <p className="text-gray-500">
              After a successful payment, click the confirmation button to
              finalize your order and receive an order confirmation email.
            </p>
          </div>
          <div className="md:col-span-2">
            <div className="md:max-w-[50%] mx-auto bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Step 5: Payment Unsuccessful?
              </h3>
              <p className="text-gray-500">
                If your payment is unsuccessful, you’ll be redirected to the
                cancellation page. From there, you can either try again or
                return to the homepage.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Link to="/product" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
