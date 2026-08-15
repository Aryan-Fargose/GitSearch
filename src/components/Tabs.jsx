export default function Tabs({ active, onChange }) {
  const tabs = [
    { id: 'repos', label: 'Repositories' },
    { id: 'users', label: 'Users' },
  ]

  return (
    <div className="max-w-2xl mx-auto flex gap-2 mb-4 justify-center">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            active === tab.id
              ? 'bg-blue-600 dark:bg-purple-700 text-white'
              : 'bg-white dark:bg-purple-950/40 text-gray-600 dark:text-purple-300 border border-gray-200 dark:border-purple-800'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}