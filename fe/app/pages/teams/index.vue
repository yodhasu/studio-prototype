<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            Team
          </h1>
          <p class="mt-1 text-sm text-muted">
            Workspace roster, invitations, and access control.
          </p>
        </div>
      </header>

      <section class="dashboard-panel">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Active workspace
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              {{ workspace.activeWorkspace?.name || 'None' }}
            </p>
            <p class="mt-1 text-xs text-muted">
              {{ workspace.activeWorkspace?.kind === 'TEAM' ? 'Team workspace' : 'Personal workspace' }}
            </p>
          </div>

          <button
            class="btn btn-primary"
            type="button"
            :disabled="workspace.activeWorkspace?.kind !== 'TEAM'"
            @click="inviteOpen = true"
          >
            Add Team
          </button>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <button
            v-for="m in workspace.members"
            :key="m.id"
            type="button"
            class="group relative rounded-xl border border-border bg-panel/20 p-4 text-left transition-colors hover:border-brand/30"
            :aria-label="`View member details: ${m.name}`"
            @click="openMember(m.id)"
          >
            <button
              v-if="canRemove(m.id)"
              type="button"
              class="absolute right-2 top-2 h-7 w-7 rounded-lg border border-border bg-surface/70 text-xs font-black text-red opacity-0 transition-opacity hover:bg-surface group-hover:opacity-100"
              aria-label="Remove member"
              @click.stop="removeMember(m.id)"
            >
              ×
            </button>

            <p class="text-sm font-bold text-text">
              {{ m.name }}
            </p>
            <p class="mt-1 text-[10px] font-black uppercase tracking-widest text-faint">
              {{ m.title || (m.id === workspace.active_user_id ? 'Owner' : 'Member') }}
            </p>

            <p
              v-if="workspace.getUserById(m.id)?.email"
              class="mt-2 text-xs text-muted"
            >
              {{ workspace.getUserById(m.id)?.email }}
            </p>

            <div class="mt-4 flex items-center justify-between text-[10px] text-muted">
              <span>Open tasks</span>
              <span class="font-mono text-text">{{ openTasksFor(m.id) }}</span>
            </div>
          </button>

          <p
            v-if="workspace.members.length === 0"
            class="text-sm italic text-faint"
          >
            No members in this workspace.
          </p>
        </div>
      </section>
    </div>

    <!-- Invite modal -->
    <div
      v-if="inviteOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 class="font-display text-lg font-bold text-text">
              Invite to team
            </h2>
            <p class="mt-1 text-xs text-muted">
              Search by name or email.
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

        <input
          v-model="inviteQuery"
          class="input-base sketch-border"
          placeholder="Search: mira / mira@..."
        >

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
          <button
            class="btn"
            type="button"
            @click="closeInvite"
          >
            Close
          </button>
        </div>
      </div>
    </div>

    <!-- Member detail modal -->
    <div
      v-if="detailOpen && selectedUser"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-lg rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div class="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 class="font-display text-lg font-bold text-text">
              {{ selectedUser.name }}
            </h2>
            <p class="mt-1 text-xs text-muted">
              {{ selectedTitle }}
              <span v-if="selectedUser.email"> • {{ selectedUser.email }}</span>
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
          <button
            class="btn"
            type="button"
            @click="detailOpen = false"
          >
            Close
          </button>

          <button
            v-if="canRemove(selectedUser.id)"
            class="btn btn-ghost border-red/40 text-red hover:bg-red/10"
            type="button"
            @click="removeMember(selectedUser.id); detailOpen = false"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const inviteOpen = ref(false)
const inviteQuery = ref('')

const detailOpen = ref(false)
const selectedUserId = ref<string | null>(null)

const teamMemberIds = computed(() => new Set(workspace.members.map(m => m.id)))

const inviteResults = computed(() => {
  const q = inviteQuery.value.trim().toLowerCase()
  const isTeamWs = workspace.activeWorkspace?.kind === 'TEAM'
  if (!isTeamWs) return []

  return workspace.users
    .filter(u => !teamMemberIds.value.has(u.id))
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

const selectedTitle = computed(() => {
  const id = selectedUserId.value
  if (!id) return 'Member'
  const m = workspace.members.find(x => x.id === id)
  return m?.title || (id === workspace.active_user_id ? 'Owner' : 'Member')
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
  const isTeamWs = workspace.activeWorkspace?.kind === 'TEAM'
  if (!isTeamWs) return false
  if (userId === workspace.active_user_id) return false
  return true
}

function projectName(projectId: string) {
  return workspace.getProjectById(projectId)?.name || 'Project'
}

function closeInvite() {
  inviteOpen.value = false
  inviteQuery.value = ''
}

function invite(userId: string) {
  workspace.inviteToActiveTeam({ user_id: userId })
  // Keep the modal open for batch invites.
}

function removeMember(userId: string) {
  workspace.removeFromActiveTeam(userId)
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
})
</script>
