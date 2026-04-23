// Deprecated mockup dataset (legacy).
// Phase 1 source of truth is now: app/domain/mock.ts + Pinia workspace store.
// This file remains only to avoid breaking older imports if they reappear.

export const MOCK_PROJECTS = []
export const MOCK_TASKS = []
export const MOCK_PROJECT_ACTIVITY = []
export const MOCK_DASHBOARD_SUMMARY = {
  active_projects: 0,
  upcoming_tasks: 0,
  projects: [],
  upcoming_deadlines: [],
  recent_activity: []
}
