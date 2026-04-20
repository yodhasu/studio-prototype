<template>
  <article
    class="group absolute select-none transition-shadow duration-200"
    :class="{ 'z-50': isSelected, 'z-10': !isSelected }"
    :style="cardStyle"
    @mousedown.stop="emit('drag-start', { id: card.id, event: $event })"
    @click.stop="emit('select', card.id)"
  >
    <div 
      class="canvas-card relative overflow-hidden bg-surface/90 backdrop-blur-md transition-all duration-300"
      :class="{ 'ring-2 ring-brand shadow-brand': isSelected, 'hover:border-border-hi shadow-sm': !isSelected }"
    >
      <!-- Grip header (Always visible if selected) -->
      <div v-if="isSelected" class="flex items-center justify-between border-b border-border/50 bg-panel/30 px-3 py-2">
        <div class="flex items-center gap-2 text-faint">
          <GripVertical class="h-3 w-3" />
          <span class="text-[10px] font-bold uppercase tracking-wider">Move Node</span>
        </div>
        <div class="flex items-center gap-1">
          <button class="rounded p-1 text-faint hover:bg-red/10 hover:text-red transition-colors">
            <Trash2 class="h-3 w-3" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <input
            v-if="isSelected"
            v-model="draftTitle"
            class="w-full bg-transparent font-display text-sm font-bold text-text outline-none placeholder:text-faint"
            placeholder="Untitled Concept"
            @blur="commitTitle"
          />
          <h3 v-else class="font-display text-sm font-bold text-text truncate">{{ card.title }}</h3>
          <component :is="cardIcon" class="h-4 w-4 shrink-0 text-brand/60" />
        </div>

        <p v-if="card.description" class="mt-1 text-[11px] text-muted line-clamp-2 italic">{{ card.description }}</p>

        <!-- Content Section -->
        <div v-if="isSelected || card.content?.notes" class="mt-4 space-y-3">
          <div v-if="isSelected" class="relative">
            <textarea
              v-model="draftNotes"
              class="w-full min-h-[80px] rounded-lg border border-border bg-panel/30 p-3 text-xs text-text outline-none focus:border-brand/30 transition-colors resize-none"
              placeholder="Detailed notes, references, or task requirements..."
              @blur="commitNotes"
            ></textarea>
          </div>
          <p v-else class="text-xs text-muted leading-relaxed line-clamp-3">
            {{ card.content?.notes }}
          </p>
        </div>

        <!-- Media Preview Mockup -->
        <div v-if="card.content?.hasMedia" class="mt-4 grid grid-cols-2 gap-2">
          <div class="aspect-video rounded-md bg-panel border border-border flex items-center justify-center">
            <ImageIcon class="h-4 w-4 text-faint" />
          </div>
          <div class="aspect-video rounded-md bg-panel border border-border flex items-center justify-center">
            <PlayCircle class="h-4 w-4 text-faint" />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <footer class="flex items-center justify-between border-t border-border/50 bg-panel/20 px-4 py-2">
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1 text-[10px] font-bold text-muted">
            <MessageSquare class="h-3 w-3" />
            {{ card.comments?.length || 0 }}
          </div>
          <div class="flex items-center gap-1 text-[10px] font-bold text-cyan">
            <Link2 class="h-3 w-3" />
            {{ card.link_count }}
          </div>
        </div>
        <div v-if="card.task" class="flex items-center gap-1.5">
          <span class="h-1.5 w-1.5 rounded-full bg-amber shadow-[0_0_6px_rgba(245,158,11,0.4)]"></span>
          <span class="text-[10px] font-bold text-faint uppercase tracking-wider">Task</span>
        </div>
      </footer>
    </div>

    <!-- Link Handles (Invisible until hover) -->
    <div 
      v-for="anchor in ['top', 'right', 'bottom', 'left']" 
      :key="anchor"
      class="absolute h-3 w-3 rounded-full bg-brand border-2 border-surface opacity-0 group-hover:opacity-100 transition-all cursor-crosshair z-20 hover:scale-125"
      :class="{
        '-top-1.5 left-1/2 -translate-x-1/2': anchor === 'top',
        '-right-1.5 top-1/2 -translate-y-1/2': anchor === 'right',
        '-bottom-1.5 left-1/2 -translate-x-1/2': anchor === 'bottom',
        '-left-1.5 top-1/2 -translate-y-1/2': anchor === 'left'
      }"
    ></div>
  </article>
</template>

<script setup lang="ts">
import { 
  GripVertical, 
  Trash2, 
  MessageSquare, 
  Link2, 
  FileText, 
  Image as ImageIcon, 
  PlayCircle,
  Hash
} from 'lucide-vue-next'
import type { Card } from '~/stores/workspace'

const props = defineProps<{
  card: Card
  isSelected: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  dragStart: [payload: { id: string, event: MouseEvent }]
  update: [payload: any]
}>()

const draftTitle = ref(props.card.title)
const draftNotes = ref(props.card.content?.notes || '')

const cardStyle = computed(() => ({
  left: `${props.card.x_pos}px`,
  top: `${props.card.y_pos}px`,
  width: `${props.card.width || 300}px`
}))

const cardIcon = computed(() => {
  if (props.card.content?.hasMedia) return ImageIcon
  if (props.card.task) return Hash
  return FileText
})

const commitTitle = () => {
  if (draftTitle.value !== props.card.title) {
    emit('update', { id: props.card.id, title: draftTitle.value })
  }
}

const commitNotes = () => {
  if (draftNotes.value !== (props.card.content?.notes || '')) {
    emit('update', { 
      id: props.card.id, 
      content: { ...props.card.content, notes: draftNotes.value } 
    })
  }
}

watch(() => props.card.title, (v) => draftTitle.value = v)
watch(() => props.card.content?.notes, (v) => draftNotes.value = v)
</script>

<style scoped>
.canvas-card {
  border-radius: var(--radius-lg);
}
</style>
