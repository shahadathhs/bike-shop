import { Info } from 'lucide-react'
import { Card } from '../ui/card'

export default function NoProductsFound() {
  return (
    <Card className="flex flex-col items-center justify-center p-8">
      <Info className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
      <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
    </Card>
  )
}
