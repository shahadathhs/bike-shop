import { Truck, ShieldCheck, Headset, RefreshCcw, Lock, Leaf } from 'lucide-react'

export interface Feature {
  id: string
  title: string
  description: string
  Icon: React.ComponentType<{ className?: string }>
}

export const featuresData: Feature[] = [
  {
    id: 'fast-delivery',
    title: 'Fast Delivery',
    description:
      'Get your order to your doorstep in record time, backed by our real-time tracking and reliable logistics.',
    Icon: Truck,
  },
  {
    id: 'premium-quality',
    title: 'Premium Quality',
    description:
      'We hand-select top-tier products from trusted manufacturers, ensuring you only get the very best.',
    Icon: ShieldCheck,
  },
  {
    id: 'round-the-clock-support',
    title: '24/7 Customer Support',
    description:
      'Our friendly support team is here day or night—via chat, email, or phone—to help with anything you need.',
    Icon: Headset,
  },
  {
    id: 'easy-returns',
    title: 'Easy Returns',
    description:
      'Changed your mind? No problem. Our hassle-free 30-day return policy makes it simple to send items back.',
    Icon: RefreshCcw,
  },
  {
    id: 'secure-payments',
    title: 'Secure Payments',
    description:
      'All transactions are protected by industry-leading encryption and fraud prevention systems.',
    Icon: Lock,
  },
  {
    id: 'eco-friendly-packaging',
    title: 'Eco-Friendly Packaging',
    description:
      'We use recyclable and biodegradable materials to minimize environmental impact with every shipment.',
    Icon: Leaf,
  },
]
