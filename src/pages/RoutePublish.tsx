import { useState } from 'react'
import { MapPin, Clock, Route as RouteIcon, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { useStore } from '@/store/useStore'

export default function RoutePublish() {
  const { routes, paceGroups, registrations, addRoute, role } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', distance: 5, startLocation: '', startTime: '', description: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.startLocation || !form.startTime) return
    addRoute({ ...form, leaderId: 'leader-1' })
    setForm({ name: '', distance: 5, startLocation: '', startTime: '', description: '' })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>跑步路线</h1>
          <p className="text-gray-400 mt-1">浏览已发布路线，领队可新增路线</p>
        </div>
        {role === 'leader' && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e85a25] text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95">
            <Plus className="w-5 h-5" />发布路线
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <h2 className="text-lg font-semibold">新增路线</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm text-gray-400">路线名称</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" placeholder="例：晨光滨江线" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">距离（公里）</label>
              <input type="number" min="1" step="0.1" value={form.distance} onChange={(e) => setForm({ ...form, distance: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B35] transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">集合地点</label>
              <input value={form.startLocation} onChange={(e) => setForm({ ...form, startLocation: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" placeholder="例：滨江大道3号口" required />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-gray-400">出发时间</label>
              <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B35] transition-colors [color-scheme:dark]" required />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-400">路线描述</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors resize-none" rows={2} placeholder="路线特点与注意事项..." />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-6 py-2.5 bg-[#FF6B35] hover:bg-[#e85a25] text-white rounded-xl font-semibold transition-all active:scale-95">确认发布</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl font-semibold transition-all">取消</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route, idx) => {
          const groups = paceGroups.filter((g) => g.routeId === route.id)
          const regs = registrations.filter((r) => r.routeId === route.id)
          const totalCap = groups.reduce((s, g) => s + g.capacity, 0)
          const confirmedCount = regs.filter((r) => r.status === 'confirmed').length
          const isExpanded = expandedRoute === route.id
          return (
            <div key={route.id} className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:shadow-xl hover:shadow-black/20" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className="h-1.5 bg-gradient-to-r from-[#FF6B35] via-[#F4845F] to-[#2EC4B6]" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold">{route.name}</h3>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF6B35]/15 text-[#FF6B35] font-medium">{route.distance}km</span>
                </div>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#FF6B35]" />{route.startLocation}</div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-[#FF6B35]" />{new Date(route.startTime).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
                {route.description && <p className="mt-3 text-sm text-gray-500 line-clamp-2">{route.description}</p>}
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-gray-400">已报名</span>
                    <span className="font-semibold text-white">{confirmedCount} / {totalCap}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#FF6B35] to-[#2EC4B6] rounded-full transition-all" style={{ width: `${Math.min((confirmedCount / totalCap) * 100, 100)}%` }} />
                  </div>
                </div>
                <button onClick={() => setExpandedRoute(isExpanded ? null : route.id)} className="mt-4 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors w-full justify-center">
                  <RouteIcon className="w-3.5 h-3.5" />
                  {isExpanded ? '收起配速组' : '查看配速组'}
                  {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
                {isExpanded && (
                  <div className="mt-3 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {groups.map((g) => {
                      const gRegs = regs.filter((r) => r.paceGroupId === g.id)
                      const gConfirmed = gRegs.filter((r) => r.status === 'confirmed').length
                      return (
                        <div key={g.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                          <div className="flex items-center gap-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                            <span className="text-sm font-medium">{g.paceRange}</span>
                          </div>
                          <span className="text-xs text-gray-400">{gConfirmed}/{g.capacity}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
