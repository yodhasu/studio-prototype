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

export interface StudioMember {
  id: string
  name: string
  avatar_url?: string
  role: string
}

export interface Card {
  id: string
  project_id: string
  org_id: string
  title: string
  content: Record<string, any>
  x_pos: number
  y_pos: number
  width: number
  comments: any[]
  link_count: number
  task?: any | null
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
  card_id: string
  status: TaskStatus
  card_title: string
  project_id: string
  project_name: string
  description?: string
  due_date: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  assignee_id?: string
}

export const useWorkspaceStore = defineStore('workspace', {
  state: () => ({
    cards: MOCK_CARDS as Card[],
    edges: MOCK_EDGES as CardEdge[],
    projects: MOCK_PROJECTS as Project[],
    tasks: MOCK_TASKS as Task[],
    members: MOCK_PROJECT_ACTIVITY.map(a => ({ id: a.user.replace(' ', '').toLowerCase(), name: a.user, role: 'Artist' })) as StudioMember[],
    currentProject: MOCK_PROJECTS[0] as Project | null,
    dashboardMetrics: MOCK_DASHBOARD_SUMMARY,
    loading: false,
  }),
  actions: {
    async fetchDashboardSummary() {
      this.dashboardMetrics = MOCK_DASHBOARD_SUMMARY
      return MOCK_DASHBOARD_SUMMARY
    },
    async fetchCards(projectId?: string) {
      const pid = projectId || this.currentProject?.id
      this.cards = MOCK_CARDS.filter(c => c.project_id === pid)
      return this.cards
    },
    async updateCard(cardId: string, updates: Partial<Card>) {
      const index = this.cards.findIndex(c => c.id === cardId)
      if (index !== -1) {
        this.cards[index] = { ...this.cards[index], ...updates }
      }
    },
    async createCard(projectId: string, title: string, x: number, y: number) {
      const newCard: Card = {
        id: 'c' + Date.now(),
        project_id: projectId,
        org_id: 'mock-org-1',
        title,
        x_pos: x,
        y_pos: y,
        width: 300,
        content: {},
        comments: [],
        link_count: 0
      }
      this.cards.push(newCard)
      return newCard
    }
  }
})
