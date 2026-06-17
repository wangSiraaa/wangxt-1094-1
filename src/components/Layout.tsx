import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, MapPin, Users, Trophy, FileText, Flag } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { Role } from '@/types'

const roleLabels: Record<Role, string> = { leader: '领队', member: '队员', volunteer: '志愿者' }
const roleColors: Record<Role, string> = { leader: 'bg-orange-500', member: 'bg-emerald-500', volunteer: 'bg-sky-500' }

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '总览' },
  { to: '/routes', icon: MapPin, label: '路线' },
  { to: '/registration', icon: Users, label: '报名' },
  { to: '/finish', icon: Trophy, label: '完赛' },
  { to: '/archive', icon: FileText, label: '档案' },
]

export default function Layout() {
  const { role, setRole } = useStore()

  return (
    <div className="min-h-screen bg-[#1A1A2E] text-gray-100 font-sans">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1A1A2E]/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flag className="w-6 h-6 text-[#FF6B35]" />
            <span className="text-xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              公益跑团
            </span>
          </div>
          <nav className="flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) => `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-white/15 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                <Icon className="w-4 h-4" />{label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-1.5 bg-white/5 rounded-lg p-1">
            {(Object.keys(roleLabels) as Role[]).map((r) => (
              <button key={r} onClick={() => setRole(r)} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${role === r ? `${roleColors[r]} text-white shadow-lg` : 'text-gray-400 hover:text-white'}`}>
                {roleLabels[r]}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <div className="fixed inset-0 -z-10 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 40px, #fff 40px, #fff 42px)' }} />
    </div>
  )
}
