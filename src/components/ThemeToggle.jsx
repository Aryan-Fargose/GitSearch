import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 px-3 py-1.5 rounded-lg border border-gray-300 dark:border-purple-700
                 bg-white dark:bg-purple-950 text-gray-700 dark:text-purple-200 text-sm
                 hover:bg-gray-50 dark:hover:bg-purple-900 transition-colors"
    >
      {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
    </button>
  )
}