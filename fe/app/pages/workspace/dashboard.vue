<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Workspace Overview</h1>
          <p class="mt-1 text-sm text-muted">A top-level view of your current projects and upcoming tasks.</p>
        </div>
      </header>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashboardMetricCard 
          label="Active Projects" 
          :value="workspace.projects.length" 
          trend="Live" 
          detail="Total number of ongoing projects in your workspace."
          tone="brand"
          to="/projects"
        />
        <DashboardMetricCard 
          label="Project Progression" 
          :value="progressionValue" 
          trend="Live" 
          detail="Tasks finished across all projects"
          tone="brand"
        />
        <DashboardMetricCard 
          label="Upcoming Deadlines" 
          :value="workspace.tasks.length" 
          trend="Tracked" 
          detail="Tasks and milestones due within the next 7 days."
          tone="brand"
          to="/schedule"
        />
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div class="xl:col-span-8 space-y-6">
          <article class="dashboard-panel">
            <div class="flex items-center justify-between">
              <h3 class="font-display text-lg font-bold text-text">Recent Projects</h3>
              <NuxtLink to="/projects" class="text-xs font-bold text-brand hover:underline">View Directory</NuxtLink>
            </div>
            
            <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div 
                v-for="project in workspace.projects.slice(0, 4)" 
                :key="project.id" 
                class="project-card group cursor-pointer"
                @click="openProject(project.id)"
              >
                <div class="flex items-start justify-between">
                  <div class="h-10 w-10 rounded-lg flex items-center justify-center font-bold text-xs" :style="project.color_code ? { backgroundColor: project.color_code + '20', color: project.color_code } : undefined">
                    {{ project.name[0] }}
                  </div>
                  <span class="badge" :style="project.color_code ? { borderColor: project.color_code + '40', color: project.color_code } : undefined">{{ project.status }}</span>
                </div>
                <h4 class="mt-4 font-display font-bold text-text group-hover:text-brand transition-colors">{{ project.name }}</h4>
                <div class="mt-4 flex items-center justify-between text-[11px] text-muted">
                  <div class="flex items-center gap-3">
                    <span class="flex items-center gap-1"><FolderKanban class="h-3 w-3" /> {{ project.card_count }} boards</span>
                    <span class="flex items-center gap-1"><CalendarDays class="h-3 w-3" /> {{ project.task_count }} tasks</span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>

        <div class="xl:col-span-4">
          <article class="dashboard-panel h-full">
            <h3 class="font-display text-lg font-bold text-text">Upcoming Tasks</h3>
            <p class="mt-1 text-xs text-muted">Items requiring your attention soon.</p>
            
            <div class="mt-6 space-y-4">
              <div v-for="task in workspace.tasks.slice(0, 5)" :key="task.id" class="flex items-center gap-4 p-3 rounded-lg border border-border bg-panel/30 hover:border-brand/30 transition-colors cursor-pointer">
                <div class="h-2 w-2 rounded-full" :style="{ backgroundColor: task.status === 'DONE' ? 'rgb(var(--c-green))' : 'rgb(var(--c-amber))' }"></div>
                <div class="flex-1 min-w-0">
                  <p class="truncate text-xs font-bold text-text">{{ task.title }}</p>
                  <p class="truncate text-[10px] text-muted">{{ task.project_name }}</p>
                </div>                <span class="text-[10px] font-mono text-faint">7d</span>
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


const progressionValue = computed(() => {
  const total = workspace.tasks.length
  const finished = workspace.tasks.filter(t => t.status === 'DONE').length
  return `${finished} / ${total}`
})

function openProject(id: string) {
  // Dashboard flow:
  // 1) User clicks a project
  // 2) Redirect to project directory
  // 3) Open sidebar for chosen project
  navigateTo({ path: '/projects', query: { open: id } })
}

onMounted(async () => {
  await ensureSession()
  await workspace.fetchDashboardSummary()
})
</script>
