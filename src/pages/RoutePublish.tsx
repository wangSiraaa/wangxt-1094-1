import { useState } from 'react'
import { MapPin, Clock, Route as RouteIcon, Plus, ChevronDown, ChevronUp, ThermometerSun, CloudRain, CloudLightning, AlertTriangle, ArrowRightLeft, CheckCircle2, Users, XCircle, UserCheck } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { WeatherType } from '@/types'

const weatherTypeOptions: { value: WeatherType; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'high_temp', label: '高温', icon: <ThermometerSun className="w-5 h-5" />, color: 'text-red-400 bg-red-500/15' },
  { value: 'rain', label: '降雨', icon: <CloudRain className="w-5 h-5" />, color: 'text-blue-400 bg-blue-500/15' },
  { value: 'storm', label: '暴风', icon: <CloudLightning className="w-5 h-5" />, color: 'text-purple-400 bg-purple-500/15' },
]

export default function RoutePublish() {
  const { routes, paceGroups, registrations, weatherAlerts, rescheduleLogs, checkIns, finishRecords, addRoute, triggerWeatherAlert, autoReschedule, role } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [expandedRoute, setExpandedRoute] = useState<string | null>(null)
  const [showWeatherForm, setShowWeatherForm] = useState<string | null>(null)
  const [weatherForm, setWeatherForm] = useState({ type: 'high_temp' as WeatherType, description: '' })
  const [rescheduleResult, setRescheduleResult] = useState<{
    show: boolean
    rescheduledCount: number
    excludedCount: number
    excludedByCheckIn: number
    excludedByFinish: number
    excludedByStatus: number
    paceGroupsPreserved: number
  } | null>(null)
  const [form, setForm] = useState({ name: '', distance: 5, backupDistance: 3, startLocation: '', startTime: '', description: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.startLocation || !form.startTime) return
    addRoute({ ...form, leaderId: 'leader-1', weatherAlertId: null })
    setForm({ name: '', distance: 5, backupDistance: 3, startLocation: '', startTime: '', description: '' })
    setShowForm(false)
  }

  const handleWeatherAlert = (e: React.FormEvent) => {
    e.preventDefault()
    if (!showWeatherForm || !weatherForm.description) return
    triggerWeatherAlert(showWeatherForm, weatherForm.type, weatherForm.description)
    setShowWeatherForm(null)
    setWeatherForm({ type: 'high_temp', description: '' })
  }

  const handleAutoReschedule = (alertId: string) => {
    const result = autoReschedule(alertId)
    setRescheduleResult({ show: true, ...result })
    setTimeout(() => setRescheduleResult(null), 6000)
  }

  const getWeatherIcon = (type: string) => {
    if (type === 'high_temp') return <ThermometerSun className="w-4 h-4 text-red-400" />
    if (type === 'rain') return <CloudRain className="w-4 h-4 text-blue-400" />
    if (type === 'storm') return <CloudLightning className="w-4 h-4 text-purple-400" />
    return <AlertTriangle className="w-4 h-4 text-amber-400" />
  }

  const getWeatherLabel = (type: string) => {
    if (type === 'high_temp') return '高温预警'
    if (type === 'rain') return '降雨预警'
    if (type === 'storm') return '暴风预警'
    return '天气预警'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>跑步路线</h1>
          <p className="text-gray-400 mt-1">浏览已发布路线，领队可新增路线并管理天气预警</p>
        </div>
        {role === 'leader' && (
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] hover:bg-[#e85a25] text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95">
            <Plus className="w-5 h-5" />发布路线
          </button>
        )}
      </div>

      {rescheduleResult && rescheduleResult.show && (
        <div className="mb-6 p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3">
            <CheckCircle2 className="w-5 h-5" />
            自动改签完成
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">成功改签</div>
              <div className="text-lg font-bold text-emerald-400 flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4" />
                {rescheduleResult.rescheduledCount} 人
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">配速组保留</div>
              <div className="text-lg font-bold text-[#2EC4B6] flex items-center gap-1.5">
                <UserCheck className="w-4 h-4" />
                {rescheduleResult.paceGroupsPreserved} 人
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-gray-400 mb-1">排除人数</div>
              <div className="text-lg font-bold text-amber-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                {rescheduleResult.excludedCount} 人
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-xs text-gray-400 space-y-1">
              <div className="flex justify-between"><span>· 已签到</span><span className="text-gray-300">{rescheduleResult.excludedByCheckIn}人</span></div>
              <div className="flex justify-between"><span>· 已完赛</span><span className="text-gray-300">{rescheduleResult.excludedByFinish}人</span></div>
              <div className="flex justify-between"><span>· 状态结束</span><span className="text-gray-300">{rescheduleResult.excludedByStatus}人</span></div>
            </div>
          </div>
        </div>
      )}

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
              <label className="text-sm text-gray-400">备用里程（公里）</label>
              <input type="number" min="1" step="0.1" value={form.backupDistance} onChange={(e) => setForm({ ...form, backupDistance: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B35] transition-colors" />
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
          const checkedInCount = regs.filter((r) => checkIns.some((c) => c.registrationId === r.id)).length
          const notStartedCount = regs.length - checkedInCount
          const isExpanded = expandedRoute === route.id
          const alert = weatherAlerts.find((a) => a.routeId === route.id && a.active)
          const routeReschedules = rescheduleLogs.filter((l) => l.fromRouteId === route.id)
          const rescheduledInCount = rescheduleLogs.filter((l) => l.toRouteId === route.id).length
          return (
            <div key={route.id} className="group bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all hover:shadow-xl hover:shadow-black/20" style={{ animationDelay: `${idx * 80}ms` }}>
              <div className={`h-1.5 ${alert ? 'bg-gradient-to-r from-red-500 via-red-400 to-amber-400' : 'bg-gradient-to-r from-[#FF6B35] via-[#F4845F] to-[#2EC4B6]'}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold">{route.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-[#FF6B35]/15 text-[#FF6B35] font-medium">{route.distance}km</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-400">备用{route.backupDistance}km</span>
                  </div>
                </div>

                {alert && (
                  <div className="mb-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <div className="flex items-center gap-2 text-red-400 text-sm font-semibold">
                      {getWeatherIcon(alert.type)}
                      {getWeatherLabel(alert.type)}
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{alert.description}</p>
                    {role === 'leader' && (
                      <button onClick={() => handleAutoReschedule(alert.id)} className="mt-2 flex items-center gap-1.5 text-xs px-3 py-1.5 bg-amber-500/15 text-amber-400 rounded-lg hover:bg-amber-500/25 transition-colors">
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        自动改签到备用里程
                      </button>
                    )}
                  </div>
                )}

                {routeReschedules.length > 0 && (
                  <div className="mb-3 p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400">
                    <div className="flex items-center gap-1 font-semibold"><ArrowRightLeft className="w-3.5 h-3.5" />已改签{routeReschedules.length}人至备用路线</div>
                  </div>
                )}

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

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <UserCheck className="w-3 h-3" />已签到 {checkedInCount}
                  </span>
                  <span className="text-gray-600">·</span>
                  <span className="flex items-center gap-1 text-gray-400">
                    <Users className="w-3 h-3" />未出发 {notStartedCount}
                  </span>
                  {rescheduledInCount > 0 && (
                    <>
                      <span className="text-gray-600">·</span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <ArrowRightLeft className="w-3 h-3" />改入 {rescheduledInCount}
                      </span>
                    </>
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button onClick={() => setExpandedRoute(isExpanded ? null : route.id)} className="flex-1 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors justify-center py-1.5 bg-white/5 rounded-lg">
                    <RouteIcon className="w-3.5 h-3.5" />
                    {isExpanded ? '收起' : '配速组'}
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {role === 'leader' && !alert && (
                    <button onClick={() => setShowWeatherForm(showWeatherForm === route.id ? null : route.id)} className="flex-1 flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors justify-center py-1.5 bg-white/5 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      天气预警
                    </button>
                  )}
                </div>

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

      {showWeatherForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-500/15 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">发布天气预警</h2>
                <p className="text-sm text-gray-400">触发后可自动改签未出发队员</p>
              </div>
            </div>

            <form onSubmit={handleWeatherAlert} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm text-gray-400">预警类型</label>
                <div className="grid grid-cols-3 gap-2">
                  {weatherTypeOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setWeatherForm({ ...weatherForm, type: opt.value })}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all ${weatherForm.type === opt.value ? 'border-white/30 bg-white/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                    >
                      <div className={opt.color.split(' ')[0]}>{opt.icon}</div>
                      <span className="text-xs font-medium">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm text-gray-400">预警描述</label>
                <textarea value={weatherForm.description} onChange={(e) => setWeatherForm({ ...weatherForm, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors resize-none" rows={3} placeholder="例：当日最高气温38°C，超过安全阈值" required />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg shadow-red-500/25 transition-all active:scale-95">
                  发布预警
                </button>
                <button type="button" onClick={() => setShowWeatherForm(null)} className="px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl font-semibold transition-all">
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
