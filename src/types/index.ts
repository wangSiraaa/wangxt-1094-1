export interface Route {
  id: string
  name: string
  distance: number
  startLocation: string
  startTime: string
  description: string
  leaderId: string
}

export interface PaceGroup {
  id: string
  routeId: string
  paceRange: string
  capacity: number
  color: string
}

export interface Registration {
  id: string
  routeId: string
  paceGroupId: string
  memberId: string
  memberName: string
  status: 'confirmed' | 'waitlist' | 'finished'
  healthCommitment: boolean
  registeredAt: string
}

export interface FinishRecord {
  id: string
  registrationId: string
  routeId: string
  memberId: string
  memberName: string
  finishTime: string
  note: string
  recordedBy: string
  recordedAt: string
}

export type Role = 'leader' | 'member' | 'volunteer'
