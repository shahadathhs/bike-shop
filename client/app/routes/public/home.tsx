import Banner from '~/components/home/Banner'
import { useLoaderData, type LoaderFunction } from 'react-router'
import Product from '~/components/home/Product'
import Testimonials from '~/components/home/Testimonials'
import WhyChooseUs from '~/components/home/WhyChooseUs'
import PaymentProcess from '~/components/home/PaymentProcess'
import FAQ from '~/components/home/FAQ'
import FeaturedBlogs from '~/components/home/FeaturedBlogs'

export function meta() {
  return [{ title: 'Bike Store - Home' }, { name: 'description', content: 'Welcome to Bike Store' }]
}

export const loader: LoaderFunction = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/bikes`)

    if (response.ok) {
      const data = await response.json()
      return data
    } else {
      throw new Error('Failed to fetch products')
    }
  } catch (err) {
    console.error('Error fetching products:', err)
    return {
      error: 'Failed to fetch products',
      errorDetails: err,
    }
  }
}

export default function Home() {
  const loaderData = useLoaderData()
  const products = loaderData?.data?.bikes
  return (
    <div className="space-y-10">
      <Banner />
      {products && <Product />}
      <PaymentProcess />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <FeaturedBlogs />
    </div>
  )
}
