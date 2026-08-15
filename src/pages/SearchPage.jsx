import { useState, useEffect } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { searchRepos, searchUsers } from '../api/github'
import { getErrorMessage } from '../api/errors'
import SearchBar from '../components/SearchBar'
import RepoCard from '../components/RepoCard'
import UserCard from '../components/UserCard'
import Tabs from '../components/Tabs'

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState('repos')
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

    const searchFn = activeTab === 'repos' ? searchRepos : searchUsers

    searchFn(debouncedQuery)
      .then((items) => { if (!cancelled) setResults(items) })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err))
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [debouncedQuery, activeTab])

  function handleTabChange(tab) {
    setActiveTab(tab)
    setResults([])
    setError(null)
  }

  return (
    <div className="min-h-screen py-10 px-4 transition-colors">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-purple-300">
        GitSearch
      </h1>

      <Tabs active={activeTab} onChange={handleTabChange} />
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder={activeTab === 'repos' ? 'Search GitHub repositories...' : 'Search by username or GitHub ID...'}
      />

      <div className="max-w-2xl mx-auto mt-8">
        {loading && <p className="text-center text-gray-500 dark:text-purple-400">Searching...</p>}
        {error && <p className="text-center text-red-600 dark:text-red-400">{error}</p>}
        {!loading && !error && debouncedQuery && results.length === 0 && (
          <p className="text-center text-gray-500 dark:text-purple-400">
            No {activeTab === 'repos' ? 'repositories' : 'users'} found for "{debouncedQuery}".
          </p>
        )}

        <div className="grid gap-4 mt-4">
          {results.map((item) =>
            activeTab === 'repos' ? (
              <RepoCard key={item.id} repo={item} />
            ) : (
              <UserCard key={item.id} user={item} />
            )
          )}
        </div>
      </div>
    </div>
  )
}