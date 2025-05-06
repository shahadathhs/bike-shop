import { useEffect, useState } from 'react'
import { useFetcher, useNavigate, type ActionFunction } from 'react-router'
import { brands, categories, models } from '~/utils/bikeUtils'
import { parseFormData, type FileUpload } from '@mjackson/form-data-parser'
import { v2 as cloudinary } from 'cloudinary'
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

export const action: ActionFunction = async ({ request }) => {
  const cookie = await getCookie(request)

  // * step 1:  Configure Cloudinary
  cloudinary.config({
    cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
    api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
  })

  // * step 2: Custom upload handler that streams the file to Cloudinary
  async function uploadHandler(fileUpload: FileUpload) {
    if (fileUpload.fieldName === 'image') {
      return new Promise<string>((resolve, reject) => {
        // Start Cloudinary upload stream
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'bikes' }, // Optional: specify a folder in Cloudinary
          (error, result) => {
            if (error) {
              return reject(error)
            }
            // Resolve with the secure URL from Cloudinary
            if (result && result.secure_url) {
              resolve(result.secure_url)
            } else {
              reject(new Error('Cloudinary upload failed'))
            }
          },
        )
        // Pipe the file stream into Cloudinary's upload stream
        fileUpload.stream().pipeTo(
          new WritableStream({
            write(chunk) {
              uploadStream.write(chunk)
            },
            close() {
              uploadStream.end()
            },
          }),
        )
      })
    }
    // * For other fields/files, simply pass the raw data
  }

  // * step 3: Parse the form data using the custom upload handler
  const formData = await parseFormData(request, uploadHandler)

  const name = formData.get('name') as string
  const brand = formData.get('brand') as string
  const modelName = formData.get('model') as string
  const price = formData.get('price') as string
  const quantity = formData.get('quantity') as string
  const description = formData.get('description') as string
  const category = formData.get('category') as string
  const imageUrl = formData.get('image') as string

  // * step 4: Create the form data object
  const formDataObject = {
    name,
    brand,
    modelName,
    price: Number(price),
    quantity: Number(quantity),
    description,
    category,
    image: imageUrl,
  }

  // * step 5: Send the form data to the server
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cookie.token}`,
      },
      body: JSON.stringify(formDataObject),
    })

    if (response.ok) {
      const data = await response.json()
      return { success: true, data }
    } else {
      const errorData = await response.json()
      console.log('errorData', errorData)
      return {
        success: false,
        error: errorData.message,
        errorDetails: errorData,
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error('Error creating product:', error)
    return {
      error: error.message || 'Failed to create product',
      errorDetails: error,
    }
  }
}

export default function CreateProduct() {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'

  const navigate = useNavigate()

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success('Product created successfully')

      // * wait for 1 second before navigating
      const timer = setTimeout(() => {
        navigate('/admin/products')
      }, 1000)

      return () => clearTimeout(timer)
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error)
    }
  }, [fetcher.data, navigate])

  const [image, setImage] = useState('')

  // * Convert selected image to base64 string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleImageChange = (e: any) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      if (file.type === 'image/jpeg' || file.type === 'image/png') {
        reader.onload = () => {
          setImage(reader.result as string)
        }
      } else {
        toast.error('Invalid File', {
          description: 'Please select a valid image file (JPEG or PNG)',
        })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="py-10 px-2">
      <div className="pb-4">
        <h3 className="text-3xl">Store New Bike Data</h3>
        <p>Enter the details of the new bike product</p>
      </div>
      <fetcher.Form method="post" encType="multipart/form-data" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* name */}
          <div className="space-y-2 max-w-md">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" required />
          </div>

          {/* brand, category & model */}
          <div className="flex flex-wrap gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Select name="brand" required defaultValue={brands[0].value}>
                <SelectTrigger id="brand">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand.value} value={brand.value}>
                      {brand.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Select name="model" required defaultValue={models[0].value}>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required defaultValue={categories[0].value}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {/* price & quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Price */}
          <div className="space-y-2 max-w-md">
            <Label htmlFor="price">Price</Label>
            <Input type="number" id="price" name="price" min="0" step="0.01" required />
          </div>

          {/* Quantity */}
          <div className="space-y-2 max-w-md">
            <Label htmlFor="quantity">Quantity</Label>
            <Input type="number" id="quantity" name="quantity" min="10" required />
          </div>
        </div>

        {/* description & image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* description */}
          <div className="space-y-2 max-w-md">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" required rows={5} />
          </div>
          {/* Image */}
          <div className="space-y-2 max-w-md">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-start gap-2">
              <Input
                type="file"
                id="image"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
              {image && (
                <img src={image} alt="Product Preview" className="w-24 h-16 rounded object-cover" />
              )}
            </div>
          </div>
        </div>
        {/* Submit button */}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Create Product
            </>
          )}
        </Button>
      </fetcher.Form>
    </div>
  )
}
