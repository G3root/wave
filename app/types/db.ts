import  { type ColumnType } from 'kysely'
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
	? ColumnType<S, I | undefined, U>
	: ColumnType<T, T | undefined, T>
export type Timestamp = ColumnType<Date, Date | string, Date | string>

export type Membership = {
	id: Generated<number>
	publicId: string
	workspaceId: string
	userId: string
	/**
	 * @kyselyType('accepted' | 'pending' | 'declined')
	 */
	status: Generated<'accepted' | 'pending' | 'declined'>
	joinedAt: string | null
	invitedName: string | null
	invitedEmail: string | null
	createdAt: Generated<string>
	updatedAt: Generated<string>
}
export type Project = {
	id: Generated<number>
	publicId: string
	name: string
	description: string | null
	leadId: string | null
	workspaceId: string
	/**
	 * @kyselyType('backlog' | 'planed' | 'in-progress' | 'paused' | 'completed' | 'cancelled')
	 */
	status: Generated<
		'backlog' | 'planed' | 'in-progress' | 'paused' | 'completed' | 'cancelled'
	>
	startDate: string | null
	targetDate: string | null
	createdAt: Generated<string>
	updatedAt: Generated<string>
}
export type ProjectsOnUsers = {
	userId: string
	projectId: string
	assignedAt: Generated<string>
}
export type User = {
	id: Generated<number>
	publicId: string
	email: string
	name: string | null
	/**
	 * @kyselyType('customer' | 'super-admin')
	 */
	globalRole: Generated<'customer' | 'super-admin'>
	createdAt: Generated<string>
	updatedAt: Generated<string>
}
export type Workspace = {
	id: Generated<number>
	name: string
	publicId: string
	creatorId: string | null
	createdAt: Generated<string>
	updatedAt: Generated<string>
}
export type DB = {
	membership: Membership
	project: Project
	projectOnUsers: ProjectsOnUsers
	user: User
	workspace: Workspace
}
