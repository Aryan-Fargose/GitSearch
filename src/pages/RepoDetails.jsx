import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRepoDetails, getRepoLanguages, getCommitActivity } from '../api/github'
import LanguageChart from '../components/LanguageChart'
import CommitActivityChart from '../components/CommitActivityChart'

export default function RepoDetails() {
  const { owner, repo } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [languages, setLanguages] = useState(null)
  const [commitWeeks, setCommitWeeks] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getRepoDetails(owner, repo)
      .then((res) => { if (!cancelled) setData(res) })
      .catch((err) => {
        if (cancelled) return
        if (err.response?.status === 404) {
          setError('Repository not found.')
        } else if (err.response?.status === 403) {
          setError('GitHub API rate limit reached. Please wait and try again.')
        } else {
          setError('Something went wrong loading this repository.')
        }
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    getRepoLanguages(owner, repo)
      .then((res) => { if (!cancelled) setLanguages(res) })
      .catch(() => { if (!cancelled) setLanguages({}) })

    fetchCommitActivity(owner, repo, (weeks) => {
      if (!cancelled) setCommitWeeks(weeks)
    })

    return () => { cancelled = true }
  }, [owner, repo])

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading repository...</p>
  if (error) return (
    <div className="text-center mt-10">
      <p className="text-red-600 mb-4">{error}</p>
      <Link to="/" className="text-blue-600 underline">Back to search</Link>
    </div>
  )
  if (!data) return null

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <Link to="/" className="text-blue-600 underline text-sm">&larr; Back to search</Link>

      <div className="flex items-center gap-3 mt-4 mb-2">
        <img src={data.owner.avatar_url} alt={data.owner.login} className="w-10 h-10 rounded-full" />
        <div>
          <p className="text-gray-500 text-sm">{data.owner.login}</p>
          <h1 className="text-2xl font-bold">{data.name}</h1>
        </div>
      </div>

      <p className="text-gray-700 mb-6">{data.description || 'No description provided.'}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <Stat label="Stars" value={data.stargazers_count.toLocaleString()} />
        <Stat label="Forks" value={data.forks_count.toLocaleString()} />
        <Stat label="Open Issues" value={data.open_issues_count.toLocaleString()} />
        <Stat label="Language" value={data.language || 'N/A'} />
        <Stat label="License" value={data.license?.name || 'None'} />
        <Stat label="Created" value={new Date(data.created_at).toLocaleDateString()} />
        <Stat label="Last Updated" value={new Date(data.updated_at).toLocaleDateString()} />
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Languages</h2>
        {languages ? (
          <LanguageChart languages={languages} />
        ) : (
          <p className="text-gray-500 text-sm">Loading languages...</p>
        )}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Commit Activity (last year)</h2>
        {commitWeeks ? (
          <CommitActivityChart weeks={commitWeeks} />
        ) : (
          <p className="text-gray-500 text-sm">Loading commit activity...</p>
        )}
      </div>

      
        href={data.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      <a>
        View on GitHub
      </a>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  )
}

function fetchCommitActivity(owner, repo, onDone, attempt = 0) {
  getCommitActivity(owner, repo)
    .then((res) => {
      // GitHub returns 202 with empty body while it computes stats for the first time.
      // Axios treats 202 as success but res may be an empty array — retry a couple times.
      if ((!res || res.length === 0) && attempt < 3) {
        setTimeout(() => fetchCommitActivity(owner, repo, onDone, attempt + 1), 1500)
      } else {
        onDone(res || [])
      }
    })
    .catch(() => onDone([]))
}