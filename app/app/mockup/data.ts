export const MOCK_PROJECTS = [
  { id: 'p1', org_id: 'mock-org-1', name: 'Infrastructure Migration', status: 'active', card_count: 12, task_count: 5, current_user_role: 'LEAD', color_code: '#8b5cf6' },
  { id: 'p2', org_id: 'mock-org-1', name: 'Brand Redesign', status: 'active', card_count: 8, task_count: 3, current_user_role: 'COLLABORATOR', color_code: '#06b6d4' },
  { id: 'p3', org_id: 'mock-org-1', name: 'Q4 Marketing Campaign', status: 'active', card_count: 15, task_count: 8, current_user_role: 'LEAD', color_code: '#10b981' },
  { id: 'p4', org_id: 'mock-org-1', name: 'Client Onboarding Portal', status: 'active', card_count: 4, task_count: 1, current_user_role: 'ASSISTANT', color_code: '#f59e0b' },
  { id: 'p5', org_id: 'mock-org-1', name: 'Annual Retreat Planning', status: 'active', card_count: 22, task_count: 11, current_user_role: 'COLLABORATOR', color_code: '#ef4444' },
  { id: 'p6', org_id: 'mock-org-1', name: 'V2 Platform Launch', status: 'active', card_count: 35, task_count: 19, current_user_role: 'LEAD', color_code: '#f97316' },
]

export const MOCK_DASHBOARD_SUMMARY = {
  active_projects: MOCK_PROJECTS.length,
  total_revenue: 150000,
  total_expenses: 45000,
  upcoming_tasks: 8,
  financials_masked: false,
  projects: MOCK_PROJECTS,
  upcoming_deadlines: [],
  recent_transactions: []
}

export const MOCK_CARDS = [
  {
    id: 'c1',
    project_id: 'p1',
    org_id: 'mock-org-1',
    title: 'Initial Discovery',
    content: { notes: 'Explore current infrastructure and identify pain points.' },
    x_pos: 100,
    y_pos: 100,
    width: 300,
    comments: [],
    link_count: 1,
    task: { id: 't1', start_date: '2026-04-01', end_date: '2026-04-10', status: 'DONE' }
  },
  {
    id: 'c2',
    project_id: 'p1',
    org_id: 'mock-org-1',
    title: 'Cloud Vendor Analysis',
    content: { notes: 'Compare AWS, GCP, and Azure for cost and features.' },
    x_pos: 500,
    y_pos: 150,
    width: 300,
    comments: [{ id: 'com1', author_name: 'Alex', body: 'AWS seems most mature.', created_at: '2026-04-05T10:00:00Z' }],
    link_count: 1,
    task: { id: 't2', start_date: '2026-04-11', end_date: '2026-04-20', status: 'PROGRESS' }
  }
]

export const MOCK_EDGES = [
  { id: 'e1', org_id: 'mock-org-1', source_card_id: 'c1', target_card_id: 'c2', type: 'DEPENDS_ON' }
]

export const MOCK_TASKS = [
  { id: 't1', card_id: 'c1', start_date: '2026-04-01', end_date: '2026-04-10', status: 'DONE', card_title: 'Initial Discovery', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6' },
  { id: 't2', card_id: 'c2', start_date: '2026-04-11', end_date: '2026-04-20', status: 'PROGRESS', card_title: 'Cloud Vendor Analysis', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6' }
]

export const MOCK_LEDGER = [
  { id: 'l1', org_id: 'mock-org-1', project_id: 'p1', project_name: 'Infrastructure Migration', amount: 5000, type: 'BUDGET_ALLOCATION', description: 'Initial budget', created_at: '2026-04-01T08:00:00Z', masked: false },
  { id: 'l2', org_id: 'mock-org-1', project_id: 'p1', project_name: 'Infrastructure Migration', amount: 1200, type: 'EXPENSE', description: 'Consultancy fees', category: 'Professional Services', created_at: '2026-04-12T14:30:00Z', masked: false }
]

export const MOCK_PROJECT_ACTIVITY = [
  { id: 'act-1', user: 'Talan Korsgaard', avatar: 'Talan', action: 'finished', target: 'Infrastructure Migration', time: '10:45 AM' },
  { id: 'act-2', user: 'Hanna Philips', avatar: 'Hanna', action: 'started', target: 'Visual Design Overhaul', time: '10:20 AM' },
  { id: 'act-3', user: 'Davis Donin', avatar: 'Davis', action: 'finished', target: 'User Authentication Flow', time: '09:15 AM' }
]
