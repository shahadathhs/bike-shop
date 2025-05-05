import { Card, CardHeader, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Badge } from "~/components/ui/badge"

export function meta() {
  return [
    { title: "Bike Store - Terms of Service" },
    { name: "description", content: "Know more about our terms of service" },
  ]
}

export default function TermsOfService() {
  return (
    <main className="container py-16 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Terms of Service</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          By using our site and services, you agree to the following terms. Please read them
          carefully.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            By accessing or using the Bike Store website, you agree to be bound by these terms of
            service. If you do not agree, please refrain from using our services.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">User Responsibilities</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            You agree to provide accurate information, use our services legally, and comply with all
            relevant regulations. Misuse or fraudulent activity may result in account termination.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Account Security</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            You are responsible for safeguarding your account details. Notify us immediately if you
            suspect unauthorized use or breach of security.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Bike Store shall not be held liable for indirect, incidental, or consequential damages
            arising from your use of our services or inability to access them.
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Badge variant="secondary">Last updated: January 2025</Badge>
      </div>
    </main>
  )
}
