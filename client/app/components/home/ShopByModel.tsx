import { useNavigate } from 'react-router'
import { Button } from '~/components/ui/button'
import { BorderBeam } from '../magicui/border-beam'

const bikeModels = ['All Models', 'Sport', 'Cruiser', 'Touring', 'Standard']

export default function ShopByModel() {
  const navigate = useNavigate()

  const handleSelect = (model: string) => {
    const queryParam = model === 'All Models' ? 'all' : model
    navigate(`/product?searchTerm=&page=1&category=all&model=${queryParam}`)
  }

  return (
    <section className="relative py-10 border overflow-hidden rounded text-center space-y-6">
      <h2 className="text-3xl font-bold text-primary">Shop by Model</h2>
      <div className="flex flex-wrap justify-center gap-4">
        {bikeModels.map(model => (
          <Button key={model} variant="outline" onClick={() => handleSelect(model)}>
            {model}
          </Button>
        ))}
      </div>
      <BorderBeam
        duration={30}
        size={300}
        reverse
        className="from-transparent via-green-500 to-transparent"
      />
    </section>
  )
}
