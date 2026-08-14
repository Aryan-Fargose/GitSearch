export default function ContributorsList({ contributors }) {
  if (!contributors || contributors.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No contributor data available.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {contributors.map((c) => (
        <a
          key={c.id}
          href={c.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow"
        >
          <img
            src={c.avatar_url}
            alt={c.login}
            className="w-8 h-8 rounded-full"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{c.login}</p>
            <p className="text-xs text-gray-500">
              {c.contributions.toLocaleString()} commits
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}