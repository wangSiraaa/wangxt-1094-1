import { create } from 'zustand'
import type { Route, PaceGroup, Registration, FinishRecord, WeatherAlert, RescheduleLog, CheckInRecord, MemberArchive, Role, WeatherType, FinishType, FamilyMember } from '@/types'
import {
  sampleRoutes,
  samplePaceGroups,
  sampleRegistrations,
  sampleFinishRecords,
  sampleWeatherAlerts,
  sampleRescheduleLogs,
  sampleCheckIns,
  currentUserId,
  currentUserName,
} from '@/data/sample'

interface AppState {
  role: Role
  routes: Route[]
  paceGroups: PaceGroup[]
  registrations: Registration[]
  finishRecords: FinishRecord[]
  weatherAlerts: WeatherAlert[]
  rescheduleLogs: RescheduleLog[]
  checkIns: CheckInRecord[]
  healthCommitted: boolean
  familyHealthCommitted: boolean
  setRole: (role: Role) => void
  addRoute: (route: Omit<Route, 'id'>) => void
  addRegistration: (routeId: string, paceGroupId: string, isFamily?: boolean, familyMembers?: FamilyMember[]) => void
  confirmHealthCommitment: () => void
  confirmFamilyHealthCommitment: () => void
  addFinishRecord: (registrationId: string, routeId: string, memberId: string, memberName: string, finishTime: string, finishType: FinishType, note: string) => void
  addCheckIn: (registrationId: string, routeId: string, memberId: string, memberName: string, location: string) => void
  triggerWeatherAlert: (routeId: string, type: WeatherType, description: string) => void
  autoReschedule: (weatherAlertId: string) => void
  getMemberArchive: (memberId: string) => MemberArchive[]
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
  weatherAlerts: [...sampleWeatherAlerts],
  rescheduleLogs: [...sampleRescheduleLogs],
  checkIns: [...sampleCheckIns],
  healthCommitted: false,
  familyHealthCommitted: false,

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

