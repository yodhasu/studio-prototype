<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-black tracking-tight text-text">
            Dashboard
          </h1>
          <p class="mt-1 text-sm text-muted">
            Live summary, derived from workspace state.
          </p>
        </div>

        <NuxtLink to="/projects">
          <BaseButton variant="primary">Open Projects</BaseButton>
        </NuxtLink>
      </header>

      <section class="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <BaseCard>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">
            Projects
          </p>
          <p class="mt-3 font-display text-3xl font-black text-text">
            {{ workspace.activeProjects.length }}
          </p>
          <p class="mt-2 text-xs text-muted">
            Active workspace directory.
          </p>
        </BaseCard>

        <BaseCard>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">
            Open tasks
          </p>
          <p class="mt-3 font-display text-3xl font-black text-text">
            {{ openTasksCount }}
          </p>
          <p class="mt-2 text-xs text-muted">
            Not DONE.
          </p>
        </BaseCard>

        <BaseCard>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">
            Overdue
          </p>
          <p class="mt-3 font-display text-3xl font-black text-text">
            {{ workspace.tasksOverdue.length }}
          </p>
          <p class="mt-2 text-xs text-muted">
            Tasks past due date.
          </p>
        </BaseCard>

        <BaseCard>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">
            Next 7 days
          </p>
          <p class="mt-3 font-display text-3xl font-black text-text">
            {{ workspace.upcomingDeadlines.length }}
          </p>
          <p class="mt-2 text-xs text-muted">
            Tasks + milestones due soon.
          </p>
        </BaseCard>

        <BaseCard>
          <p class="text-[10px] font-black uppercase tracking-[0.2em] text-faint">
            Assigned to me
          </p>
          <p class="mt-3 font-display text-3xl font-black text-text">
            {{ workspace.assignedToMe.length }}
          </p>
          <p class="mt-2 text-xs text-muted">
            Open tasks owned by current user.
          </p>
        </BaseCard>
      </section>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <BaseCard class="xl:col-span-7">
          <BaseSectionHeader title="Upcoming">
            <template #action>
              <NuxtLink
                to="/schedule"
                class="text-xs font-black text-brand hover:underline"
              >Open schedule</NuxtLink>
            </template>
          </BaseSectionHeader>

          <div class="mt-6 space-y-2">
            <NuxtLink
              v-for="item in workspace.upcomingDeadlines.slice(0, 8)"
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

            <BaseEmptyState
              v-if="workspace.upcomingDeadlines.length === 0"
              title="No upcoming deadlines"
              description="You have no tasks or milestones due in the next 7 days."
            />
          </div>
        </BaseCard>

        <BaseCard class="xl:col-span-5">
          <BaseSectionHeader title="Recent activity" />
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

            <BaseEmptyState
              v-if="workspace.recentActivity.length === 0"
              title="No activity yet"
              description="Actions in your workspace will appear here."
            />
          </div>
        </BaseCard>
      </div>

      <BaseCard>
          <BaseSectionHeader title="Projects">
            <template #action>
              <NuxtLink
                to="/projects"
                class="text-xs font-black text-brand hover:underline"
              >View all</NuxtLink>
            </template>
          </BaseSectionHeader>

        <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard
            v-for="project in workspace.activeProjects.slice(0, 6)"
            :key="project.id"
            :project="project"
          />
        </div>
      </BaseCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import BaseCard from '~/components/base/BaseCard.vue'
import BaseSectionHeader from '~/components/base/BaseSectionHeader.vue'
import BaseEmptyState from '~/components/base/BaseEmptyState.vue'
import BaseButton from '~/components/base/BaseButton.vue'
import ProjectCard from '~/components/ProjectCard.vue'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const openTasksCount = computed(() => workspace.activeTasks.filter(t => t.status !== 'COMPLETED').length)

function projectName(projectId: string) {
  return workspace.getProjectById(projectId)?.name || 'Project'
}

onMounted(async () => {
  await ensureSession()
})
</script>
