import type {
  ActivityEvent,
  Milestone,
  ModuleAccess,
  NoteIdea,
  Project,
  Role,
  ScheduleItem,
  Task,
  Team,
  TeamMember,
  User,
  Workspace
} from './models'

export type StudioSnapshot = {
  workspaces: Workspace[]
  users: User[]
  roles: Role[]
  teams: Team[]
  team_members: TeamMember[]
  module_access: ModuleAccess[]
  projects: Project[]
  milestones: Milestone[]
  tasks: Task[]
  schedule_items: ScheduleItem[]
  notes: NoteIdea[]
  activity: ActivityEvent[]
}
