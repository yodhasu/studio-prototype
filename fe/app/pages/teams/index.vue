<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <BaseSectionHeader
        title="Team"
        description="Workspace roster, invitations, and access control."
      />

      <BaseCard>
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <BaseButton
              :variant="inviteButtonClass === 'text-faint opacity-50 cursor-not-allowed' ? 'secondary' : 'primary'"
              :class="inviteButtonClass"
              :disabled="inviteButtonClass === 'text-faint opacity-50 cursor-not-allowed'"
              @click="openInvite"
            >
              Add Member
            </BaseButton>

            <BaseBadge variant="default" class="px-3 py-2">
              {{ workspace.ownerPlan }} • {{ memberLimitLabel }}
            </BaseBadge>
          </div>

          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Active workspace
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              {{ workspace.activeWorkspace?.name || 'None' }}
            </p>
            <p class="mt-1 text-xs text-muted">
              {{ workspace.workspaceLabel }}
            </p>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="m in workspace.members"
            :key="m.id"
            class="group relative rounded-xl border border-border bg-panel/20 p-4 text-left transition-colors hover:border-brand/30"
            role="button"
            tabindex="0"
            :aria-label="`View member details: ${m.name}`"
            @click="openMember(m.id)"
            @keydown.enter.prevent="openMember(m.id)"
            @keydown.space.prevent="openMember(m.id)"
          >
            <button
              v-if="canRemove(m.id)"
              type="button"
              class="absolute right-2 top-2 h-7 w-7 rounded-lg border border-border bg-surface/70 text-xs font-black text-red opacity-0 transition-opacity hover:bg-surface group-hover:opacity-100"
              aria-label="Remove member"
              @click.stop="handleRemoveMember(m.id)"
            >
              ×
            </button>

            <p class="text-sm font-bold text-text">
              {{ m.name }}
            </p>
            <p class="mt-1 text-[10px] font-black uppercase tracking-widest text-faint">
              {{ m.role === 'owner' ? 'Owner' : (m.custom_role_label || 'Member') }}
            </p>

            <p
              v-if="m.email"
              class="mt-2 text-xs text-muted"
            >
              {{ m.email }}
            </p>

            <div class="mt-4 flex items-center justify-between text-[10px] text-muted">
              <span>Open tasks</span>
              <span class="font-mono text-text">{{ openTasksFor(m.id) }}</span>
            </div>
          </div>

          <BaseEmptyState
            v-if="workspace.members.length === 0"
            title="No members"
            description="No members in this workspace."
          />
        </div>
      </BaseCard>
    </div>

    <!-- Invite modal -->
    <BaseModal
      v-model:open="inviteOpen"
      title="Invite to workspace"
      max-width="lg"
    >
      <template #header>
        <div class="flex items-center justify-between w-full p-6 border-b border-border/50">
          <div>
            <h2 class="font-display text-lg font-bold text-text">
              Invite to workspace
            </h2>
            <p class="mt-1 text-xs text-muted">
              Search by username or email.
            </p>
          </div>
          <button
            class="text-faint hover:text-text"
            aria-label="Close invite modal"
            @click="closeInvite"
          >
            ✕
          </button>
        </div>
      </template>

      <div class="p-6">

        <input
          v-model="inviteQuery"
          class="input-base sketch-border"
          placeholder="Search: mira / mira@..."
        >

        <p class="mt-2 text-[10px] font-black uppercase tracking-widest text-faint">
          {{ workspace.ownerPlan }} • {{ memberLimitLabel }}
        </p>

        <p
          v-if="workspace.lastInviteError"
          class="mt-3 text-xs text-red-400"
        >
          {{ workspace.lastInviteError }}
        </p>

        <div class="mt-4 max-h-[320px] space-y-2 overflow-y-auto pr-1">
          <button
            v-for="u in inviteResults"
            :key="u.id"
            type="button"
            class="flex w-full items-center justify-between rounded-xl border border-border bg-panel/20 p-3 text-left hover:border-brand/30"
            @click="invite(u.id)"
          >
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-text">
                {{ u.name }}
              </p>
              <p class="truncate text-xs text-muted">
                {{ u.email || '—' }}
              </p>
            </div>
            <span class="btn btn-ghost text-[10px] font-black uppercase tracking-widest">
              Add
            </span>
          </button>

          <p
            v-if="inviteResults.length === 0"
            class="text-sm italic text-faint"
          >
            No matches.
          </p>
        </div>

        <div class="mt-5 flex justify-end">
          <BaseButton @click="closeInvite">
            Close
          </BaseButton>
        </div>
      </div>
    </BaseModal>

    <!-- Member detail modal -->
    <BaseModal
      v-model:open="detailOpen"
      :title="selectedUser?.name || 'Member Detail'"
      max-width="lg"
    >
      <template #header>
        <div class="flex items-start justify-between w-full p-6 border-b border-border/50">
          <div>
            <h2 class="font-display text-lg font-bold text-text">
              {{ selectedUser?.name }}
            </h2>
            <p class="mt-1 text-xs text-muted">
              {{ selectedRoleLabel }}
              <span v-if="selectedUser?.email"> • {{ selectedUser.email }}</span>
            </p>
          </div>
          <button
            class="text-faint hover:text-text"
            aria-label="Close member detail modal"
            @click="detailOpen = false"
          >
            ✕
          </button>
        </div>
      </template>

      <div class="p-6" v-if="selectedUser">

        <div class="dashboard-panel">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Assigned tasks
            </p>
            <span class="text-[10px] font-mono text-muted">{{ selectedTasks.length }}</span>
          </div>

          <div class="mt-4 space-y-2">
            <NuxtLink
              v-for="t in selectedTasks"
              :key="t.id"
              class="flex items-center justify-between rounded-lg border border-border bg-panel/20 p-3 hover:border-brand/30"
              :to="`/projects/${t.project_id}`"
            >
              <div class="min-w-0">
                <p class="truncate text-xs font-bold text-text">
                  {{ t.title }}
                </p>
                <p class="truncate text-[10px] text-muted">
                  {{ projectName(t.project_id) }} • {{ t.status }}
                </p>
              </div>
              <span class="text-[10px] font-mono text-faint">{{ t.due_date || 'TBD' }}</span>
            </NuxtLink>

            <p
              v-if="selectedTasks.length === 0"
              class="text-sm italic text-faint"
            >
              No tasks assigned.
            </p>
          </div>
        </div>

        <div class="mt-5 flex justify-end gap-2">
          <BaseButton @click="detailOpen = false">
            Close
          </BaseButton>

          <BaseButton
            v-if="canRemove(selectedUser.id)"
            variant="ghost"
            class="border-red/40 text-red hover:bg-red/10"
            @click="handleRemoveMember(selectedUser.id); detailOpen = false"
          >
            Remove
          </BaseButton>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import BaseSectionHeader from '~/components/base/BaseSectionHeader.vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import BaseBadge from '~/components/base/BaseBadge.vue'
