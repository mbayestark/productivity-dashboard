import type { Doc } from '../../../convex/_generated/dataModel'

interface Props {
  milestones: Doc<'cubesat_milestones'>[]
}

const statusColor: Record<string, { dot: string; text: string }> = {
  complete:    { dot: 'bg-green-500', text: 'text-green-700' },
  in_progress: { dot: 'bg-indigo-500', text: 'text-indigo-700' },
  upcoming:    { dot: 'bg-gray-300', text: 'text-gray-500' },
  delayed:     { dot: 'bg-red-500', text: 'text-red-700' },
}

export default function MilestoneTimeline({ milestones }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-4">Milestone Timeline</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {milestones.map((m, i) => {
            const sc = statusColor[m.status] ?? statusColor.upcoming
            return (
              <div key={m._id} className="flex items-start">
                <div className="flex flex-col items-center w-36 shrink-0">
                  {/* Dot */}
                  <div className={`w-4 h-4 rounded-full ${sc.dot} ring-4 ring-white z-10`} />
                  {/* Content */}
                  <div className="text-center mt-2 px-1">
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{m.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(m.targetDate)}</p>
                    <span className={`text-[10px] font-medium ${sc.text} capitalize`}>
                      {m.status.replace('_', ' ')}
                    </span>
                    {m.completedDate && (
                      <p className="text-[10px] text-green-600 mt-0.5">Done {formatDate(m.completedDate)}</p>
                    )}
                  </div>
                </div>
                {/* Connector line */}
                {i < milestones.length - 1 && (
                  <div className="w-8 h-0.5 bg-gray-200 mt-[7px] shrink-0" />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
