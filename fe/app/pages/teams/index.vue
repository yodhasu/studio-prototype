<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            Team
          </h1>
          <p class="mt-1 text-sm text-muted">
            Workspace roster and ownership visibility.
          </p>
        </div>
      </header>

      <section class="dashboard-panel">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Active workspace
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              {{ workspace.activeWorkspace?.name || 'None' }}
            </p>
          </div>
          <NuxtLink
            class="btn btn-primary"
            to="/workspace/dashboard"
          >Workspace</NuxtLink>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="m in workspace.members"
            :key="m.id"
            class="rounded-xl border border-border bg-panel/20 p-4"
          >
            <p class="text-sm font-bold text-text">
              {{ m.name }}
            </p>
            <p class="mt-1 text-[10px] font-black uppercase tracking-widest text-faint">
              {{ m.title || 'Member' }}
            </p>

            <div class="mt-4 flex items-center justify-between text-[10px] text-muted">
              <span>Open tasks</span>
              <span class="font-mono text-text">{{ openTasksFor(m.id) }}</span>
            </div>
          </div>

          <p
            v-if="workspace.members.length === 0"
            class="text-sm italic text-faint"
          >
            No members in this workspace.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

function openTasksFor(userId: string) {
  return workspace.activeTasks.filter(t => t.assignee_id === userId && t.status !== 'DONE').length
}

onMounted(async () => {
  await ensureSession()
})
</script>
