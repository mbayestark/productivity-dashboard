import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Target, CalendarCheck, BarChart2
} from 'lucide-react'

const links = [
  { to: '/',          label: 'Dashboard', icon: LayoutDashboard },
  { to: '/projects',  label: 'Projects',  icon: FolderKanban },
  { to: '/tasks',     label: 'Tasks',     icon: CheckSquare },
  { to: '/goals',     label: 'Goals',     icon: Target },
  { to: '/checkins',  label: 'Check-ins', icon: CalendarCheck },
  { to: '/stats',     label: 'Stats',     icon: BarChart2 },
]

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Mbaye's Dashboard</h1>
        <p className="text-xs text-gray-500 mt-1">DAUST Productivity</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
