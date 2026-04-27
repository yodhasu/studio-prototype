import { computed, type ComputedRef } from 'vue'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { Project } from '~/stores/workspace'

export function useRouteTitle(opts: {
  route: RouteLocationNormalizedLoaded
  activeProject: ComputedRef<Project | null>
}) {
  const title = computed(() => {
    const path = opts.route.path

    if (path === '/dashboard') return 'Dashboard'

    if (path === '/projects') return 'Projects'
    if (path.startsWith('/projects/')) return opts.activeProject.value?.name || 'Project'

    if (path === '/schedule') return 'Schedule'

    if (path === '/workspace/dashboard') return 'Workspace'
    if (path.startsWith('/workspace/')) return opts.activeProject.value?.name || 'Workspace'

    if (path === '/teams') return 'Team'

    if (path.startsWith('/settings')) return 'Settings'

    return 'Studio'
  })

  const subtitle = computed(() => {
    const path = opts.route.path

    if (path === '/dashboard') return 'Studio overview'

    if (path === '/projects') return 'Directory'
    if (path.startsWith('/projects/')) return 'Project Command Sheet'

    if (path === '/schedule') return 'Kanban / Calendar'

    if (path === '/workspace/dashboard') return 'Workspace overview'
    if (path.startsWith('/workspace/')) return 'Creative workspace'

    if (path === '/teams') return 'Roster'

    if (path.startsWith('/settings')) return 'Account'

    return null
  })

  return { title, subtitle }
}
