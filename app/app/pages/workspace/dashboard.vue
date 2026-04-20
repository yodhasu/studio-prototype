<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Today's Mission</h1>
          <p class="mt-1 text-sm text-muted">Active production workstreams and priority deliverables.</p>
        </div>
        <div class="view-switcher">
          <button class="view-switcher__btn active">Overview</button>
          <NuxtLink to="/projects" class="view-switcher__btn">Project Hub</NuxtLink>
        </div>
      </header>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashboardMetricCard 
          label="Active Projects" 
          :value="workspace.projects.length" 
          trend="Live" 
          detail="Projects with active movement in the last 72h."
          tone="brand"
        />
        <DashboardMetricCard 
          label="Team Load" 
          value="84%" 
          trend="Busy" 
          detail="Total studio resource utilization."
          tone="warning"
          :progress="84"
        />
        <DashboardMetricCard 
          label="Upcoming Deadlines" 
          :value="workspace.tasks.length" 
          trend="Tracked" 
          detail="Milestones due within the next 7 days."
          tone="cyan"
        />
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div class="xl:col-span-8 space-y-6">
          <article class="dashboard-panel">
            <div class="flex items-center justify-between">
              <h3 class="font-display text-lg font-bold text-text">Live Production Flow</h3>
              <NuxtLink to="/projects" class="text-xs font-bold text-brand hover:underline">View All Projects</NuxtLink>
            </div>
            
            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div v-for="project in workspace.projects.slice(0, 4)" :key="project.id" class="project-card group">
                <div class="flex items-start justify-between">
                  <div class="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs" :style="{ backgroundColor: project.color_code + '20', color: project.color_code }">
                    {{ project.name[0] }}
                  </div>
                  <span class="badge" :style="{ borderColor: project.color_code + '40', color: project.color_code }">{{ project.status }}</span>
                </div>
                <h4 class="mt-4 font-display font-bold text-text group-hover:text-brand transition-colors">{{ project.name }}</h4>
                <div class="mt-4 flex items-center justify-between text-[11px] text-muted">
                  <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1"><FolderKanban class="h-3 w-3" /> {{ project.card_count }} cards</span>
                    <span class="flex items-center gap-1"><CalendarDays class="h-3 w-3" /> {{ project.task_count }} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="xl:col-span-4">
          <article class="dashboard-panel h-full">
            <h3 class="font-display text-lg font-bold text-text">Priority Focus</h3>
            <p class="mt-1 text-xs text-muted">Deliverables requiring immediate attention.</p>
            
            <div class="mt-6 space-y-4">
              <div v-for="task in workspace.tasks.slice(0, 5)" :key="task.id" class="flex items-center gap-4 p-3 rounded-lg border border-border bg-panel/30 hover:border-brand/30 transition-colors cursor-pointer">
                <div class="h-2 w-2 rounded-full" :style="{ backgroundColor: task.status === 'DONE' ? 'rgb(var(--c-green))' : 'rgb(var(--c-amber))' }"></div>
                <div class="flex-1 min-w-0">
                  <p class="truncate text-xs font-bold text-text">{{ task.card_title }}</p>
                  <p class="truncate text-[10px] text-muted">{{ task.project_name }}</p>
                </div>
                <span class="text-[10px] font-mono text-faint">7d</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderKanban, CalendarDays } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

onMounted(async () => {
  await ensureSession()
  await workspace.fetchDashboardSummary()
})
</script>
