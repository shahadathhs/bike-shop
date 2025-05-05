import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Copy } from 'lucide-react'

export default function DemoCredentials() {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch {
      toast.error('Failed to copy')
    }
  }

  return (
    <div className="space-y-2">
      {/* Admin */}
      <div className="text-center border rounded p-2">
        <h3 className="text-lg font-semibold">Admin Credentials</h3>
        <div className="flex justify-center">
          <div className="flex items-center justify-center space-x-2 text-xs">
            <span>
              Email: <span className="text-primary">admin@gmail.com</span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard('admin@gmail.com')}
            >
              <Copy size={14} />
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs">
            <span>
              Password: <span className="text-primary">123456</span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard('123456')}
            >
              <Copy size={14} />
            </Button>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="text-center border rounded p-2">
        <h3 className="text-lg font-semibold">User Credentials</h3>
        <div className="flex justify-center">
          <div className="flex items-center justify-center space-x-2 text-xs">
            <span>
              Email: <span className="text-primary">user@gmail.com</span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard('user@gmail.com')}
            >
              <Copy size={14} />
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs">
            <span>
              Password: <span className="text-primary">123456</span>
            </span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => copyToClipboard('123456')}
            >
              <Copy size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
