import { Link } from 'react-router'
import { nanoid } from 'nanoid'
import { motion } from 'motion/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { paymentSteps } from '~/constant/paymentSteps'
import { cn } from '~/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.2 * i,
    },
  }),
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

export default function PaymentProcess() {
  return (
    <motion.section
      className="py-16 px-4 sm:px-6 lg:px-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      custom={0}
    >
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2 className="text-3xl font-bold mb-10" variants={itemVariants}>
          How Our Payment Process Works
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          variants={containerVariants}
          custom={1}
        >
          {paymentSteps.map((step, index) => (
            <motion.div
              key={nanoid()}
              variants={itemVariants}
              className={cn(
                index === paymentSteps.length - 1 ? 'sm:col-span-2' : '',
                'transition-transform transform hover:scale-105',
              )}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div className="mt-10" variants={itemVariants}>
          <Link to="/product">
            <Button size="lg" variant={'outline'} className='cursor-pointer'>
              Start Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.section>
  )
}
