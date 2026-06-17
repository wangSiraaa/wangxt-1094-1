import { create } from 'zustand'
import type { Route, PaceGroup, Registration, FinishRecord, Role } from '@/types'
import {
  sampleRoutes,
  samplePaceGroups,
  sampleRegistrations,
  sampleFinishRecords,
  currentUserId,
  currentUserName,
} from '@/data/sample'

interface AppState {
  role: Role
  routes: Route[]
  paceGroups: PaceGroup[]
  registrations: Registration[]
  finishRecords: FinishRecord[]
  healthCommitted: boolean
  setRole: (role: Role) => void
  addRoute: (route: Omit<Route, 'id'>) => void
  addRegistration: (routeId: string, paceGroupId: string) => void
  addFinishRecord: (registrationId: string, routeId: string, memberId: string, memberName: string, finishTime: string, note: string) => void
  confirmHealthCommitment: () => void
  isGroupFull: (paceGroupId: string) => boolean
  getGroupRegistrations: (paceGroupId: string) => Registration[]
  getRouteRegistrations: (routeId: string) => Registration[]
  isFinished: (memberId: string, routeId: string) => boolean
}

let idCounter = 100
const genId = (prefix: string) => `${prefix}-${++idCounter}`

export const useStore = create<AppState>((set, get) => ({
  role: 'leader',
  routes: [...sampleRoutes],
  paceGroups: [...samplePaceGroups],
  registrations: [...sampleRegistrations],
  finishRecords: [...sampleFinishRecords],
  healthCommitted: false,

  setRole: (role) => set({ role }),

  addRoute: (routeData) => {
    const newRoute: Route = { ...routeData, id: genId('route') }
    const defaultGroups: PaceGroup[] = [
      { id: genId('pg'), routeId: newRoute.id, paceRange: '5:00-5:30/km', capacity: 8, color: '#2EC4B6' },
      { id: genId('pg'), routeId: newRoute.id, paceRange: '5:30-6:00/km', capacity: 10, color: '#E9C46A' },
      { id: genId('pg'), routeId: newRoute.id, paceRange: '6:00-7:00/km', capacity: 12, color: '#F4845F' },
    ]
    set((s) => ({ routes: [...s.routes, newRoute], paceGroups: [...s.paceGroups, ...defaultGroups] }))
  },

  addRegistration: (routeId, paceGroupId) => {
    const state = get()
    if (!state.healthCommitted) return
    const existing = state.registrations.find(
      (r) => r.routeId === routeId && r.memberId === currentUserId
    )
    if (existing) return
    const isFull = state.isGroupFull(paceGroupId)
    const newReg: Registration = {
      id: genId('reg'),
      routeId,
      paceGroupId,
      memberId: currentUserId,
      memberName: currentUserName,
      status: isFull ? 'waitlist' : 'confirmed',
      healthCommitment: true,
      registeredAt: new Date().toISOString(),
    }
    set((s) => ({ registrations: [...s.registrations, newReg] }))
  },

  addFinishRecord: (registrationId, routeId, memberId, memberName, finishTime, note) => {
    const newRecord: FinishRecord = {
      id: genId('fin'),
      registrationId,
      routeId,
      memberId,
      memberName,
      finishTime,
      note,
      recordedBy: 'vol-1',
      recordedAt: new Date().toISOString(),
    }
    set((s) => ({
      finishRecords: [...s.finishRecords, newRecord],
      registrations: s.registrations.map((r) =>
        r.id === registrationId ? { ...r, status: 'finished' as const } : r
      ),
    }))
  },

  confirmHealthCommitment: () => set({ healthCommitted: true }),

  isGroupFull: (paceGroupId) => {
    const state = get()
    const group = state.paceGroups.find((g) => g.id === paceGroupId)
    if (!group) return false
    const confirmedCount = state.registrations.filter(
      (r) => r.paceGroupId === paceGroupId && r.status === 'confirmed'
    ).length
    return confirmedCount >= group.capacity
  },

  getGroupRegistrations: (paceGroupId) =>
    get().registrations.filter((r) => r.paceGroupId === paceGroupId),

  getRouteRegistrations: (routeId) =>
    get().registrations.filter((r) => r.routeId === routeId),

  isFinished: (memberId, routeId) =>
    get().finishRecords.some((f) => f.memberId === memberId && f.routeId === routeId),
}))
