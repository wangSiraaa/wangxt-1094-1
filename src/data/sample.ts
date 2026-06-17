import type { Route, PaceGroup, Registration, FinishRecord } from '@/types'

export const currentUserId = 'member-1'
export const currentUserName = '张明'

export const sampleRoutes: Route[] = [
  {
    id: 'route-1',
    name: '晨光滨江线',
    distance: 5,
    startLocation: '滨江大道3号口',
    startTime: '2025-03-15T07:00',
    description: '沿滨江绿道跑步，风景优美，适合晨练',
    leaderId: 'leader-1',
  },
  {
    id: 'route-2',
    name: '城市公园环线',
    distance: 10,
    startLocation: '中心公园南门',
    startTime: '2025-03-16T06:30',
    description: '绕公园两圈，平坦路面，适合LSD训练',
    leaderId: 'leader-1',
  },
  {
    id: 'route-3',
    name: '山林探索线',
    distance: 8,
    startLocation: '福山公园东门',
    startTime: '2025-03-22T07:30',
    description: '山路跑步，累计爬升200米，有挑战性',
    leaderId: 'leader-2',
  },
]

export const samplePaceGroups: PaceGroup[] = [
  { id: 'pg-1', routeId: 'route-1', paceRange: '5:00-5:30/km', capacity: 8, color: '#2EC4B6' },
  { id: 'pg-2', routeId: 'route-1', paceRange: '5:30-6:00/km', capacity: 10, color: '#E9C46A' },
  { id: 'pg-3', routeId: 'route-1', paceRange: '6:00-7:00/km', capacity: 12, color: '#F4845F' },
  { id: 'pg-4', routeId: 'route-2', paceRange: '5:00-5:30/km', capacity: 6, color: '#2EC4B6' },
  { id: 'pg-5', routeId: 'route-2', paceRange: '5:30-6:00/km', capacity: 8, color: '#E9C46A' },
  { id: 'pg-6', routeId: 'route-2', paceRange: '6:00-7:00/km', capacity: 10, color: '#F4845F' },
  { id: 'pg-7', routeId: 'route-3', paceRange: '5:30-6:00/km', capacity: 6, color: '#E9C46A' },
  { id: 'pg-8', routeId: 'route-3', paceRange: '6:00-7:00/km', capacity: 8, color: '#F4845F' },
]


export const sampleRegistrations: Registration[] = [
  { id: 'reg-1', routeId: 'route-1', paceGroupId: 'pg-1', memberId: 'member-2', memberName: '李华', status: 'confirmed' as const, healthCommitment: true, registeredAt: '2025-03-10T08:00:00Z' },
  { id: 'reg-2', routeId: 'route-1', paceGroupId: 'pg-2', memberId: 'member-3', memberName: '王芳', status: 'confirmed' as const, healthCommitment: true, registeredAt: '2025-03-10T09:00:00Z' },
  { id: 'reg-3', routeId: 'route-1', paceGroupId: 'pg-2', memberId: 'member-1', memberName: '张明', status: 'confirmed' as const, healthCommitment: true, registeredAt: '2025-03-11T10:00:00Z' },
  { id: 'reg-4', routeId: 'route-2', paceGroupId: 'pg-5', memberId: 'member-1', memberName: '张明', status: 'confirmed' as const, healthCommitment: true, registeredAt: '2025-03-12T08:00:00Z' },
  { id: 'reg-5', routeId: 'route-2', paceGroupId: 'pg-4', memberId: 'member-2', memberName: '李华', status: 'confirmed' as const, healthCommitment: true, registeredAt: '2025-03-12T09:00:00Z' },
]

export const sampleFinishRecords: FinishRecord[] = [
  { id: 'fin-1', registrationId: 'reg-1', routeId: 'route-1', memberId: 'member-2', memberName: '李华', finishTime: '0:28:15', note: '很轻松', recordedBy: 'vol-1', recordedAt: '2025-03-15T07:30:00Z' },
]
