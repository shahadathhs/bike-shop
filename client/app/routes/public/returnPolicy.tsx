import { Card, CardHeader, CardContent } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Badge } from "~/components/ui/badge"

export function meta() {
  return [
    { title: "Bike Store - Return Policy" },
    { name: "description", content: "Know more about our return policy" },
  ]
}

export default function ReturnPolicy() {
  return (
    <main className="container py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Return Policy</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Your satisfaction is our priority. Here’s how returns and refunds work at Bike Store.
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Return Eligibility</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Items can be returned within 30 days of purchase, provided they are unused, in original
            packaging, and with a receipt.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">How to Return an Item</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            To initiate a return, please contact our support team via email or phone. Once your
            return request is approved, we will send you instructions on how to return the item.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Refund Process</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Once we receive the returned item, we will process your refund to the original payment
            method within 7–10 business days.
          </p>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-semibold">Non-Returnable Items</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            Some items, such as customized or sale items, may not be eligible for return. Please
            check with our support team for more details.
          </p>
        </CardContent>
      </Card>

      <div className="text-center mt-12">
        <Badge variant="secondary">Last updated: January 2025</Badge>
      </div>
    </main>
  )
}
