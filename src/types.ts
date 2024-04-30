// export interface DatabaseProject {
// 	name: string,
// 	id: string,
// 	project: Project,
// }

export interface Project {
	id: string
	guildId: string
	name: string
	managerRoles: string[]
	memberRoles: string[]
	managerUsers: string[]
	memberUsers: string[]
	tasks: Task[]
	timestamp: string
}

export enum TaskStatus {
	ToDo = 0,
	Backlog = 1,
	InProgress = 2,
	Completed = 3
}

export enum Priority {
	Urgent = 3,
	High = 2,
	Normal = 1,
	Low = 0
}

export interface Task {
	id: string
	assignees: string[]
	name: string
	priority: Priority
	status: TaskStatus
}

export enum FetchStatus {
	Loading,
	Failed,
	Succeeded
}
