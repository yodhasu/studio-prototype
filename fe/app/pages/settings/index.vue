<template>
  <div class="p-8">
    <div class="mx-auto max-w-6xl">
      <BaseSectionHeader
        title="Account Settings"
        description="Manage your profile, preferences, and workspace configuration."
      />

      <div class="flex gap-8">
        <!-- Settings sidebar tabs -->
        <aside class="w-48 shrink-0 flex flex-col gap-1">
          <button
            v-for="tab in settingsTabs"
            :key="tab.key"
            class="settings-tab"
            :class="{ 'settings-tab--active': activeTab === tab.key, 'settings-tab--danger': tab.danger }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </aside>

        <!-- Settings content -->
        <BaseCard class="flex-1 min-h-[480px]">
          <!-- My Profile -->
          <template v-if="activeTab === 'profile'">
            <h3 class="settings-section-title">My Profile</h3>
            <div class="space-y-6 max-w-lg">
              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Display Name</p>
                  <p class="settings-row-desc">Your display name visible to team members.</p>
                </div>
                <input
                  type="text"
                  class="input-base w-64"
                  :value="accountLabel"
                  readonly
                >
              </div>

              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Email Address</p>
                  <p class="settings-row-desc">The email associated with your account.</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm text-text font-medium">{{ accountEmail }}</span>
                  <BaseButton variant="ghost">Edit</BaseButton>
                </div>
              </div>

              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Account Plan</p>
                  <p class="settings-row-desc">Your current subscription tier.</p>
                </div>
                <span class="settings-plan-badge" :class="`settings-plan-badge--${accountTier.toLowerCase()}`">
                  {{ accountTier }}
                </span>
              </div>
            </div>
          </template>

          <!-- Security -->
          <template v-else-if="activeTab === 'security'">
            <h3 class="settings-section-title">Security</h3>
            <div class="space-y-6 max-w-lg">
              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Password</p>
                  <p class="settings-row-desc">Set a unique password to protect your account.</p>
                </div>
                <BaseButton variant="ghost">Change Password</BaseButton>
              </div>

              <div class="settings-row">
                <div>
                  <p class="settings-row-label">2-step verification</p>
                  <p class="settings-row-desc">Make your account extra secure. Along with your password, you'll need to enter a code.</p>
                </div>
                <button
                  type="button"
                  class="settings-toggle"
                  :class="{ 'settings-toggle--on': twoFactor }"
                  @click="twoFactor = !twoFactor"
                >
                  <span class="settings-toggle-knob" />
                </button>
              </div>

              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Active Sessions</p>
                  <p class="settings-row-desc">You are currently signed in on this device.</p>
                </div>
                <span class="text-xs font-bold text-faint">1 session</span>
              </div>
            </div>
          </template>

          <!-- Workspaces -->
          <template v-else-if="activeTab === 'teams'">
            <h3 class="settings-section-title">Workspaces</h3>
            <div class="space-y-4 max-w-lg">
              <div
                v-for="ws in userWorkspaces"
                :key="ws.id"
                class="flex items-center justify-between rounded-xl border border-border bg-panel/20 p-4"
              >
                <div>
                  <p class="text-sm font-bold text-text">{{ ws.name }}</p>
                  <p class="text-[10px] text-faint mt-1">{{ workspaceMemberCount(ws.id) }} members</p>
                </div>
                <NuxtLink to="/teams">
                  <BaseButton variant="ghost">Manage</BaseButton>
                </NuxtLink>
              </div>
              <BaseEmptyState
                v-if="userWorkspaces.length === 0"
                title="No workspaces found"
                description="You are not a member of any workspaces."
              />
            </div>
          </template>

          <!-- Notifications -->
          <template v-else-if="activeTab === 'notifications'">
            <h3 class="settings-section-title">Notifications</h3>
            <div class="space-y-6 max-w-lg">
              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Email notifications</p>
                  <p class="settings-row-desc">Receive email updates about task assignments and deadlines.</p>
                </div>
                <button
                  type="button"
                  class="settings-toggle"
                  :class="{ 'settings-toggle--on': emailNotifs }"
                  @click="emailNotifs = !emailNotifs"
                >
                  <span class="settings-toggle-knob" />
                </button>
              </div>

              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Activity digest</p>
                  <p class="settings-row-desc">Get a daily summary of workspace activity.</p>
                </div>
                <button
                  type="button"
                  class="settings-toggle"
                  :class="{ 'settings-toggle--on': activityDigest }"
                  @click="activityDigest = !activityDigest"
                >
                  <span class="settings-toggle-knob" />
                </button>
              </div>
            </div>
          </template>

          <!-- Billing -->
          <template v-else-if="activeTab === 'billing'">
            <h3 class="settings-section-title">Billing</h3>
            <div class="space-y-6 max-w-lg">
              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Current Plan</p>
                  <p class="settings-row-desc">Your workspace is on the {{ accountTier }} plan.</p>
                </div>
                <span class="settings-plan-badge" :class="`settings-plan-badge--${accountTier.toLowerCase()}`">
                  {{ accountTier }}
                </span>
              </div>

              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Payment Method</p>
                  <p class="settings-row-desc">No payment method on file.</p>
                </div>
                <BaseButton variant="ghost">Add</BaseButton>
              </div>
            </div>
          </template>

          <!-- Data Export -->
          <template v-else-if="activeTab === 'export'">
            <h3 class="settings-section-title">Data Export</h3>
            <div class="space-y-6 max-w-lg">
              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Export workspace data</p>
                  <p class="settings-row-desc">Download a copy of all your projects, tasks, and notes as JSON.</p>
                </div>
                <BaseButton variant="ghost">Export</BaseButton>
              </div>
            </div>
          </template>

          <!-- Delete Account -->
          <template v-else-if="activeTab === 'delete'">
            <h3 class="settings-section-title text-red">Delete Account</h3>
            <div class="space-y-6 max-w-lg">
              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Deactivate my account</p>
                  <p class="settings-row-desc">This will shut down your account. Your account will be reactive when you sign in again.</p>
                </div>
                <BaseButton variant="ghost" class="text-amber border-amber/30">Deactivate</BaseButton>
              </div>

              <div class="settings-row">
                <div>
                  <p class="settings-row-label">Delete Account</p>
                  <p class="settings-row-desc">This will delete your account. Your account will be permanently deleted.</p>
                </div>
                <BaseButton variant="ghost" class="text-red border-red/30">Delete</BaseButton>
              </div>
            </div>
          </template>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseSectionHeader from '~/components/base/BaseSectionHeader.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseEmptyState from '~/components/base/BaseEmptyState.vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useAuthStore } from '~/stores/auth'

