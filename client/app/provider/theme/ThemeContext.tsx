import { createContext, useContext } from 'react'

// * Create a context for the theme
export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {
    //* TODO: Implement theme toggle functionality
  },
})

// * Custom hook to access the theme context
export const useTheme = () => {
  return useContext(ThemeContext as React.Context<{ theme: string; toggleTheme: () => void }>)
}
