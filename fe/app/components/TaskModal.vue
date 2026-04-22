<template>
  <UModal v-model:open="isOpen" :ui="{ overlay: 'z-[100]', content: 'z-[101] max-w-md' }">
    <div class="p-0 overflow-hidden bg-surface sketch-border border-0">
      <div class="p-6 border-b border-border/10 bg-overlay/20 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-2 h-6 rounded-full bg-brand"></div>
          <h3 class="text-lg font-bold tracking-tight">
            {{ mode === 'create' ? 'Create Task' : mode === 'edit' ? 'Edit Task' : 'Task Details' }}
          </h3>
        </div>
        <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark" @click="isOpen = false" />
      </div>

      <div class="p-6 space-y-6">
        <div v-if="mode === 'detail' && localTask" class="space-y-6">
          <div>
            <h4 class="text-[10px] font-bold text-faint uppercase tracking-widest mb-1">Title</h4>
            <p class="text-lg font-bold text-text">{{ localTask.title }}</p>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <h4 class="text-[10px] font-bold text-faint uppercase tracking-widest mb-1 text-center">Status</h4>
              <UBadge :color="getStatusColor(localTask.status)" variant="subtle" class="w-full justify-center">{{ localTask.status }}</UBadge>
            </div>
            <div>
              <h4 class="text-[10px] font-bold text-faint uppercase tracking-widest mb-1 text-center">Priority</h4>
              <UBadge :color="getPriorityColor(localTask.priority)" variant="subtle" class="w-full justify-center">{{ localTask.priority }}</UBadge>
            </div>
          </div>

          <div>
             <h4 class="text-[10px] font-bold text-faint uppercase tracking-widest mb-1">Description</h4>
             <p class="text-sm text-muted leading-relaxed italic bg-panel/30 p-3 rounded-lg border border-border/10">
               {{ localTask.detail || 'No description provided.' }}
             </p>
          </div>

          <div class="flex items-center justify-between items-end pt-4 border-t border-border/10">
             <div class="flex items-center gap-2 text-faint">
               <UIcon name="i-heroicons-calendar" class="w-4 h-4" />
               <span class="text-xs font-medium">Due {{ formatDate(localTask.due_date) }}</span>
             </div>
             <UButton 
               label="Edit Task" 
               icon="i-heroicons-pencil" 
               size="xs" 
               color="primary" 
               variant="ghost" 
               class="hover:bg-brand/5"
               @click="setMode('edit')" 
             />
          </div>
        </div>

        <div v-else class="space-y-4">
          <UFormField label="Task Title" name="title" :ui="{ label: 'text-[10px] font-bold text-faint uppercase tracking-widest p-1' }">
            <UInput v-model="form.title" placeholder="What needs doing?" class="sketch-border" variant="none" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4">
            <UFormField label="Status" name="status" :ui="{ label: 'text-[10px] font-bold text-faint uppercase tracking-widest p-1' }">
              <USelect v-model="form.status" :options="statusOptions" class="sketch-border" variant="none" />
            </UFormField>
            <UFormField label="Priority" name="priority" :ui="{ label: 'text-[10px] font-bold text-faint uppercase tracking-widest p-1' }">
              <USelect v-model="form.priority" :options="priorityOptions" class="sketch-border" variant="none" />
            </UFormField>
          </div>

          <UFormField label="Description" name="detail" :ui="{ label: 'text-[10px] font-bold text-faint uppercase tracking-widest p-1' }">
            <UTextarea v-model="form.detail" placeholder="Add context..." class="sketch-border" variant="none" :rows="3" />
          </UFormField>

          <UFormField label="Due Date" name="due_date" :ui="{ label: 'text-[10px] font-bold text-faint uppercase tracking-widest p-1' }">
            <UInput type="date" v-model="form.due_date" class="sketch-border" variant="none" />
          </UFormField>

          <p v-if="formError" class="text-xs font-semibold text-red">{{ formError }}</p>

          <div class="pt-4 flex gap-3">
            <UButton 
              v-if="mode === 'edit'"
              label="Cancel" 
              color="neutral" 
              variant="ghost" 
              block 
              class="flex-1"
              @click="setMode('detail')" 
            />
            <UButton 
              :label="mode === 'create' ? 'Create Task' : 'Save Changes'" 
              color="primary" 
              block 
              class="flex-[2] rounded-xl font-bold sketch-border"
              :loading="loading"
              @click="handleSubmit" 
            />
          </div>
        </div>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useWorkspaceStore, type Task, type TaskStatus } from '~/stores/workspace'

const props = defineProps<{
  task?: Task | null
  projectId: string
  initialMode?: 'create' | 'detail' | 'edit'
}>()

const isOpen = defineModel<boolean>('open', { default: false })
const mode = ref<'create' | 'detail' | 'edit'>(props.initialMode || 'detail')
const loading = ref(false)
const formError = ref('')
const workspace = useWorkspaceStore()

const localTask = ref<Task | null>(props.task || null)

const statusOptions: TaskStatus[] = ['TODO', 'PROGRESS', 'BLOCKED', 'DONE']
const priorityOptions: Array<Task['priority']> = ['LOW', 'MEDIUM', 'HIGH']

const form = ref<{
  title: string
  detail: string
  status: TaskStatus
  priority: Task['priority']
  due_date: string
}>({
  title: '',
  detail: '',
  status: 'TODO',
  priority: 'MEDIUM',
  due_date: new Date().toISOString().slice(0, 10)
})

function setMode(newMode: 'create' | 'detail' | 'edit') {
  mode.value = newMode
  if (newMode === 'edit' && localTask.value) {
    form.value = {
      title: localTask.value.title,
      detail: localTask.value.detail || '',
      status: localTask.value.status,
      priority: localTask.value.priority,
      due_date: (localTask.value.due_date ?? new Date().toISOString()).slice(0, 10)
    }
  }
}

watch(() => props.task, (newVal) => {
  localTask.value = newVal || null
  if (newVal) {
    if (props.initialMode) mode.value = props.initialMode
    else mode.value = 'detail'
  } else {
    mode.value = 'create'
    resetForm()
  }
}, { immediate: true })

watch(isOpen, (newVal) => {
  if (!newVal) {
    // Reset after close
    setTimeout(() => { mode.value = 'detail' }, 300)
  }
})

function resetForm() {
  form.value = {
    title: '',
    detail: '',
    status: 'TODO',
    priority: 'MEDIUM',
    due_date: new Date().toISOString().slice(0, 10)
  }
}

function getStatusColor(status: TaskStatus): 'success' | 'info' | 'error' | 'neutral' {
  switch (status) {
    case 'DONE': return 'success'
    case 'PROGRESS': return 'info'
    case 'BLOCKED': return 'error'
    default: return 'neutral'
  }
}

function getPriorityColor(priority: Task['priority']): 'error' | 'warning' | 'neutral' {
  switch (priority) {
    case 'HIGH': return 'error'
    case 'MEDIUM': return 'warning'
    default: return 'neutral'
  }
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'TBD'
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function handleSubmit() {
  formError.value = ''

  if (!form.value.title.trim()) {
    formError.value = 'Task title is required.'
    return
  }

  if (!form.value.due_date) {
    formError.value = 'Due date is required.'
    return
  }

  loading.value = true
  try {
    if (mode.value === 'create') {
      await workspace.createTask({
        ...form.value,
        project_id: props.projectId
      })
    } else if (mode.value === 'edit' && localTask.value) {
      workspace.updateTask(localTask.value.id, form.value)
    }
    isOpen.value = false
  } catch (err) {
    console.error('Task error:', err)
    formError.value = 'Failed to save task. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
