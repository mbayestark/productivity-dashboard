import { useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface Props {
  onDone: () => void
}

export default function CheckinForm({ onDone }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const tasks = useQuery(api.tasks.listTasks, {}) ?? []
  const inProgress = tasks.filter((t) => t.status === 'in_progress' || t.status === 'todo')
  const createCheckin = useMutation(api.checkins.createCheckin)

  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())
  const [energy, setEnergy] = useState(3)
  const [focus, setFocus] = useState(3)
  const [wins, setWins] = useState('')
  const [blockers, setBlockers] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const toggle = (id: string) => {
    setSelectedTasks((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const submit = async () => {
    setSaving(true)
    await createCheckin({
      date: today,
      completedTaskIds: [...selectedTasks] as Id<'tasks'>[],
      energyLevel: energy,
      focusScore: focus,
      wins: wins || undefined,
      blockers: blockers || undefined,
      notes: notes || undefined,
    })
    setSaving(false)
    onDone()
  }

  const ScoreRow = ({ label, val, set }: { label: string; val: number; set: (n: number) => void }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24">{label}</span>
      <div className="flex gap-1">
        {[1,2,3,4,5].map((n) => (
          <button
            key={n}
            onClick={() => set(n)}
            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
              val === n ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >{n}</button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Tasks completed today</p>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {inProgress.length === 0 && <p className="text-sm text-gray-400">No active tasks</p>}
          {inProgress.map((t) => (
            <label key={t._id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={selectedTasks.has(t._id)}
                onChange={() => toggle(t._id)}
                className="rounded text-indigo-600"
              />
              <span className="text-gray-700">{t.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <ScoreRow label="Energy" val={energy} set={setEnergy} />
        <ScoreRow label="Focus" val={focus} set={setFocus} />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Wins</label>
        <textarea
          value={wins}
          onChange={(e) => setWins(e.target.value)}
          rows={2}
          placeholder="What went well?"
          className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Blockers</label>
        <textarea
          value={blockers}
          onChange={(e) => setBlockers(e.target.value)}
          rows={2}
          placeholder="What got in the way?"
          className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Any other notes..."
          className="mt-1 w-full border border-gray-200 rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      </div>

      <button
        onClick={submit}
        disabled={saving}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
      >
        {saving ? 'Saving...' : 'Log Check-in'}
      </button>
    </div>
  )
}
