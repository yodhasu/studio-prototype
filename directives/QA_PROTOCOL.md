# Directive: Project C3 QA Protocol ("The Studio Bible")

This directive defines the quality standards and verification procedures for the Project C3 studio platform. As the Final QA Layer, I must ensure all "Definitions of Done" are met before the app is declared "Ready to Ship".

## 1. Visual Fidelity Standards
- **Color Palette**: All backgrounds must use Slate-900 (`#0f172a`). No generic colors allowed.
- **Typography**: Inter for interface elements; JetBrains Mono for metadata/pills.
- **Micro-animations**: Hover states on Kanban cards and Nav items must be smooth and premium.
- **H-Fit Constraint**: Components must not stretch vertically unnecessarily.

## 2. Role-Based Access Control (RBAC) Verification
- **Admin**: Full access to Finance, CRM, and Workspace.
- **Artist**: Strictly restricted from Finance and Studio Management views.
- **PM**: Access to project-level finances but not global studio burn rates.
- **Verification Method**: Session switching with role-specific accounts (Admin, PM, Lead Creative, Artist, Client).

## 3. The "Golden Path" Scenarios
I will verify these specific business logic loops:
- **Scenario A (Context Discovery)**: A freelancer added to a project must be able to view the 'Creative Hub' graph and understand visual intent within 2 minutes.
- **Scenario B (Scope Creep)**: Adding tasks to Kanban must automatically flag bandwidth changes in the 'Resource Capacity' heatmap (visible to PM/Owner).
- **Scenario C (Billing Trigger)**: Moving a task to the 'Final' column in the Workspace must trigger an 'Uninvoiced Milestone' flag in the Management Hub.

## 4. Feature Checklist
- [ ] **Dual-Hub Partitioning**: Financial health (Management) must be 100% invisible to Artists/Freelancers.
- [ ] **One-Click Invoicing**: Verify the loop between 'Final' tasks and the Finance Module.
- [ ] **Creative Hub Parity**: Assets must link directly to Kanban cards.

## 5. Responsiveness Protocol
- Verify desktop at `1920x1080` (Standard).
- Verify tablet at `768x1024` (iPad Mini/Pro).
- **H-Fit Constraint**: Ensure widgets never stretch to fill vertical space unnecessarily. Content defines height.

## 6. Performance Gate
- Page load to meaningful paint < 1.5s.
- No "Corporate Fluff": Zero welcome banners or generic interstitial screens.

## 7. QA Reporting Standards (The "Secretive" Protocol)
- **Descriptive over Comparative**: QA reports and directives must **never** mention specific ports, environments, or make direct comparisons to other versions.
- **Provide Requirements, Not Solutions**: State the exact business logic missing or styling failure (e.g., "Kanban drag-and-drop throws render error") without pointing the developer to an alternative environment to copy from.
- **Maintain QA Independence**: The goal is to enforce the Definition of Done blindly against the specifications, preventing developers from "cheating" by simply swapping implementations without understanding the core requirements.
