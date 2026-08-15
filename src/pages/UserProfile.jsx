import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getUserProfile, getUserRepos } from '../api/github'
import { getErrorMessage } from '../api/errors'

export default function UserProfile() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [repos, setRepos] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getUserProfile(username)
      .then((res) => { if (!cancelled) setUser(res) })
      .catch((err) => { if (!cancelled) setError(getErrorMessage(err)) })
      .finally(() => { if (!cancelled) setLoading(false) })

    getUserRepos(username)
      .then((res) => { if (!cancelled) setRepos(res) })
      .catch(() => { if (!cancelled) setRepos([]) })

    return () => { cancelled = true }
  }, [username])

  if (loading) return (
    <div className="min-h-screen">
      <p className="text-center pt-10 text-gray-500 dark:text-purple-400">Loading profile...</p>
    </div>
  )
  if (error) return (
    <div className="min-h-screen text-center pt-10">
      <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
      <Link to="/" className="text-blue-600 dark:text-purple-400 underline">Back to search</Link>
    </div>
  )
  if (!user) return null

  return (
    <div className="min-h-screen transition-colors">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Link to="/" className="text-blue-600 dark:text-purple-400 underline text-sm">&larr; Back to search</Link>

        <div className="flex items-center gap-4 mt-4 mb-4">
          <img src={user.avatar_url} alt={user.login} className="w-20 h-20 rounded-full" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-purple-200">
              {user.name || user.login}
            </h1>
            <p className="text-gray-500 dark:text-purple-400">@{user.login}</p>
          </div>
        </div>

        {user.bio && <p className="text-gray-700 dark:text-purple-300/80 mb-6">{user.bio}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <Stat label="Followers" value={user.followers.toLocaleString()} />
          <Stat label="Following" value={user.following.toLocaleString()} />
          <Stat label="Public Repos" value={user.public_repos.toLocaleString()} />
          <Stat label="Joined" value={new Date(user.created_at).toLocaleDateString()} />
        </div>

        {(user.location || user.blog || user.company) && (
          <div className="mb-6 text-sm text-gray-600 dark:text-purple-300/80 space-y-1">
            {user.company && <p>🏢 {user.company}</p>}
            {user.location && <p>📍 {user.location}</p>}
            {user.blog && (
              <p>
                🔗{' '}
                
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline text-blue-600 dark:text-purple-400"
                <a>
                  {user.blog}
                </a>
              </p>
            )}
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-purple-200">
            Recently Updated Repositories
          </h2>
          {repos && repos.length > 0 ? (
            <div className="grid gap-3">
              {repos.map((repo) => (
                <Link
                  key={repo.id}
                  to={`/repo/${repo.owner.login}/${repo.name}`}
                  className="block border border-gray-200 dark:border-purple-800 rounded-lg p-3
                             bg-white dark:bg-purple-950/30 hover:shadow-md dark:hover:shadow-purple-900/50 transition-shadow"
                >
                  <p className="font-medium text-blue-700 dark:text-purple-300">{repo.name}</p>
                  <p className="text-sm text-gray-500 dark:text-purple-400 mt-1">
                    ⭐ {repo.stargazers_count.toLocaleString()} {repo.language && `· ${repo.language}`}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-purple-400 text-sm">No public repositories found.</p>
          )}
        </div>

        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 bg-blue-600 dark:bg-purple-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-purple-600"
        >
          View on GitHub
        </a>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="border border-gray-200 dark:border-purple-800 rounded-lg p-3 bg-white dark:bg-purple-950/30">
      <p className="text-xs text-gray-500 dark:text-purple-400 uppercase">{label}</p>
      <p className="font-semibold text-gray-900 dark:text-purple-100">{value}</p>
    </div>
  )
}