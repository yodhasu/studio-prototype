import { useWorkspaceStore } from '~/stores/workspace'

export const useWorkspaceBoot = () => {
  const workspace = useWorkspaceStore()

  const ensureSession = async () => {
    await workspace.boot()
    return true
  }

  return { ensureSession }
}
