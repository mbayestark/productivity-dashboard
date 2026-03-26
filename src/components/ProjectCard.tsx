import type { Doc } from '../../convex/_generated/dataModel'

const roleColors: Record<string, { badge: string; bar: string }> = {
  'IT Committee': { badge: 'bg-blue-100 text-blue-700',   bar: 'bg-blue-500'   },
  'Student Gov':  { badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-500' },
  'JDAS':         { badge: 'bg-teal-100 text-teal-700',   bar: 'bg-teal-500'   },
  'AASTIC':       { badge: 'bg-purple-100 text-purple-700', bar: 'bg-purple-500' },
  'Personal':     { badge: 'bg-gray-100 text-gray-700',   bar: 'bg-gray-500'   },
  'Academic':     { badge: 'bg-green-100 text-green-700', bar: 'bg-green-500'  },
  'Career':       { badge: 'bg-pink-100 text-pink-700',   bar: 'bg-pink-500'   },
}

const statusColors: Record<string, string> = {
  active:    'bg-green-100 text-green-700',
  paused:    'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  blocked:   'bg-red-100 text-red-700',
}

interface Props {
  project: Doc<'projects'>
  onClick?: () => void
}

export default function ProjectCard({ project, onClick }: Props) {
  const rc = roleColors[project.role] ?? { badge: 'bg-gray-100 text-gray-700', bar: 'bg-gray-500' }
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-sm leading-tight">{project.name}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[project.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {project.status}
        </span>
      </div>

      <div className="flex gap-2 mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${rc.badge}`}>
          {project.role}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600 capitalize">
          {project.priority}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${rc.bar} rounded-full transition-all`} style={{ width: `${project.progress}%` }} />
        </div>
      </div>

      {project.deadline && (
        <p className="text-xs text-gray-400 mt-3">Due {project.deadline}</p>
      )}
    </div>
  )
}
