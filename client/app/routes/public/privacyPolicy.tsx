import { Card, CardHeader, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Badge } from "~/components/ui/badge"

export function meta() {
  return [
    { title: "Bike Store - Privacy Policy" },
    { name: "description", content: "Know more about our privacy policy" },
  ]
}

export default function PrivacyPolicy() {
  return (
    <main className="container py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Privacy Policy</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your trust matters. Here’s how we handle your personal information.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            We collect personal information such as your name, email address, phone number, and
            payment details when you place an order or register an account on our website.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            The information we collect is used to process orders, improve our website, and
            communicate with you about your orders and promotions. We will never sell or share your
            personal information with third parties.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Data Security</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            We take the security of your personal data seriously. We use encryption and other
            security measures to protect your information from unauthorized access.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Your Rights</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            You have the right to access, modify, or delete your personal information. If you have
            any concerns, please contact our support team.
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Badge variant="secondary">Last updated: January 2025</Badge>
      </div>
    </main>
  )
}
