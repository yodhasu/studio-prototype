# TTMC3 — Updated Product Overview

## 1. Core Identity

TTMC3 is a **Workspace Management SaaS**.

It provides a unified environment where users can:

- manage projects
- organize tasks and schedules
- coordinate teams
- store ideas and work context
- handle operational workflows (light → heavy depending on scale)

It is designed to work across different user types:

- individuals (solo use)
- small teams / indie groups
- creative studios
- IT/product teams
- startups
- scalable toward enterprise workflows

The system adapts based on:

- account plan
- workspace membership
- project membership
- enabled modules

---

## 2. Product Philosophy

TTMC3 is built on one core principle:

**“Same system, different complexity levels.”**

Instead of making:

- a “simple app” for individuals
- and a “complex app” for companies

TTMC3 is one system that **scales in capability** without forcing complexity early.

So:

- small users get essentials only
- growing teams unlock coordination
- larger orgs expand into operations

No forced bloat. No artificial limitations.

---

## 3. Core Concept: The Workspace

Everything revolves around the idea of a **Workspace**.

A workspace is a neutral work container. It does not need a hard-coded type such as personal/team/organization. A workspace can behave like a personal workspace when it has one member, or like a team/company workspace when it has multiple members.

Inside a workspace, users can:

- create projects
- manage tasks
- organize schedules
- invite and manage workspace members
- store ideas/context
- enable additional modules

Think of workspace as:

> a container for work, context, and coordination

---

## 4. Core Building Blocks

TTMC3 is built from a few fundamental entities:

### Workspace Layer

- User
- Workspace
- Workspace Member
- Subscription / Plan
- Workspace Role / Custom Permission

### Work Layer

- Project
- Project Member
- Task
- Milestone
- Schedule Item

### Context Layer

- Notes / Ideas
- References (future creative link)
- Activity / Updates

### Operational Layer (expandable)

- Bills / Records
- Resource / Capacity (future)
- ERP / MRP modules (future expansion)

These layers should feel connected, not separate products.

---

## 5. Product Behavior by Scale

### Level 1 — Individual Use

User experience:

- one owned workspace
- one workspace member: the user
- personal projects
- task tracking
- scheduling
- idea capture

No team complexity. No enterprise noise.

---

### Level 2 — Team Coordination

Unlocked through plan limits and workspace member capacity:

- shared projects
- task assignment
- member invitations
- custom workspace roles
- team schedule visibility
- shared activity

Now TTMC3 becomes a coordination tool.

---

### Level 3 — Operational Expansion (Future)

For larger usage:

- deeper workflow modules
- resource planning
- operational tracking
- ERP/MRP-like extensions
- advanced permissions

This layer should feel like **expansion**, not default UI.

---

## 6. What TTMC3 Is NOT

To avoid design confusion:

TTMC3 is **not**:

- a deep creative workspace (that’s separate)
- a pure ERP system
- a simple to-do app
- a bloated “everything dashboard”

It sits in the middle as a:

> **structured coordination system for work**

---

## 7. Relationship to Creative Workspace (Important)

Creative execution (canvas, graph, assets, etc.) lives in a **separate app/service**.

TTMC3 interacts with it by:

- linking projects to workspace instances
- storing metadata about progress
- showing summaries / activity
- acting as the coordination layer

So:

- TTMC3 = control + structure
- Workspace app = execution + creation

---

## 8. UX Philosophy

TTMC3 UI should feel:

- minimal but powerful
- structured, not cluttered
- fast to understand
- progressive in complexity

Rules:

- show only what’s needed
- reveal complexity when relevant
- avoid dead dashboards
- every screen must serve a workflow

---

## 9. Core Flows (Golden Paths)

### Individual Flow

- register account
- automatically create / enter owned workspace
- create project
- create tasks
- schedule work
- track progress
- store ideas

---

### Team Flow

- owner invites members into workspace
- owner assigns custom workspace roles
- create shared projects
- add members to projects
- assign tasks
- coordinate schedule
- monitor project progress

---

### Growth Flow

- enable more modules
- expand workspace capabilities
- manage more complex operations

---

## 10. RBAC, Plans, and Access Model

TTMC3 uses a simple workspace-first RBAC model for v1. The system should avoid overbuilding enterprise permission logic early, while still keeping the data structure ready for growth.

### Core Rule

> Account plan controls capacity. Workspace membership controls entry. Project membership controls visibility.

### Plan Rules

Plans belong to the user/account, not to the workspace. Workspace limits are based on the workspace creator / owner account.

- Free
  - max 1 owned workspace
  - max 1 member in that workspace

- Pro
  - max 1 owned workspace
  - max 5 members in that workspace

- Business
  - unlimited owned workspaces
  - unlimited members per workspace

If a free user is invited into a Pro or Business workspace, they may join because the workspace capacity is governed by the workspace owner's plan.

### Workspace Membership

A user becomes part of a workspace through `workspace_members`.

Recommended role model for v1:

- `owner`
  - automatically assigned to the workspace creator
  - has full control over workspace settings, invitations, members, project creation, and destructive actions

- `custom`
  - assigned by the owner during invitation or after joining
  - permissions are defined by the workspace owner
  - can be stored as a permission preset or permission JSON depending on backend design

This avoids forcing fixed roles like admin/member too early, while still keeping owner authority explicit.

### Project Access

A project belongs to one workspace. Projects should not belong directly to users.

When a user creates a project:

1. create the project under the current `workspace_id`
2. set `created_by` to the creating user
3. automatically insert the creator into `project_members`

For v1, project membership only controls access/visibility. Project-level RBAC is intentionally not required yet.

A user can see a project if:

1. the user is a member of the selected workspace
2. and either:
   - the user is the workspace owner
   - or the user exists in `project_members` for that project

### Recommended Core Tables

```txt
users
- id
- auth_user_id
- email
- plan

workspaces
- id
- name
- created_by
- created_at

workspace_members
- id
- workspace_id
- user_id
- role: owner | custom
- custom_permissions / permission_profile_id
- created_at

projects
- id
- workspace_id
- created_by
- name
- created_at

project_members
- id
- project_id
- user_id
- created_at
```

### Access Query Mental Model

```txt
User logs in
→ select workspace
→ verify workspace_members
→ load projects where:
   - workspace_id matches selected workspace
   - and user is owner or exists in project_members
```

This keeps individual and team usage in the same system without separate app modes. A one-person workspace is just a workspace with one member. A team workspace is just a workspace with multiple members.

---

## 11. Engineering Direction (Frontend)

The frontend must:

- reflect real domain structure
- maintain consistent state across pages
- simulate real workflows using mock/local data
- be ready for:
  - backend APIs
  - database schema
  - RBAC
  - plan/member limit logic
  - subscription logic

This is critical:

> frontend should define the system clearly before backend exists

---

## 12. One-Line Mental Model

If you had to compress TTMC3 into one sentence:

> **“A scalable workspace OS for managing projects, tasks, teams, and operational context without forcing complexity upfront.”**

# DEVELOPMENT PHASE

Phase 1: Frontend foundation, non-business management
Build the visible operating layer first:

workspace structure
projects
tasks
milestones
schedules
workspace/member views
notes/ideas/context
dashboard based on real derived state
account/workspace/module scaffolding
integration-ready architecture

Phase 2: Backend support for those same modules
Once the shape is right:

entity definitions
DB schema
API contracts
auth/workspace boundaries
store-to-endpoint replacement

Phase 3: Business/operational logic
Only after the core app already feels correct:

billing
accounting-style logic
ERP/MRP behavior
finance rules
subscription enforcement depth
business reporting
