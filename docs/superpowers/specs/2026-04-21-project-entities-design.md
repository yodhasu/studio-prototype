# Design Doc: Project, Task, and Workspace Entities

**Date:** 2026-04-21  
**Status:** Draft  
**Scope:** Architecture and Data Schema for Project-level children.

---

## 1. Objective
Define the parent-child relationships and attribute requirements for the core Project Management entities in Studio C3. This setup focuses on a "Strictly Parallel" architecture that separates administrative scheduling (Tasks) from creative production (Workspace Cards).

## 2. Entity Hierarchy

- **Project (Parent)**
    - **Tasks (1:N)**: Administrative deliverables with timeline data.
    - **Workspace (1:1)**: The creative container for visual organization.
        - **Cards (1:N)**: Rich visual/content nodes within the workspace.

---

## 3. Data Schema

### 3.1 Task Entity
Focuses on "Who, What, and When."
- `id`: UUID (Primary Key)
- `project_id`: UUID (Foreign Key to Project)
- `title`: String
- `detail`: Text
- `start_date`: Timestamp
- `end_date`: Timestamp
- `user_assigned`: UUID (Foreign Key to User/Artist)

### 3.2 Workspace Entity
Acts as a 1:1 mapping to a project to house visual cards.
- `id`: UUID (Primary Key)
- `project_id`: UUID (Foreign Key to Project)

### 3.3 Card Entity
Focuses on creative content and visual metadata.
- `id`: UUID (Primary Key)
- `workspace_id`: UUID (Foreign Key to Workspace)
- `title`: String
- `description`: Text (Brief summary)
- `text`: Rich Text / Markdown (Mini-WYSIWYG content)
- `media_container`: JSONB (References to images/videos)
- `file_container`: JSONB (References to documents)
- **Positioning**: `x_pos`, `y_pos`, `width` (For Canvas rendering)

---

## 4. Relationship Logic: Strictly Parallel
To maintain simplicity and decouple the "Business" Hub from the "Creative" Hub:
- **No Direct Link**: There is no hard database link between a `Task` and a `Card`.
- **Project-Level Aggregation**: Use the shared `project_id` to aggregate data for studio-wide reporting or dashboard metrics.
- **Card-to-Card Links**: Aesthetic links between cards are recorded in a `card_links` table (`source_id`, `target_id`, `type`) for future data portability and visual graph rendering.

## 5. UI/UX Considerations
- **WYSIWYG**: A minimalist editor (e.g., TipTap or similar) for the card's `text` field.
- **Media/File Handlers**: Drag-and-drop zones within the card for asset management.
- **Canvas View**: A zoomed-out view showing all Cards within the project's Workspace.

---

## 6. Success Criteria
- [ ] Users can create a standalone Task with a deadline.
- [ ] Artists can create rich Cards in the Workspace without assignment/date pressure.
- [ ] Dashboard correctly counts both Tasks (for progression) and Cards (for activity) using the `project_id`.
