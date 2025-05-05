import { Card, CardHeader, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert"

export function meta() {
  return [
    { title: "Bike Store - About Us" },
    { name: "description", content: "Know more about us" },
  ]
}

export default function About() {
  return (
    <main className="container py-10 space-y-12">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Know About Us</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Learn who we are, what we stand for, and why cyclists trust us.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Our Mission</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            At Bike Store, our mission is to provide high-quality, reliable, and innovative bicycles
            for riders of all levels. Whether you're a casual commuter or an adventure enthusiast, we
            are dedicated to enhancing your cycling experience with cutting-edge technology,
            sustainable practices, and exceptional customer service.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Who We Are</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Founded in 2020, we started as a small team of passionate cyclists who wanted to
            revolutionize the biking industry. Over the years, we've grown into a trusted brand, known
            for our commitment to quality and customer satisfaction.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            Our team consists of experienced engineers, designers, and cycling enthusiasts who work
            tirelessly to create innovative and durable bikes for every kind of rider.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">What We Offer</h2>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Wide range of bicycles, from road bikes to mountain bikes</li>
            <li>Custom bike configurations tailored to your needs</li>
            <li>High-quality parts and accessories</li>
            <li>Eco-friendly and sustainable manufacturing practices</li>
            <li>Expert maintenance and repair services</li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Why Choose Us?</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            We believe that a great biking experience starts with a great bike. That’s why we
            prioritize superior craftsmanship, advanced technology, and customer-focused solutions.
            Our commitment to quality ensures that every ride you take is smooth, safe, and enjoyable.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Join Our Community</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Cycling is more than just a mode of transportation; it’s a lifestyle. Join our community
            of riders who share a love for adventure, sustainability, and innovation. Follow us on
            social media, participate in local events, and stay updated on the latest biking trends!
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
