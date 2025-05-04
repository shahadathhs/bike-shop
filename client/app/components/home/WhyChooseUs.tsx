import { nanoid } from 'nanoid'

export default function WhyChooseUs() {
  const features = [
    {
      title: 'Fast Delivery',
      description:
        'We guarantee fast and reliable delivery so you can enjoy your new products as soon as possible.',
    },
    {
      title: 'Premium Quality',
      description: 'We offer only the highest quality products sourced from trusted manufacturers.',
    },
    {
      title: '24/7 Customer Support',
      description:
        'Our dedicated customer service team is available 24/7 to assist you with any inquiries.',
    },
  ]

  return (
    <div className="py-16">
      <div className="max-w-screen-xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map(feature => (
            <div key={nanoid()} className="p-6 border shadow-md rounded-lg">
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
