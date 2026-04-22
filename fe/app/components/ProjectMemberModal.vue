<template>
  <UModal v-model:open="isOpen" :ui="{ overlay: 'z-[100]', content: 'z-[101]' }">
    <UCard variant="outline" :ui="{ root: 'divide-y divide-border ring-0' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-text">
            Project Members
          </h3>
          <UButton 
            color="neutral" 
            variant="ghost" 
            icon="i-heroicons-x-mark-20-solid" 
            class="-my-1" 
            @click="isOpen = false"
          />
        </div>
      </template>

      <div class="px-6 py-4 border-b border-border/50 flex justify-end">
        <UButton 
          color="primary" 
          variant="solid" 
          icon="i-heroicons-user-plus" 
          label="Add New Member" 
          size="sm"
          class="rounded-lg shadow-sm"
          @click="addRandomMember"
        />
      </div>

      <div class="p-6 grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        <div 
          v-for="member in projectMembers" 
          :key="member.id"
          class="relative group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-surface hover:bg-surface-elevated hover:border-brand/30 transition-all"
        >
          <UAvatar :src="member.avatar_url" :alt="member.name" size="md" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-text truncate">{{ member.name }}</p>
            <p class="text-xs text-muted truncate">{{ member.role }}</p>
          </div>
          
          <button 
            class="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 bg-red-500 text-white shadow-lg p-1.5 rounded-full transition-all hover:scale-110 active:scale-95 z-10"
            title="Unassign Member"
            @click="removeMember(member.id)"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <div v-if="projectMembers.length === 0" class="col-span-2 py-8 text-center text-sm text-faint italic">
          No members assigned to this production yet.
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'

const isOpen = defineModel<boolean>('open', { default: false })

const props = defineProps<{
  projectId: string
}>()

const workspace = useWorkspaceStore()



const project = computed(() => workspace.projects.find(p => p.id === props.projectId))
const projectMembers = computed(() => {
  if (!project.value?.member_ids) return []
  return workspace.members.filter(m => project.value?.member_ids?.includes(m.id))
})

function addRandomMember() {
  const unassigned = workspace.members.find(m => !project.value?.member_ids?.includes(m.id))
  if (unassigned && project.value) {
    if (!project.value.member_ids) project.value.member_ids = []
    project.value.member_ids.push(unassigned.id)
  }
}

function removeMember(memberId: string) {
  if (project.value && project.value.member_ids) {
    project.value.member_ids = project.value.member_ids.filter(id => id !== memberId)
  }
}
</script>
