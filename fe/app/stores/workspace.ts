import { defineStore } from 'pinia'
import { MOCK_PROJECTS, MOCK_DASHBOARD_SUMMARY, MOCK_CARDS, MOCK_EDGES, MOCK_TASKS, MOCK_LEDGER, MOCK_PROJECT_ACTIVITY } from '~/mockup/data'

export type ProjectRole = 'LEAD' | 'ASSISTANT' | 'COLLABORATOR'
export type EdgeType = 'DEPENDS_ON' | 'RELATES_TO'
export type TaskStatus = 'TODO' | 'PROGRESS' | 'BLOCKED' | 'DONE'
export type LedgerType = 'BUDGET_ALLOCATION' | 'EXPENSE'

export interface Project {
  id: string
  org_id: string
  name: string
  description?: string
  color_code?: string | null
  status: string
  current_user_role?: ProjectRole
  card_count: number
  task_count: number
  member_ids?: string[]
}

export interface Workspace {
  id: string
  project_id: string
}

export interface StudioMember {
  id: string
  name: string
  avatar_url?: string
  role: string
}

export interface Card {
  id: string
  workspace_id: string
  org_id: string
  title: string
  description?: string
  text?: string // Rich Text / Markdown
  content?: { media?: Array<{ type: string, url: string }> }
  media_container?: any // JSONB references
  file_container?: any // JSONB references
  x_pos: number
  y_pos: number
  width: number
  height?: number
  comments: any[]
  link_count: number
}

export interface CardEdge {
  id: string
  org_id: string
  source_card_id: string
  target_card_id: string
  type: EdgeType
}

export interface Task {
  id: string
  project_id: string
  title: string
  detail?: string
  status: TaskStatus
  start_date?: string
  end_date?: string
  due_date?: string // Keep for legacy/UI compatibility if needed
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  user_assigned?: string // user_id
  assignee_id?: string // legacy mapping
  project_name?: string
}

export interface ProjectActivity {
  id: string
  project_id: string
  user: string
  message: string
  type: 'TASK' | 'MEDIA' | 'SYSTEM'
  timestamp: string
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    workspaces: [{ id: 'w1', project_id: 'p1' }] as Workspace[],
    cards: MOCK_CARDS as any[] as Card[],
    edges: MOCK_EDGES as CardEdge[],
    projects: MOCK_PROJECTS as Project[],
    tasks: MOCK_TASKS as any[] as Task[],
    activities: MOCK_PROJECT_ACTIVITY as any[] as ProjectActivity[],
    members: MOCK_PROJECT_ACTIVITY.map(a => ({ id: a.user.replace(' ', '').toLowerCase(), name: a.user, role: 'Artist' })) as StudioMember[],
    currentProject: MOCK_PROJECTS[0] as Project | null,
    dashboardMetrics: MOCK_DASHBOARD_SUMMARY,
    loading: false,
  }),
  actions: {
    async fetchProjects() {
      this.projects = [...MOCK_PROJECTS]
      return this.projects
    },
    async createProject(payload: { name: string, description?: string, color_code?: string }) {
      const name = payload.name.trim()
      if (!name) return null

      const project: Project = {
        id: 'p' + Date.now(),
        org_id: 'mock-org-1',
        name,
        description: payload.description,
        color_code: payload.color_code || '#6A5AF9',
        status: 'Planning',
        card_count: 0,
        task_count: 0,
        member_ids: []
      }

      this.projects.unshift(project)
      return project
    },
    async fetchDashboardSummary() {
      this.dashboardMetrics = MOCK_DASHBOARD_SUMMARY
      return MOCK_DASHBOARD_SUMMARY
    },
    async fetchCards(projectId?: string) {
      const pid = projectId || this.currentProject?.id
      const ws = this.workspaces.find(w => w.project_id === pid)
      if (ws) {
        this.cards = (MOCK_CARDS as any[] as Card[]).filter(c => c.workspace_id === ws.id)
      } else {
        // Fallback or create workspace logic
        this.cards = []
      }
      return this.cards
    },
    async updateCard(cardId: string, updates: Partial<Card>) {
      const index = this.cards.findIndex(c => c.id === cardId)
      if (index !== -1) {
        this.cards[index] = { ...this.cards[index], ...updates }
      }
    },
    async deleteCard(cardId: string) {
      this.cards = this.cards.filter(c => c.id !== cardId)
      this.edges = this.edges.filter(e => e.source_card_id !== cardId && e.target_card_id !== cardId)
    },
    async createCard(workspaceId: string, title: string, x: number, y: number) {
      const newCard: Card = {
        id: 'c' + Date.now(),
        workspace_id: workspaceId,
        org_id: 'mock-org-1',
        title,
        x_pos: x,
        y_pos: y,
        width: 300,
        content: { media: [] },
        comments: [],
        link_count: 0
      }
      this.cards.push(newCard)
      return newCard
    },
    async createEdge(sourceId: string, targetId: string) {
      if (sourceId === targetId) return
      const exists = this.edges.find(e => 
        (e.source_card_id === sourceId && e.target_card_id === targetId) ||
        (e.source_card_id === targetId && e.target_card_id === sourceId)
      )
      if (exists) return

      const newEdge: CardEdge = {
        id: 'e' + Date.now(),
        org_id: 'mock-org-1',
        source_card_id: sourceId,
        target_card_id: targetId,
        type: 'RELATES_TO'
      }
      this.edges.push(newEdge)
      
      const source = this.cards.find(c => c.id === sourceId)
      const target = this.cards.find(c => c.id === targetId)
      if (source) source.link_count++
      if (target) target.link_count++
      
      return newEdge
    },
    async createTask(task: Partial<Task>) {
      const newTask: Task = {
        id: 't' + Date.now(),
        project_id: task.project_id!,
        title: task.title || 'New Task',
        detail: task.detail || '',
        status: task.status || 'TODO',
        due_date: task.due_date || new Date().toISOString(),
        priority: task.priority || 'MEDIUM',
      }
      this.tasks.push(newTask)
      this.addLog(newTask.project_id, `Created new task: ${newTask.title}`, 'TASK')
      return newTask
    },
    async updateTask(taskId: string, updates: Partial<Task>) {
      const index = this.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updates }
        this.addLog(this.tasks[index].project_id, `Updated task: ${this.tasks[index].title}`, 'TASK')
      }
    },
    addLog(projectId: string, message: string, type: ProjectActivity['type'] = 'SYSTEM') {
      this.activities.unshift({
        id: 'act-' + Date.now(),
        project_id: projectId,
        user: 'You', // Hardcoded for mockup
        message,
        type,
        timestamp: new Date().toISOString()
      })
    }
  }
})
