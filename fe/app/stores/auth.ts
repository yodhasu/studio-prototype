import { defineStore } from 'pinia'

export type SubscriptionTier = 'FREE' | 'PRO' | 'ENTERPRISE'

export type MockLoginAccount = {
  id: string
  label: string
  email: string
  password: string
  tier: SubscriptionTier
  user_id: string
  workspace_id: string
}

export const MOCK_LOGIN_ACCOUNTS: MockLoginAccount[] = [
  {
    id: 'acc-free',
    label: 'Free Demo',
    email: 'free@ttmc3.local',
    password: 'free123',
    tier: 'FREE',
    user_id: 'u-you',
    workspace_id: 'ws-team-free'
  },
  {
    id: 'acc-pro',
    label: 'Pro Demo',
    email: 'pro@ttmc3.local',
    password: 'pro123',
    tier: 'PRO',
    user_id: 'u-pro-owner',
    workspace_id: 'ws-team-pro'
  },
  {
    id: 'acc-enterprise',
    label: 'Enterprise Demo',
    email: 'enterprise@ttmc3.local',
    password: 'enterprise123',
    tier: 'ENTERPRISE',
    user_id: 'u-ent-owner',
    workspace_id: 'ws-team-enterprise'
  }
]

const AUTH_STORAGE_KEY = 'ttmc3.mock.auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    active_account_id: '' as string,
    initialized: false,
    lastError: '' as string
  }),

  getters: {
    isAuthenticated: state => Boolean(state.active_account_id),

    currentAccount(state): MockLoginAccount | null {
      if (!state.active_account_id) return null
      return MOCK_LOGIN_ACCOUNTS.find(a => a.id === state.active_account_id) || null
    }
  },

  actions: {
    initFromStorage() {
      if (this.initialized) return
      this.initialized = true

      if (import.meta.server) return

      const id = window.localStorage.getItem(AUTH_STORAGE_KEY) || ''
      if (id && MOCK_LOGIN_ACCOUNTS.some(a => a.id === id)) {
        this.active_account_id = id
      }
    },

    login(email: string, password: string) {
      this.lastError = ''
      const e = email.trim().toLowerCase()
      const hit = MOCK_LOGIN_ACCOUNTS.find(a => a.email.toLowerCase() === e && a.password === password)
      if (!hit) {
        this.lastError = 'Invalid email or password.'
        return false
      }

      this.active_account_id = hit.id
      if (import.meta.client) window.localStorage.setItem(AUTH_STORAGE_KEY, hit.id)
      return true
    },

    quickLogin(accountId: string) {
      this.lastError = ''
      const hit = MOCK_LOGIN_ACCOUNTS.find(a => a.id === accountId)
      if (!hit) return false

      this.active_account_id = hit.id
      if (import.meta.client) window.localStorage.setItem(AUTH_STORAGE_KEY, hit.id)
      return true
    },

    logout() {
      this.active_account_id = ''
      this.lastError = ''
      if (import.meta.client) window.localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }
})
