import { Routes, Route } from 'react-router-dom'
import SearchPage from './pages/SearchPage'
import RepoDetails from './pages/RepoDetails'

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/repo/:owner/:repo" element={<RepoDetails />} />
    </Routes>
  )
}

export default App