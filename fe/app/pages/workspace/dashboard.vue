<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            Workspace
          </h1>
          <p class="mt-1 text-sm text-muted">
            Root context for projects, tasks, schedule, and notes.
          </p>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="btn btn-primary"
            @click="createOpen = true"
          >
            New Workspace
          </button>
        </div>
      </header>

      <section class="dashboard-panel">
        <div class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Active workspace
            </p>
            <p class="mt-2 font-display text-xl font-black text-text">
              {{ workspace.activeWorkspace?.name || 'None' }}
            </p>
            <p class="mt-1 text-xs text-muted">
              {{ workspace.activeWorkspace?.kind || '—' }}
            </p>
          </div>

          <div class="min-w-[260px]">
            <label class="block text-[10px] font-black uppercase tracking-widest text-faint">Switch</label>
            <select
              v-model="selectedWorkspaceId"
              class="input-base sketch-border mt-2"
            >
              <option
                v-for="ws in workspace.workspaces"
                :key="ws.id"
                :value="ws.id"
              >
                {{ ws.name }} ({{ ws.kind }})
              </option>
            </select>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <DashboardMetricCard
          label="Projects"
          :value="workspace.activeProjects.length"
          trend="Live"
          detail="Projects in this workspace"
          tone="brand"
          to="/projects"
        />
        <DashboardMetricCard
          label="Open tasks"
          :value="openTasksCount"
          trend="Live"
          detail="Not DONE"
          tone="brand"
          to="/schedule"
        />
        <DashboardMetricCard
          label="Overdue"
          :value="workspace.tasksOverdue.length"
          trend="Attention"
          detail="Past due date"
          tone="danger"
          to="/schedule"
        />
        <DashboardMetricCard
          label="Notes"
          :value="workspace.activeNotes.length"
          trend="Live"
          detail="Context captured"
          tone="brand"
        />
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section class="dashboard-panel xl:col-span-7">
          <div class="flex items-center justify-between">
            <h2 class="font-display text-lg font-bold text-text">
              Upcoming
            </h2>
            <NuxtLink
              to="/schedule"
              class="text-xs font-bold text-brand hover:underline"
            >Open schedule</NuxtLink>
          </div>

          <div class="mt-6 space-y-2">
            <NuxtLink
              v-for="item in workspace.upcomingDeadlines.slice(0, 10)"
              :key="item.kind + ':' + item.id"
              class="flex items-center justify-between rounded-lg border border-border bg-panel/20 p-3 hover:border-brand/30 transition-colors"
              :to="`/projects/${item.project_id}`"
            >
              <div class="min-w-0">
                <p class="truncate text-xs font-bold text-text">{{ item.title }}</p>
                <p class="truncate text-[10px] text-muted">{{ item.kind }} • {{ projectName(item.project_id) }}</p>
              </div>
              <span class="text-[10px] font-mono text-faint">{{ item.due_date }}</span>
            </NuxtLink>

            <p
              v-if="workspace.upcomingDeadlines.length === 0"
              class="text-sm italic text-faint"
            >
              No upcoming deadlines.
            </p>
          </div>
        </section>

        <section class="dashboard-panel xl:col-span-5">
          <h2 class="font-display text-lg font-bold text-text">
            Recent activity
          </h2>
          <div class="mt-6 space-y-3">
            <div
              v-for="a in workspace.recentActivity.slice(0, 8)"
              :key="a.id"
              class="rounded-lg border border-border bg-panel/20 p-3"
            >
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                {{ a.entity_type }} • {{ a.type }}
              </p>
              <p class="mt-2 text-sm text-text">
                {{ a.message }}
              </p>
              <p class="mt-2 text-[10px] text-muted italic">
                {{ a.timestamp }}
              </p>
            </div>

            <p
              v-if="workspace.recentActivity.length === 0"
              class="text-sm italic text-faint"
            >
              No activity yet.
            </p>
          </div>
        </section>
      </div>
    </div>

    <div
      v-if="createOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div class="w-full max-w-md rounded-2xl border border-border bg-surface p-5 shadow-2xl">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="font-display text-lg font-bold text-text">
            Create Workspace
          </h2>
          <button
            class="text-faint hover:text-text"
            aria-label="Close create workspace modal"
            @click="createOpen = false"
          >
            ✕
          </button>
        </div>

        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Name</label>
        <input
          v-model="createName"
          class="mb-4 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text outline-none focus:border-brand"
          placeholder="e.g. Studio Alpha"
        >

        <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Kind</label>
        <select
          v-model="createKind"
          class="input-base sketch-border"
        >
          <option value="PERSONAL">
            PERSONAL
          </option>
          <option value="TEAM">
            TEAM
          </option>
        </select>

        <p
          v-if="createError"
          class="mt-3 text-xs text-red-400"
        >
          {{ createError }}
        </p>

        <div class="mt-5 flex justify-end gap-2">
          <button
            class="btn"
            @click="createOpen = false"
          >
            Cancel
          </button>
          <button
            class="btn btn-primary"
            @click="submitCreate"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const selectedWorkspaceId = ref<string>('')

const createOpen = ref(false)
const createName = ref('')
const createKind = ref<'PERSONAL' | 'TEAM'>('TEAM')
const createError = ref('')

const openTasksCount = computed(() => workspace.activeTasks.filter(t => t.status !== 'DONE').length)

function projectName(projectId: string) {
  return workspace.getProjectById(projectId)?.name || 'Project'
}

function submitCreate() {
  createError.value = ''
  if (!createName.value.trim()) {
    createError.value = 'Workspace name is required.'
    return
  }

  const ws = workspace.createWorkspace({ name: createName.value, kind: createKind.value })
  if (!ws) {
    createError.value = 'Failed to create workspace.'
    return
  }

  createOpen.value = false
  createName.value = ''
  selectedWorkspaceId.value = ws.id
}

watch(selectedWorkspaceId, (id) => {
  if (!id) return
  if (id === workspace.active_workspace_id) return
  workspace.switchWorkspace(id)
})

onMounted(async () => {
  await ensureSession()
  selectedWorkspaceId.value = workspace.active_workspace_id || workspace.workspaces[0]?.id || ''
})
</script>
