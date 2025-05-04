import { useState, useEffect, useMemo } from 'react'
import { ThemeContext } from './ThemeContext'

export type TTheme = 'light' | 'dark'

export const themes: Record<TTheme, string> = {
  light: 'light',
  dark: 'dark',
}

// * Theme provider component
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<TTheme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme') as TTheme | null
      if (storedTheme) setTheme(storedTheme)
      setMounted(true) // * Ensure theme is set before rendering
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute('data-theme', theme)
      localStorage.setItem('theme', theme)
    }
  }, [theme, mounted])

  const toggleTheme = () => {
    setTheme(prevTheme =>
      prevTheme === themes.light ? (themes.dark as TTheme) : (themes.light as TTheme),
    )
  }

  const themeInfo = useMemo(() => ({ theme, toggleTheme }), [theme])

  return <ThemeContext.Provider value={themeInfo}>{children}</ThemeContext.Provider>
}
