<template>
  <BaseModal
    v-model:open="isOpen"
    max-width="2xl"
    :show-close="false"
  >
    <template #header>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center gap-2">
          <div class="h-6 w-2 rounded-full bg-brand" />
          <div>
            <h3 class="text-lg font-bold tracking-tight">
              {{ modalTitle }}
            </h3>
            <p class="text-[10px] font-black uppercase tracking-widest text-faint">
              {{ modalKicker }}
            </p>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-ghost btn-icon"
          aria-label="Close task modal"
          @click="closeModal"
        >
          x
        </button>
      </div>
    </template>

    <div class="max-h-[80vh] overflow-y-auto p-6" ref="panelRef" tabindex="-1">
            <div
              v-if="localTask && isViewMode"
              class="mb-5 grid gap-3 sm:grid-cols-3"
            >
              <div class="rounded-xl border border-border/40 bg-panel/20 p-3">
                <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                  Status
                </p>
                <span
                  class="badge mt-2 w-full justify-center"
                  :class="getStatusClass(localTask.status)"
                >
                  {{ localTask.status }}
                </span>
              </div>
              <div class="rounded-xl border border-border/40 bg-panel/20 p-3">
                <p class="text-[10px] font-black uppercase tracking-widest text-faint">
                  Priority
                </p>
                <span
                  class="badge mt-2 w-full justify-center"
                  :class="getPriorityClass(localTask.priority)"
                >
                  {{ localTask.priority }}
                </span>
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
                <label class="block lg:col-span-2">
                  <span class="field-label">Task Title</span>
                  <input
                    v-model="form.title"
                    type="text"
                    placeholder="What needs doing?"
                    class="input-base sketch-border mt-1 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isViewMode"
                  >
                </label>

                <label class="block">
                  <span class="field-label">Status</span>
                  <select
                    v-model="form.status"
                    class="input-base sketch-border mt-1 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isViewMode"
                  >
                    <option
                      v-for="status in statusOptions"
                      :key="status"
                      :value="status"
                    >
                      {{ status }}
                    </option>
                  </select>
                </label>

                <label class="block">
                  <span class="field-label">Priority</span>
                  <select
                    v-model="form.priority"
                    class="input-base sketch-border mt-1 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isViewMode"
                  >
                    <option
                      v-for="priority in priorityOptions"
                      :key="priority"
                      :value="priority"
                    >
                      {{ priority }}
                    </option>
                  </select>
                </label>

                <label class="block">
                  <span class="field-label">Assignee</span>
                  <select
                    v-model="form.assignee_id"
                    class="input-base sketch-border mt-1 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isViewMode"
                  >
                    <option value="">
                      Unassigned
                    </option>
                    <option
                      v-for="member in projectMembers"
                      :key="member.id"
                      :value="member.id"
                    >
                      {{ member.name }}
                    </option>
                  </select>
                </label>

                <label class="block lg:col-span-2">
                  <span class="field-label">Description</span>
                  <textarea
                    v-model="form.detail"
                    placeholder="Add context..."
                    class="input-base sketch-border mt-1 min-h-32 resize-y disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isViewMode"
                  />
                </label>

                <label class="block">
                  <span class="field-label">Due Date</span>
                  <input
                    v-model="form.due_date"
                    type="date"
                    class="input-base sketch-border mt-1 disabled:cursor-not-allowed disabled:opacity-60"
                    :disabled="isViewMode"
                  >
                </label>

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
                <button
                  v-if="isViewMode"
                  class="btn btn-ghost flex-1"
                  type="button"
                  @click="setMode('edit')"
                >
                  Edit Task
                </button>
                <button
                  v-if="isViewMode"
                  class="btn btn-ghost flex-1"
                  type="button"
                  @click="closeModal"
                >
                  Close
                </button>
                <template v-else>
                  <button
                    v-if="mode === 'edit'"
                    class="btn btn-ghost flex-1"
                    type="button"
                    @click="setMode('detail')"
                  >
                    Cancel
                  </button>
                  <button
                    class="btn btn-primary flex-[2] rounded-xl font-bold sketch-border"
                    type="submit"
                    :disabled="loading"
                  >
                    {{ loading ? 'Saving...' : mode === 'create' ? 'Create Task' : 'Save Changes' }}
                  </button>
                </template>
              </div>
            </form>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import BaseModal from './base/BaseModal.vue'
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
const panelRef = ref<HTMLElement | null>(null)

const statusOptions: TaskStatus[] = ['PLANNING', 'ACTIVE', 'PAUSED', 'COMPLETED']
const priorityOptions: Array<Task['priority']> = ['LOW', 'MEDIUM', 'HIGH']

const project = computed(() => workspace.getProjectById(props.projectId))
const projectMembers = computed(() => {
  const members = workspace.getProjectMembers(props.projectId)
  if (!members.length) return workspace.members
  return members
})

const isViewMode = computed(() => mode.value === 'detail')
const modalTitle = computed(() => mode.value === 'create' ? 'Create Task' : isViewMode.value ? 'Task Details' : 'Edit Task')
const modalKicker = computed(() => mode.value === 'create' ? 'New deliverable' : isViewMode.value ? 'Inspect deliverable' : 'Update deliverable')

const form = ref<{
  title: string
  detail: string
  status: TaskStatus
  priority: Task['priority']
  assignee_id: string
  due_date: string
}>({
  title: '',
  detail: '',
  status: 'PLANNING',
  priority: 'MEDIUM',
  assignee_id: '',
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
    assignee_id: task.assignee_id || '',
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
    status: 'PLANNING',
    priority: 'MEDIUM',
    assignee_id: '',
    due_date: new Date().toISOString().slice(0, 10)
  }
}

function closeModal() {
  isOpen.value = false
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

watch(isOpen, async (newVal) => {
  if (newVal) {
    await nextTick()
    panelRef.value?.focus()
    return
  }

  setTimeout(() => {
    mode.value = localTask.value ? 'detail' : 'create'
    formError.value = ''
  }, 250)
})

function getStatusClass(status: TaskStatus) {
  switch (status) {
    case 'COMPLETED': return 'badge-income'
    case 'ACTIVE': return 'badge-cyan'
    case 'PAUSED': return 'badge-expense'
    default: return ''
  }
}

function getPriorityClass(priority: Task['priority']) {
  switch (priority) {
    case 'HIGH': return 'badge-expense'
    case 'MEDIUM': return 'badge-warning'
    default: return ''
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
    const payload = {
      title: form.value.title,
      detail: form.value.detail,
      status: form.value.status,
      priority: form.value.priority,
      due_date: form.value.due_date,
      assignee_id: form.value.assignee_id || undefined
    }

    if (mode.value === 'create') {
      await workspace.createTask({
        ...payload,
        project_id: props.projectId
      })
    } else if (mode.value === 'edit' && localTask.value) {
      workspace.updateTask(localTask.value.id, payload)
    }
    closeModal()
  } catch (err) {
    console.error('Task error:', err)
    formError.value = 'Failed to save task. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.field-label {
  display: inline-block;
  padding: 0.25rem;
  color: #B4AFA0;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
</style>
