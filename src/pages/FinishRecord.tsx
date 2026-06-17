import { useState } from 'react'
import { Trophy, Timer, Users, BarChart3, CheckCircle2, AlertTriangle, Coffee, LogOut } from 'lucide-react'
import { useStore } from '@/store/useStore'
import type { FinishType } from '@/types'

const finishTypeOptions: { value: FinishType; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  { value: 'normal', label: '正常完赛', icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-500/15', desc: '按计划完成全部里程' },
  { value: 'supply_interrupted', label: '补给中断', icon: <Coffee className="w-4 h-4" />, color: 'text-amber-400 bg-amber-500/15', desc: '因补给问题暂停后继续完成' },
  { value: 'early_withdrawal', label: '提前退赛', icon: <LogOut className="w-4 h-4" />, color: 'text-red-400 bg-red-500/15', desc: '未能完成全部里程提前退出' },
]

export default function FinishRecord() {
  const { routes, paceGroups, registrations, finishRecords, addFinishRecord, isFinished } = useStore()
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [finishForm, setFinishForm] = useState({ registrationId: '', finishTime: '', finishType: 'normal' as FinishType, note: '' })
  const [searchTerm, setSearchTerm] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const routeRegs = registrations.filter((r) => r.routeId === selectedRoute && (r.status === 'confirmed' || r.status === 'finished'))
  const routeFinishes = finishRecords.filter((f) => f.routeId === selectedRoute)
  const routeGroups = paceGroups.filter((g) => g.routeId === selectedRoute)

  const unfinishedRegs = routeRegs.filter((r) => !isFinished(r.memberId, r.routeId!))

  const filteredRegs = searchTerm
    ? unfinishedRegs.filter((r) => r.memberName.includes(searchTerm))
    : unfinishedRegs

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!finishForm.registrationId || !finishForm.finishTime) return
    const reg = registrations.find((r) => r.id === finishForm.registrationId)
    if (!reg) return
    addFinishRecord(finishForm.registrationId, reg.routeId, reg.memberId, reg.memberName, finishForm.finishTime, finishForm.finishType, finishForm.note)
    setSuccessMsg(`${reg.memberName} 完赛记录已保存！`)
    setFinishForm({ registrationId: '', finishTime: '', finishType: 'normal', note: '' })
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const totalConfirmed = routeRegs.filter((r) => r.status === 'confirmed' || r.status === 'finished').length
  const totalFinished = routeFinishes.length
  const normalCount = routeFinishes.filter((f) => f.finishType === 'normal').length
  const interruptedCount = routeFinishes.filter((f) => f.finishType === 'supply_interrupted').length
  const withdrawalCount = routeFinishes.filter((f) => f.finishType === 'early_withdrawal').length
  const avgTime = routeFinishes.length > 0
    ? routeFinishes.reduce((sum, f) => {
        const parts = f.finishTime.split(':').map(Number)
        return sum + (parts[0] || 0) * 3600 + (parts[1] || 0) * 60 + (parts[2] || 0)
      }, 0) / routeFinishes.length
    : 0
  const avgTimeStr = avgTime > 0 ? `${Math.floor(avgTime / 3600)}:${String(Math.floor((avgTime % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(avgTime % 60)).padStart(2, '0')}` : '--:--:--'

  const getFinishTypeBadge = (type: FinishType) => {
    const opt = finishTypeOptions.find((o) => o.value === type)
    if (!opt) return null
    return <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${opt.color}`}>{opt.icon}{opt.label}</span>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>完赛登记</h1>
        <p className="text-gray-400 mt-1">志愿者记录完赛成绩，区分正常完赛、补给中断与提前退赛</p>
      </div>

      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">选择路线</label>
        <select value={selectedRoute || ''} onChange={(e) => setSelectedRoute(e.target.value || null)} className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B35] transition-colors [color-scheme:dark]">
          <option value="">-- 请选择 --</option>
          {routes.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
      </div>

      {selectedRoute && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-[#FF6B35]" />
                <span className="text-sm text-gray-400">报名人数</span>
              </div>
              <div className="text-3xl font-bold" style={{ fontFamily: 'Outfit, sans-serif' }}>{totalConfirmed}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-[#2EC4B6]" />
                <span className="text-sm text-gray-400">完赛人数</span>
              </div>
              <div className="text-3xl font-bold text-[#2EC4B6]" style={{ fontFamily: 'Outfit, sans-serif' }}>{totalFinished}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-sm text-gray-400">正常完赛</span>
              </div>
              <div className="text-3xl font-bold text-emerald-400" style={{ fontFamily: 'Outfit, sans-serif' }}>{normalCount}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Coffee className="w-5 h-5 text-amber-400" />
                <span className="text-sm text-gray-400">补给中断</span>
              </div>
              <div className="text-3xl font-bold text-amber-400" style={{ fontFamily: 'Outfit, sans-serif' }}>{interruptedCount}</div>
            </div>
            <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <LogOut className="w-5 h-5 text-red-400" />
                <span className="text-sm text-gray-400">提前退赛</span>
              </div>
              <div className="text-3xl font-bold text-red-400" style={{ fontFamily: 'Outfit, sans-serif' }}>{withdrawalCount}</div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Timer className="w-5 h-5 text-[#E9C46A]" />
              <span className="font-semibold">平均完赛时间</span>
              <span className="text-xl font-bold text-[#E9C46A] font-mono" style={{ fontFamily: 'Outfit, sans-serif' }}>{avgTimeStr}</span>
            </div>
          </div>

          {routeGroups.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-3 flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#FF6B35]" />各组完赛率</h2>
              <div className="space-y-3">
                {routeGroups.map((g) => {
                  const gRegs = routeRegs.filter((r) => r.paceGroupId === g.id)
                  const gFinishes = gRegs.filter((r) => isFinished(r.memberId, selectedRoute)).length
                  const rate = gRegs.length > 0 ? (gFinishes / gRegs.length) * 100 : 0
                  return (
                    <div key={g.id} className="flex items-center gap-4">
                      <div className="flex items-center gap-2 min-w-[160px]">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                        <span className="text-sm font-medium">{g.paceRange}</span>
                      </div>
                      <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${rate}%`, backgroundColor: g.color }} />
                      </div>
                      <span className="text-sm text-gray-400 min-w-[60px] text-right">{gFinishes}/{gRegs.length}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />{successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold mb-4">登记完赛</h2>
              <form onSubmit={handleFinish} className="space-y-4 bg-white/[0.03] border border-white/10 rounded-2xl p-6">
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">选择队员</label>
                  <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="搜索队员姓名..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors text-sm mb-2" />
                  <select value={finishForm.registrationId} onChange={(e) => setFinishForm({ ...finishForm, registrationId: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B35] transition-colors [color-scheme:dark]" required>
                    <option value="">-- 选择未完赛队员 --</option>
                    {filteredRegs.map((r) => <option key={r.id} value={r.id}>{r.memberName}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">完赛用时</label>
                  <input value={finishForm.finishTime} onChange={(e) => setFinishForm({ ...finishForm, finishTime: e.target.value })} placeholder="0:52:30" className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" required />
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">完赛类型</label>
                  <div className="grid grid-cols-3 gap-2">
                    {finishTypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFinishForm({ ...finishForm, finishType: opt.value })}
                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center ${finishForm.finishType === opt.value ? 'border-white/30 bg-white/10' : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'}`}
                      >
                        <div className={opt.color.split(' ')[0]}>{opt.icon}</div>
                        <span className="text-xs font-medium">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{finishTypeOptions.find((o) => o.value === finishForm.finishType)?.desc}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-sm text-gray-400">备注</label>
                  <input value={finishForm.note} onChange={(e) => setFinishForm({ ...finishForm, note: e.target.value })} placeholder="可选备注..." className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF6B35] transition-colors" />
                </div>
                <button type="submit" className="w-full px-6 py-3 bg-[#FF6B35] hover:bg-[#e85a25] text-white rounded-xl font-semibold shadow-lg shadow-orange-500/25 transition-all active:scale-95">提交完赛记录</button>
              </form>
            </div>

            <div>
              <h2 className="text-lg font-bold mb-4">完赛记录</h2>
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {routeFinishes.length === 0 && <p className="text-gray-500 text-sm">暂无完赛记录</p>}
                {routeFinishes.map((f) => {
                  const reg = registrations.find((r) => r.id === f.registrationId)
                  const group = reg ? paceGroups.find((g) => g.id === reg.paceGroupId) : null
                  return (
                    <div key={f.id} className="px-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: group?.color || '#666' }} />
                          <span className="font-medium text-sm">{f.memberName}</span>
                          <span className="text-xs text-gray-500">{group?.paceRange}</span>
                        </div>
                        {getFinishTypeBadge(f.finishType)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-mono font-semibold text-[#2EC4B6]">{f.finishTime}</div>
                        {f.note && <div className="text-xs text-gray-500">{f.note}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
