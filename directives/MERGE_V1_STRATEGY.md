# Directive: V1 Production Target Specifications

This directive outlines the required architecture, UI/UX standards, and business logic for the Project C3 V1 build. Developers must ensure all features strictly adhere to these criteria to pass the QA gate.

## 1. UI/UX Standards (The Foundation)
The application must present as a premium, high-agency tool.
- **Styling**: Implement robust use of glassmorphism variants and fluid animations using `@vueuse/motion`.
- **Containers**: Cards and visual modules must utilize `rounded-xl` and `p-6` as the standard constraint.
- **Theme Constraints**: Dark mode is mandatory. Base backgrounds must be `bg-slate-900` (`#0f172a`). Borders must cleanly delineate hierarchy using `border-slate-800`. Primary text is `text-slate-200` with interactive accents (like success states) mapping to `text-indigo-400` or `emerald-400`.
- **Navigation Hierarchy**: Sidebar interactions must cleanly segment the experience into three isolated zones: `PRODUCTION`, `MANAGEMENT`, and `CREATIVE`.

## 2. Feature & Logic Requirements
The platform must implement deep studio-logic, not just generic dashboard counters.
- **Dashboard ("Today's Mission")**: Must aggregate dense, studio-specific KPIs including real-time 'Studio Burn Rate', 'Unpaid Invoices', and clear delineations of active pipelines. This data must populate visually within the premium card layouts previously defined.
- **Finance Office / Management Hub**: Must contain actionable modules spanning exact project budgets, aggregated resource heat-maps, and specific CRM metrics.
- **Kanban Depth**: Each task card must retain deep data fields (Time-priority markers, assignees, specific deliverable tags).
- **Creative Hub**: Must feature a functional, node-linked "Project Canvas". It is unacceptable for this view to remain an empty, static shell; it must load meaningful graph mappings of project assets and tasks.

## 3. Critical Blockers & Fix Requirements
Specific functional gaps have been identified that will block V1 release. Developers must address these explicitly:
- **Kanban Drag-and-Drop Integrity**: The ability to move tasks across columns must be flawless. Current implementations utilizing libraries like `vuedraggable` must be verified against Vue 3 composition patterns to ensure no render warnings or silent fails occur during drag ends.
- **Billing Logic Flow (Scenario C)**: The system must successfully recognize when a Kanban task is moved into the 'Final' column and trigger an 'Uninvoiced Milestone' flag globally in the Management Hub. This interaction is mandatory for passing QA.
- **Role Masking Enforcements**: Strict execution of the Supabase RBAC protocols. For example, any user entering an "Artist" state must demonstrably lose all access to financial metrics or Studio Burn Rates.
- **Data Seeding**: The UI must consistently connect to seeded state/data. Deployments cannot present "0/100" generic mockups on prime dashboards; mock data must be deeply instantiated during development to prove complex components function correctly.
