// ~/components/ErrorPage.tsx
import { Link } from 'react-router'
import { motion } from 'motion/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorPageProps {
  status?: number
  message?: string
  details?: string
}

export default function ErrorPage({
  status = 404,
  message = 'Oops! The page you’re looking for isn’t here.',
  details = 'It might have been moved or no longer exists.',
}: ErrorPageProps) {
  return (
    <motion.section
      className="h-screen w-full flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-md w-full text-center">
        <CardHeader className="space-y-2 pt-6">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
          <CardTitle className="text-2xl font-bold">{status}</CardTitle>
          <CardDescription className="text-lg">{message}</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <p className="mb-6 text-sm text-muted-foreground">{details}</p>
          <Button asChild size="lg" className="w-full">
            <Link to="/">Back to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.section>
  )
}
