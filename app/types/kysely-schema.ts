import { type Insertable, type Selectable, type Updateable } from 'kysely'
import { type Project, type Membership } from './db'

export type ProjectSelect = Selectable<Project>
export type ProjectStatus = ProjectSelect['status']
export type NewProject = Insertable<Project>
export type ProjectUpdate = Updateable<Project>

export type MembershipSelect = Selectable<Membership>
export type MembershipStatus = MembershipSelect['status']
export type NewMembership = Insertable<Membership>
export type MembershipUpdate = Updateable<Membership>
