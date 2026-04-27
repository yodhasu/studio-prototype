import type {
  ActivityEvent,
  Milestone,
  ModuleAccess,
  NoteIdea,
  Project,
  ProjectMember,
  ScheduleItem,
  Task,
  User,
  Workspace,
  WorkspaceMember
} from './models'

export type StudioSnapshot = {
  workspaces: Workspace[]
  users: User[]
  workspace_members: WorkspaceMember[]
  project_members: ProjectMember[]
  module_access: ModuleAccess[]
  projects: Project[]
  milestones: Milestone[]
  tasks: Task[]
  schedule_items: ScheduleItem[]
  notes: NoteIdea[]
  activity: ActivityEvent[]
}
