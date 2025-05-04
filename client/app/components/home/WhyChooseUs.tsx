import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card'
import { motion } from 'motion/react'
import { featuresData } from '~/constant/featuresData'
import { BorderBeam } from '../magicui/border-beam'

export default function WhyChooseUs() {
  return (
    <section className="relative md:py-10 md:border md:rounded overflow-hidden">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold">Why Choose Us?</h2>
        <p className="text-muted-foreground mt-4">
          We go above and beyond at every step to make sure you’re thrilled with your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {featuresData.map(({ id, title, description, Icon }) => (
          <motion.div
            key={id}
            className="rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-col items-center space-y-2 pt-6">
                <Icon className="h-10 w-10 text-primary" />
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <BorderBeam
        duration={30}
        size={300}
        className="opacity-0 md:opacity-100 from-transparent via-green-500 to-transparent"
      />
    </section>
  )
}
