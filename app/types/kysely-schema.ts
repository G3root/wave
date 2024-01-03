import { type Insertable, type Selectable, type Updateable } from 'kysely'
import { type Project } from './db'

export type ProjectSelect = Selectable<Project>
export type ProjectStatus = ProjectSelect['status']
export type NewProject = Insertable<Project>
export type ProjectUpdate = Updateable<Project>
