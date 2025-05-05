import { Badge } from '~/components/ui/badge'
import SettingsCard from '../card/SettingsCard'
import { settingsCards } from '~/constant/settingsData'

export default function Settings() {
  return (
    <div className="relative p-4">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Coming Soon Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center h-[calc(100vh-88px)] bg-background/80 backdrop-blur-sm z-10">
        <div className="text-center max-w-md mx-auto">
          <Badge className="mb-4 px-3 py-1 text-sm bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            Under Development
          </Badge>
          <h2 className="text-4xl font-bold tracking-tighter mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Coming Soon
          </h2>
          <p className="text-muted-foreground mb-6">
            We&apos;re working hard to bring you a comprehensive settings experience. Check back
            soon for updates!
          </p>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse delay-150" />
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse delay-300" />
          </div>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 lg:gap-6">
        {settingsCards.slice(0, 2).map(card => (
          <SettingsCard
            key={card.title}
            icon={card.icon}
            title={card.title}
            description={card.description}
          />
        ))}
      </div>
    </div>
  )
}
