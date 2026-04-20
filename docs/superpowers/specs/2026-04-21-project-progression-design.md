# Dashboard Metric: Project Progression (Minimalist)

**Date:** 2026-04-21
**Topic:** Redesigning the center dashboard metric to track literal task progression.

## Overview
The goal is to replace the enterprise-focused "Storage Quota / Team Load" metric card with a simpler, more meaningful "Project Progression" metric for solo artists. This metric will display the count of completed tasks against the total number of assigned tasks in a minimalist "X / Y" format.

## User Requirements
- **Literal Value:** Display `Finished Tasks / Total Tasks` (e.g., "12 / 15").
- **Minimalist UI:** Remove the progress ring and percentage suffix.
- **Context:** Use product-level terminology ("Workspace Overview", "Projects") and avoid painting metaphors.

## Technical Design

### Components
- **DashboardMetricCard:**
  - Update `label` to "Project Progression".
  - Update `value` to a computed string formatted as `finishedCount / totalCount`.
  - Pass `undefined` or `0` to the `progress` prop (or modify the component to hide the ring if it's currently mandatory).
  - Update `detail` to "Tasks finished across all projects".

### Data Flow
- **Source:** The `workspace` store (Pinia).
- **Logic:** 
  - `totalTasks = workspace.tasks.length`
  - `finishedTasks = workspace.tasks.filter(t => t.status === 'DONE').length`
  - Computed value: `${finishedTasks} / ${totalTasks}` or just `${finishedTasks} <span class="text-faint font-normal">/ ${totalTasks}</span>` for visual hierarchy.

## Success Criteria
1. The center dashboard card displays exact task ratios.
2. No progress circle is visible.
3. Terminology matches the "Product" persona established in previous steps.
4. The value updates reactively when task statuses change in the store.

## Testing Plan
1. Manually verify the dashboard renders the "X / Y" format.
2. Confirm the absence of the progress ring.
3. Verify that changing a task to "DONE" in the project view results in an immediate dashboard update.
