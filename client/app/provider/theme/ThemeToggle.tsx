import { GiMoon, GiUbisoftSun } from 'react-icons/gi'
import { useTheme } from './ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <label className="swap swap-rotate">
      <input onClick={toggleTheme} type="checkbox" className="theme-controller" />
      {theme === 'light' ? (
        <div className="text-lg">
          <GiUbisoftSun />
        </div>
      ) : (
        <div className="text-lg">
          <GiMoon />
        </div>
      )}
    </label>
  )
}
