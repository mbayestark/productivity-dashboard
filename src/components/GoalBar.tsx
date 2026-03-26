import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'
import { ChevronDown, ChevronUp } from 'lucide-react'

const categoryColors: Record<string, string> = {
  academic: 'bg-green-500',
  career:   'bg-pink-500',
  personal: 'bg-gray-500',
  health:   'bg-red-500',
  project:  'bg-indigo-500',
}

interface Props {
  goal: Doc<'goals'>
}

export default function GoalBar({ goal }: Props) {
  const [open, setOpen] = useState(false)
  const updateGoal = useMutation(api.goals.updateGoal)
  const bar = categoryColors[goal.category] ?? 'bg-indigo-500'

  const toggleMilestone = (i: number) => {
    const ms = (goal.milestones ?? []).map((m, idx) =>
      idx === i ? { ...m, done: !m.done } : m
    )
    updateGoal({ id: goal._id, milestones: ms })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">{goal.title}</h3>
          <span className="text-xs text-gray-400 capitalize">{goal.category}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-700">{goal.progress}%</span>
          {goal.milestones && goal.milestones.length > 0 && (
            <button onClick={() => setOpen(!open)} className="text-gray-400 hover:text-gray-600">
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div className={`h-full ${bar} rounded-full transition-all`} style={{ width: `${goal.progress}%` }} />
      </div>

      {goal.targetDate && (
        <p className="text-xs text-gray-400">Target: {goal.targetDate}</p>
      )}

      {open && goal.milestones && (
        <div className="mt-3 space-y-2 border-t border-gray-100 pt-3">
          {goal.milestones.map((m, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="checkbox"
                checked={m.done}
                onChange={() => toggleMilestone(i)}
                className="rounded text-indigo-600"
              />
              <span className={m.done ? 'line-through text-gray-400' : 'text-gray-700'}>{m.title}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
