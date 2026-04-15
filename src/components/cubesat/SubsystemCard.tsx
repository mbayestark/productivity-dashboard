import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Pencil, Check, X } from 'lucide-react'
import type { Doc } from '../../../convex/_generated/dataModel'

interface Props {
  subsystem: Doc<'cubesat_subsystems'>
}

const statusBadge: Record<string, string> = {
  complete:    'bg-green-100 text-green-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  blocked:     'bg-yellow-100 text-yellow-700',
  not_started: 'bg-gray-100 text-gray-500',
}

const statusOptions = ['not_started', 'in_progress', 'blocked', 'complete']

export default function SubsystemCard({ subsystem }: Props) {
  const [editing, setEditing] = useState(false)
  const [progress, setProgress] = useState(subsystem.progress)
  const [status, setStatus] = useState(subsystem.status)
  const [notes, setNotes] = useState(subsystem.notes ?? '')

  const update = useMutation(api.cubesat.updateSubsystem)

  const save = async () => {
    await update({
      id: subsystem._id,
      progress,
      status,
      notes: notes || undefined,
    })
    setEditing(false)
  }

  const cancel = () => {
    setProgress(subsystem.progress)
    setStatus(subsystem.status)
    setNotes(subsystem.notes ?? '')
    setEditing(false)
  }

  const badge = statusBadge[subsystem.status] ?? statusBadge.not_started
  const barColor = subsystem.status === 'complete' ? 'bg-green-500'
    : subsystem.status === 'blocked' ? 'bg-yellow-500'
    : 'bg-indigo-500'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight">{subsystem.name}</h4>
        {!editing && (
          <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <Pencil size={14} />
          </button>
        )}
      </div>

      {!editing ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge} capitalize`}>
              {subsystem.status.replace('_', ' ')}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Progress</span>
              <span>{subsystem.progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${subsystem.progress}%` }} />
            </div>
          </div>
          {subsystem.notes && (
            <p className="text-xs text-gray-500 mt-3 line-clamp-2">{subsystem.notes}</p>
          )}
        </>
      ) : (
        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Progress ({progress}%)</label>
            <input
              type="range" min={0} max={100} value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Status</label>
            <select
              value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Notes</label>
            <textarea
              value={notes} onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-200 rounded-lg p-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1 bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors">
              <Check size={14} /> Save
            </button>
            <button onClick={cancel} className="flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
