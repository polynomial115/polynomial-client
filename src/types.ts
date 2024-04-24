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
	tasks: string[] // Temporary, change this into tasks interface later
	timestamp: string
}