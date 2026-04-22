export default defineNuxtRouteMiddleware((to) => {
  // Legacy entrypoints (old shell)
  if (to.path === '/') return navigateTo('/dashboard', { replace: true })
  if (to.path === '/workspace/dashboard') return navigateTo('/dashboard', { replace: true })

  return undefined
})
