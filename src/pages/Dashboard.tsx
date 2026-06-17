import { ThermometerSun, CloudRain, CloudLightning, ArrowRightLeft, Users, AlertTriangle, Eye } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { WeatherType } from '@/types'

export default function Dashboard() {
  const { routes, paceGroups, registrations, weatherAlerts, rescheduleLogs, checkIns, finishRecords } = useStore()

  const activeAlerts = weatherAlerts.filter((a) => a.active)
  const allReschedules = rescheduleLogs

  const getWeatherIcon = (type: WeatherType) => {
    if (type === 'high_temp') return <ThermometerSun className="w-5 h-5 text-red-400" />
    if (type === 'rain') return <CloudRain className="w-5 h-5 text-blue-400" />
    if (type === 'storm') return <CloudLightning className="w-5 h-5 text-purple-400" />
    return <AlertTriangle className="w-5 h-5 text-amber-400" />
  }

  const getWeatherLabel = (type: WeatherType) => {
    if (type === 'high_temp') return '高温预警'
    if (type === 'rain') return '降雨预警'
    if (type === 'storm') return '暴风预警'
    return '天气预警'
  }

  const getWeatherBg = (type: WeatherType) => {
    if (type === 'high_temp') return 'border-red-500/30 bg-red-500/5'
    if (type === 'rain') return 'border-blue-500/30 bg-blue-500/5'
    if (type === 'storm') return 'border-purple-500/30 bg-purple-500/5'
    return 'border-amber-500/30 bg-amber-500/5'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>活动总览</h1>
        <p className="text-gray-400 mt-1">分组变化与天气调整一目了然</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="text-sm text-gray-400 mb-1">活跃路线</div>
          <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{routes.length}</div>
        </div>
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
          <div className="text-sm text-gray-400 mb-1">报名总人数</div>
          <div className="text-3xl font-bold text-[#FF6B35]" style={{ fontFamily: 'Outfit, sans-serif' }}>{registrations.filter((r) => r.status === 'confirmed' || r.status === 'finished').length}</div>
        </div>
        <div className="bg-white/[0.03] border border-red-500/20 rounded-2xl p-5">
          <div className="text-sm text-gray-400 mb-1">活跃天气预警</div>
          <div className="text-3xl font-bold text-red-400" style={{ fontFamily: 'Outfit, sans-serif' }}>{activeAlerts.length}</div>
        </div>
        <div className="bg-white/[0.03] border border-amber-500/20 rounded-2xl p-5">
          <div className="text-sm text-gray-400 mb-1">改签人次</div>
          <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: 'Outfit, sans-serif' }}>{allReschedules.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ThermometerSun className="w-5 h-5 text-red-400" />
            天气预警
          </h2>
          {activeAlerts.length === 0 && (
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-center">
              <p className="text-gray-500">当前无活跃天气预警</p>
            </div>
          )}
          <div className="space-y-3">
            {activeAlerts.map((alert) => {
              const route = routes.find((r) => r.id === alert.routeId)
              const routeRegs = registrations.filter((r) => r.routeId === alert.routeId)
              const notStartedCount = routeRegs.filter((r) => {
                if (finishRecords.some((f) => f.registrationId === r.id)) return false
                if (checkIns.some((c) => c.registrationId === r.id)) return false
                if (r.status === 'finished') return false
                return true
              }).length
              const alertReschedules = allReschedules.filter((l) => l.weatherAlertId === alert.id)
              return (
                <div key={alert.id} className={`p-4 border rounded-xl ${getWeatherBg(alert.type)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {getWeatherIcon(alert.type)}
                    <span className="font-semibold">{route?.name || '未知路线'}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{getWeatherLabel(alert.type)}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-500">未出发队员：<span className="text-white font-semibold">{notStartedCount}</span>人</span>
                    <span className="text-gray-500">已改签：<span className="text-emerald-400 font-semibold">{alertReschedules.length}</span>人</span>
                    {route && <span className="text-gray-500">备用里程：<span className="text-white font-semibold">{route.backupDistance}km</span></span>}
                  </div>
                  <div className="text-xs text-gray-600 mt-2">触发时间：{new Date(alert.triggeredAt).toLocaleString('zh-CN')}</div>
                </div>
              )
            })}
          </div>

          {weatherAlerts.filter((a) => !a.active).length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-500 mb-2">历史预警</h3>
              <div className="space-y-2">
                {weatherAlerts.filter((a) => !a.active).map((alert) => {
                  const route = routes.find((r) => r.id === alert.routeId)
                  return (
                    <div key={alert.id} className="flex items-center justify-between px-3 py-2 bg-white/[0.02] rounded-lg text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(alert.type)}
                        <span>{route?.name}</span>
                      </div>
                      <span>{new Date(alert.triggeredAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            分组变化
          </h2>
          {allReschedules.length === 0 && (
            <div className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl text-center">
              <p className="text-gray-500">暂无分组变更记录</p>
            </div>
          )}
          <div className="space-y-3">
            {allReschedules.map((log) => {
              const fromRoute = routes.find((r) => r.id === log.fromRouteId)
              const toRoute = routes.find((r) => r.id === log.toRouteId)
              const fromGroup = paceGroups.find((g) => g.id === log.fromPaceGroupId)
              const toGroup = paceGroups.find((g) => g.id === log.toPaceGroupId)
              const reg = registrations.find((r) => r.id === log.registrationId)
              const alert = weatherAlerts.find((a) => a.id === log.weatherAlertId)
              return (
                <div key={log.id} className="p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{reg?.memberName || '未知'}</span>
                    <span className="text-xs text-gray-500">{new Date(log.rescheduledAt).toLocaleString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex-1 p-2 bg-white/5 rounded-lg">
                      <div className="text-gray-500 mb-0.5">原分组</div>
                      <div className="font-medium">{fromRoute?.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: fromGroup?.color || '#666' }} />
                        <span className="text-gray-400">{fromGroup?.paceRange}</span>
                      </div>
                    </div>
                    <ArrowRightLeft className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <div className="flex-1 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <div className="text-emerald-500 mb-0.5">新分组</div>
                      <div className="font-medium">{toRoute?.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: toGroup?.color || '#666' }} />
                        <span className="text-gray-400">{toGroup?.paceRange}</span>
                      </div>
                      {fromGroup?.paceRange === toGroup?.paceRange && (
                        <span className="text-emerald-400 text-xs">✓ 配速组已保留</span>
                      )}
                    </div>
                  </div>
                  {alert && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                      {getWeatherIcon(alert.type)}
                      <span>因{getWeatherLabel(alert.type)}改签</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#FF6B35]" />
              各路线当前分组
            </h3>
            <div className="space-y-3">
              {routes.map((route) => {
                const groups = paceGroups.filter((g) => g.routeId === route.id)
                const regs = registrations.filter((r) => r.routeId === route.id)
                const alert = weatherAlerts.find((a) => a.routeId === route.id && a.active)
                const rescheduledCount = allReschedules.filter((l) => l.toRouteId === route.id).length
                return (
                  <div key={route.id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{route.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF6B35]/15 text-[#FF6B35]">{route.distance}km</span>
                        {alert && <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 flex items-center gap-1"><Eye className="w-3 h-3" />预警中</span>}
                      </div>
                      {rescheduledCount > 0 && (
                        <span className="text-xs text-amber-400 flex items-center gap-1"><ArrowRightLeft className="w-3 h-3" />改入{rescheduledCount}人</span>
                      )}
                    </div>
                    <div className="space-y-2">
                      {groups.map((g) => {
                        const gRegs = regs.filter((r) => r.paceGroupId === g.id)
                        const confirmed = gRegs.filter((r) => r.status === 'confirmed').length
                        const rescheduled = gRegs.filter((r) => r.rescheduledFromRouteId).length
                        return (
                          <div key={g.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: g.color }} />
                              <span className="text-sm">{g.paceRange}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-gray-400">{confirmed}/{g.capacity}</span>
                              {rescheduled > 0 && <span className="text-amber-400">+{rescheduled}改签</span>}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
