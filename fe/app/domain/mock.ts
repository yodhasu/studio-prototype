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
    // Free tier owner account
    { id: 'u-you', name: 'Free Owner', email: 'free@ttmc3.local' },

    // Free tier roster + candidates
    { id: 'u-free-1', name: 'Ari Free', email: 'ari.free@ivoryforge.local' },
    { id: 'u-free-2', name: 'Bex Free', email: 'bex.free@ivoryforge.local' },
    { id: 'u-free-3', name: 'Cora Free', email: 'cora.free@ivoryforge.local' },

    // Pro tier owner + roster + candidates
    { id: 'u-pro-owner', name: 'Pro Owner', email: 'pro@ttmc3.local' },
    { id: 'u-pro-1', name: 'Mira Chen', email: 'mira@ivoryforge.local' },
    { id: 'u-pro-2', name: 'Jules Hart', email: 'jules@ivoryforge.local' },
    { id: 'u-pro-3', name: 'Sana Patel', email: 'sana@ivoryforge.local' },
    { id: 'u-pro-4', name: 'Niko Pro', email: 'niko.pro@ivoryforge.local' },
    { id: 'u-pro-5', name: 'Lena Pro', email: 'lena.pro@ivoryforge.local' },
    { id: 'u-pro-6', name: 'Rafi Pro', email: 'rafi.pro@ivoryforge.local' },

    // Enterprise tier owner + roster + candidates
    { id: 'u-ent-owner', name: 'Enterprise Owner', email: 'enterprise@ttmc3.local' },
    { id: 'u-ent-1', name: 'Ava Enterprise', email: 'ava.enterprise@ivoryforge.local' },
    { id: 'u-ent-2', name: 'Noah Enterprise', email: 'noah.enterprise@ivoryforge.local' },
    { id: 'u-ent-3', name: 'Mia Enterprise', email: 'mia.enterprise@ivoryforge.local' },
    { id: 'u-ent-4', name: 'Liam Enterprise', email: 'liam.enterprise@ivoryforge.local' },
    { id: 'u-ent-5', name: 'Eli Enterprise', email: 'eli.enterprise@ivoryforge.local' },
    { id: 'u-ent-6', name: 'Ivy Enterprise', email: 'ivy.enterprise@ivoryforge.local' },
    { id: 'u-ent-7', name: 'Omar Enterprise', email: 'omar.enterprise@ivoryforge.local' },
    { id: 'u-ent-8', name: 'Rina Enterprise', email: 'rina.enterprise@ivoryforge.local' },
    { id: 'u-ent-9', name: 'Theo Enterprise', email: 'theo.enterprise@ivoryforge.local' }
  ]

  const workspaces: Workspace[] = [
    { id: 'ws-personal', kind: 'PERSONAL', name: 'Personal Workspace', owner_user_id: 'u-you', plan: 'FREE', created_at: ts },
    { id: 'ws-team-free', kind: 'TEAM', name: 'Tier Demo — Free', owner_user_id: 'u-you', team_id: 'team-free', plan: 'FREE', created_at: ts },
    { id: 'ws-team-pro', kind: 'TEAM', name: 'Tier Demo — Pro', owner_user_id: 'u-pro-owner', team_id: 'team-pro', plan: 'PRO', created_at: ts },
    { id: 'ws-team-enterprise', kind: 'TEAM', name: 'Tier Demo — Enterprise', owner_user_id: 'u-ent-owner', team_id: 'team-enterprise', plan: 'ENTERPRISE', created_at: ts }
  ]

  const teams: Team[] = [
    { id: 'team-free', workspace_id: 'ws-team-free', name: 'Free Squad', created_at: ts },
    { id: 'team-pro', workspace_id: 'ws-team-pro', name: 'Pro Squad', created_at: ts },
    { id: 'team-enterprise', workspace_id: 'ws-team-enterprise', name: 'Enterprise Squad', created_at: ts }
  ]

  const team_members: TeamMember[] = [
    // FREE tier: capped at 3 (already full)
    { id: 'tm-free-1', team_id: 'team-free', user_id: 'u-you', title: 'Owner', created_at: ts },
    { id: 'tm-free-2', team_id: 'team-free', user_id: 'u-free-1', title: 'Member', created_at: ts },
    { id: 'tm-free-3', team_id: 'team-free', user_id: 'u-free-2', title: 'Member', created_at: ts },

    // PRO tier: 7 / 10 used
    { id: 'tm-pro-1', team_id: 'team-pro', user_id: 'u-pro-owner', title: 'Owner', created_at: ts },
    { id: 'tm-pro-2', team_id: 'team-pro', user_id: 'u-pro-1', title: 'Lead Artist', created_at: ts },
    { id: 'tm-pro-3', team_id: 'team-pro', user_id: 'u-pro-2', title: 'Compositor', created_at: ts },
    { id: 'tm-pro-4', team_id: 'team-pro', user_id: 'u-pro-3', title: 'Coordinator', created_at: ts },
    { id: 'tm-pro-5', team_id: 'team-pro', user_id: 'u-pro-4', title: 'Editor', created_at: ts },
    { id: 'tm-pro-6', team_id: 'team-pro', user_id: 'u-pro-5', title: 'Animator', created_at: ts },
    { id: 'tm-pro-7', team_id: 'team-pro', user_id: 'u-pro-6', title: 'Design Ops', created_at: ts },

    // ENTERPRISE tier: 10+ used, unlimited invites
    { id: 'tm-ent-1', team_id: 'team-enterprise', user_id: 'u-ent-owner', title: 'Owner', created_at: ts },
    { id: 'tm-ent-2', team_id: 'team-enterprise', user_id: 'u-ent-1', title: 'Ops Manager', created_at: ts },
    { id: 'tm-ent-3', team_id: 'team-enterprise', user_id: 'u-ent-2', title: 'Tech Lead', created_at: ts },
    { id: 'tm-ent-4', team_id: 'team-enterprise', user_id: 'u-ent-3', title: 'Product Lead', created_at: ts },
    { id: 'tm-ent-5', team_id: 'team-enterprise', user_id: 'u-ent-4', title: 'Architect', created_at: ts },
    { id: 'tm-ent-6', team_id: 'team-enterprise', user_id: 'u-ent-5', title: 'QA Lead', created_at: ts },
    { id: 'tm-ent-7', team_id: 'team-enterprise', user_id: 'u-ent-6', title: 'Data Lead', created_at: ts },
    { id: 'tm-ent-8', team_id: 'team-enterprise', user_id: 'u-ent-7', title: 'Frontend Lead', created_at: ts },
    { id: 'tm-ent-9', team_id: 'team-enterprise', user_id: 'u-ent-8', title: 'Backend Lead', created_at: ts },
    { id: 'tm-ent-10', team_id: 'team-enterprise', user_id: 'u-ent-9', title: 'Infra Lead', created_at: ts }
  ]

  const projects: Project[] = [
    {
      id: 'p-trailer',
      workspace_id: 'ws-team-pro',
      name: 'Cinematic Trailer Cut',
      description: 'Storyboard, animatic, and final cut pipeline.',
      color_code: '#8b5cf6',
      status: 'ACTIVE',
      member_ids: ['u-you', 'u-pro-1', 'u-pro-2'],
      created_at: isoNow(day(now, -21)),
      updated_at: ts
    },
    {
      id: 'p-concepts',
      workspace_id: 'ws-team-pro',
      name: 'Faction Concept Sheets',
      description: 'Exploration sheets for silhouettes, materials, and insignia.',
      color_code: '#06b6d4',
      status: 'ACTIVE',
      member_ids: ['u-pro-1', 'u-pro-3'],
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
      assignee_id: 'u-pro-1',
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
      assignee_id: 'u-pro-2',
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
      assignee_id: 'u-pro-1',
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
      assignee_id: 'u-pro-3',
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
      workspace_id: 'ws-team-pro',
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
      workspace_id: 'ws-team-pro',
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
      workspace_id: 'ws-team-pro',
      actor_user_id: 'u-pro-1',
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
      { id: 'mod-teams-pro', workspace_id: 'ws-team-pro', module_key: 'teams', enabled: true },
      { id: 'mod-notes-pro', workspace_id: 'ws-team-pro', module_key: 'notes', enabled: true },
      { id: 'mod-schedule-pro', workspace_id: 'ws-team-pro', module_key: 'schedule', enabled: true },
      { id: 'mod-business-pro', workspace_id: 'ws-team-pro', module_key: 'business', enabled: false },
      { id: 'mod-teams-free', workspace_id: 'ws-team-free', module_key: 'teams', enabled: true },
      { id: 'mod-schedule-free', workspace_id: 'ws-team-free', module_key: 'schedule', enabled: true },
      { id: 'mod-teams-enterprise', workspace_id: 'ws-team-enterprise', module_key: 'teams', enabled: true },
      { id: 'mod-schedule-enterprise', workspace_id: 'ws-team-enterprise', module_key: 'schedule', enabled: true }
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
