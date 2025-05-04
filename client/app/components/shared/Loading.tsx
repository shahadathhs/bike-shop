import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="backdrop-blur-lg bg-white/70  rounded-2xl p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold tracking-tight text-primary">
            BIKE STORE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-6">
            <div className="relative flex items-center justify-center">
              <Loader2 className="h-16 w-16 animate-spin text-primary" />
              <span className="absolute inset-0 rounded-full border-4 border-primary/50 animate-ping"></span>
            </div>
            <p className="text-lg text-gray-700 animate-pulse">Loading your bicycle paradise...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
