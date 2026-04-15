import { useState } from 'react'
import type { Doc } from '../../../convex/_generated/dataModel'
import AddLogEntry from './AddLogEntry'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  entries: Doc<'cubesat_log'>[]
}

const typeBadge: Record<string, string> = {
  firmware:  'bg-blue-100 text-blue-700',
  hardware:  'bg-amber-100 text-amber-700',
  test:      'bg-teal-100 text-teal-700',
  milestone: 'bg-green-100 text-green-700',
  issue:     'bg-red-100 text-red-700',
}

export default function BuildLog({ entries }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Build Log</h3>
      <AddLogEntry />
      <div className="space-y-3">
        {entries.length === 0 && <p className="text-gray-400 text-sm">No log entries yet</p>}
        {entries.map((entry) => (
          <LogEntry key={entry._id} entry={entry} />
        ))}
      </div>
    </div>
  )
}

function LogEntry({ entry }: { entry: Doc<'cubesat_log'> }) {
  const [expanded, setExpanded] = useState(false)
  const badge = typeBadge[entry.type] ?? 'bg-gray-100 text-gray-600'
  const hasLongBody = entry.body && entry.body.length > 120

  return (
    <div className="border-l-2 border-gray-200 pl-3 py-1">
      <div className="flex flex-wrap items-center gap-2 mb-0.5">
        <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
        <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${badge} capitalize`}>
          {entry.type}
        </span>
        {entry.subsystem && (
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
            {entry.subsystem}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-gray-900">{entry.title}</p>
      {entry.body && (
        <div className="mt-1">
          <p className={`text-xs text-gray-500 ${!expanded && hasLongBody ? 'line-clamp-2' : ''}`}>
            {entry.body}
          </p>
          {hasLongBody && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-0.5 text-xs text-indigo-600 mt-1 hover:text-indigo-700"
            >
              {expanded ? <><ChevronUp size={12} /> Less</> : <><ChevronDown size={12} /> More</>}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
