# Frontend Architecture Overview: Studio C3

## 1. Vision & Persona
Studio C3 is a production-first OS designed for creative studios and indie artists. The frontend is built to minimize "corporate friction," focusing on high-density information display, visual context, and sleek minimalist aesthetics.

## 2. Technology Stack

- **Core Framework**: [Nuxt 4](https://nuxt.com/) (Experimental Mode)
    - Leverages the modern `app/` directory structure.
    - SSR disabled for maximum client-side performance and SPA-like reactivity.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
    - Custom Design System defined in `fe/app/assets/css/main.css`.
    - Features: Glassmorphism, smooth transitions, and a curated Slate-based dark mode.
- **State Management**: [Pinia](https://pinia.vuejs.org/)
    - Centralized stores in `fe/app/stores/`.
    - `useWorkspaceStore`: Manage production tasks, projects, and live activity.
    - `useAuthStore`: Handle session and studio permissions.
- **Iconography**: [Lucide Vue Next](https://lucide.dev/guide/packages/lucide-vue-next)
    - Clean, consistent stroke weights for a professional UI.

## 3. Directory Structure (Nuxt 4 Pattern)

```text
fe/app/
├── assets/         # Design tokens, global CSS, and static assets
├── components/     # Atomic and module-level Vue components
├── composables/    # Shared logic (e.g., useWorkspaceBoot)
├── layouts/        # Global wrappers (DashboardSidebar, Shell)
├── pages/          # Directory-based routing (e.g., pages/projects/index.vue)
└── stores/         # Pinia state definitions
```

## 4. Key Design Patterns

### 1. Robust Directory Routing
To ensure route reliability, pages are structured as directories with an `index.vue` file. This pattern prevents "route not found" issues common with standalone top-level files in some environments.

### 2. The Dual-Hub Philosophy
The UI is strictly separated into **Workspace** (Production focus) and **Management** (Business focus), accessible via the main sidebar.

### 3. Context Persistence
The app minimizes context switching by providing direct navigation links between metric summaries, task lists, and project galleries.
