import type { StudioSnapshot } from './snapshot'
import type { ActivityEvent, ID, Milestone, NoteIdea, Project, Task, Team, TeamMember, User, Workspace } from './models'

function isoNow(now: Date) {
  return now.toISOString()
}

function day(now: Date, offsetDays: number) {
  const d = new Date(now)
  d.setDate(d.getDate() + offsetDays)
  return d
}

function yyyyMmDd(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

export function createMockSnapshot(now = new Date()): StudioSnapshot {
  const ts = isoNow(now)

  const users: User[] = [
    { id: 'u-you', name: 'You', email: 'you@ivoryforge.local' },
    { id: 'u-mira', name: 'Mira Chen', email: 'mira@ivoryforge.local' },
    { id: 'u-jules', name: 'Jules Hart', email: 'jules@ivoryforge.local' },
    { id: 'u-sana', name: 'Sana Patel', email: 'sana@ivoryforge.local' }
  ]

  const workspaces: Workspace[] = [
    { id: 'ws-personal', kind: 'PERSONAL', name: 'Personal Workspace', owner_user_id: 'u-you', created_at: ts },
    { id: 'ws-team', kind: 'TEAM', name: 'Ivory Forge Studio', owner_user_id: 'u-you', team_id: 'team-ivory', created_at: ts }
  ]

  const teams: Team[] = [
    { id: 'team-ivory', workspace_id: 'ws-team', name: 'Core Team', created_at: ts }
  ]

  const team_members: TeamMember[] = [
    { id: 'tm-1', team_id: 'team-ivory', user_id: 'u-you', title: 'Producer', created_at: ts },
    { id: 'tm-2', team_id: 'team-ivory', user_id: 'u-mira', title: 'Lead Artist', created_at: ts },
    { id: 'tm-3', team_id: 'team-ivory', user_id: 'u-jules', title: 'Compositor', created_at: ts },
    { id: 'tm-4', team_id: 'team-ivory', user_id: 'u-sana', title: 'Coordinator', created_at: ts }
  ]

  const projects: Project[] = [
    {
      id: 'p-trailer',
      workspace_id: 'ws-team',
      name: 'Cinematic Trailer Cut',
      description: 'Storyboard, animatic, and final cut pipeline.',
      color_code: '#8b5cf6',
      status: 'ACTIVE',
      member_ids: ['u-you', 'u-mira', 'u-jules'],
      created_at: isoNow(day(now, -21)),
      updated_at: ts
    },
    {
      id: 'p-concepts',
      workspace_id: 'ws-team',
      name: 'Faction Concept Sheets',
      description: 'Exploration sheets for silhouettes, materials, and insignia.',
      color_code: '#06b6d4',
      status: 'ACTIVE',
      member_ids: ['u-mira', 'u-sana'],
      created_at: isoNow(day(now, -14)),
      updated_at: ts
    },
    {
      id: 'p-style',
      workspace_id: 'ws-personal',
      name: 'UI Style Guide',
      description: 'Typography scale, tokens, and component patterns.',
      color_code: '#10b981',
      status: 'PLANNING',
      member_ids: ['u-you'],
      created_at: isoNow(day(now, -9)),
      updated_at: ts
    }
  ]

  const milestones: Milestone[] = [
    {
      id: 'm-trailer-lock',
      project_id: 'p-trailer',
      title: 'Picture lock',
      due_date: yyyyMmDd(day(now, 6)),
      status: 'OPEN',
      created_at: isoNow(day(now, -20)),
      updated_at: ts
    },
    {
      id: 'm-concepts-pack',
      project_id: 'p-concepts',
      title: 'Sheet pack v1',
      due_date: yyyyMmDd(day(now, 3)),
      status: 'OPEN',
      created_at: isoNow(day(now, -13)),
      updated_at: ts
    }
  ]

  const tasks: Task[] = [
    {
      id: 't-animatic',
      project_id: 'p-trailer',
      title: 'Animatic pass',
      detail: 'Cut timing, add temp SFX, verify beats.',
      status: 'ACTIVE',
      priority: 'HIGH',
      due_date: yyyyMmDd(day(now, 2)),
      assignee_id: 'u-you',
      milestone_id: 'm-trailer-lock',
      created_at: isoNow(day(now, -18)),
      updated_at: ts
    },
    {
      id: 't-colorscript',
      project_id: 'p-trailer',
      title: 'Color script thumbnails',
      detail: 'Mood exploration for key moments.',
      status: 'PLANNING',
      priority: 'MEDIUM',
      due_date: yyyyMmDd(day(now, 5)),
      assignee_id: 'u-mira',
      created_at: isoNow(day(now, -17)),
      updated_at: ts
    },
    {
      id: 't-comp',
      project_id: 'p-trailer',
      title: 'Comp polish',
      detail: 'Grain, glows, and final overlays.',
      status: 'PAUSED',
      priority: 'MEDIUM',
      due_date: yyyyMmDd(day(now, 6)),
      assignee_id: 'u-jules',
      milestone_id: 'm-trailer-lock',
      created_at: isoNow(day(now, -10)),
      updated_at: ts
    },
    {
      id: 't-silhouettes',
      project_id: 'p-concepts',
      title: 'Silhouette exploration sheet',
      detail: '20 thumbnails, pick 5 for refinement.',
      status: 'ACTIVE',
      priority: 'HIGH',
      due_date: yyyyMmDd(day(now, 1)),
      assignee_id: 'u-mira',
      milestone_id: 'm-concepts-pack',
      created_at: isoNow(day(now, -8)),
      updated_at: ts
    },
    {
      id: 't-insignia',
      project_id: 'p-concepts',
      title: 'Insignia variants',
      detail: '3 families, 6 variants each.',
      status: 'PLANNING',
      priority: 'MEDIUM',
      due_date: yyyyMmDd(day(now, 3)),
      assignee_id: 'u-sana',
      milestone_id: 'm-concepts-pack',
      created_at: isoNow(day(now, -6)),
      updated_at: ts
    },
    {
      id: 't-tokens',
      project_id: 'p-style',
      title: 'Token inventory',
      detail: 'Collect spacing/typography/color tokens.',
      status: 'PLANNING',
      priority: 'LOW',
      due_date: yyyyMmDd(day(now, 4)),
      assignee_id: 'u-you',
      created_at: isoNow(day(now, -4)),
      updated_at: ts
    }
  ]

  const notes: NoteIdea[] = [
    {
      id: 'note-1',
      workspace_id: 'ws-team',
      title: 'Trailer beats',
      body: 'Ensure the reveal lands at 00:42, build tension earlier.',
      project_id: 'p-trailer',
      created_at: isoNow(day(now, -3)),
      updated_at: ts
    },
    {
      id: 'note-2',
      workspace_id: 'ws-personal',
      title: 'Typography',
      body: 'Decide between Inter and Geist, test readability at 12px.',
      project_id: 'p-style',
      created_at: isoNow(day(now, -2)),
      updated_at: ts
    }
  ]

  const activity: ActivityEvent[] = [
    {
      id: 'act-1',
      workspace_id: 'ws-team',
      actor_user_id: 'u-you',
      type: 'CREATE',
      entity_type: 'PROJECT',
      entity_id: 'p-trailer',
      project_id: 'p-trailer',
      message: 'Created project: Cinematic Trailer Cut',
      timestamp: isoNow(day(now, -21))
    },
    {
      id: 'act-2',
      workspace_id: 'ws-team',
      actor_user_id: 'u-mira',
      type: 'STATUS',
      entity_type: 'TASK',
      entity_id: 't-silhouettes',
      project_id: 'p-concepts',
      message: 'Task status → ACTIVE: Silhouette exploration sheet',
      timestamp: isoNow(day(now, -1))
    }
  ]

  return {
    workspaces,
    users,
    roles: [{ id: 'role-member', name: 'Member' }],
    teams,
    team_members,
    module_access: [
      { id: 'mod-teams', workspace_id: 'ws-team', module_key: 'teams', enabled: true },
      { id: 'mod-notes', workspace_id: 'ws-team', module_key: 'notes', enabled: true },
      { id: 'mod-schedule', workspace_id: 'ws-team', module_key: 'schedule', enabled: true },
      { id: 'mod-business', workspace_id: 'ws-team', module_key: 'business', enabled: false }
    ],
    projects,
    milestones,
    tasks,
    schedule_items: [],
    notes,
    activity
  }
}

export function projectNameById(projects: Project[], id: ID) {
  return projects.find(p => p.id === id)?.name
}

export function userNameById(users: User[], id: ID) {
  return users.find(u => u.id === id)?.name
}
