---
type: module-spec
status: in-progress
tags: [dashboard, workspace, components]
related: ["[[docs/Architecture/Frontend_Overview]]"]
---
# Module Documentation: Workspace Dashboard

## 1. Overview
The Dashboard is the home screen for the **Workspace** hub. It serves as the "Today's Mission" deck for artists, providing a high-level summary of active projects, task progression, and upcoming deadlines.

## 2. Key Components

### DashboardMetricCard
A reusable component for displaying high-level KPIs.
- **Source**: [[fe/app/components/DashboardMetricCard.vue]]
- **Props**:
    - `label`: Title of the metric (e.g., "Active Projects").
    - `value`: Main numerical or text value (e.g., "12 / 15").
    - `trend`: Status badge text.
    - `tone`: Visual theme (`brand`, `cyan`, `success`, etc.).
    - `to`: (Optional) [[docs/Architecture/Frontend_Overview#3-directory-structure-nuxt-4-pattern|Nuxt route]] for direct navigation.
- **Interaction**: If the `to` prop is provided, the entire card behaves as an accessible `NuxtLink` with a pointer cursor and hover lift effect.

### Content Panels
- **Recent Projects**: Displays the 4 most recently modified projects in a grid format, providing quick entry into specific production boards.
- **Upcoming Tasks**: A condensed list of the next 5 tasks due, showing their status and associated project.

## 3. Specialized Features

### Project Progression Tracker
Unlike standard metrics, the **Project Progression** card displays a reactive `X / Y` ratio. 
- **Logic**: Calculated by filtering the `workspace.tasks` store for tasks where `status === 'DONE'` against the total task count.
- **Goal**: Provides immediate psychological feedback on project completion without the clutter of progress rings or percentages.

### Metric-to-Module Navigation
To streamline artist workflows, specific metric cards act as direct shortcuts:
- **Active Projects** ➔ `/projects`
- **Upcoming Deadlines** ➔ `/schedule`

## 4. Data Integration

The dashboard utilizes the `useWorkspaceStore` Pinia store. 
- **Initialization**: On component mount, the dashboard calls `workspace.fetchDashboardSummary()` to populate the local state with mock/live production data.
- **Reactivity**: Any changes in the `tasks` or `projects` arrays automatically propagate to the metric cards and lists.
