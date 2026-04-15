import { useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import OverallProgressRing from '../components/cubesat/OverallProgressRing'
import QuickStats from '../components/cubesat/QuickStats'
import MilestoneTimeline from '../components/cubesat/MilestoneTimeline'
import SubsystemCard from '../components/cubesat/SubsystemCard'
import BuildLog from '../components/cubesat/BuildLog'

export default function CubeSatDashboard() {
  const subsystems = useQuery(api.cubesat.getSubsystems)
  const milestones = useQuery(api.cubesat.getMilestones)
  const logEntries = useQuery(api.cubesat.getLog)
  const overallProgress = useQuery(api.cubesat.getOverallProgress)
  const seed = useMutation(api.cubesat.seedInitialData)

  useEffect(() => {
    if (subsystems && subsystems.length === 0) {
      seed()
    }
  }, [subsystems, seed])

  const loading = subsystems === undefined || milestones === undefined || logEntries === undefined

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link
          to="/"
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors w-fit"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <OverallProgressRing progress={overallProgress ?? 0} />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SAT-3U-001 — CubeSat Prototype</h2>
          <p className="text-gray-500 text-sm mt-1">3U CubeSat &middot; STM32F446RETx &middot; NUCLEO-F446RE</p>
          <span className="inline-block mt-2 text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium">
            In Development
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      {!loading && (
        <QuickStats subsystems={subsystems} milestones={milestones} logEntries={logEntries} />
      )}

      {/* Milestone Timeline */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <MilestoneTimeline milestones={milestones} />
      )}

      {/* Subsystem Progress */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Subsystem Progress</h3>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {subsystems.map((s) => (
              <SubsystemCard key={s._id} subsystem={s} />
            ))}
          </div>
        )}
      </div>

      {/* Build Log */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <BuildLog entries={logEntries} />
      )}
    </div>
  )
}
