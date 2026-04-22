<template>
  <div class="premium-scroll h-full overflow-y-auto p-8">
    <div class="mx-auto max-w-7xl space-y-8">
      <header class="flex items-end justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold tracking-tight text-text">Production Schedule</h1>
          <p class="mt-1 text-sm text-muted">Timeline view of active production workstreams.</p>
        </div>
        <button class="btn btn-primary" @click="showEventModal = true">
          <Plus class="mr-2 h-4 w-4" /> Schedule Event
        </button>
      </header>

      <section class="dashboard-panel">
        <div class="grid grid-cols-[100px_1fr] gap-4 text-sm" v-for="day in 7" :key="day">
          <div class="border-r border-border/50 py-4 pr-4 font-bold text-muted">
            Apr {{ 10 + day }}
          </div>
          <div class="space-y-3 py-4">
            <div v-if="day % 2 === 0" class="flex flex-col gap-2 rounded-lg border border-border bg-panel/30 p-3">
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full" :style="{ backgroundColor: 'rgb(var(--c-brand))' }" />
                <span class="text-xs font-bold text-text">Milestone Delivery</span>
                <span class="ml-auto text-[10px] text-muted">10:00 AM - 12:00 PM</span>
              </div>
            </div>
            <div v-if="day % 3 === 0" class="flex flex-col gap-2 rounded-lg border border-border bg-panel/30 p-3">
              <div class="flex items-center gap-2">
                <div class="h-2 w-2 rounded-full" :style="{ backgroundColor: 'rgb(var(--c-amber))' }" />
                <span class="text-xs font-bold text-text">Client Review Sync</span>
                <span class="ml-auto text-[10px] text-muted">2:00 PM - 3:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="dashboard-panel">
        <h2 class="mb-3 text-sm font-semibold uppercase tracking-wide text-faint">Scheduled Events</h2>
        <div v-if="events.length" class="space-y-3">
          <article v-for="event in events" :key="event.id" class="rounded-xl border border-border/70 bg-surface/70 p-4">
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-text">{{ event.title }}</p>
              <span class="text-xs text-faint">{{ event.date }}</span>
            </div>
          </article>
        </div>
        <p v-else class="text-sm text-muted">No events scheduled yet.</p>
      </section>

      <div v-if="showEventModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true">
        <div class="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-2xl">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="font-display text-lg font-bold">Schedule Event</h2>
            <button @click="closeEventModal" class="text-faint hover:text-text" aria-label="Close schedule event modal">
              <X class="h-4 w-4" />
            </button>
          </div>

          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Title</label>
          <input
            v-model="draftTitle"
            class="mb-4 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text outline-none focus:border-brand"
            placeholder="e.g. Client review"
          >

          <label class="mb-2 block text-xs font-semibold uppercase tracking-wider text-faint">Date</label>
          <input
            v-model="draftDate"
            type="date"
            class="mb-5 w-full rounded-lg border border-border bg-surface-elevated px-3 py-2 text-sm text-text outline-none focus:border-brand"
          >

          <p v-if="eventError" class="mb-3 text-xs text-red-400">{{ eventError }}</p>

          <div class="flex justify-end gap-2">
            <button class="btn" @click="closeEventModal">Cancel</button>
            <button class="btn btn-primary" @click="createEvent">Add Event</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, X } from 'lucide-vue-next'

type ScheduleEvent = { id: string, title: string, date: string }

const showEventModal = ref(false)
const draftTitle = ref('')
const draftDate = ref(new Date().toISOString().slice(0, 10))
const eventError = ref('')

const events = ref<ScheduleEvent[]>([
  { id: 'ev-1', title: 'Weekly planning sync', date: draftDate.value }
])

function closeEventModal() {
  showEventModal.value = false
  eventError.value = ''
}

function createEvent() {
  if (!draftTitle.value.trim()) {
    eventError.value = 'Event title is required.'
    return
  }

  events.value.unshift({
    id: `ev-${Date.now()}`,
    title: draftTitle.value.trim(),
    date: draftDate.value
  })

  draftTitle.value = ''
  closeEventModal()
}
</script>
