import { useState } from 'react'
import { ShieldCheck, Users, AlertCircle, CheckCircle2, Clock, Heart, Plus, X, ThermometerSun, CloudRain } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { currentUserId } from '@/data/sample'
import type { FamilyMember } from '@/types'

export default function Registration() {
  const { routes, paceGroups, registrations, weatherAlerts, healthCommitted, familyHealthCommitted, addRegistration, confirmHealthCommitment, confirmFamilyHealthCommitment, isGroupFull, isFinished, role } = useStore()
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [showCommitment, setShowCommitment] = useState(false)
  const [showFamilyCommitment, setShowFamilyCommitment] = useState(false)
  const [registered, setRegistered] = useState<string | null>(null)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)
  const [isFamily, setIsFamily] = useState(false)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberRelation, setNewMemberRelation] = useState('')

  const route = routes.find((r) => r.id === selectedRoute)
  const groups = paceGroups.filter((g) => g.routeId === selectedRoute)
  const myReg = registrations.find((r) => r.routeId === selectedRoute && r.memberId === currentUserId)
  const routeAlert = weatherAlerts.find((a) => a.routeId === selectedRoute && a.active)

  const handleRegisterClick = (routeId: string) => {
    setSelectedRoute(routeId)
    if (!healthCommitted) {
      setShowCommitment(true)
    }
  }

  const handleConfirmCommitment = () => {
    confirmHealthCommitment()
    setShowCommitment(false)
  }

  const handleConfirmFamilyCommitment = () => {
    confirmFamilyHealthCommitment()
    setShowFamilyCommitment(false)
  }

  const addFamilyMember = () => {
    if (!newMemberName || !newMemberRelation) return
    setFamilyMembers([...familyMembers, {
      id: `fm-${Date.now()}`,
      name: newMemberName,
      relationship: newMemberRelation,
      healthCommitment: false,
    }])
    setNewMemberName('')
    setNewMemberRelation('')
  }

  const removeFamilyMember = (id: string) => {
    setFamilyMembers(familyMembers.filter((m) => m.id !== id))
  }

  const toggleFamilyHealthCommitment = (id: string) => {
    setFamilyMembers(familyMembers.map((m) =>
      m.id === id ? { ...m, healthCommitment: !m.healthCommitment } : m
    ))
  }

  const handlePaceSelect = (paceGroupId: string) => {
    if (!selectedRoute) return
    if (isFinished(currentUserId, selectedRoute)) {
      alert('你已完赛，报名信息不可修改')
      return
    }
    if (isFamily && !familyHealthCommitted) {
      setShowFamilyCommitment(true)
      return
    }
    const allFamilyCommitted = familyMembers.every((m) => m.healthCommitment)
    if (isFamily && !allFamilyCommitted) {
      alert('请先确认所有家属的健康承诺')
      return
    }
    addRegistration(selectedRoute, paceGroupId, isFamily, familyMembers)
    setRegistered(paceGroupId)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400"><CheckCircle2 className="w-3 h-3" />已确认</span>
    if (status === 'waitlist') return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400"><Clock className="w-3 h-3" />候补</span>
    if (status === 'finished') return <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400">已完赛</span>
    return null
  }

  const getWeatherIcon = (type: string) => {
    if (type === 'high_temp') return <ThermometerSun className="w-4 h-4 text-red-400" />
    if (type === 'rain') return <CloudRain className="w-4 h-4 text-blue-400" />
    return <AlertCircle className="w-4 h-4 text-amber-400" />
  }

  const getWeatherLabel = (type: string) => {
    if (type === 'high_temp') return '高温预警'
    if (type === 'rain') return '降雨预警'
    if (type === 'storm') return '暴风预警'
    return '天气预警'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>报名与分组</h1>
        <p className="text-gray-400 mt-1">选择路线报名，支持家庭组队，按配速自动分组</p>
      </div>

      {!selectedRoute && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {routes.map((r) => {
            const regs = registrations.filter((reg) => reg.routeId === r.id)
            const totalCap = paceGroups.filter((g) => g.routeId === r.id).reduce((s, g) => s + g.capacity, 0)
            const hasMyReg = regs.some((reg) => reg.memberId === currentUserId)
            const alert = weatherAlerts.find((a) => a.routeId === r.id && a.active)
            return (
              <button key={r.id} onClick={() => role === 'member' ? handleRegisterClick(r.id) : setSelectedRoute(r.id)} className="text-left bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-[#FF6B35]/50 hover:bg-white/[0.05] transition-all group relative">
                {alert && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-400">
                    {getWeatherIcon(alert.type)}
                    {getWeatherLabel(alert.type)}
                  </div>
                )}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-lg">{r.name}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[#FF6B35]/15 text-[#FF6B35] font-medium">{r.distance}km</span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{r.startLocation}</p>
                <p className="text-xs text-gray-600 mb-3">备用里程：{r.backupDistance}km</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{regs.filter((reg) => reg.status === 'confirmed').length}/{totalCap} 已报名</span>
                  {hasMyReg && <span className="text-xs text-emerald-400 font-medium">已报名</span>}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {selectedRoute && route && (
        <div>
          <button onClick={() => { setSelectedRoute(null); setExpandedGroup(null); setIsFamily(false); setFamilyMembers([]) }} className="mb-6 text-sm text-gray-400 hover:text-white transition-colors">&larr; 返回路线列表</button>

          {routeAlert && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              {getWeatherIcon(routeAlert.type)}
              <div>
                <div className="font-semibold text-red-400">{getWeatherLabel(routeAlert.type)}</div>
                <p className="text-sm text-gray-400 mt-1">{routeAlert.description}</p>
                <p className="text-xs text-gray-500 mt-1">备用里程：{route.backupDistance}km · 未出发队员将被自动改签</p>
              </div>
            </div>
          )}

          {role === 'member' && !myReg && (
            <div className="mb-8">
              <div className="mb-6 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-400" />
                    <span className="font-semibold">家庭组队参加</span>
                  </div>
                  <button
                    onClick={() => setIsFamily(!isFamily)}
                    className={`relative w-12 h-6 rounded-full transition-colors ${isFamily ? 'bg-[#FF6B35]' : 'bg-white/10'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isFamily ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {isFamily && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex gap-2">
                      <input value={newMemberName} onChange={(e) => setNewMemberName(e.target.value)} placeholder="家属姓名" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm" />
                      <input value={newMemberRelation} onChange={(e) => setNewMemberRelation(e.target.value)} placeholder="关系（如：配偶）" className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm" />
                      <button onClick={addFamilyMember} className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"><Plus className="w-4 h-4" /></button>
                    </div>
                    {familyMembers.map((m) => (
                      <div key={m.id} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{m.name}</span>
                          <span className="text-xs text-gray-500">{m.relationship}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFamilyHealthCommitment(m.id)}
                            className={`text-xs px-2 py-1 rounded-full transition-colors ${m.healthCommitment ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/10 text-gray-400'}`}
                          >
                            {m.healthCommitment ? '✓ 已承诺' : '未承诺'}
                          </button>
                          <button onClick={() => removeFamilyMember(m.id)} className="text-gray-500 hover:text-red-400 transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    ))}
                    {familyMembers.length > 0 && !familyMembers.every((m) => m.healthCommitment) && (
                      <p className="text-xs text-amber-400">⚠ 请为每位家属单独确认健康承诺</p>
                    )}
                  </div>
                )}
              </div>

              <h2 className="text-xl font-bold mb-4">选择配速组</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {groups.map((g) => {
                  const gRegs = registrations.filter((r) => r.paceGroupId === g.id)
                  const confirmedCount = gRegs.filter((r) => r.status === 'confirmed').length
                  const full = isGroupFull(g.id)
                  const remaining = g.capacity - confirmedCount
                  return (
                    <button key={g.id} onClick={() => handlePaceSelect(g.id)} disabled={!!registered} className={`relative text-left border rounded-2xl p-5 transition-all ${full ? 'border-white/5 bg-white/[0.02] opacity-75' : 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05]'} ${registered === g.id ? 'ring-2 ring-[#FF6B35]' : ''}`}>
                      <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ backgroundColor: g.color }} />
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                        <span className="font-bold">{g.paceRange}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">剩余名额</span>
                        <span className={full ? 'text-amber-400 font-semibold' : 'text-white font-semibold'}>{full ? 0 : remaining}</span>
                      </div>
                      {full && <div className="mt-2 flex items-center gap-1 text-xs text-amber-400"><AlertCircle className="w-3 h-3" />已满，将进入候补</div>}
                      {registered === g.id && <div className="mt-2 text-xs text-[#FF6B35] font-semibold">已选择</div>}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {myReg && (
            <div className="mb-8 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                你已报名此路线
                {getStatusBadge(myReg.status)}
              </div>
              <p className="text-sm text-gray-400 mt-1">配速组：{groups.find((g) => g.id === myReg.paceGroupId)?.paceRange}</p>
              {myReg.isFamily && myReg.familyMembers.length > 0 && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                  <Heart className="w-3.5 h-3.5 text-pink-400" />
                  家庭组队：{myReg.familyMembers.map((m) => m.name).join('、')}
                </div>
              )}
              {myReg.rescheduledFromRouteId && (
                <div className="mt-2 text-xs text-amber-400">⚠ 因天气调整，已从原路线改签至此</div>
              )}
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="w-5 h-5 text-[#FF6B35]" />分组结果</h2>
            <div className="space-y-3">
              {groups.map((g) => {
                const gRegs = registrations.filter((r) => r.paceGroupId === g.id)
                const confirmed = gRegs.filter((r) => r.status === 'confirmed')
                const waitlist = gRegs.filter((r) => r.status === 'waitlist')
                const finished = gRegs.filter((r) => r.status === 'finished')
                const isExp = expandedGroup === g.id
                return (
                  <div key={g.id} className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden">
                    <button onClick={() => setExpandedGroup(isExp ? null : g.id)} className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                        <span className="font-semibold">{g.paceRange}</span>
                        <span className="text-xs text-gray-400">{confirmed.length + finished.length}/{g.capacity}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {waitlist.length > 0 && <span className="text-xs text-amber-400">候补{waitlist.length}人</span>}
                        {isExp ? <span>&#9650;</span> : <span>&#9660;</span>}
                      </div>
                    </button>
                    {isExp && (
                      <div className="px-5 pb-4 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {[...confirmed, ...finished].map((r) => (
                          <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{r.memberName}</span>
                              {r.isFamily && <Heart className="w-3 h-3 text-pink-400" />}
                              {r.rescheduledFromRouteId && <span className="text-xs text-amber-400">改签</span>}
                            </div>
                            {getStatusBadge(r.status)}
                          </div>
                        ))}
                        {waitlist.length > 0 && (
                          <>
                            <div className="text-xs text-amber-400 font-medium pt-2 pb-1">候补名单</div>
                            {waitlist.map((r) => (
                              <div key={r.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-amber-500/5">
                                <span className="text-sm text-gray-300">{r.memberName}</span>
                                {getStatusBadge(r.status)}
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {showCommitment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#FF6B35]/15 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <div>
                <h2 className="text-xl font-bold">个人健康承诺确认</h2>
                <p className="text-sm text-gray-400">报名前请认真阅读并确认</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto text-sm text-gray-300 space-y-2">
              <p>1. 本人确认身体健康，无不适合跑步的疾病（如心脏病、高血压等）。</p>
              <p>2. 本人了解跑步活动的风险，自愿参加并承担相应责任。</p>
              <p>3. 活动期间本人将遵守组织方安排，服从领队和志愿者指引。</p>
              <p>4. 本人承诺活动前充分热身，如感不适将及时停止并求助。</p>
              <p>5. 本人同意组织方在紧急情况下采取必要的救助措施。</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleConfirmCommitment} className="flex-1 px-6 py-3 bg-[#FF6B35] hover:bg-[#e85a25] text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95">
                我已阅读并确认
              </button>
              <button onClick={() => setShowCommitment(false)} className="px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl font-semibold transition-all">
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {showFamilyCommitment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1A1A2E] border border-white/10 rounded-2xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-pink-500/15 flex items-center justify-center">
                <Heart className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold">家属健康承诺确认</h2>
                <p className="text-sm text-gray-400">请为每位家属单独确认</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto text-sm text-gray-300 space-y-2">
              <p>1. 本人确认家属身体健康，无不适合跑步的疾病。</p>
              <p>2. 本人了解家属参加活动的风险，同意其参加并承担相应责任。</p>
              <p>3. 活动期间本人将照看家属，服从领队和志愿者指引。</p>
              <p>4. 如家属感到不适，本人将及时停止并求助。</p>
              <p>5. 本人同意组织方在紧急情况下采取必要的救助措施。</p>
            </div>
            {familyMembers.length > 0 && !familyMembers.every((m) => m.healthCommitment) && (
              <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-xs text-amber-400">⚠ 以下家属尚未确认健康承诺：{familyMembers.filter((m) => !m.healthCommitment).map((m) => m.name).join('、')}</p>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={handleConfirmFamilyCommitment}
                disabled={!familyMembers.every((m) => m.healthCommitment)}
                className="flex-1 px-6 py-3 bg-pink-500 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-pink-500/25 transition-all active:scale-95"
              >
                确认家属健康承诺
              </button>
              <button onClick={() => setShowFamilyCommitment(false)} className="px-6 py-3 border border-white/10 hover:bg-white/5 text-gray-300 rounded-xl font-semibold transition-all">
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
