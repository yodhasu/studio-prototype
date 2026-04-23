export type ID = string

export type WorkspaceKind = 'PERSONAL' | 'TEAM'

export const WORKFLOW_STATUSES = ['PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED'] as const
export type WorkflowStatus = typeof WORKFLOW_STATUSES[number]

// Single workflow status modifier shared by Project + Task.
export type ProjectStatus = WorkflowStatus
export type TaskStatus = WorkflowStatus

export type MilestoneStatus = 'OPEN' | 'DONE'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH'

// Placeholders (Phase 1)
export type Role = {
  id: ID
  name: string
}

export type ModuleAccess = {
  id: ID
  workspace_id: ID
  module_key: string
  enabled: boolean
}

export type User = {
  id: ID
  name: string
  email?: string
  avatar_url?: string
}

export type Workspace = {
  id: ID
  kind: WorkspaceKind
  name: string
  owner_user_id: ID
  team_id?: ID
  created_at: string
}

export type Team = {
  id: ID
  workspace_id: ID
  name: string
  created_at: string
}

export type TeamMember = {
  id: ID
  team_id: ID
  user_id: ID
  role_id?: ID
  title?: string
  created_at: string
}

export type Project = {
  id: ID
  workspace_id: ID
  name: string
  description?: string
  color_code?: string | null
  status: ProjectStatus
  member_ids: ID[]
  created_at: string
  updated_at: string
}

export type Milestone = {
  id: ID
  project_id: ID
  title: string
  due_date?: string // YYYY-MM-DD
  status: MilestoneStatus
  created_at: string
  updated_at: string
}

export type Task = {
  id: ID
  project_id: ID
  title: string
  detail?: string
  status: TaskStatus
  priority: TaskPriority
  due_date?: string // YYYY-MM-DD
  assignee_id?: ID
  milestone_id?: ID
  created_at: string
  updated_at: string
}

export type ScheduleItem = {
  id: ID
  workspace_id: ID
  title: string
  start_date: string // YYYY-MM-DD
  end_date: string // YYYY-MM-DD
  project_id?: ID
  task_id?: ID
  milestone_id?: ID
  created_at: string
  updated_at: string
}

export type NoteIdea = {
  id: ID
  workspace_id: ID
  title: string
  body: string
  project_id?: ID
  task_id?: ID
  created_at: string
  updated_at: string
}

export type ActivityEntityType = 'WORKSPACE' | 'TEAM' | 'PROJECT' | 'MILESTONE' | 'TASK' | 'NOTE' | 'SCHEDULE'
export type ActivityEventType = 'CREATE' | 'UPDATE' | 'STATUS' | 'ASSIGN' | 'LINK'

export type ActivityEvent = {
  id: ID
  workspace_id: ID
  actor_user_id: ID
  type: ActivityEventType
  entity_type: ActivityEntityType
  entity_id: ID
  project_id?: ID
  message: string
  timestamp: string
}
