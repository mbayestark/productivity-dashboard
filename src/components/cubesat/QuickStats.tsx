import type { Doc } from '../../../convex/_generated/dataModel'

interface Props {
  subsystems: Doc<'cubesat_subsystems'>[]
  milestones: Doc<'cubesat_milestones'>[]
  logEntries: Doc<'cubesat_log'>[]
}

export default function QuickStats({ subsystems, milestones, logEntries }: Props) {
  const completeCount = subsystems.filter((s) => s.status === 'complete').length
  const totalCount = subsystems.length

  const today = new Date()
  const upcoming = milestones.filter((m) => m.status !== 'complete')
  const nextMilestone = upcoming[0]
  const daysToNext = nextMilestone
    ? Math.max(0, Math.ceil((new Date(nextMilestone.targetDate).getTime() - today.getTime()) / 86400000))
    : null

  const weekAgo = new Date(today)
  weekAgo.setDate(weekAgo.getDate() - 7)
  const weekStr = weekAgo.toISOString().split('T')[0]
  const logsThisWeek = logEntries.filter((e) => e.date >= weekStr).length

  const stats = [
    { label: 'Subsystems complete', value: `${completeCount} / ${totalCount}` },
    { label: 'Days to next milestone', value: daysToNext !== null ? `${daysToNext}` : '—' },
    { label: 'Log entries this week', value: `${logsThisWeek}` },
    { label: 'Next milestone', value: nextMilestone ? nextMilestone.title : '—', sub: nextMilestone ? formatDate(nextMilestone.targetDate) : undefined },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">{s.label}</p>
          <p className="text-lg font-bold text-gray-900">{s.value}</p>
          {s.sub && <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>}
        </div>
      ))}
    </div>
  )
}

function formatDate(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
