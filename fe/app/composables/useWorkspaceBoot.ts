import { useAuthStore } from '~/stores/auth'
import { useWorkspaceStore } from '~/stores/workspace'

export const useWorkspaceBoot = () => {
  const auth = useAuthStore()
  const workspace = useWorkspaceStore()

  const ensureSession = async (options?: { loadProjects?: boolean }) => {
    const loadProjects = options?.loadProjects ?? true
    // Mock hydration
    if (!auth.isLoggedIn) {
      // For the better iteration mockup, we might want to skip the login for now
      // or just assume we are logged in.
      return true
    }

    if (loadProjects && !workspace.projects.length) {
      await workspace.fetchProjects()
    }
    return true
  }

  return { ensureSession }
}
