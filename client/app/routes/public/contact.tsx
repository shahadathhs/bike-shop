import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { Mail, Phone, MapPin } from 'lucide-react'
import { BorderBeam } from '~/components/magicui/border-beam'
import { toast } from 'sonner'

export function meta() {
  return [
    { title: 'Bike Store - Contact Us' },
    { name: 'description', content: 'Get in touch with us' },
  ]
}

export default function Contact() {
  const handleSubmit = () => {
    toast.success('Thanks for checking out this feature!', {
      duration: 5000,
      icon: '👋',
      position: 'top-center',
      description: 'But we are still working on it. Backend is under development.',
    })
  }
  return (
    <main className="relative overflow-hidden py-10 mt-10 xl:border xl:rounded">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <Card className="shadow-md">
          <CardHeader>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Send Us a Message</h2>
            <p className="text-muted-foreground">
              Have a question or concern? We&apos;re here to help.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={e => {
                e.preventDefault()
                handleSubmit()
              }}
              className="space-y-4"
            >
              <Input type="text" placeholder="Your Name" required />
              <Input type="email" placeholder="Your Email" required />
              <Textarea placeholder="Your Message..." rows={5} required />
              <Button type="submit" className="w-full">
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Details */}
        <Card className="shadow-md">
          <CardHeader>
            <h2 className="text-3xl font-bold tracking-tight text-primary">Contact Information</h2>
            <p className="text-muted-foreground">
              Reach out directly via email, phone, or visit us in person.
            </p>
          </CardHeader>
          <CardContent className="space-y-6 text-muted-foreground">
            <div className="flex items-center gap-4">
              <Mail className="text-primary" />
              <span>support@bikestore.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-primary" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-primary" />
              <span>123 Cycle Lane, Bike City, Country</span>
            </div>
            <Separator />
            <p className="text-sm">Working Hours: Mon–Fri, 9:00 AM – 5:00 PM</p>
          </CardContent>
        </Card>
      </div>
      <BorderBeam className="opacity-0 lg:opacity-100" duration={40} size={300} />
    </main>
  )
}
