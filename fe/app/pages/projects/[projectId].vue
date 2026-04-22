<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <div v-if="!project" class="sketch-border bg-surface p-6">
        <p class="text-[10px] font-black uppercase tracking-widest text-faint">Project Not Found</p>
        <p class="mt-2 text-sm text-muted">The requested command sheet does not exist.</p>
        <NuxtLink class="btn btn-primary mt-4 inline-flex" to="/projects">Back to Projects</NuxtLink>
      </div>

      <template v-else>
        <header class="sketch-border bg-surface p-6">
          <div class="flex items-center justify-between gap-4">
            <div class="min-w-0">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">Production / Projects</p>
              <div class="mt-2 flex items-center gap-3">
                <div class="h-3 w-3 rounded-full" :style="{ backgroundColor: project.color_code || 'rgb(var(--c-border))' }" />
                <h1 class="truncate font-display text-2xl font-black tracking-tight text-text">{{ project.name }}</h1>
              </div>
              <p class="mt-2 text-sm text-muted">{{ project.description || 'Project command sheet.' }}</p>
            </div>

            <div class="shrink-0 flex items-center gap-2">
              <span class="badge" :style="project.color_code ? { borderColor: project.color_code + '40', color: project.color_code } : undefined">{{ project.status }}</span>
              <NuxtLink class="btn btn-primary" :to="`/workspace/${project.id}`">Enter Workspace</NuxtLink>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">Cards</p>
              <p class="mt-2 font-display text-lg font-black text-text">{{ project.card_count }}</p>
            </div>
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">Tasks</p>
              <p class="mt-2 font-display text-lg font-black text-text">{{ project.task_count }}</p>
            </div>
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">Stage</p>
              <p class="mt-2 text-xs font-black text-text">{{ stageLabel }}</p>
            </div>
            <div class="rounded-xl border border-border bg-panel/20 p-3">
              <p class="text-[10px] font-black uppercase tracking-widest text-faint">Next due</p>
              <p class="mt-2 text-xs font-black text-text">{{ nextDueLabel }}</p>
            </div>
          </div>
        </header>

        <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <section class="dashboard-panel xl:col-span-7">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-lg font-black text-text">Deliverables</h2>
              <NuxtLink class="text-xs font-black text-brand hover:underline" to="/schedule">Open Schedule</NuxtLink>
            </div>
            <div class="mt-6">
              <ProjectTaskList :project-id="project.id" />
            </div>
          </section>

          <aside class="space-y-6 xl:col-span-5">
            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">Collaborators</h2>
              <p class="mt-1 text-xs text-muted">Mock roster from store activity.</p>
              <div class="mt-5">
                <ProjectMemberBox :project-id="project.id" />
              </div>
            </section>

            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">Activity</h2>
              <div v-if="projectActivities.length" class="mt-5 space-y-4">
                <div v-for="a in projectActivities.slice(0, 6)" :key="a.id" class="rounded-lg border border-border bg-panel/20 p-3">
                  <p class="text-[10px] font-black uppercase tracking-widest text-faint">{{ a.type }}</p>
                  <p class="mt-2 text-sm text-text">{{ a.message }}</p>
                  <p class="mt-2 text-[10px] text-muted italic">by {{ a.user }}</p>
                </div>
              </div>
              <p v-else class="mt-5 text-sm text-muted italic">No activity recorded.</p>
            </section>

            <section class="dashboard-panel">
              <h2 class="font-display text-lg font-black text-text">Workspace Launch</h2>
              <p class="mt-1 text-xs text-muted">Enter the concept graph with project context preserved.</p>
              <NuxtLink class="btn btn-primary mt-5 inline-flex w-full justify-center" :to="`/workspace/${project.id}`">
                Enter Workspace
              </NuxtLink>
            </section>
          </aside>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const route = useRoute()
const projectId = computed(() => route.params.projectId as string)

const project = computed(() => workspace.projects.find(p => p.id === projectId.value) || null)

const projectActivities = computed(() => {
  const p = project.value
  if (!p) return []
  return workspace.activities.filter(a => a.project_id === p.id)
})

const stageLabel = computed(() => {
  const total = workspace.tasks.filter(t => t.project_id === projectId.value).length
  const done = workspace.tasks.filter(t => t.project_id === projectId.value && t.status === 'DONE').length
  if (!total) return 'Draft'
  const ratio = done / total
  if (ratio >= 1) return 'Final'
  if (ratio >= 0.7) return 'Polish'
  if (ratio >= 0.3) return 'Review'
  return 'Draft'
})

const nextDueLabel = computed(() => {
  const dues = workspace.tasks
    .filter(t => t.project_id === projectId.value)
    .map(t => t.due_date)
    .filter((d): d is string => Boolean(d))
    .map(d => new Date(d).getTime())
    .filter(ms => Number.isFinite(ms))
    .sort((a, b) => a - b)

  const next = dues[0]
  if (!next) return 'None'
  return new Date(next).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
})

onMounted(async () => {
  await ensureSession()
  const p = project.value
  if (p) workspace.currentProject = p
})
</script>
