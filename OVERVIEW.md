# PROJECT OVERHAUL: PROJECT STUDIO MANAGEMENT C3

**Version:** 1.0  
**Vision:** The definitive high-agency platform for creative studios. Production-focused, business-automated, and zero-bullshit.

---

## I. CORE ARCHITECTURE: THE DUAL-HUB SYSTEM

The app is strictly partitioned into two operational environments to prevent context-leakage between creative flow and business stress.

### 1. THE WORKSPACE (The Production Floor)

_User Persona: Artists, Animators, Lead Designers._
Focus: Execution, visual context, and immediate task priority.

- **Workspace Dashboard:** A "Today's Mission" view. Shows active project timelines, personal task lists, and recent activity from the Creative Hub.
- **Integrated Kanban:** \* One card = One specific deliverable.
  - Columns are customizable but optimized for art pipelines (Draft > Review > Polish > Final).
  - Context-Aware: Every card links directly to relevant nodes in the Creative Hub.
- **Creative Hub (Visual Knowledge Graph):**
  - An Obsidian-style graph view for visual assets.
  - Allows users to link moodboards, style guides, and references to specific project stages.
  - Solves the "where was that reference?" problem by maintaining persistent context.
- **Granular Scheduling:**
  - Visual timeline of task assignments.
  - Focuses on "Who owns what" and "What's the deadline."
  - **Anti-Feature:** No time-tracking. We measure progress by deliverables, not by hours spent sitting.

### 2. THE MANAGEMENT (The Business Office)

_User Persona: Studio Owners, Accountants, Project Managers._
Focus: Financial health, client relations, and team bandwidth.

- **Management Dashboard:** A high-level flight deck. Shows studio-wide KPIs:
  - `Studio Burn Rate`
  - `Unpaid Invoices`
  - `Active Client Count`
  - `Total Pipeline Value`
- **Finance Module (The "Better Excel"):** \* Automatic invoice generation based on project milestones.
  - Expense tracking with categorization.
  - Financial forecasting based on current project schedules.
- **Resource Capacity:**
  - Heat-map of team bandwidth.
  - Shows who is overloaded and who is "bench" (available) without invasive monitoring.
- **Client & Contract CRM:**
  - Storage for legal docs, contact info, and project history.

---

## II. THE USER WORKFLOW (The "Golden Path")

The application follows a circular lifecycle where data flows between hubs.

1.  **Project Initialization:** Admin creates a project in **Management**, links a client, and sets a budget.
2.  **Visual Brainstorming:** Lead Creative populates the **Creative Hub** with references, moodboards, and art style guides.
3.  **Task Orchestration:** Lead Creative breaks production into **Kanban** tasks, tagging specific artists.
4.  **Focused Execution:** Artists work within the **Workspace Dashboard**, accessing linked references directly within their task view.
5.  **Administrative Loop:** When the "Final" column is triggered, the **Management Hub** flags the Admin to generate an invoice.

---

## III. USER SCENARIOS (Case Studies)

### Scenario A: The New Hire / Freelancer

- **Action:** A freelancer is added to an ongoing project.
- **Result:** Instead of reading 100 Discord messages, they open the **Creative Hub**. They see the visual evolution of the character/scene via the Knowledge Graph. They have full context in minutes.

### Scenario B: The Scope Creep

- **Action:** A client requests extra revisions.
- **Result:** Lead Creative adds tasks to the Kanban. The **Management Dashboard** automatically updates the "Resource Capacity" view, flagging to the PM that the current deadline is now impossible. Data-driven pushback against the client is now instant.

### Scenario C: The Billing Panic

- **Action:** It's the end of the month.
- **Result:** Admin checks the **Management Dashboard**. They see a list of projects that hit the "Final" column but have $0 in "Invoiced Amount." One click generates the bill.

---

## IV. RBAC (ROLE-BASED ACCESS CONTROL)

We implement a "Need-to-Know" permissions layer to keep the UI clean and sensitive data secure.

| Role                     | Access Level               | Description                                                                                    |
| :----------------------- | :------------------------- | :--------------------------------------------------------------------------------------------- |
| **Studio Owner / Admin** | Full Access                | Complete control over Finance, Management, and Workspace.                                      |
| **Project Manager**      | Management + Production    | Can edit schedules and view project finances, but cannot see global studio burn rates.         |
| **Lead Creative**        | Production Full + Capacity | Can manage the Kanban/Hub and view team capacity to assign tasks. No Finance access.           |
| **Artist / Contributor** | Production Restricted      | Can view/edit assigned tasks and contribute to the Creative Hub. Cannot see studio management. |
| **External Client**      | Reviewer Mode              | View-only access to specific project progress and the ability to approve/comment on tasks.     |

---

## III. TECHNICAL SPECIFICATIONS

- **Frontend:** Nuxt (Composition API) + Vite.
- **Styling:** Tailwind CSS (Theme: Custom Slate-900 based Dark Mode).
- **State Management:** Pinia (Separated into `useWorkspaceStore` and `useManagementStore`).
- **Backend:** FastAPI (Python) for asynchronous performance.
- **Database:** Supabase (PostgreSQL).
- **Storage:** Supabase Buckets (for high-res asset hosting).
- **Real-time:** WebSockets (for live Kanban updates and collaborative moodboards).

---

## IV. UI/UX MANIFESTO

1.  **Dark Mode First:** `#0f172a` (Slate 900) is the base. High-end art looks better on dark surfaces.
2.  **Typography:** Inter for UI clarity; JetBrains Mono for metadata and technical tags.
3.  **H-Fit Constraint:** Widgets must never stretch to fill vertical space unnecessarily. Content defines height.
4.  **Zero Corporate Fluff:** No "Welcome back!" banners. Show the data, show the work, then get out of the way.
5.  **Context Persistence:** A user should be able to jump from an Invoice to the specific Task that triggered it in one click.

---

## V. DEFINITION OF DONE

A feature is "Done" when:

- It is responsive across desktop/tablet.
- RBAC permissions are correctly enforced via Supabase policies.
- It doesn't break the "Dual-Hub" logic.
- The UI follows the modern, minimalist sleek aesthetic.
