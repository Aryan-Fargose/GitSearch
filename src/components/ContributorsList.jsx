export default function ContributorsList({ contributors }) {
  if (!contributors || contributors.length === 0) {
    return <p className="text-gray-500 dark:text-purple-400 text-sm">No contributor data available.</p>
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {contributors.map((c) => (
        <a
          key={c.id}
          href={c.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-200 dark:border-purple-800 rounded-lg p-2
                     bg-white dark:bg-purple-950/30
                     hover:shadow-md dark:hover:shadow-purple-900/50 transition-shadow"
        >
          <img src={c.avatar_url} alt={c.login} className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate text-gray-900 dark:text-purple-100">
              {c.login}
            </p>
            <p className="text-xs text-gray-500 dark:text-purple-400">
              {c.contributions.toLocaleString()} commits
            </p>
          </div>
        </a>
      ))}
    </div>
  )
}