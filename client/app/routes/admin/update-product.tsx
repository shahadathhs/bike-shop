import { useEffect, useState } from 'react'
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  type ActionFunction,
  type LoaderFunction,
} from 'react-router'
import { brands, categories, models } from '~/utils/bikeUtils'
import { getCookie } from '~/services/auth.services'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Loader2, Upload } from 'lucide-react'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url)
  const segments = url.pathname.split('/')
  const productId = segments[3] // /dashboard/update-product/:id
  const cookie = await getCookie(request)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${productId}`, {
      headers: { Authorization: `Bearer ${cookie.token}` },
    })
    const data = await response.json()
    return { success: true, product: data.data }
  } catch (err) {
    console.error('Error fetching product:', err)
    return { success: false, product: {} }
  }
}

export const action: ActionFunction = async ({ request }) => {
  const cookie = await getCookie(request)
  const formData = await request.formData()
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const modelName = formData.get('modelName') as string
  const price = formData.get('price') as string
  const quantity = formData.get('quantity') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const previousImage = formData.get('prev_image') as string
  const image = formData.get('image') as string

  const formDataObject = {
    name,
    brand,
    modelName,
    price: Number(price),
    quantity: Number(quantity),
    description,
    category,
    // Use the new base64 image if provided; otherwise fall back to the previous image URL.
    image: image ? image : previousImage,
  }

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${cookie.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObject),
    })
    const data = await response.json()
    return { success: true, data, message: 'Product Updated Successfully' }
  } catch (err) {
    console.error('Error updating product:', err)
    return { success: false, data: {}, message: 'Failed to update the product.' }
  }
}

export default function UpdateProduct() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { product } = useLoaderData<{ success: boolean; product: any }>()
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'

  const navigate = useNavigate()

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success('Product updated successfully')
      const timer = setTimeout(() => navigate('/admin/products'), 1000)
      return () => clearTimeout(timer)
    } else if (fetcher.data?.message) {
      toast.error(fetcher.data.message)
    }
  }, [fetcher.data, navigate])

  const [image, setImage] = useState<string>(product.image || '')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (['image/jpeg', 'image/png'].includes(file.type)) {
        const reader = new FileReader()
        reader.onload = () => setImage(reader.result as string)
        reader.readAsDataURL(file)
      } else {
        toast.error('Invalid file. Please select a JPEG or PNG image.')
      }
    }
  }

  return (
    <div className="py-10">
      <div className="pb-4">
        <h3 className="text-3xl">Update Bike Data</h3>
        <p>Modify the details of the existing bike product</p>
      </div>
      <fetcher.Form method="post" encType="multipart/form-data" className="space-y-4">
        <input type="hidden" name="id" value={product._id} />
        <input type="hidden" name="prev_image" value={product.image} />
        <input type="hidden" name="image" value={image} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" defaultValue={product.name} required />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select name="brand" required defaultValue={product.brand}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(b => (
                    <SelectItem key={b.value} value={b.value}>
                      {b.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelName">Model</Label>
              <Select name="modelName" required defaultValue={product.modelName}>
                <SelectTrigger id="modelName">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(m => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required defaultValue={product.category}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              id="price"
              name="price"
              defaultValue={product.price}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2 max-w-md">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              type="number"
              id="quantity"
              name="quantity"
              defaultValue={product.quantity}
              min="10"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 max-w-md">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product.description}
              rows={5}
              required
            />
          </div>

          <div className="space-y-2 max-w-md">
            <Label htmlFor="imageInput">Product Image</Label>
            <div className="flex items-start gap-2">
              <Input type="file" id="imageInput" onChange={handleImageChange} accept="image/*" />
              {image && (
                <img src={image} alt="Product Preview" className="w-24 h-16 rounded object-cover" />
              )}
            </div>
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Update Product
            </>
          )}
        </Button>
      </fetcher.Form>
    </div>
  )
}
