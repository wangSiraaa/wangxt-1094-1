export interface Route {
  id: string
  name: string
  distance: number
  backupDistance: number
  startLocation: string
  startTime: string
  description: string
  leaderId: string
  weatherAlertId: string | null
}

export interface PaceGroup {
  id: string
  routeId: string
  paceRange: string
  capacity: number
  color: string
}

export type WeatherType = 'high_temp' | 'rain' | 'storm' | 'none'

export interface WeatherAlert {
  id: string
  routeId: string
  type: WeatherType
  description: string
  triggeredAt: string
  active: boolean
}

export interface FamilyMember {
  id: string
  name: string
  relationship: string
  healthCommitment: boolean
}

export type FinishType = 'normal' | 'supply_interrupted' | 'early_withdrawal'

export interface Registration {
  id: string
  routeId: string
  paceGroupId: string
  memberId: string
  memberName: string
  status: 'confirmed' | 'waitlist' | 'finished'
  healthCommitment: boolean
  familyHealthCommitment: boolean
  isFamily: boolean
  familyMembers: FamilyMember[]
  rescheduledFromRouteId: string | null
  rescheduledFromPaceGroupId: string | null
  rescheduledAt: string | null
  registeredAt: string
}

export interface FinishRecord {
  id: string
  registrationId: string
  routeId: string
  memberId: string
  memberName: string
  finishTime: string
  finishType: FinishType
  note: string
  recordedBy: string
  recordedAt: string
}

export interface RescheduleLog {
  id: string
  fromRouteId: string
  fromPaceGroupId: string
  toRouteId: string
  toPaceGroupId: string
  weatherAlertId: string
  registrationId: string
  rescheduledAt: string
}

export interface CheckInRecord {
  id: string
  registrationId: string
  routeId: string
  memberId: string
  memberName: string
  checkInTime: string
  location: string
}

export interface OriginalRouteEvidence {
  routeId: string
  routeName: string
  distance: number
  checkIns: CheckInRecord[]
  finishRecord: FinishRecord | null
}

export interface MemberArchive {
  memberId: string
  memberName: string
  routeId: string
  routeName: string
  distance: number
  paceGroupId: string
  paceRange: string
  paceGroupColor: string
  status: string
  healthCommitment: boolean
  familyHealthCommitment: boolean
  isFamily: boolean
  familyMembers: FamilyMember[]
  rescheduledFrom: { routeId: string; routeName: string; paceGroupId: string; paceRange: string } | null
  weatherAlert: { type: WeatherType; description: string } | null
  checkIns: (CheckInRecord & { routeName: string })[]
  finishRecord: (FinishRecord & { routeName: string }) | null
}

export type Role = 'leader' | 'member' | 'volunteer'
