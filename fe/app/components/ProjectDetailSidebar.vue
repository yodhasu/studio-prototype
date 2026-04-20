<template>
  <USlideover v-model="isOpen">
    <template #content>
      <div class="p-8 flex-1 flex flex-col h-full overflow-hidden bg-surface border-l border-border/50 shadow-[0_0_40px_rgba(0,0,0,0.1)]">
        <div class="flex items-start justify-between mb-8">
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-text font-display">{{ project?.name || 'Project Details' }}</h2>
            <p class="mt-2 text-sm text-muted leading-relaxed">{{ project?.description || 'No description provided for this production.' }}</p>
          </div>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isOpen = false"
          />
        </div>

        <div class="flex-1 overflow-y-auto pr-2 -mr-2 space-y-8 custom-scrollbar">
          <!-- Members Section -->
          <ProjectMemberBox v-if="project" :project-id="project.id" />

          <!-- Task List Section -->
          <ProjectTaskList v-if="project" :project-id="project.id" />

          <!-- Monetization Section -->
          <div class="space-y-3">
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

        <div class="mt-auto pt-8 border-t border-border/50 flex gap-4">
          <UButton block color="primary" label="Open Workspace" icon="i-heroicons-squares-2x2" @click="goToWorkspace" />
        </div>
      </div>
    </template>
  </USlideover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'

const props = defineProps<{
  modelValue: boolean
  projectId: string | null
}>()

const emit = defineEmits(['update:modelValue'])
const workspace = useWorkspaceStore()
const router = useRouter()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

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
