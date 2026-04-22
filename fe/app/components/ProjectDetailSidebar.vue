<template>
  <USlideover 
    v-model:open="isOpen" 
    :ui="{ 
      content: 'max-w-lg fixed right-0 inset-y-0 z-50 bg-surface shadow-2xl backdrop-blur-md border-l border-border/10',
      header: 'p-0 relative',
      close: 'end-4 top-4 z-10',
      overlay: 'fixed inset-0 bg-[var(--c-bg)]/60 backdrop-blur-sm z-40'
    }"
  >
    <template #header>
      <div class="px-8 pt-10 pr-20 pb-4 relative">
        <div class="absolute top-9 right-14">
          <span class="text-[9px] font-bold uppercase tracking-widest text-faint">Edit flow pending</span>
        </div>
        <h2 class="text-xl font-bold text-foreground line-clamp-1 tracking-tight">{{ project?.name || 'Workspace Context' }}</h2>
        <p class="text-[13px] text-muted line-clamp-2 mt-1 leading-snug">{{ project?.description || 'Active production workspace.' }}</p>
      </div>
    </template>

    <template #body>
      <div class="flex-1 overflow-y-auto space-y-8 custom-scrollbar pb-24 px-8 pt-2">
        <!-- Metadata (Extreme Minimalist) -->
        <div class="flex items-center gap-6 py-2 px-1 border-b border-border/10 pb-6 opacity-80">
          <div class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            <span class="text-[10px] font-bold uppercase tracking-widest text-muted">{{ project?.status || 'Active' }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-bolt" class="w-3.5 h-3.5 text-amber" />
            <span class="text-[10px] font-bold uppercase tracking-widest text-muted">{{ projectPriority }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-calendar" class="w-3.5 h-3.5 text-muted" />
            <span class="text-[10px] font-bold uppercase tracking-widest text-faint">JUN 30</span>
          </div>
        </div>

        <!-- Collaborators (Minimalist Trigger) -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-[10px] font-bold text-muted uppercase tracking-widest px-1">Collaborators</span>
            <UButton 
              variant="link" 
              color="neutral" 
              size="xs" 
              label="Open Team" 
              @click="showMembers = true" 
              class="text-[10px] hover:text-brand"
            />
          </div>
          <div class="flex items-center gap-3 p-3 sketch-border bg-panel/30 cursor-pointer hover:bg-panel/50 transition-colors" @click="showMembers = true">
            <div class="h-9 w-9 rounded-full border border-border/30 bg-brand/15 flex items-center justify-center text-brand">
              <UIcon name="i-heroicons-user-group" class="w-4 h-4" />
            </div>
            <div class="space-y-1">
              <p class="text-[11px] font-bold uppercase tracking-widest text-text">Team Directory</p>
              <p class="text-[10px] text-faint">{{ project?.member_ids?.length ?? 0 }} collaborators hidden until opened</p>
            </div>
            <div class="ml-auto flex items-center text-faint">
              <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
            </div>
          </div>
        </div>

        <!-- Section Switcher (Tactile Depth Refinement) -->
        <div class="flex p-1 bg-overlay/40 rounded-xl sketch-border mx-1 shadow-inner">
          <button 
            v-for="item in tabItems" 
            :key="item.slot"
            class="flex-1 py-2 px-3 rounded-lg text-[10px] font-black transition-all uppercase tracking-[0.14em]"
            :class="activeTab === item.slot ? 'bg-surface shadow-md text-brand border border-border/10' : 'text-faint hover:text-muted'"
            @click="activeTab = item.slot"
          >
            {{ item.label }}
          </button>
        </div>

        <div class="px-1 min-h-[300px]">
          <div v-if="activeTab === 'details'" class="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <ProjectTaskList v-if="project" :project-id="project.id" />
            
            <div class="pt-6 border-t border-border/10">
              <UButton 
                block 
                icon="i-heroicons-banknotes" 
                label="View Financials" 
                color="neutral" 
                variant="ghost" 
                class="h-10 rounded-lg text-[10px] font-bold uppercase tracking-widest text-faint hover:text-brand transition-colors"
                @click="handleMonetization"
              />
            </div>
          </div>

          <div v-else-if="activeTab === 'activity'" class="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div v-if="projectActivities.length > 0" class="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/20">
              <div v-for="activity in projectActivities" :key="activity.id" class="relative pl-8 group">
                <!-- Artistic Timeline Dot -->
                <div class="absolute left-0 top-1.5 w-6 h-6 flex items-center justify-center">
                   <div class="w-1.5 h-1.5 rounded-full bg-brand/40 group-hover:bg-brand group-hover:scale-125 transition-all outline outline-4 outline-surface"></div>
                </div>
                
                <div class="space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-bold text-muted uppercase tracking-widest">{{ activity.type }}</span>
                    <span class="text-[9px] text-faint font-medium">{{ formatRelativeTime(activity.timestamp) }}</span>
                  </div>
                  <p class="text-[13px] text-text font-medium leading-relaxed">{{ activity.message }}</p>
                  <p class="text-[10px] text-faint italic leading-tight">by {{ activity.user }}</p>
                </div>
              </div>
            </div>
            <div v-else class="py-20 text-center space-y-3">
              <UIcon name="i-heroicons-clock" class="w-10 h-10 text-faint/30 mx-auto" />
              <p class="text-faint text-sm italic">No activity logged for {{ project?.name }} yet.</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="absolute bottom-6 left-0 right-0 flex justify-center px-8">
        <UButton 
          color="primary" 
          label="Enter Studio Workspace" 
          icon="i-heroicons-arrow-right-circle" 
          @click="goToWorkspace" 
          size="xl" 
          class="w-full max-w-[340px] rounded-xl shadow-xl hover:shadow-brand/20 sketch-border !bg-brand !text-bg font-black uppercase tracking-widest transition-all hover:-translate-y-0.5 active:translate-y-0"
        />
      </div>
    </template>
  </USlideover>

  <!-- Members Modal -->
  <UModal v-model="showMembers">
    <div class="p-8">
      <div class="flex items-center justify-between mb-8">
        <h3 class="text-lg font-bold flex items-center gap-2">
          <UIcon name="i-heroicons-users" class="w-5 h-5 text-brand" />
          Collaborators
        </h3>
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="showMembers = false" />
      </div>
      <ProjectMemberBox v-if="project" :project-id="project.id" />
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
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

const isNotWorkspacePage = computed(() => {
  return router.currentRoute.value.path !== `/workspace/${project.value?.id}`
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
</style>