const workspace = useWorkspaceStore()
const auth = useAuthStore()

const settingsTabs = [
  { key: 'profile', label: 'My Profile' },
  { key: 'security', label: 'Security' },
  { key: 'teams', label: 'Workspaces' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'billing', label: 'Billing' },
  { key: 'export', label: 'Data Export' },
  { key: 'delete', label: 'Delete Account', danger: true }
]

const activeTab = ref('profile')
const twoFactor = ref(false)
const emailNotifs = ref(true)
const activityDigest = ref(false)

const accountLabel = computed(() => auth.currentAccount?.label || 'User')
const accountEmail = computed(() => auth.currentAccount?.email || '—')
const accountTier = computed(() => auth.currentAccount?.tier || 'FREE')

const userWorkspaces = computed(() => {
  const uid = workspace.active_user_id
  const memberWsIds = new Set(workspace.workspace_members.filter(wm => wm.user_id === uid).map(wm => wm.workspace_id))
  return workspace.workspaces.filter(w => memberWsIds.has(w.id))
})

function workspaceMemberCount(wsId: string) {
  return workspace.workspace_members.filter(wm => wm.workspace_id === wsId).length
}
</script>

<style scoped>
.settings-tab {
  padding: 0.5rem 0.875rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--c-muted);
  border-radius: var(--r-sm);
  border: 1px solid transparent;
  transition: all 0.15s;
  cursor: pointer;
  background: none;
}

.settings-tab:hover {
  background: var(--c-panel);
  color: var(--c-text);
}

.settings-tab--active {
  background: var(--c-brand);
  color: var(--c-bg);
  border-color: var(--c-brand);
  font-weight: 700;
}

.settings-tab--active:hover {
  background: var(--c-brand-hi);
  color: var(--c-bg);
}

.settings-tab--danger {
  color: var(--c-red);
}

.settings-section-title {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-text);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--c-border);
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(var(--c-border), 0.3);
}

.settings-row:last-child {
  border-bottom: none;
}

.settings-row-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--c-text);
}

.settings-row-desc {
  font-size: 0.75rem;
  color: var(--c-muted);
  margin-top: 0.2rem;
  max-width: 320px;
}

/* Plan badge */
.settings-plan-badge {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.25rem 0.75rem;
  border-radius: 8px;
}

.settings-plan-badge--free {
  background: rgba(74, 222, 128, 0.12);
  color: #22c55e;
  border: 1px solid rgba(74, 222, 128, 0.25);
}

.settings-plan-badge--pro {
  background: rgba(120, 160, 180, 0.12);
  color: var(--c-cyan);
  border: 1px solid rgba(120, 160, 180, 0.25);
}

.settings-plan-badge--business {
  background: rgba(251, 191, 36, 0.1);
  color: #d97706;
  border: 1px solid rgba(251, 191, 36, 0.25);
}

/* Toggle switch */
.settings-toggle {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 12px;
  background: var(--c-border);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.settings-toggle--on {
  background: var(--c-brand);
}

.settings-toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--c-surface);
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.settings-toggle--on .settings-toggle-knob {
  transform: translateX(20px);
}
</style>
