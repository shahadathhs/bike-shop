import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

const latestUpdates = [
  {
    title: 'New Electric Bike Series Launch 🚴‍♂️⚡',
    description:
      'We’ve just launched our eco-friendly electric bike series with enhanced battery life and smoother rides. Check it out now!',
    date: 'May 1, 2025',
  },
  {
    title: 'Community Ride Event - June 10th 🌍',
    description:
      'Join our local community ride and explore city trails with fellow cycling enthusiasts. Register now to get a free kit!',
    date: 'April 28, 2025',
  },
  {
    title: 'Bike Maintenance Tips Blog 🛠️',
    description:
      'Read our latest blog post on how to maintain your bike for peak performance through every season.',
    date: 'April 25, 2025',
  },
]

export default function LatestUpdates() {
  return (
    <section className="py-10">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center text-primary mb-10">Latest Updates</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {latestUpdates.map((update, idx) => (
            <Card key={idx} className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-xl">{update.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{update.date}</p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{update.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
