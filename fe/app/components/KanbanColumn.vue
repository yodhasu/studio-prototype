<template>
  <section class="dashboard-panel">
    <div class="flex items-end justify-between">
      <div>
        <h2 class="font-display text-lg font-bold text-text">
          {{ title }}
        </h2>
        <p class="mt-1 text-[10px] font-bold uppercase tracking-widest text-faint">
          {{ subtitle }}
        </p>
      </div>
      <span class="text-[10px] font-mono text-muted">{{ localList.length }}</span>
    </div>

    <div class="mt-5">
      <VueDraggable
        v-model="localList"
        group="production-schedule"
        item-key="id"
        class="space-y-3 min-h-[80px]"
        :animation="150"
        ghost-class="opacity-40"
      >
        <template #item="{ element }">
          <TaskCard
            :task="element"
            @open="(t) => emit('open', t)"
          />
        </template>

        <template #footer>
          <p
            v-if="localList.length === 0"
            class="text-xs text-faint italic"
          >
            No items in this column.
          </p>
        </template>
      </VueDraggable>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { Task } from '~/stores/workspace'

const props = defineProps<{ title: string, subtitle: string, modelValue: Task[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: Task[]], 'moved': [taskId: string], 'open': [task: Task] }>()

const localList = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

watch(
  () => props.modelValue.map(task => task.id).join('|'),
  (next, prev) => {
    const before = prev ? prev.split('|').filter(Boolean) : []
    const after = next ? next.split('|').filter(Boolean) : []
    const movedId = after.find(id => !before.includes(id))
    if (movedId) emit('moved', movedId)
  },
  { flush: 'post' }
)
</script>
