import c1 from 'assets/customer/c1.png'
import c2 from 'assets/customer/c2.png'
import c3 from 'assets/customer/c3.png'
import c4 from 'assets/customer/c4.png'
import c5 from 'assets/customer/c5.png'
import c6 from 'assets/customer/c6.png'

export interface Testimonial {
  name: string
  text: string
  image: string
}

export const testimonialsData: Testimonial[] = [
  {
    name: 'John Doe',
    text: 'Amazing service! I found exactly what I needed and the shopping experience was fantastic.',
    image: c1,
  },
  {
    name: 'Jane Smith',
    text: "Love the quality of the products! I'll definitely be shopping here again.",
    image: c2,
  },
  {
    name: 'Mark Lee',
    text: 'Great prices and fast shipping! Highly recommend this store.',
    image: c3,
  },
  {
    name: 'Emily Wong',
    text: 'The customer support went above and beyond to help me choose the right size.',
    image: c4,
  },
  {
    name: 'Alex Johnson',
    text: 'Five stars! The whole process was seamless from browsing to delivery.',
    image: c1,
  },
  {
    name: 'Sara Patel',
    text: 'I’ve never had a bad experience here. Products are always top-notch.',
    image: c5,
  },
  {
    name: 'David Kim',
    text: 'Such unique items and fast checkout—will be back for more!',
    image: c2,
  },
  {
    name: 'Lily Chen',
    text: 'Their eco-friendly packaging really stood out. Love this brand’s values.',
    image: c6,
  },
  {
    name: 'Mike Brown',
    text: 'Super easy returns and friendly service. Shopping here is a joy.',
    image: c3,
  },
  {
    name: 'Rachel Green',
    text: 'Every order arrives promptly and perfectly packed. Highly recommend!',
    image: c4,
  },
]
