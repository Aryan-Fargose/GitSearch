import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import RepoDetails from './pages/RepoDetails'
import UserProfile from './pages/UserProfile'
import ThemeToggle from './components/ThemeToggle'
import CursorField from './components/CursorField'

function App() {
  return (
    <>
      <CursorField />
      <div className="relative z-10">
        <ThemeToggle />
        <Routes>
          <Route path="/" element={<SearchPage />} />
          <Route path="/repo/:owner/:repo" element={<RepoDetails />} />
          <Route path="/user/:username" element={<UserProfile />} />
        </Routes>
      </div>
    </>
  )
}

export default App