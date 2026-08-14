import { Link } from 'react-router-dom'

export default function RepoCard({ repo }) {
  return (
    <Link
      to={`/repo/${repo.owner.login}/${repo.name}`}
      className="block border border-gray-200 dark:border-purple-800 rounded-lg p-4
                 bg-white dark:bg-purple-950/30
                 hover:shadow-md dark:hover:shadow-purple-900/50 transition-shadow"
    >
      <div className="flex items-center gap-2 mb-1">
        <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-6 h-6 rounded-full" />
        <span className="text-sm text-gray-500 dark:text-purple-400">{repo.owner.login}</span>
      </div>
      <h3 className="font-semibold text-lg text-blue-700 dark:text-purple-300">{repo.name}</h3>
      <p className="text-gray-600 dark:text-purple-200/80 text-sm mt-1 line-clamp-2">
        {repo.description || 'No description provided.'}
      </p>
      <div className="flex gap-4 mt-3 text-sm text-gray-500 dark:text-purple-400">
        <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
        {repo.language && <span>🔵 {repo.language}</span>}
      </div>
    </Link>
  )
}