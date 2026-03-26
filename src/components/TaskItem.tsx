import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Doc } from '../../convex/_generated/dataModel'
import { CheckCircle, Circle, Clock } from 'lucide-react'

const priorityColors: Record<string, string> = {
  urgent: 'text-red-600 bg-red-50',
  high:   'text-orange-600 bg-orange-50',
  medium: 'text-yellow-600 bg-yellow-50',
  low:    'text-gray-500 bg-gray-50',
}

interface Props {
  task: Doc<'tasks'>
  projectName?: string
}

export default function TaskItem({ task, projectName }: Props) {
  const completeTask = useMutation(api.tasks.completeTask)
  const done = task.status === 'done'

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-opacity ${done ? 'opacity-50 bg-gray-50 border-gray-100' : 'bg-white border-gray-200'}`}>
      <button
        onClick={() => !done && completeTask({ id: task._id })}
        className="mt-0.5 shrink-0 text-gray-400 hover:text-indigo-500 transition-colors"
        disabled={done}
      >
        {done ? <CheckCircle size={18} className="text-green-500" /> : <Circle size={18} />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
          {task.title}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {projectName && (
            <span className="text-xs text-gray-400">{projectName}</span>
          )}
          <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${priorityColors[task.priority] ?? 'text-gray-500 bg-gray-50'}`}>
            {task.priority}
          </span>
          {task.deadline && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <Clock size={11} />
              {task.deadline}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
