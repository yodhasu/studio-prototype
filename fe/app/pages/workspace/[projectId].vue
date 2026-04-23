<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-4xl space-y-6">
      <header class="sketch-border bg-surface p-6">
        <p class="text-[10px] font-bold uppercase tracking-widest text-faint">
          403 Forbidden
        </p>
        <div class="mt-3 flex items-center gap-3">
          <div
            class="h-3 w-3 rounded-full"
            :style="{ backgroundColor: project?.color_code || 'rgb(var(--c-border))' }"
          />
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">
            {{ project?.name || 'Creative Workspace' }}
          </h1>
        </div>
        <p class="mt-3 text-sm text-muted">
          The creative workspace is under reconstruction. Context is preserved, but the board is locked for now.
        </p>

        <div class="mt-5 flex flex-wrap gap-3">
          <NuxtLink
            class="btn btn-primary"
            :to="`/projects/${projectId}`"
          >Back to Project Command Sheet</NuxtLink>
          <NuxtLink
            class="btn"
            to="/dashboard"
          >Back to Dashboard</NuxtLink>
        </div>
      </header>

      <section class="dashboard-panel">
        <p class="text-xs font-bold uppercase tracking-widest text-muted">
          Preserved Context
        </p>
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div class="rounded-xl border border-border bg-panel/20 p-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-faint">
              Project
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              {{ project?.name || 'Unknown' }}
            </p>
          </div>
          <div class="rounded-xl border border-border bg-panel/20 p-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-faint">
              Project ID
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              {{ projectId }}
            </p>
          </div>
          <div class="rounded-xl border border-border bg-panel/20 p-4">
            <p class="text-[10px] font-bold uppercase tracking-widest text-faint">
              State
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              Locked / Rebuilding
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const route = useRoute()
const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const projectId = computed(() => route.params.projectId as string)
const project = computed(() => workspace.projects.find(p => p.id === projectId.value) || null)

onMounted(async () => {
  await ensureSession()
  workspace.setCurrentProject(projectId.value)
})
</script>