  addRegistration: (routeId, paceGroupId, isFamily = false, familyMembers = []) => {
    const state = get()
    if (!state.healthCommitted) return
    if (isFamily && !state.familyHealthCommitted) return
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
      familyHealthCommitment: isFamily ? state.familyHealthCommitted : false,
      isFamily,
      familyMembers,
      rescheduledFromRouteId: null,
      rescheduledFromPaceGroupId: null,
      rescheduledAt: null,
      registeredAt: new Date().toISOString(),
    }
    set((s) => ({ registrations: [...s.registrations, newReg] }))
  },

  confirmHealthCommitment: () => set({ healthCommitted: true }),
  confirmFamilyHealthCommitment: () => set({ familyHealthCommitted: true }),

  addFinishRecord: (registrationId, routeId, memberId, memberName, finishTime, finishType, note) => {
    const newRecord: FinishRecord = {
      id: genId('fin'),
      registrationId,
      routeId,
      memberId,
      memberName,
      finishTime,
      finishType,
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

  addCheckIn: (registrationId, routeId, memberId, memberName, location) => {
    const newCheckIn: CheckInRecord = {
      id: genId('ck'),
      registrationId,
      routeId,
      memberId,
      memberName,
      checkInTime: new Date().toISOString(),
      location,
    }
    set((s) => ({ checkIns: [...s.checkIns, newCheckIn] }))
  },

  triggerWeatherAlert: (routeId, type, description) => {
    const newAlert: WeatherAlert = {
      id: genId('wa'),
      routeId,
      type,
      description,
      triggeredAt: new Date().toISOString(),
      active: true,
    }
    set((s) => ({
      weatherAlerts: [...s.weatherAlerts, newAlert],
      routes: s.routes.map((r) =>
        r.id === routeId ? { ...r, weatherAlertId: newAlert.id } : r
      ),
    }))
  },

  autoReschedule: (weatherAlertId) => {
    const state = get()
    const alert = state.weatherAlerts.find((a) => a.id === weatherAlertId)
    if (!alert) return
    const route = state.routes.find((r) => r.id === alert.routeId)
    if (!route) return

    const regsToReschedule = state.registrations.filter(
      (r) => r.routeId === alert.routeId && r.status !== 'finished'
    )

    if (regsToReschedule.length === 0) return

    let backupRoute = state.routes.find(
      (r) => r.id !== alert.routeId && r.distance === route.backupDistance
    )

    if (!backupRoute) {
      const backupRouteId = genId('route')
      backupRoute = {
        id: backupRouteId,
        name: `${route.name}（备用）`,
        distance: route.backupDistance,
        backupDistance: route.backupDistance,
        startLocation: route.startLocation,
        startTime: route.startTime,
        description: `因${alert.type === 'high_temp' ? '高温' : '降雨'}天气启用的备用路线`,
        leaderId: route.leaderId,
        weatherAlertId,
      }
      const backupGroups: PaceGroup[] = [
        { id: genId('pg'), routeId: backupRouteId, paceRange: '5:00-5:30/km', capacity: 8, color: '#2EC4B6' },
        { id: genId('pg'), routeId: backupRouteId, paceRange: '5:30-6:00/km', capacity: 10, color: '#E9C46A' },
        { id: genId('pg'), routeId: backupRouteId, paceRange: '6:00-7:00/km', capacity: 12, color: '#F4845F' },
      ]
      set((s) => ({
        routes: [...s.routes, backupRoute!],
        paceGroups: [...s.paceGroups, ...backupGroups],
      }))
    }

    const updatedState = get()
    const backupGroups = updatedState.paceGroups.filter((g) => g.routeId === backupRoute!.id)
    const newLogs: RescheduleLog[] = []
    const updatedRegs = updatedState.registrations.map((r) => {
      if (r.routeId !== alert.routeId || r.status === 'finished') return r
      const originalGroup = updatedState.paceGroups.find((g) => g.id === r.paceGroupId)
      const matchingBackupGroup = originalGroup
        ? backupGroups.find((bg) => bg.paceRange === originalGroup.paceRange) || backupGroups[0]
        : backupGroups[0]
      if (!matchingBackupGroup) return r
      newLogs.push({
        id: genId('rl'),
        fromRouteId: r.routeId,
        fromPaceGroupId: r.paceGroupId,
        toRouteId: backupRoute!.id,
        toPaceGroupId: matchingBackupGroup.id,
        weatherAlertId,
        registrationId: r.id,
        rescheduledAt: new Date().toISOString(),
      })
      return {
        ...r,
        routeId: backupRoute!.id,
        paceGroupId: matchingBackupGroup.id,
        rescheduledFromRouteId: r.routeId,
        rescheduledFromPaceGroupId: r.paceGroupId,
        rescheduledAt: new Date().toISOString(),
      }
    })

    set((s) => ({
      registrations: updatedRegs,
      rescheduleLogs: [...s.rescheduleLogs, ...newLogs],
    }))
  },

  getMemberArchive: (memberId) => {
    const state = get()
    const memberRegs = state.registrations.filter((r) => r.memberId === memberId)
    return memberRegs.map((reg) => {
      const route = state.routes.find((r) => r.id === reg.routeId)
      const group = state.paceGroups.find((g) => g.id === reg.paceGroupId)
      const finish = state.finishRecords.find((f) => f.registrationId === reg.id)
      const checkIns = state.checkIns.filter((c) => c.registrationId === reg.id)
      const rescheduleLog = state.rescheduleLogs.find((l) => l.registrationId === reg.id)
      const weatherAlert = reg.rescheduledFromRouteId
        ? state.weatherAlerts.find((a) => a.routeId === reg.rescheduledFromRouteId)
        : null
      const fromRoute = reg.rescheduledFromRouteId
        ? state.routes.find((r) => r.id === reg.rescheduledFromRouteId)
        : null
      const fromGroup = reg.rescheduledFromPaceGroupId
        ? state.paceGroups.find((g) => g.id === reg.rescheduledFromPaceGroupId)
        : null
      return {
        memberId,
        memberName: reg.memberName,
        routeId: reg.routeId,
        routeName: route?.name || '',
        distance: route?.distance || 0,
        paceGroupId: reg.paceGroupId,
        paceRange: group?.paceRange || '',
        paceGroupColor: group?.color || '#666',
        status: reg.status,
        healthCommitment: reg.healthCommitment,
        familyHealthCommitment: reg.familyHealthCommitment,
        isFamily: reg.isFamily,
        familyMembers: reg.familyMembers,
        rescheduledFrom: fromRoute && fromGroup
          ? { routeId: fromRoute.id, routeName: fromRoute.name, paceGroupId: fromGroup.id, paceRange: fromGroup.paceRange }
          : null,
        weatherAlert: weatherAlert
          ? { type: weatherAlert.type, description: weatherAlert.description }
          : null,
        checkIns,
        finishRecord: finish || null,
      } as MemberArchive
    })
  },

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
