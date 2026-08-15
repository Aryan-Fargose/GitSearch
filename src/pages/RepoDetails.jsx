import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getRepoDetails, getRepoLanguages, getCommitActivity, getContributors } from '../api/github'
import { getErrorMessage } from '../api/errors'
import LanguageChart from '../components/LanguageChart'
import CommitActivityChart from '../components/CommitActivityChart'
import ContributorsList from '../components/ContributorsList'

export default function RepoDetails() {
  const { owner, repo } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [languages, setLanguages] = useState(null)
  const [commitWeeks, setCommitWeeks] = useState(null)
  const [contributors, setContributors] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getRepoDetails(owner, repo)
      .then((res) => { if (!cancelled) setData(res) })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err))
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    getRepoLanguages(owner, repo)
      .then((res) => { if (!cancelled) setLanguages(res) })
      .catch(() => { if (!cancelled) setLanguages({}) })

    fetchCommitActivity(owner, repo, (weeks) => {
      if (!cancelled) setCommitWeeks(weeks)
    })

    getContributors(owner, repo)
      .then((res) => { if (!cancelled) setContributors(res) })
      .catch(() => { if (!cancelled) setContributors([]) })

    return () => { cancelled = true }
  }, [owner, repo])

  if (loading) return (
    <div className="min-h-screen">
      <p className="text-center pt-10 text-gray-500 dark:text-purple-400">Loading repository...</p>
    </div>
  )
  if (error) return (
    <div className="min-h-screen text-center pt-10">
      <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
      <Link to="/" className="text-blue-600 dark:text-purple-400 underline">Back to search</Link>
    </div>
  )
  if (!data) return null

  return (
    <div className="min-h-screen transition-colors">
      <div className="max-w-3xl mx-auto py-10 px-4">
        <Link to="/" className="text-blue-600 dark:text-purple-400 underline text-sm">&larr; Back to search</Link>

        <div className="flex items-center gap-3 mt-4 mb-2">
          <img src={data.owner.avatar_url} alt={data.owner.login} className="w-10 h-10 rounded-full" />
          <div>
            <p className="text-gray-500 dark:text-purple-400 text-sm">{data.owner.login}</p>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-purple-200">{data.name}</h1>
          </div>
        </div>

        <p className="text-gray-700 dark:text-purple-300/80 mb-6">
          {data.description || 'No description provided.'}
        </p>

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
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-purple-200">Languages</h2>
          {languages ? (
            <LanguageChart languages={languages} />
          ) : (
            <p className="text-gray-500 dark:text-purple-400 text-sm">Loading languages...</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-purple-200">
            Commit Activity (last year)
          </h2>
          {commitWeeks ? (
            <CommitActivityChart weeks={commitWeeks} />
          ) : (
            <p className="text-gray-500 dark:text-purple-400 text-sm">Loading commit activity...</p>
          )}
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-purple-200">Contributors</h2>
          {contributors ? (
            <ContributorsList contributors={contributors} />
          ) : (
            <p className="text-gray-500 dark:text-purple-400 text-sm">Loading contributors...</p>
          )}
        </div>

        <a
          href={data.html_url}
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

function fetchCommitActivity(owner, repo, onDone, attempt = 0) {
  getCommitActivity(owner, repo)
    .then((res) => {
      if ((!res || res.length === 0) && attempt < 3) {
        setTimeout(() => fetchCommitActivity(owner, repo, onDone, attempt + 1), 1500)
      } else {
        onDone(res || [])
      }
    })
    .catch(() => onDone([]))
}