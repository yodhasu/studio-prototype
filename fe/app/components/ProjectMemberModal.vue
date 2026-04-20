<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-border' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-text">
            Project Members
          </h3>
          <UButton 
            color="primary" 
            variant="ghost" 
            icon="i-heroicons-user-plus" 
            label="Add Member" 
            @click="addRandomMember"
          />
        </div>
      </template>

      <div class="p-4 grid grid-cols-2 gap-4">
        <div 
          v-for="member in projectMembers" 
          :key="member.id"
          class="relative group flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-surface hover:bg-surface-elevated transition-colors"
        >
          <UAvatar :src="member.avatar_url" :alt="member.name" size="md" />
          <div class="flex-1 min-w-0">
            <p class="text-sm font-bold text-text truncate">{{ member.name }}</p>
            <p class="text-xs text-muted truncate">{{ member.role }}</p>
          </div>
          
          <button 
            class="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white p-1 rounded-full text-[10px] transition-all"
            @click="removeMember(member.id)"
          >
            <X class="w-3 h-3" />
          </button>
        </div>
      </div>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'

const props = defineProps<{
  modelValue: boolean
  projectId: string
}>()

const emit = defineEmits(['update:modelValue'])
const workspace = useWorkspaceStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

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