import BaseModal from '~/components/base/BaseModal.vue'
import BaseEmptyState from '~/components/base/BaseEmptyState.vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const route = useRoute()

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const inviteOpen = ref(false)
const inviteQuery = ref('')

const detailOpen = ref(false)
const selectedUserId = ref<string | null>(null)

const inviteCapReached = computed(() => !workspace.canInviteMore)

const inviteButtonClass = computed(() => {
  if (inviteCapReached.value) return 'bg-red text-white hover:bg-red'
  return 'bg-[#2a1111] text-[#f3c5c5] hover:bg-[#3a1616]'
})

const memberLimitLabel = computed(() => {
  if (workspace.memberLimit === null) return `${workspace.membersUsed} members • unlimited`
  return `${workspace.membersUsed}/${workspace.memberLimit} members`
})

const workspaceMemberIds = computed(() => new Set(workspace.members.map(m => m.id)))

const inviteResults = computed(() => {
  const q = inviteQuery.value.trim().toLowerCase()

  return workspace.users
    .filter(u => !workspaceMemberIds.value.has(u.id))
    .filter((u) => {
      if (!q) return true
      return u.name.toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
    })
    .slice(0, 20)
})

const selectedUser = computed(() => {
  if (!selectedUserId.value) return null
  return workspace.getUserById(selectedUserId.value)
})

const selectedRoleLabel = computed(() => {
  const id = selectedUserId.value
  if (!id) return 'Member'
  const m = workspace.members.find(x => x.id === id)
  if (!m) return 'Member'
  return m.role === 'owner' ? 'Owner' : (m.custom_role_label || 'Member')
})

const selectedTasks = computed(() => {
  if (!selectedUserId.value) return []
  return workspace.activeTasks
    .filter(t => t.assignee_id === selectedUserId.value)
    .slice()
    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))
})

function openTasksFor(userId: string) {
  return workspace.activeTasks.filter(t => t.assignee_id === userId && t.status !== 'COMPLETED').length
}

function canRemove(userId: string) {
  // Can't remove workspace owner, can't remove yourself
  const ws = workspace.activeWorkspace
  if (!ws) return false
  if (userId === ws.owner_user_id) return false
  if (userId === workspace.active_user_id) return false
  // Only workspace owner can remove members
  if (!workspace.isWorkspaceOwner) return false
  return true
}

function projectName(projectId: string) {
  return workspace.getProjectById(projectId)?.name || 'Project'
}

function closeInvite() {
  inviteOpen.value = false
  inviteQuery.value = ''
  workspace.lastInviteError = ''
}

function openInvite() {
  workspace.lastInviteError = ''
  inviteOpen.value = true

  if (inviteCapReached.value) {
    if (workspace.memberLimit === null) return
    workspace.lastInviteError = `Member limit reached for ${workspace.ownerPlan} plan (${workspace.membersUsed}/${workspace.memberLimit}).`
  }
}

function invite(userId: string) {
  workspace.inviteMember({ user_id: userId })
}

function handleRemoveMember(userId: string) {
  workspace.removeMember(userId)
  if (selectedUserId.value === userId) {
    selectedUserId.value = null
    detailOpen.value = false
  }
}

function openMember(userId: string) {
  selectedUserId.value = userId
  detailOpen.value = true
}

onMounted(async () => {
  await ensureSession()

  if (route.query.invite === '1') {
    inviteOpen.value = true
    if (typeof route.query.q === 'string') inviteQuery.value = route.query.q
  }
})
</script>
