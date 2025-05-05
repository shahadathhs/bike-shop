import { Card, CardContent } from "~/components/ui/card"
import { Bike, Users, ShieldCheck, Store } from "lucide-react"

const stats = [
  {
    icon: <Bike className="w-6 h-6 text-primary" />,
    label: "Bikes Sold",
    value: "25,000+",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    label: "Happy Customers",
    value: "18,000+",
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    label: "Warranty Coverage",
    value: "2 Years",
  },
  {
    icon: <Store className="w-6 h-6 text-primary" />,
    label: "Retail Locations",
    value: "30+",
  },
]

export default function HomeStats() {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center shadow-md">
            <CardContent className="py-6 flex flex-col items-center justify-center space-y-2">
              {stat.icon}
              <h3 className="text-2xl font-semibold">{stat.value}</h3>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
