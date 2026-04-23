<template>
  <UModal
    v-model:open="isOpen"
    :ui="{ overlay: 'z-[100]', content: 'z-[101] max-w-2xl w-full' }"
  >
    <div class="overflow-hidden border-0 bg-surface sketch-border">
      <div class="flex items-center justify-between border-b border-border/10 bg-overlay/20 p-6">
        <div class="flex items-center gap-2">
          <div class="h-6 w-2 rounded-full bg-brand" />
          <div>
            <h3 class="text-lg font-bold tracking-tight">
              {{ mode === 'create' ? 'Create Task' : isViewMode ? 'Task Details' : 'Edit Task' }}
            </h3>
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              {{ mode === 'create' ? 'New deliverable' : isViewMode ? 'Inspect deliverable' : 'Update deliverable' }}
            </p>
          </div>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-x-mark"
          @click="isOpen = false"
        />
      </div>

      <div class="max-h-[80vh] overflow-y-auto p-6">
        <div
          v-if="localTask && isViewMode"
          class="mb-5 grid gap-3 sm:grid-cols-3"
        >
          <div class="rounded-xl border border-border/40 bg-panel/20 p-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Status
            </p>
            <UBadge
              :color="getStatusColor(localTask.status)"
              variant="subtle"
              class="mt-2 w-full justify-center"
            >
              {{ localTask.status }}
            </UBadge>
          </div>
          <div class="rounded-xl border border-border/40 bg-panel/20 p-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Priority
            </p>
            <UBadge
              :color="getPriorityColor(localTask.priority)"
              variant="subtle"
              class="mt-2 w-full justify-center"
            >
              {{ localTask.priority }}
            </UBadge>
          </div>
          <div class="rounded-xl border border-border/40 bg-panel/20 p-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              Due Date
            </p>
            <p class="mt-2 text-sm font-bold text-text">
              {{ formatDate(localTask.due_date) }}
            </p>
          </div>
        </div>

        <form
          class="space-y-5"
          @submit.prevent="handleSubmit"
        >
          <div class="grid gap-5 lg:grid-cols-2">
            <div class="lg:col-span-2">
              <UFormField
                label="Task Title"
                name="title"
                :ui="{ label: 'px-1 py-1 text-[10px] font-bold uppercase tracking-widest text-faint' }"
              >
                <UInput
                  v-model="form.title"
                  placeholder="What needs doing?"
                  class="sketch-border"
                  variant="none"
                  :disabled="isViewMode"
                />
              </UFormField>
            </div>

            <UFormField
              label="Status"
              name="status"
              :ui="{ label: 'px-1 py-1 text-[10px] font-bold uppercase tracking-widest text-faint' }"
            >
              <USelect
                v-model="form.status"
                :options="statusOptions"
                class="sketch-border"
                variant="none"
                :disabled="isViewMode"
              />
            </UFormField>

            <UFormField
              label="Priority"
              name="priority"
              :ui="{ label: 'px-1 py-1 text-[10px] font-bold uppercase tracking-widest text-faint' }"
            >
              <USelect
                v-model="form.priority"
                :options="priorityOptions"
                class="sketch-border"
                variant="none"
                :disabled="isViewMode"
              />
            </UFormField>

            <div class="lg:col-span-2">
              <UFormField
                label="Description"
                name="detail"
                :ui="{ label: 'px-1 py-1 text-[10px] font-bold uppercase tracking-widest text-faint' }"
              >
                <UTextarea
                  v-model="form.detail"
                  placeholder="Add context..."
                  class="sketch-border"
                  variant="none"
                  :rows="5"
                  :disabled="isViewMode"
                />
              </UFormField>
            </div>

            <UFormField
              label="Due Date"
              name="due_date"
              :ui="{ label: 'px-1 py-1 text-[10px] font-bold uppercase tracking-widest text-faint' }"
            >
              <UInput
                v-model="form.due_date"
                type="date"
                class="sketch-border"
                variant="none"
                :disabled="isViewMode"
              />
            </UFormField>

            <div class="flex items-end justify-end">
              <div
                v-if="localTask"
                class="rounded-xl border border-border/40 bg-panel/20 px-3 py-2 text-right"
              >
                <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                  Project task
                </p>
                <p class="mt-1 text-xs font-bold text-text">
                  {{ localTask.title }}
                </p>
              </div>
            </div>
          </div>

          <p
            v-if="formError"
            class="text-xs font-semibold text-red"
          >
            {{ formError }}
          </p>

          <div class="flex gap-3 pt-2">
            <UButton
              v-if="isViewMode"
              label="Edit Task"
              color="primary"
              variant="ghost"
              block
              class="flex-1"
              type="button"
              @click="setMode('edit')"
            />
            <UButton
              v-if="isViewMode"
              label="Close"
              color="neutral"
              variant="ghost"
              block
              class="flex-1"
              type="button"
              @click="isOpen = false"
            />
            <template v-else>
              <UButton
                v-if="mode === 'edit'"
                label="Cancel"
                color="neutral"
                variant="ghost"
                block
                class="flex-1"
                type="button"
                @click="setMode('detail')"
              />
              <UButton
                :label="mode === 'create' ? 'Create Task' : 'Save Changes'"
                color="primary"
                block
                class="flex-[2] rounded-xl font-bold sketch-border"
                :loading="loading"
                type="submit"
              />
            </template>
          </div>
        </form>
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
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

const isViewMode = computed(() => mode.value === 'detail')

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

function syncFormFromTask(task: Task | null) {
  if (!task) {
    resetForm()
    return
  }

  form.value = {
    title: task.title,
    detail: task.detail || '',
    status: task.status,
    priority: task.priority,
    due_date: (task.due_date ?? new Date().toISOString()).slice(0, 10)
  }
}

function setMode(newMode: 'create' | 'detail' | 'edit') {
  mode.value = newMode
  if (newMode === 'edit') syncFormFromTask(localTask.value)
  if (newMode === 'create') resetForm()
}

function resetForm() {
  form.value = {
    title: '',
    detail: '',
    status: 'TODO',
    priority: 'MEDIUM',
    due_date: new Date().toISOString().slice(0, 10)
  }
}

watch([() => props.task, () => props.initialMode], ([newTask, initialMode]) => {
  localTask.value = newTask || null

  if (newTask) {
    mode.value = initialMode === 'edit' ? 'edit' : 'detail'
    syncFormFromTask(newTask)
    return
  }

  mode.value = 'create'
  resetForm()
}, { immediate: true })

watch(isOpen, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      mode.value = localTask.value ? 'detail' : 'create'
      formError.value = ''
    }, 250)
  }
})

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
