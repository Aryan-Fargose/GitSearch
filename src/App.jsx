import { useState, useEffect } from 'react'
import { useDebounce } from './hooks/useDebounce'
import { searchRepos } from './api/github'
import SearchBar from './components/SearchBar'
import RepoCard from './components/RepoCard'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([])
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    searchRepos(debouncedQuery)
      .then((items) => {
        if (!cancelled) setResults(items)
      })
      .catch((err) => {
        if (!cancelled) {
          if (err.response?.status === 403) {
            setError('GitHub API rate limit reached. Please wait a bit and try again.')
          } else {
            setError('Something went wrong while searching. Please try again.')
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [debouncedQuery])

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-6">GitSearch</h1>
      <SearchBar value={query} onChange={setQuery} />

      <div className="max-w-2xl mx-auto mt-8">
        {loading && <p className="text-center text-gray-500">Searching...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && debouncedQuery && results.length === 0 && (
          <p className="text-center text-gray-500">No repositories found for "{debouncedQuery}".</p>
        )}

        <div className="grid gap-4 mt-4">
          {results.map((repo) => (
            <RepoCard key={repo.id} repo={repo} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App