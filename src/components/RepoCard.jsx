export default function RepoCard({ repo }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-2 mb-1">
        <img src={repo.owner.avatar_url} alt={repo.owner.login} className="w-6 h-6 rounded-full" />
        <span className="text-sm text-gray-500">{repo.owner.login}</span>
      </div>
      <h3 className="font-semibold text-lg text-blue-700">{repo.name}</h3>
      <p className="text-gray-600 text-sm mt-1 line-clamp-2">
        {repo.description || 'No description provided.'}
      </p>
      <div className="flex gap-4 mt-3 text-sm text-gray-500">
        <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
        {repo.language && <span>🔵 {repo.language}</span>}
      </div>
    </div>
  )
}