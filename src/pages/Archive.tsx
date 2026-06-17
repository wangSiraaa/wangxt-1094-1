import { useState } from 'react'
import { FileText, MapPin, Timer, CheckCircle2, Clock, Heart, ThermometerSun, CloudRain, ArrowRightLeft, Coffee, LogOut, MapPinned } from 'lucide-react'
import { useStore } from '@/store/useStore'
import { currentUserId, currentUserName } from '@/data/sample'
import type { MemberArchive, FinishType } from '@/types'

const finishTypeLabels: Record<FinishType, { label: string; color: string }> = {
  normal: { label: '正常完赛', color: 'text-emerald-400 bg-emerald-500/15' },
  supply_interrupted: { label: '补给中断', color: 'text-amber-400 bg-amber-500/15' },
  early_withdrawal: { label: '提前退赛', color: 'text-red-400 bg-red-500/15' },
}

const weatherTypeLabels: Record<string, { label: string; icon: React.ReactNode }> = {
  high_temp: { label: '高温', icon: <ThermometerSun className="w-3.5 h-3.5 text-red-400" /> },
  rain: { label: '降雨', icon: <CloudRain className="w-3.5 h-3.5 text-blue-400" /> },
  storm: { label: '暴风', icon: <CloudRain className="w-3.5 h-3.5 text-purple-400" /> },
}

export default function Archive() {
  const { getMemberArchive } = useStore()
  const [selectedMember, setSelectedMember] = useState<string>(currentUserId)
  const [expandedArchive, setExpandedArchive] = useState<string | null>(null)

  const archives = getMemberArchive(selectedMember)
  const memberName = selectedMember === currentUserId ? currentUserName : '队员'

  const allMembers = Array.from(new Set(archives.map((a) => a.memberId)))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>个人档案</h1>
        <p className="text-gray-400 mt-1">路线、配速、签到和完赛证据的可追溯档案</p>
      </div>

      <div className="mb-6">
        <label className="text-sm text-gray-400 mb-2 block">查看队员</label>
        <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)} className="w-full max-w-md bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B35] transition-colors [color-scheme:dark]">
          <option value={currentUserId}>{currentUserName}（我）</option>
        </select>
      </div>

      {archives.length === 0 && (
        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-2xl text-center">
          <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">暂无活动档案</p>
        </div>
      )}

      <div className="space-y-4">
        {archives.map((archive: MemberArchive) => {
          const isExp = expandedArchive === archive.routeId
          const finishInfo = archive.finishRecord ? finishTypeLabels[archive.finishRecord.finishType] : null
          return (
            <div key={archive.routeId} className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
              <button
                onClick={() => setExpandedArchive(isExp ? null : archive.routeId)}
                className="w-full p-5 flex items-center justify-between hover:bg-white/[0.02] transition-colors text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${archive.paceGroupColor}20` }}>
                    <MapPin className="w-5 h-5" style={{ color: archive.paceGroupColor }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg">{archive.routeName}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#FF6B35]/15 text-[#FF6B35]">{archive.distance}km</span>
                      {archive.rescheduledFrom && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 flex items-center gap-1">
                          <ArrowRightLeft className="w-3 h-3" />改签
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" />{archive.paceRange}</span>
                      {archive.isFamily && <span className="flex items-center gap-1 text-pink-400"><Heart className="w-3.5 h-3.5" />家庭组</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {archive.finishRecord ? (
                    <span className={`text-xs px-2.5 py-1 rounded-full ${finishInfo?.color}`}>
                      {archive.finishRecord.finishType === 'normal' && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                      {archive.finishRecord.finishType === 'supply_interrupted' && <Coffee className="w-3 h-3 inline mr-1" />}
                      {archive.finishRecord.finishType === 'early_withdrawal' && <LogOut className="w-3 h-3 inline mr-1" />}
                      {finishInfo?.label}
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400">
                      <Clock className="w-3 h-3 inline mr-1" />进行中
                    </span>
                  )}
                  {isExp ? <span>&#9650;</span> : <span>&#9660;</span>}
                </div>
              </button>

              {isExp && (
                <div className="px-5 pb-5 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                  {archive.rescheduledFrom && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-semibold text-amber-400">
                        <ArrowRightLeft className="w-4 h-4" />
                        天气改签记录
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-gray-400">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">原路线：</span>
                          <span>{archive.rescheduledFrom.routeName}</span>
                          <span className="text-gray-600">·</span>
                          <span>{archive.rescheduledFrom.paceRange}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">现路线：</span>
                          <span>{archive.routeName}</span>
                          <span className="text-gray-600">·</span>
                          <span>{archive.paceRange}</span>
                          <span className="text-emerald-400 text-xs">（配速组已保留）</span>
                        </div>
                        {archive.weatherAlert && (
                          <div className="flex items-center gap-2 text-amber-400">
                            {weatherTypeLabels[archive.weatherAlert.type]?.icon}
                            <span>{weatherTypeLabels[archive.weatherAlert.type]?.label}：{archive.weatherAlert.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {archive.isFamily && archive.familyMembers.length > 0 && (
                    <div className="p-3 bg-pink-500/10 border border-pink-500/20 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-semibold text-pink-400">
                        <Heart className="w-4 h-4" />
                        家庭组队
                      </div>
                      <div className="mt-2 space-y-1">
                        {archive.familyMembers.map((m) => (
                          <div key={m.id} className="flex items-center justify-between text-xs">
                            <span className="text-gray-300">{m.name}（{m.relationship}）</span>
                            <span className={m.healthCommitment ? 'text-emerald-400' : 'text-amber-400'}>
                              {m.healthCommitment ? '✓ 健康承诺已确认' : '未确认健康承诺'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">个人健康承诺</div>
                      <div className={archive.healthCommitment ? 'text-emerald-400 text-sm' : 'text-amber-400 text-sm'}>
                        {archive.healthCommitment ? '✓ 已确认' : '未确认'}
                      </div>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                      <div className="text-xs text-gray-500 mb-1">家属健康承诺</div>
                      <div className={archive.familyHealthCommitment ? 'text-emerald-400 text-sm' : 'text-gray-500 text-sm'}>
                        {archive.isFamily ? (archive.familyHealthCommitment ? '✓ 已确认' : '未确认') : '不适用'}
                      </div>
                    </div>
                  </div>

                  {archive.checkIns.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold mb-2 flex items-center gap-2"><MapPinned className="w-4 h-4 text-[#FF6B35]" />签到记录</div>
                      <div className="space-y-1.5">
                        {archive.checkIns.map((ck) => (
                          <div key={ck.id} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-lg text-xs">
                            <div className="flex items-center gap-2">
                              <MapPinned className="w-3 h-3 text-[#2EC4B6]" />
                              <span className="text-gray-300">{ck.location}</span>
                            </div>
                            <span className="text-gray-500">{new Date(ck.checkInTime).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {archive.finishRecord && (
                    <div>
                      <div className="text-sm font-semibold mb-2 flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#2EC4B6]" />完赛证据</div>
                      <div className="p-3 bg-white/5 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">完赛用时</span>
                          <span className="text-sm font-mono font-semibold text-[#2EC4B6]">{archive.finishRecord.finishTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">完赛类型</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${finishInfo?.color}`}>{finishInfo?.label}</span>
                        </div>
                        {archive.finishRecord.note && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">备注</span>
                            <span className="text-xs text-gray-300">{archive.finishRecord.note}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">登记时间</span>
                          <span className="text-xs text-gray-400">{new Date(archive.finishRecord.recordedAt).toLocaleString('zh-CN')}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
