import { defineStore } from 'pinia'
import { createMockSnapshot } from '~/domain/mock'
import type {
  AccountPlan,
  ActivityEvent,
  ID,
  Milestone,
  ModuleAccess,
  NoteIdea,
  Project,
  ProjectMember,
  ProjectStatus,
  Task,
  TaskPriority,
  TaskStatus,
  User,
  Workspace,
  WorkspaceMember,
  WorkspaceMemberRole
} from '~/domain/models'

export type {
  AccountPlan,
  ActivityEvent,
  ID,
  Milestone,
  ModuleAccess,
  NoteIdea,
  Project,
  ProjectMember,
  ProjectStatus,
  Task,
  TaskPriority,
  TaskStatus,
  User,
  Workspace,
  WorkspaceMember,
  WorkspaceMemberRole
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function isoNow() {
  return new Date().toISOString()
}

function parseDateOnly(yyyyMmDd: string) {
  const [y, m, d] = yyyyMmDd.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d, 0, 0, 0, 0)
}

function dateOnlyMs(value?: string) {
  if (!value) return null
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const d = parseDateOnly(value)
    return d ? d.getTime() : null
  }
  const d = new Date(value)
  return Number.isFinite(d.getTime()) ? new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() : null
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    booted: false,
    loading: false,

    // session context
    active_user_id: 'u-you' as ID,
    active_workspace_id: null as ID | null,

    // domain
    workspaces: [] as Workspace[],
    users: [] as User[],
    workspace_members: [] as WorkspaceMember[],
    project_members: [] as ProjectMember[],
    module_access: [] as ModuleAccess[],

    projects: [] as Project[],
    milestones: [] as Milestone[],
    tasks: [] as Task[],
    notes: [] as NoteIdea[],
    activities: [] as ActivityEvent[],

    // UI convenience
    currentProjectId: null as ID | null,

    // UI feedback
    lastInviteError: '' as string
  }),

  getters: {
    activeWorkspace(state) {
      return state.active_workspace_id ? state.workspaces.find(w => w.id === state.active_workspace_id) || null : null
    },

    // ── Workspace owner's plan ─────────────────────────
    // Plan belongs to the workspace owner, not the workspace.
    ownerPlan(): AccountPlan {
      const ws = this.activeWorkspace
      if (!ws) return 'FREE'
      const owner = this.users.find(u => u.id === ws.owner_user_id)
      return owner?.plan || 'FREE'
    },

    // ── Member limits based on owner's plan ────────────
    memberLimit(): number | null {
      switch (this.ownerPlan) {
        case 'FREE': return 1
        case 'PRO': return 5
        case 'BUSINESS': return null
        default: return 1
      }
    },

    membersUsed(): number {
      return this.members.length
    },

    canInviteMore(): boolean {
      const limit = this.memberLimit
      if (limit === null) return true
      return this.membersUsed < limit
    },

    // ── Workspace members ──────────────────────────────
    // Uses workspace_members table directly.
    members(state): Array<User & { role: WorkspaceMemberRole, custom_role_label?: string }> {
      const wsId = state.active_workspace_id
      if (!wsId) return []

      return state.workspace_members
        .filter(wm => wm.workspace_id === wsId)
        .flatMap((wm) => {
          const u = state.users.find(x => x.id === wm.user_id)
          if (!u) return []
          return [{ ...u, role: wm.role, custom_role_label: wm.custom_role_label }]
        })
    },

    // ── Derived workspace label ────────────────────────
    // "Solo workspace" when 1 member, "Team workspace" when > 1
    workspaceLabel(): string {
      return this.membersUsed > 1 ? 'Team workspace' : 'Solo workspace'
    },

    // ── Active workspace is owned by current user ──────
    isWorkspaceOwner(state): boolean {
      const ws = this.activeWorkspace
      if (!ws) return false
      return ws.owner_user_id === state.active_user_id
    },

    // ── Projects ───────────────────────────────────────
    activeProjects(state): Project[] {
      const wsId = state.active_workspace_id
      if (!wsId) return []
      return state.projects.filter(p => p.workspace_id === wsId)
    },

    activeProject(): Project | null {
      const pid = this.currentProjectId
      if (!pid) return null
      return this.projects.find(p => p.id === pid) || null
    },

    // ── Tasks scoped to active workspace ───────────────
    activeTasks(): Task[] {
      const projectIds = new Set(this.activeProjects.map(p => p.id))
      return this.tasks.filter(t => projectIds.has(t.project_id))
    },

    activeMilestones(): Milestone[] {
      const projectIds = new Set(this.activeProjects.map(p => p.id))
      return this.milestones.filter(m => projectIds.has(m.project_id))
    },

    activeNotes(state): NoteIdea[] {
      const wsId = state.active_workspace_id
      if (!wsId) return []
      return state.notes.filter(n => n.workspace_id === wsId)
    },

    recentActivity(): ActivityEvent[] {
      const wsId = this.active_workspace_id
      if (!wsId) return []
      return this.activities
        .filter(a => a.workspace_id === wsId)
        .slice()
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    },

    tasksOverdue(): Task[] {
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()

      return this.activeTasks
        .filter(t => t.status !== 'COMPLETED' && Boolean(t.due_date))
        .map(t => ({ t, ms: dateOnlyMs(t.due_date) }))
        .filter(x => x.ms !== null && x.ms! < todayStart)
        .sort((a, b) => (a.ms! - b.ms!))
        .map(x => x.t)
    },

    upcomingDeadlines(): Array<{ kind: 'TASK' | 'MILESTONE', id: ID, project_id: ID, title: string, due_date: string }> {
      const today = new Date()
      const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
      const cutoff = todayStart + 7 * 24 * 60 * 60 * 1000

      const tasks = this.activeTasks
        .filter(t => t.status !== 'COMPLETED' && Boolean(t.due_date))
        .map(t => ({ kind: 'TASK' as const, id: t.id, project_id: t.project_id, title: t.title, due_date: t.due_date! }))

      const milestones = this.activeMilestones
        .filter(m => m.status !== 'DONE' && Boolean(m.due_date))
        .map(m => ({ kind: 'MILESTONE' as const, id: m.id, project_id: m.project_id, title: m.title, due_date: m.due_date! }))

      return [...tasks, ...milestones]
        .map(x => ({ ...x, ms: dateOnlyMs(x.due_date) }))
        .filter(x => x.ms !== null && x.ms! >= todayStart && x.ms! <= cutoff)
        .sort((a, b) => a.ms! - b.ms!)
        .slice(0, 20)
        .map(({ ms: _ms, ...rest }) => rest)
    },

    assignedToMe(): Task[] {
      return this.activeTasks
        .filter(t => t.assignee_id === this.active_user_id && t.status !== 'COMPLETED')
        .slice()
        .sort((a, b) => {
          const aMs = dateOnlyMs(a.due_date) ?? Number.POSITIVE_INFINITY
          const bMs = dateOnlyMs(b.due_date) ?? Number.POSITIVE_INFINITY
          return aMs - bMs
        })
    }
  },

  actions: {
    async boot() {
      if (this.booted) return true
      this.loading = true
      try {
        const snap = createMockSnapshot(new Date())
        this.workspaces = snap.workspaces
        this.users = snap.users
        this.workspace_members = snap.workspace_members
        this.project_members = snap.project_members
        this.module_access = snap.module_access
        this.projects = snap.projects
        this.milestones = snap.milestones
        this.tasks = snap.tasks
        this.notes = snap.notes
        this.activities = snap.activity

        this.active_workspace_id = snap.workspaces[0]?.id || null
        this.booted = true
        return true
      } finally {
        this.loading = false
      }
    },

    setCurrentProject(projectId: ID | null) {
      this.currentProjectId = projectId
    },

    setSessionContext(userId: ID, workspaceId?: ID) {
      this.active_user_id = userId

      if (workspaceId && this.workspaces.some(w => w.id === workspaceId)) {
        this.active_workspace_id = workspaceId
        return
      }

      // Pick workspace owned by user, or first workspace they are a member of
      const owned = this.workspaces.find(w => w.owner_user_id === userId)
      if (owned) {
        this.active_workspace_id = owned.id
        return
      }

      const memberWsIds = new Set(
        this.workspace_members.filter(wm => wm.user_id === userId).map(wm => wm.workspace_id)
      )
      const asMember = this.workspaces.find(w => memberWsIds.has(w.id))
      this.active_workspace_id = asMember?.id || this.workspaces[0]?.id || null
    },

    // ── Workspace CRUD ─────────────────────────────────
    createWorkspace(payload: { name: string }) {
      const name = payload.name.trim()
      if (!name) return null

      const id = uid('ws')
      const ws: Workspace = {
        id,
        name,
        owner_user_id: this.active_user_id,
        created_at: isoNow()
      }

      this.workspaces.unshift(ws)

      // Creator is automatically owner
      this.workspace_members.push({
        id: uid('wm'),
        workspace_id: id,
        user_id: this.active_user_id,
        role: 'owner',
        created_at: isoNow()
      })

      this.active_workspace_id = id
      this.currentProjectId = null
      this.logActivity({ type: 'CREATE', entity_type: 'WORKSPACE', entity_id: id, message: `Created workspace: ${name}` })
      return ws
    },

    switchWorkspace(workspaceId: ID) {
      this.active_workspace_id = workspaceId
      this.currentProjectId = null
      this.logActivity({ type: 'UPDATE', entity_type: 'WORKSPACE', entity_id: workspaceId, message: 'Switched workspace.' })
    },

    // ── Workspace member management ────────────────────
    inviteMember(payload: { user_id: ID, custom_role_label?: string }) {
      this.lastInviteError = ''

      const wsId = this.active_workspace_id
      if (!wsId) return false

      if (!this.canInviteMore) {
        const limit = this.memberLimit
        this.lastInviteError = limit === null
          ? 'Invite blocked.'
          : `Member limit reached for ${this.ownerPlan} plan (${this.membersUsed}/${limit}).`
        return false
      }

      const exists = this.workspace_members.some(wm => wm.workspace_id === wsId && wm.user_id === payload.user_id)
      if (exists) return true

      this.workspace_members.push({
        id: uid('wm'),
        workspace_id: wsId,
        user_id: payload.user_id,
        role: 'custom',
        custom_role_label: payload.custom_role_label || 'Member',
        created_at: isoNow()
      })

      const u = this.getUserById(payload.user_id)
      this.logActivity({
        type: 'ASSIGN',
        entity_type: 'MEMBER',
        entity_id: payload.user_id,
        message: `Invited ${u?.name || 'member'} to workspace.`
      })
      return true
    },

    removeMember(userId: ID) {
      const wsId = this.active_workspace_id
      if (!wsId) return

      const idx = this.workspace_members.findIndex(wm => wm.workspace_id === wsId && wm.user_id === userId)
      if (idx === -1) return

      const u = this.getUserById(userId)
      this.workspace_members.splice(idx, 1)
      this.logActivity({
        type: 'UPDATE',
        entity_type: 'MEMBER',
        entity_id: userId,
        message: `Removed ${u?.name || 'member'} from workspace.`
      })
    },

    // ── Project CRUD ───────────────────────────────────
    createProject(payload: { name: string, description?: string, color_code?: string }) {
      const wsId = this.active_workspace_id
      if (!wsId) return null
      const name = payload.name.trim()
      if (!name) return null

      const now = isoNow()
      const project: Project = {
        id: uid('p'),
        workspace_id: wsId,
        name,
        description: payload.description?.trim() || undefined,
        color_code: payload.color_code || '#6A5AF9',
        status: 'PLANNING',
        created_by: this.active_user_id,
        created_at: now,
        updated_at: now
      }

      this.projects.unshift(project)

      // Creator automatically added to project_members
      this.project_members.push({
        id: uid('pm'),
        project_id: project.id,
        user_id: this.active_user_id,
        created_at: now
      })

      this.logActivity({ type: 'CREATE', entity_type: 'PROJECT', entity_id: project.id, project_id: project.id, message: `Created project: ${project.name}` })
      return project
    },

    updateProject(projectId: ID, updates: Partial<Pick<Project, 'name' | 'description' | 'color_code' | 'status'>>) {
      const idx = this.projects.findIndex(p => p.id === projectId)
      if (idx === -1) return
      const prev = this.projects[idx]!
      this.projects[idx] = { ...prev, ...updates, updated_at: isoNow() }
      this.logActivity({ type: 'UPDATE', entity_type: 'PROJECT', entity_id: projectId, project_id: projectId, message: `Updated project: ${this.projects[idx]!.name}` })
    },

    addProjectMember(projectId: ID, userId: ID) {
      const exists = this.project_members.some(pm => pm.project_id === projectId && pm.user_id === userId)
      if (exists) return
      this.project_members.push({
        id: uid('pm'),
        project_id: projectId,
        user_id: userId,
        created_at: isoNow()
      })
      this.logActivity({ type: 'ASSIGN', entity_type: 'PROJECT', entity_id: projectId, project_id: projectId, message: 'Updated project members.' })
    },

    removeProjectMember(projectId: ID, userId: ID) {
      const idx = this.project_members.findIndex(pm => pm.project_id === projectId && pm.user_id === userId)
      if (idx === -1) return
      this.project_members.splice(idx, 1)
    },

    getProjectMembers(projectId: ID): User[] {
      const memberIds = new Set(this.project_members.filter(pm => pm.project_id === projectId).map(pm => pm.user_id))
      return this.users.filter(u => memberIds.has(u.id))
    },

    // ── Milestones ─────────────────────────────────────
    createMilestone(payload: { project_id: ID, title: string, due_date?: string }) {
      const now = isoNow()
      const milestone: Milestone = {
        id: uid('m'),
        project_id: payload.project_id,
        title: payload.title.trim() || 'Milestone',
        due_date: payload.due_date,
        status: 'OPEN',
        created_at: now,
        updated_at: now
      }
      this.milestones.unshift(milestone)
      this.logActivity({ type: 'CREATE', entity_type: 'MILESTONE', entity_id: milestone.id, project_id: payload.project_id, message: `Created milestone: ${milestone.title}` })
      return milestone
    },

    updateMilestone(milestoneId: ID, updates: Partial<Omit<Milestone, 'id' | 'project_id' | 'created_at'>>) {
      const idx = this.milestones.findIndex(m => m.id === milestoneId)
      if (idx === -1) return
      const prev = this.milestones[idx]!
      this.milestones[idx] = { ...prev, ...updates, updated_at: isoNow() }
      this.logActivity({ type: 'UPDATE', entity_type: 'MILESTONE', entity_id: milestoneId, project_id: prev.project_id, message: `Updated milestone: ${this.milestones[idx]!.title}` })
    },

    // ── Tasks ──────────────────────────────────────────
    createTask(payload: {
      project_id: ID
      title: string
      detail?: string
      status?: TaskStatus
      priority?: TaskPriority
      due_date?: string
      assignee_id?: ID
      milestone_id?: ID
    }) {
      const now = isoNow()
      const task: Task = {
        id: uid('t'),
        project_id: payload.project_id,
        title: payload.title.trim() || 'New Task',
        detail: payload.detail?.trim() || undefined,
        status: payload.status || 'PLANNING',
        priority: payload.priority || 'MEDIUM',
        due_date: payload.due_date,
        assignee_id: payload.assignee_id,
        milestone_id: payload.milestone_id,
        created_at: now,
        updated_at: now
      }
      this.tasks.unshift(task)
      this.logActivity({ type: 'CREATE', entity_type: 'TASK', entity_id: task.id, project_id: task.project_id, message: `Created task: ${task.title}` })
      return task
    },

    updateTask(taskId: ID, updates: Partial<Omit<Task, 'id' | 'project_id' | 'created_at'>>) {
      const idx = this.tasks.findIndex(t => t.id === taskId)
      if (idx === -1) return
      const prev = this.tasks[idx]!
      this.tasks[idx] = { ...prev, ...updates, updated_at: isoNow() }

      if (typeof updates.status !== 'undefined') {
        this.logActivity({ type: 'STATUS', entity_type: 'TASK', entity_id: taskId, project_id: prev.project_id, message: `Task status → ${this.tasks[idx]!.status}: ${this.tasks[idx]!.title}` })
      } else {
        this.logActivity({ type: 'UPDATE', entity_type: 'TASK', entity_id: taskId, project_id: prev.project_id, message: `Updated task: ${this.tasks[idx]!.title}` })
      }
    },

    // ── Notes ──────────────────────────────────────────
    createNote(payload: { title: string, body: string, project_id?: ID, task_id?: ID }) {
      const wsId = this.active_workspace_id
      if (!wsId) return null

      const now = isoNow()
      const note: NoteIdea = {
        id: uid('note'),
        workspace_id: wsId,
        title: payload.title.trim() || 'Note',
        body: payload.body.trim() || '',
        project_id: payload.project_id,
        task_id: payload.task_id,
        created_at: now,
        updated_at: now
      }
      this.notes.unshift(note)
      this.logActivity({ type: 'CREATE', entity_type: 'NOTE', entity_id: note.id, project_id: payload.project_id, message: `Created note: ${note.title}` })
      return note
    },

    updateNote(noteId: ID, updates: Partial<Omit<NoteIdea, 'id' | 'workspace_id' | 'created_at'>>) {
      const idx = this.notes.findIndex(n => n.id === noteId)
      if (idx === -1) return
      const prev = this.notes[idx]!
      this.notes[idx] = { ...prev, ...updates, updated_at: isoNow() }
      this.logActivity({ type: 'UPDATE', entity_type: 'NOTE', entity_id: noteId, project_id: prev.project_id, message: `Updated note: ${this.notes[idx]!.title}` })
    },

    // ── Activity logging ───────────────────────────────
    logActivity(evt: { type: ActivityEvent['type'], entity_type: ActivityEvent['entity_type'], entity_id: ID, project_id?: ID, message: string }) {
      const wsId = this.active_workspace_id
      if (!wsId) return

      const a: ActivityEvent = {
        id: uid('act'),
        workspace_id: wsId,
        actor_user_id: this.active_user_id,
        type: evt.type,
        entity_type: evt.entity_type,
        entity_id: evt.entity_id,
        project_id: evt.project_id,
        message: evt.message,
        timestamp: isoNow()
      }
      this.activities.unshift(a)
    },

    // ── Lookups ────────────────────────────────────────
    getProjectById(id: ID) {
      return this.projects.find(p => p.id === id) || null
    },

    getUserById(id: ID) {
      return this.users.find(u => u.id === id) || null
    },

    getWorkspaceMember(wsId: ID, userId: ID): WorkspaceMember | null {
      return this.workspace_members.find(wm => wm.workspace_id === wsId && wm.user_id === userId) || null
    }
  }
})
