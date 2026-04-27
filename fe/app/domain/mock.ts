import type { StudioSnapshot } from './snapshot'
import type { ActivityEvent, ID, Milestone, NoteIdea, Project, ProjectMember, Task, User, Workspace, WorkspaceMember } from './models'

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

  // ── Users ─────────────────────────────────────────────
  // Plan lives on the user/account, not the workspace.
  const users: User[] = [
    // Free tier owner account
    { id: 'u-you', name: 'Free Owner', email: 'free@ttmc3.local', plan: 'FREE' },

    // Free tier candidates
    { id: 'u-free-1', name: 'Ari Free', email: 'ari.free@ivoryforge.local', plan: 'FREE' },
    { id: 'u-free-2', name: 'Bex Free', email: 'bex.free@ivoryforge.local', plan: 'FREE' },
    { id: 'u-free-3', name: 'Cora Free', email: 'cora.free@ivoryforge.local', plan: 'FREE' },

    // Pro tier owner + roster
    { id: 'u-pro-owner', name: 'Pro Owner', email: 'pro@ttmc3.local', plan: 'PRO' },
    { id: 'u-pro-1', name: 'Mira Chen', email: 'mira@ivoryforge.local', plan: 'FREE' },
    { id: 'u-pro-2', name: 'Jules Hart', email: 'jules@ivoryforge.local', plan: 'FREE' },
    { id: 'u-pro-3', name: 'Sana Patel', email: 'sana@ivoryforge.local', plan: 'FREE' },
    { id: 'u-pro-4', name: 'Niko Pro', email: 'niko.pro@ivoryforge.local', plan: 'FREE' },
    { id: 'u-pro-5', name: 'Lena Pro', email: 'lena.pro@ivoryforge.local', plan: 'FREE' },
    { id: 'u-pro-6', name: 'Rafi Pro', email: 'rafi.pro@ivoryforge.local', plan: 'FREE' },

    // Business tier owner + roster
    { id: 'u-ent-owner', name: 'Business Owner', email: 'enterprise@ttmc3.local', plan: 'BUSINESS' },
    { id: 'u-ent-1', name: 'Ava Enterprise', email: 'ava.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-2', name: 'Noah Enterprise', email: 'noah.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-3', name: 'Mia Enterprise', email: 'mia.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-4', name: 'Liam Enterprise', email: 'liam.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-5', name: 'Eli Enterprise', email: 'eli.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-6', name: 'Ivy Enterprise', email: 'ivy.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-7', name: 'Omar Enterprise', email: 'omar.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-8', name: 'Rina Enterprise', email: 'rina.enterprise@ivoryforge.local', plan: 'FREE' },
    { id: 'u-ent-9', name: 'Theo Enterprise', email: 'theo.enterprise@ivoryforge.local', plan: 'FREE' }
  ]

  // ── Workspaces ──────────────────────────────────────
  // Neutral containers. No kind/type field.
  // Capacity limits derive from the owner's plan.
  const workspaces: Workspace[] = [
    { id: 'ws-solo-free', name: 'Free Solo Studio', owner_user_id: 'u-you', created_at: ts },
    { id: 'ws-team-free', name: 'Free Team Studio', owner_user_id: 'u-you', created_at: ts },
    { id: 'ws-team-pro', name: 'Pro Studio', owner_user_id: 'u-pro-owner', created_at: ts },
    { id: 'ws-team-enterprise', name: 'Business Studio', owner_user_id: 'u-ent-owner', created_at: ts }
  ]

  // ── Workspace Members ───────────────────────────────
  // Roles: owner | custom
  // Workspace creator is automatically owner.
  // custom_role_label provides display label for custom members.
  const workspace_members: WorkspaceMember[] = [
    // ws-solo-free: 1 member (Solo workspace label derived)
    { id: 'wm-solo-1', workspace_id: 'ws-solo-free', user_id: 'u-you', role: 'owner', created_at: ts },

    // ws-team-free: 3 members (Team workspace label derived)
    { id: 'wm-free-1', workspace_id: 'ws-team-free', user_id: 'u-you', role: 'owner', created_at: ts },
    { id: 'wm-free-2', workspace_id: 'ws-team-free', user_id: 'u-free-1', role: 'custom', custom_role_label: 'Member', created_at: ts },
    { id: 'wm-free-3', workspace_id: 'ws-team-free', user_id: 'u-free-2', role: 'custom', custom_role_label: 'Member', created_at: ts },

    // ws-team-pro: 7 members
    { id: 'wm-pro-1', workspace_id: 'ws-team-pro', user_id: 'u-pro-owner', role: 'owner', created_at: ts },
    { id: 'wm-pro-2', workspace_id: 'ws-team-pro', user_id: 'u-pro-1', role: 'custom', custom_role_label: 'Lead Artist', created_at: ts },
    { id: 'wm-pro-3', workspace_id: 'ws-team-pro', user_id: 'u-pro-2', role: 'custom', custom_role_label: 'Compositor', created_at: ts },
    { id: 'wm-pro-4', workspace_id: 'ws-team-pro', user_id: 'u-pro-3', role: 'custom', custom_role_label: 'Coordinator', created_at: ts },
    { id: 'wm-pro-5', workspace_id: 'ws-team-pro', user_id: 'u-pro-4', role: 'custom', custom_role_label: 'Editor', created_at: ts },
    { id: 'wm-pro-6', workspace_id: 'ws-team-pro', user_id: 'u-pro-5', role: 'custom', custom_role_label: 'Animator', created_at: ts },
    { id: 'wm-pro-7', workspace_id: 'ws-team-pro', user_id: 'u-pro-6', role: 'custom', custom_role_label: 'Design Ops', created_at: ts },

    // ws-team-enterprise: 10 members
    { id: 'wm-ent-1', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-owner', role: 'owner', created_at: ts },
    { id: 'wm-ent-2', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-1', role: 'custom', custom_role_label: 'Ops Manager', created_at: ts },
    { id: 'wm-ent-3', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-2', role: 'custom', custom_role_label: 'Tech Lead', created_at: ts },
    { id: 'wm-ent-4', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-3', role: 'custom', custom_role_label: 'Product Lead', created_at: ts },
    { id: 'wm-ent-5', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-4', role: 'custom', custom_role_label: 'Architect', created_at: ts },
    { id: 'wm-ent-6', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-5', role: 'custom', custom_role_label: 'QA Lead', created_at: ts },
    { id: 'wm-ent-7', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-6', role: 'custom', custom_role_label: 'Data Lead', created_at: ts },
    { id: 'wm-ent-8', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-7', role: 'custom', custom_role_label: 'Frontend Lead', created_at: ts },
    { id: 'wm-ent-9', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-8', role: 'custom', custom_role_label: 'Backend Lead', created_at: ts },
    { id: 'wm-ent-10', workspace_id: 'ws-team-enterprise', user_id: 'u-ent-9', role: 'custom', custom_role_label: 'Infra Lead', created_at: ts }
  ]

  // ── Projects ────────────────────────────────────────
  const projects: Project[] = [
    {
      id: 'p-trailer',
      workspace_id: 'ws-team-pro',
      name: 'Cinematic Trailer Cut',
      description: 'Storyboard, animatic, and final cut pipeline.',
      color_code: '#8b5cf6',
      status: 'ACTIVE',
      created_by: 'u-pro-owner',
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
      created_by: 'u-pro-1',
      created_at: isoNow(day(now, -14)),
      updated_at: ts
    },
    {
      id: 'p-style',
      workspace_id: 'ws-solo-free',
      name: 'UI Style Guide',
      description: 'Typography scale, tokens, and component patterns.',
      color_code: '#10b981',
      status: 'PLANNING',
      created_by: 'u-you',
      created_at: isoNow(day(now, -9)),
      updated_at: ts
    }
  ]

  // ── Project Members ─────────────────────────────────
  // Controls visibility for non-owners.
  // Project creator is always included.
  const project_members: ProjectMember[] = [
    // p-trailer: creator u-pro-owner + 2
    { id: 'pm-1', project_id: 'p-trailer', user_id: 'u-pro-owner', created_at: ts },
    { id: 'pm-2', project_id: 'p-trailer', user_id: 'u-pro-1', created_at: ts },
    { id: 'pm-3', project_id: 'p-trailer', user_id: 'u-pro-2', created_at: ts },

    // p-concepts: creator u-pro-1 + 1
    { id: 'pm-4', project_id: 'p-concepts', user_id: 'u-pro-1', created_at: ts },
    { id: 'pm-5', project_id: 'p-concepts', user_id: 'u-pro-3', created_at: ts },

    // p-style: creator u-you
    { id: 'pm-6', project_id: 'p-style', user_id: 'u-you', created_at: ts }
  ]

  // ── Milestones ──────────────────────────────────────
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

  // ── Tasks ───────────────────────────────────────────
  const tasks: Task[] = [
    {
      id: 't-animatic',
      project_id: 'p-trailer',
      title: 'Animatic pass',
      detail: 'Cut timing, add temp SFX, verify beats.',
      status: 'ACTIVE',
      priority: 'HIGH',
      due_date: yyyyMmDd(day(now, 2)),
      assignee_id: 'u-pro-owner',
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

  // ── Notes ───────────────────────────────────────────
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
      workspace_id: 'ws-solo-free',
      title: 'Typography',
      body: 'Decide between Inter and Geist, test readability at 12px.',
      project_id: 'p-style',
      created_at: isoNow(day(now, -2)),
      updated_at: ts
    }
  ]

  // ── Activity ────────────────────────────────────────
  const activity: ActivityEvent[] = [
    {
      id: 'act-1',
      workspace_id: 'ws-team-pro',
      actor_user_id: 'u-pro-owner',
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
    workspace_members,
    project_members,
    module_access: [
      { id: 'mod-schedule-pro', workspace_id: 'ws-team-pro', module_key: 'schedule', enabled: true },
      { id: 'mod-notes-pro', workspace_id: 'ws-team-pro', module_key: 'notes', enabled: true },
      { id: 'mod-business-pro', workspace_id: 'ws-team-pro', module_key: 'business', enabled: false },
      { id: 'mod-schedule-free', workspace_id: 'ws-team-free', module_key: 'schedule', enabled: true },
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
