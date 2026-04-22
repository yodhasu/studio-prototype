<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-black tracking-tight text-text">Dashboard</h1>
          <p class="mt-1 text-sm text-muted">Operational summary, derived from workspace store.</p>
        </div>
        <NuxtLink to="/projects" class="btn btn-primary">Open Projects</NuxtLink>
      </header>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <article class="dashboard-panel">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">Projects</p>
          <p class="mt-3 font-display text-3xl font-black text-text">{{ workspace.projects.length }}</p>
          <p class="mt-2 text-xs text-muted">Total projects in directory.</p>
        </article>

        <article class="dashboard-panel">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">Tasks</p>
          <p class="mt-3 font-display text-3xl font-black text-text">{{ workspace.tasks.length }}</p>
          <p class="mt-2 text-xs text-muted">Total tasks across projects.</p>
        </article>

        <article class="dashboard-panel">
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">Completed</p>
          <p class="mt-3 font-display text-3xl font-black text-text">{{ doneCount }}</p>
          <p class="mt-2 text-xs text-muted">Tasks with status DONE.</p>
        </article>
      </section>

      <section class="dashboard-panel">
        <div class="flex items-center justify-between">
          <h2 class="font-display text-lg font-black text-text">Projects</h2>
          <NuxtLink to="/projects" class="text-xs font-black text-brand hover:underline">View all</NuxtLink>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard v-for="project in workspace.projects.slice(0, 6)" :key="project.id" :project="project" />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const doneCount = computed(() => workspace.tasks.filter(t => t.status === 'DONE').length)

onMounted(async () => {
  await ensureSession()
})
</script>
