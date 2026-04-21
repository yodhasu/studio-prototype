<template>
  <USlideover 
    v-model:open="isOpen" 
    :title="project?.name || 'Project Details'" 
    :description="project?.description || 'No description provided for this production.'"
    :ui="{ width: 'max-w-lg' }"
  >
    <template #body>
      <div class="flex-1 overflow-y-auto space-y-8 custom-scrollbar">
        <!-- Members Section -->
        <ProjectMemberBox v-if="project" :project-id="project.id" />

        <!-- Task List Section -->
        <ProjectTaskList v-if="project" :project-id="project.id" />

        <!-- Monetization Section -->
        <div class="space-y-3 pt-4">
          <span class="text-xs font-bold text-muted uppercase tracking-wider px-1">Financials</span>
          <UButton 
            block 
            icon="i-heroicons-currency-dollar" 
            label="Monetization Settings" 
            color="white" 
            variant="solid" 
            class="h-12 rounded-xl text-brand font-bold shadow-sm"
            @click="handleMonetization"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <UButton block color="primary" label="Open Workspace" icon="i-heroicons-squares-2x2" @click="goToWorkspace" size="lg" />
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'

const isOpen = defineModel<boolean>('open', { default: false })
const props = defineProps<{
  projectId: string | null
}>()

const workspace = useWorkspaceStore()
const router = useRouter()
const project = computed(() => {
  if (!props.projectId) return null
  return workspace.projects.find(p => p.id === props.projectId)
})

function handleMonetization() {
  alert('Monetization configuration coming soon!')
}

function goToWorkspace() {
  if (project.value) {
    workspace.currentProject = project.value
    router.push('/workspace')
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
