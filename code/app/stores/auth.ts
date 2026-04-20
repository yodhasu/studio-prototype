import { defineStore } from 'pinia'

export interface AuthOrgLink {
  org_id: string
  role: string
}

export interface AuthUser {
  id: string
  email: string
  full_name?: string | null
  subscription_tier: string
  org_links: AuthOrgLink[]
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {
      id: 'mock-user-123',
      email: 'dev@studio.local',
      full_name: 'Studio Designer',
      subscription_tier: 'STUDIO_PRO',
      org_links: [{ org_id: 'mock-org-1', role: 'TIER_1' }]
    } as AuthUser | null,
    token: 'mock-token',
    activeOrgId: 'mock-org-1',
  }),
  getters: {
    isLoggedIn: (state) => Boolean(state.token),
    orgId: (state) => state.activeOrgId || state.user?.org_links?.[0]?.org_id || null,
  },
  actions: {
    logout() {
      this.user = null
      this.token = null
      this.activeOrgId = null
      navigateTo('/login')
    }
  }
})
