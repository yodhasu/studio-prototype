export const MOCK_PROJECTS = [
  { id: 'p1', org_id: 'mock-org-1', name: 'Infrastructure Migration', description: 'Migrating legacy art assets to high-performance cloud storage.', status: 'active', card_count: 12, task_count: 5, current_user_role: 'LEAD', color_code: '#8b5cf6', member_ids: ['talankorsgaard', 'hannaphilips'] },
  { id: 'p2', org_id: 'mock-org-1', name: 'Brand Redesign', description: 'Complete overhaul of the studio visual identity for 2026.', status: 'active', card_count: 8, task_count: 3, current_user_role: 'COLLABORATOR', color_code: '#06b6d4', member_ids: ['davisdonin'] },
  { id: 'p3', org_id: 'mock-org-1', name: 'Q4 Marketing Campaign', description: 'Holiday outreach and social media campaign assets.', status: 'active', card_count: 15, task_count: 8, current_user_role: 'LEAD', color_code: '#10b981', member_ids: ['talankorsgaard', 'davisdonin'] },
  { id: 'p4', org_id: 'mock-org-1', name: 'Client Onboarding Portal', description: 'Self-service portal for new clients to upload briefs.', status: 'active', card_count: 4, task_count: 1, current_user_role: 'ASSISTANT', color_code: '#f59e0b', member_ids: [] },
  { id: 'p5', org_id: 'mock-org-1', name: 'Annual Retreat Planning', description: 'Logistics and scheduling for the 10th anniversary retreat.', status: 'active', card_count: 22, task_count: 11, current_user_role: 'COLLABORATOR', color_code: '#ef4444', member_ids: ['hannaphilips'] },
  { id: 'p6', org_id: 'mock-org-1', name: 'V2 Platform Launch', description: 'Major rollout of the high-performance creative hub v2.', status: 'active', card_count: 35, task_count: 19, current_user_role: 'LEAD', color_code: '#f97316', member_ids: ['talankorsgaard', 'hannaphilips', 'davisdonin'] },
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
  { id: 't1', card_id: 'c1', due_date: '2026-04-10', status: 'DONE', priority: 'HIGH', card_title: 'Initial Discovery', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6', description: 'Review all current VPC and storage configurations.' },
  { id: 't2', card_id: 'c2', due_date: '2026-04-20', status: 'PROGRESS', priority: 'MEDIUM', card_title: 'Cloud Vendor Analysis', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6', description: 'Compare cost vs performance for AWS S3 and GCP Buckets.' },
  { id: 't3', card_id: 'c3', due_date: '2026-04-15', status: 'TODO', priority: 'HIGH', card_title: 'Security Audit', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6', description: 'Ensure all IAM policies follow principle of least privilege.' },
  { id: 't4', card_id: 'c4', due_date: '2026-04-25', status: 'TODO', priority: 'LOW', card_title: 'Documentation', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6', description: 'Document the migration path and rollback strategy.' },
  { id: 't5', card_id: 'c5', due_date: '2026-04-12', status: 'TODO', priority: 'MEDIUM', card_title: 'Asset Inventory', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6', description: 'Create a full list of assets to be migrated.' },
  { id: 't6', card_id: 'c6', due_date: '2026-04-18', status: 'TODO', priority: 'HIGH', card_title: 'Traffic Routing', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6', description: 'Plan the Route53 switchover logic.' },
  { id: 't7', card_id: 'c7', due_date: '2026-04-22', status: 'TODO', priority: 'LOW', card_title: 'Post-Migration Cleanup', project_id: 'p1', project_name: 'Infrastructure Migration', project_color_code: '#8b5cf6', description: 'Decommission old instances.' },
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
