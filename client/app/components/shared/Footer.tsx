import { Link } from 'react-router'
import { Twitter, Youtube, Facebook, Github } from 'lucide-react'
import logoImg from 'assets/logo.png'
import { Separator } from '../ui/separator'
import { legalLinks, quickLinks } from '~/constant/navigationLinks'

const socialLinks = [
  { href: 'https://twitter.com', label: 'Twitter', icon: Twitter },
  { href: 'https://youtube.com', label: 'YouTube', icon: Youtube },
  { href: 'https://facebook.com', label: 'Facebook', icon: Facebook },
  { href: 'https://github.com', label: 'GitHub', icon: Github },
]

export default function Footer() {
  return (
    <footer className="border-t bg-background text-muted-foreground">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 py-4">
        {/* About Section */}
        <div className="md:col-span-2 lg:col-span-3 space-y-3">
          <div>
            <Link to="/" aria-label="Home">
              <img src={logoImg} alt="Bike Shop Logo" className="h-10 w-auto" />
            </Link>
          </div>
          <h3 className="text-2xl font-bold">Bike Shop.</h3>
          <p className="text-sm leading-relaxed max-w-lg">
            At Bike Shop, we&apos;re passionate about two wheels. Since 2020, we&apos;ve been your
            trusted source for quality bikes, expert service, and everything you need for the ride.
          </p>
          <div className="flex items-center space-x-4">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="hover:text-primary transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-2 flex flex-col">
          <h6 className="text-base font-semibold text-foreground">Quick Links</h6>
          {quickLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:underline text-xs transition-colors">
              {label}
            </Link>
          ))}
        </div>

        {/* Legal Links */}
        <div className="space-y-2 flex flex-col">
          <h6 className="text-base font-semibold text-foreground">Legal</h6>
          {legalLinks.map(({ to, label }) => (
            <Link key={to} to={to} className="hover:underline text-xs transition-colors">
              {label}
            </Link>
          ))}
        </div>
      </div>
      <Separator />
      <div className="text-center text-xs py-4 text-muted-foreground">
        &copy; {new Date().getFullYear()} Bike Shop. All rights reserved.
      </div>
    </footer>
  )
}
