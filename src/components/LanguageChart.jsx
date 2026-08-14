import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

export default function LanguageChart({ languages }) {
  const entries = Object.entries(languages)

  if (entries.length === 0) {
    return <p className="text-gray-500 text-sm">No language data available for this repository.</p>
  }

  const totalBytes = entries.reduce((sum, [, bytes]) => sum + bytes, 0)

  const data = entries
    .map(([name, bytes]) => ({
      name,
      value: bytes,
      percent: ((bytes / totalBytes) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value)

  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={({ name, percent }) => `${name} ${percent}%`}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value.toLocaleString()} bytes`, name]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}