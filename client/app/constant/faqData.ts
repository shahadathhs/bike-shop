export interface FAQ {
  question: string
  answer: string
}

export const faqData: FAQ[] = [
  {
    question: 'How do I place an order?',
    answer:
      'Browse our products, select your quantity, then proceed to checkout. Enter your payment details and confirm—your order is on its way!',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We accept all major credit cards via Stripe, plus PayPal and Apple Pay. Choose your preferred option in the secure checkout flow.',
  },
  {
    question: 'Can I cancel my order after purchasing?',
    answer:
      'You can cancel within 24 hours of placing your order. Contact support ASAP and we’ll reverse the charge before fulfillment.',
  },
  {
    question: 'Do you offer international shipping?',
    answer:
      'Yes! We ship worldwide. Rates and delivery estimates will be shown at checkout once you enter your address.',
  },
  {
    question: 'How can I contact customer support?',
    answer:
      'Reach us via email at support@example.com, call +1 (555) 123-4567, or click the chat icon in the bottom corner anytime.',
  },
  {
    question: 'What is your return policy?',
    answer:
      'We offer hassle-free returns within 30 days. Simply open a return request in your account dashboard and follow the steps.',
  },
  {
    question: 'Do you have a loyalty program?',
    answer:
      'Yes! Earn points on every purchase, referral, and review. Redeem them for discounts at checkout. Sign up in your profile.',
  },
  {
    question: 'Where are you located?',
    answer:
      'Our headquarters are in New York City, but we ship from fulfillment centers across the U.S. to speed up delivery.',
  },
  {
    question: 'Can I track my shipment?',
    answer:
      'Absolutely. Once your order ships, you’ll receive an email with a tracking link. You can also view status in your account.',
  },
  {
    question: 'Are your products eco-friendly?',
    answer:
      'We use sustainable materials whenever possible and package orders in recyclable or compostable materials.',
  },
]
