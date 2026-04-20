<template>
  <UModal v-model="isOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-border' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-text">
            Edit Task
          </h3>
          <UButton 
            color="gray" 
            variant="ghost" 
            icon="i-heroicons-x-mark" 
            @click="isOpen = false"
          />
        </div>
      </template>

      <div class="p-6 space-y-6">
        <UFormGroup label="Title">
          <UInput v-model="localTask.card_title" placeholder="What needs to be done?" />
        </UFormGroup>

        <UFormGroup label="Description">
          <UTextarea v-model="localTask.description" placeholder="Add some details..." :rows="4" />
        </UFormGroup>

        <div class="grid grid-cols-2 gap-4">
          <UFormGroup label="Due Date">
            <UInput v-model="localTask.due_date" type="date" />
          </UFormGroup>
          <UFormGroup label="Priority">
            <USelect v-model="localTask.priority" :options="['LOW', 'MEDIUM', 'HIGH']" />
          </UFormGroup>
        </div>

        <UFormGroup label="Assignee">
          <USelectMenu
            v-model="localTask.assignee_id"
            :options="workspace.members"
            value-attribute="id"
            option-attribute="name"
          >
            <template #label>
              <span v-if="currentAssignee" class="truncate font-bold">{{ currentAssignee.name }}</span>
              <span v-else class="text-muted">Unassigned</span>
            </template>
          </USelectMenu>
        </UFormGroup>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <UButton color="gray" variant="solid" label="Cancel" @click="isOpen = false" />
          <UButton color="primary" label="Save Changes" @click="save" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWorkspaceStore } from '~/stores/workspace'
import type { Task } from '~/stores/workspace'

const props = defineProps<{
  modelValue: boolean
  task: Task | null
}>()

const emit = defineEmits(['update:modelValue', 'save'])
const workspace = useWorkspaceStore()
const localTask = ref<Partial<Task>>({})

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

watch(() => props.task, (newVal) => {
  if (newVal) {
    localTask.value = JSON.parse(JSON.stringify(newVal))
  }
}, { immediate: true })

const currentAssignee = computed(() => {
  return workspace.members.find(m => m.id === localTask.value.assignee_id)
})

function save() {
  if (props.task) {
    Object.assign(props.task, localTask.value)
    emit('save', props.task)
    isOpen.value = false
  }
}
</script>
