import { Link } from 'react-router'
import { nanoid } from 'nanoid'

const steps = [
  {
    title: 'Step 1: Select Your Product',
    description:
      "Choose the product you’d like to purchase and select the quantity. Once you've made your selection, proceed to the checkout page to finalize your order.",
  },
  {
    title: 'Step 2: Go to Checkout',
    description:
      'After selecting your quantity, you’ll be directed to our secure checkout page. Here, you can review your order before proceeding.',
  },
  {
    title: 'Step 3: Secure Stripe Payment',
    description:
      'On the Stripe checkout page, enter your payment details. Once payment is successful, you’ll be redirected to the order confirmation page.',
  },
  {
    title: 'Step 4: Order Confirmation',
    description:
      'After a successful payment, click the confirmation button to finalize your order and receive an order confirmation email.',
  },
  {
    title: 'Step 5: Payment Unsuccessful?',
    description:
      'If your payment is unsuccessful, you’ll be redirected to the cancellation page. From there, you can either try again or return to the homepage.',
  },
]

export default function PaymentProcess() {
  return (
    <div className="py-16">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-8">How Our Payment Process Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {steps.map((step, index) => (
            <div
              key={nanoid()}
              className={`border p-6 rounded-lg shadow-md ${
                index === steps.length - 1 ? 'md:col-span-2 md:max-w-[50%] mx-auto' : ''
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/product" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
