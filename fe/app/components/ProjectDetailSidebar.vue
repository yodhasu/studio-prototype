<template>
  <Teleport to="body">
    <Transition name="sidebar-overlay">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-40 bg-bg/70 backdrop-blur-sm"
        @click="isOpen = false"
      />
    </Transition>

    <Transition name="sidebar-panel">
      <aside
        v-if="isOpen"
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border/10 bg-surface shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Project details"
      >
        <header class="relative px-8 pb-4 pr-20 pt-10">
          <div class="absolute right-14 top-9">
            <span class="text-[9px] font-bold uppercase tracking-widest text-faint">Edit flow pending</span>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-icon absolute right-4 top-4"
            aria-label="Close project details"
            @click="isOpen = false"
          >
            x
          </button>
          <h2 class="line-clamp-1 text-xl font-bold tracking-tight text-text">
            {{ project?.name || 'Workspace Context' }}
          </h2>
          <p class="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">
            {{ project?.description || 'Active production workspace.' }}
          </p>
        </header>

        <div class="custom-scrollbar flex-1 space-y-8 overflow-y-auto px-8 pb-24 pt-2">
          <div class="flex items-center gap-6 border-b border-border/10 px-1 py-2 pb-6 opacity-80">
            <div class="flex items-center gap-2">
              <span class="h-1.5 w-1.5 rounded-full bg-green-500" />
              <span class="text-[10px] font-bold uppercase tracking-widest text-muted">{{ project?.status || 'Active' }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Bolt class="h-3.5 w-3.5 text-amber" />
              <span class="text-[10px] font-bold uppercase tracking-widest text-muted">{{ projectPriority }}</span>
            </div>
            <div class="flex items-center gap-2">
              <Calendar class="h-3.5 w-3.5 text-muted" />
              <span class="text-[10px] font-bold uppercase tracking-widest text-faint">JUN 30</span>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="px-1 text-[10px] font-bold uppercase tracking-widest text-muted">Collaborators</span>
              <button
                type="button"
                class="text-[10px] font-bold uppercase tracking-widest text-muted hover:text-brand"
                @click="showMembers = true"
              >
                Open Team
              </button>
            </div>
            <button
              type="button"
              class="flex w-full cursor-pointer items-center gap-3 bg-panel/30 p-3 text-left transition-colors hover:bg-panel/50 sketch-border"
              @click="showMembers = true"
            >
              <div class="flex h-9 w-9 items-center justify-center rounded-full border border-border/30 bg-brand/15 text-brand">
                <Users class="h-4 w-4" />
              </div>
              <div class="space-y-1">
                <p class="text-[11px] font-bold uppercase tracking-widest text-text">
                  Team Directory
                </p>
                <p class="text-[10px] text-faint">
                  {{ project?.member_ids?.length ?? 0 }} collaborators hidden until opened
                </p>
              </div>
              <ChevronRight class="ml-auto h-4 w-4 text-faint" />
            </button>
          </div>

          <div class="mx-1 flex rounded-xl bg-overlay/40 p-1 shadow-inner sketch-border">
            <button
              v-for="item in tabItems"
              :key="item.slot"
              class="flex-1 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-[0.14em] transition-all"
              :class="activeTab === item.slot ? 'border border-border/10 bg-surface text-brand shadow-md' : 'text-faint hover:text-muted'"
              type="button"
              @click="activeTab = item.slot"
            >
              {{ item.label }}
            </button>
          </div>

          <div class="min-h-[300px] px-1">
            <div
              v-if="activeTab === 'details'"
              class="space-y-8"
            >
              <ProjectTaskList
                v-if="project"
                :project-id="project.id"
              />

              <div class="border-t border-border/10 pt-6">
                <button
                  type="button"
                  class="btn btn-ghost h-10 w-full rounded-lg text-[10px] font-bold uppercase tracking-widest text-faint transition-colors hover:text-brand"
                  @click="handleMonetization"
                >
                  <Banknote class="h-4 w-4" />
                  View Financials
                </button>
              </div>
            </div>

            <div v-else-if="activeTab === 'activity'">
              <div
                v-if="projectActivities.length > 0"
                class="relative space-y-6 before:absolute before:bottom-2 before:left-3 before:top-2 before:w-[1px] before:bg-border/20"
              >
                <div
                  v-for="activity in projectActivities"
                  :key="activity.id"
                  class="group relative pl-8"
                >
                  <div class="absolute left-0 top-1.5 flex h-6 w-6 items-center justify-center">
                    <div class="h-1.5 w-1.5 rounded-full bg-brand/40 outline outline-4 outline-surface transition-all group-hover:scale-125 group-hover:bg-brand" />
                  </div>

                  <div class="space-y-1">
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-bold uppercase tracking-widest text-muted">{{ activity.type }}</span>
                      <span class="text-[9px] font-medium text-faint">{{ formatRelativeTime(activity.timestamp) }}</span>
                    </div>
                    <p class="text-[13px] font-medium leading-relaxed text-text">
                      {{ activity.message }}
                    </p>
                    <p class="text-[10px] italic leading-tight text-faint">
                      by {{ activity.user }}
                    </p>
                  </div>
                </div>
              </div>
              <div
                v-else
                class="space-y-3 py-20 text-center"
              >
                <Clock class="mx-auto h-10 w-10 text-faint/30" />
                <p class="text-sm italic text-faint">
                  No activity logged for {{ project?.name }} yet.
                </p>
              </div>
            </div>
          </div>
        </div>

        <footer class="absolute bottom-6 left-0 right-0 flex justify-center px-8">
          <button
            type="button"
            class="btn btn-primary w-full max-w-[340px] rounded-xl font-black uppercase tracking-widest shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 sketch-border"
            @click="goToWorkspace"
          >
            <ArrowRightCircle class="h-5 w-5" />
            Enter Studio Workspace
          </button>
        </footer>
      </aside>
    </Transition>
  </Teleport>

  <ProjectMemberModal
    v-if="project"
    v-model:open="showMembers"
    :project-id="project.id"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowRightCircle, Banknote, Bolt, Calendar, ChevronRight, Clock, Users } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'

const isOpen = defineModel<boolean>('open', { default: false })
const showMembers = ref(false)
const activeTab = ref('details')

const props = defineProps({
  projectId: {
    type: String,
    default: null
  }
})

const workspace = useWorkspaceStore()
const router = useRouter()

const project = computed(() => {
  if (!props.projectId) return null
  return workspace.projects.find(p => p.id === props.projectId)
})

const tabItems = [
  { label: 'DELIVERABLES', slot: 'details' },
  { label: 'ACTIVITY', slot: 'activity' }
]

const projectPriority = computed(() => {
  if (!project.value) return 'Normal'
  return project.value.card_count > 10 ? 'High' : 'Normal'
})

const projectActivities = computed(() => {
  if (!props.projectId) return []
  return workspace.activities.filter(a => a.project_id === props.projectId)
})

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function handleMonetization() {
  alert('Financial overview unavailable in draft.')
}

function goToWorkspace() {
  if (project.value) {
    workspace.currentProject = project.value
    router.push(`/workspace/${project.value.id}`)
    isOpen.value = false
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(var(--c-brand), 0.1);
  border-radius: 10px;
}

.sidebar-overlay-enter-active,
.sidebar-overlay-leave-active,
.sidebar-panel-enter-active,
.sidebar-panel-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.sidebar-overlay-enter-from,
.sidebar-overlay-leave-to {
  opacity: 0;
}

.sidebar-panel-enter-from,
.sidebar-panel-leave-to {
  transform: translateX(100%);
}
</style>
