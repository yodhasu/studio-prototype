export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore()
  const workspace = useWorkspaceStore()

  auth.initFromStorage()

  const isLogin = to.path === '/login'

  if (!auth.isAuthenticated && !isLogin) {
    return navigateTo('/login', { replace: true })
  }

  if (auth.isAuthenticated) {
    const wasBooted = workspace.booted
    await workspace.boot()

    const acc = auth.currentAccount
    if (acc && !wasBooted) {
      workspace.setSessionContext(acc.user_id, acc.workspace_id)
    }

    if (isLogin) {
      return navigateTo('/dashboard', { replace: true })
    }
  }

  return undefined
})
