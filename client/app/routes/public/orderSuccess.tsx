import { useEffect } from 'react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

export default function OrderSuccessPage() {
  // Clear cart on success page load (as a backup)
  useEffect(() => {
    localStorage.setItem('cart', '[]')
  }, [])

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card className="border-2 shadow-lg">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Order Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Thank you for your purchase. Your order has been placed successfully and is now being
            processed.
          </p>

          <div className="bg-muted/30 rounded-lg p-4 my-6">
            <div className="flex justify-between mb-2">
              <span className="text-muted-foreground">Order Number:</span>
              <span className="font-medium">
                {Math.floor(Math.random() * 1000000)
                  .toString()
                  .padStart(6, '0')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <p className="text-sm">
            A confirmation email has been sent to your email address with all the details of your
            order.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Link to="/customer/orders">
            <Button variant="outline" className="w-full">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Button>
          </Link>
          <Link to="/product">
            <Button className="w-full">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
