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
          <NuxtLink
            v-for="project in workspace.projects.slice(0, 6)"
            :key="project.id"
            :to="`/projects/${project.id}`"
            class="project-card group"
          >
            <div class="flex items-start justify-between">
              <div
                class="h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg"
                :style="project.color_code ? { backgroundColor: project.color_code + '20', color: project.color_code } : undefined"
              >
                {{ project.name[0] }}
              </div>
              <span class="badge" :style="project.color_code ? { borderColor: project.color_code + '40', color: project.color_code } : undefined">{{ project.status }}</span>
            </div>
            <h3 class="mt-6 font-display text-lg font-black text-text group-hover:text-brand transition-colors">{{ project.name }}</h3>
            <p class="mt-2 text-sm text-muted line-clamp-2">{{ project.description || 'Project command sheet.' }}</p>

            <div class="mt-8 border-t border-border/50 pt-4">
              <div class="flex items-center justify-between text-[11px] font-black text-faint">
                <span class="flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full" :style="{ backgroundColor: project.color_code || 'rgb(var(--c-brand))' }" />
                  {{ project.card_count }} cards
                </span>
                <span>{{ project.task_count }} tasks</span>
              </div>
            </div>
          </NuxtLink>
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
