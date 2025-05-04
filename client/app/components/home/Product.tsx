import { Link, useLoaderData } from 'react-router'
import type { ProductCard } from '~/types/product'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { truncate } from '~/lib/utils'
import { BorderBeam } from '../magicui/border-beam'

export default function Product() {
  const loaderData = useLoaderData()
  const products = loaderData?.data?.bikes

  if (!products || products.length === 0) return null

  return (
    <section>
      <div className="mx-auto text-center">
        <h2 className="text-4xl font-bold mb-3">Popular Bikes</h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto">
          Explore our most loved bicycles—crafted for speed, comfort, and durability.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.slice(0, 6).map((product: ProductCard) => (
          <Card
            key={product._id}
            className="relative overflow-hidden pt-0"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[200px] object-cover border-b rounded-t-md"
            />

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between pb-3">
                <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                <Badge variant="outline">New</Badge>
              </div>
              <CardDescription>{truncate(product.description, 90)}</CardDescription>
            </CardHeader>

            <CardContent className="mt-auto">
              <Button asChild className="w-full">
                <Link to={`/product/${product._id}`}>Buy Now</Link>
              </Button>
            </CardContent>

            {/* Border beam */}
            <BorderBeam duration={8} size={100} />
          </Card>
        ))}
      </div>

      <div className="text-center mt-10">
        <Button asChild size="lg">
          <Link to="/product">View All Bikes</Link>
        </Button>
      </div>
    </section>
  )
}
