<template>
  <article
    ref="rootRef"
    class="group absolute select-none transition-shadow duration-200"
    :class="{ 'z-50': isSelected, 'z-10': !isSelected }"
    :style="cardStyle"
    @click.stop="emit('select', card.id)"
  >
    <div 
      class="sketch-border relative overflow-hidden bg-surface transition-all duration-300"
      :class="{ 
        'border-[2px] !border-brand shadow-md transform -rotate-[0.3deg]': isSelected, 
        'shadow-sm': !isSelected,
        'ring-2 ring-brand ring-offset-2': isLinkingTarget
      }"
      @mouseup.stop="handleMouseUp"
    >
      <!-- Control Strip (Always visible, handle for dragging) -->
      <div 
        id="node-control-strip" 
        class="flex items-center justify-between border-b border-border/40 bg-[var(--c-bg)]/40 px-3 py-1.5 cursor-default"
      >
        <div class="flex-1"></div>
        <div 
          class="flex items-center justify-center cursor-grab active:cursor-grabbing text-faint hover:text-muted transition-colors px-4"
          title="Drag to move"
          aria-label="Drag to move"
          @mousedown.stop.prevent="emit('drag-start', { id: card.id, event: $event })"
        >
          <GripHorizontal class="h-3.5 w-3.5" />
        </div>
        <div class="flex-1 flex items-center justify-end gap-1.5">
          <button 
            class="p-1 text-faint hover:text-red transition-colors rounded hover:bg-red/10"
            @click.stop="workspace.deleteCard(card.id)"
          >
            <Trash2 class="h-3 w-3" />
          </button>
        </div>
      </div>

      <!-- Body -->
      <div class="p-4">
        <div class="flex items-start justify-between gap-3 mb-4">
          <input
            v-if="isSelected"
            v-model="draftTitle"
            class="w-full bg-transparent font-display text-sm font-bold text-text outline-none placeholder:text-faint"
            placeholder="Untitled Concept"
            @blur="commitTitle"
          />
          <h3 v-else class="font-display text-sm font-bold text-text truncate leading-tight">{{ card.title }}</h3>
          <component :is="cardIcon" class="h-4 w-4 shrink-0 text-brand/60" />
        </div>

        <p v-if="card.description" class="mb-4 text-[11px] text-muted line-clamp-2 italic leading-relaxed">{{ card.description }}</p>

        <!-- Collapsible Content Sections -->
        <div class="space-y-1.5">
          <!-- Notes Section -->
          <div class="sketch-border bg-[var(--c-bg)]/20 overflow-hidden border-border/60">
            <button 
              @click.stop="collapsed.notes = !collapsed.notes" 
              class="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted hover:bg-[var(--c-bg)]/30 transition-colors"
            >
              <div class="flex items-center gap-2">
                <FileText class="h-3 w-3 opacity-60" />
                <span>Notes</span>
              </div>
              <component :is="collapsed.notes ? ChevronRight : ChevronDown" class="h-2.5 w-2.5 opacity-50" />
            </button>
            <div v-show="!collapsed.notes" class="px-3 pb-3 pt-1">
              <textarea
                v-if="isSelected"
                v-model="draftText"
                class="w-full min-h-[100px] sketch-border bg-[var(--c-bg)]/30 p-3 text-xs text-text outline-none focus:border-brand/30 transition-colors resize-none premium-scroll"
                placeholder="Detailed notes, references..."
                @blur="commitText"
              ></textarea>
              <div v-else class="text-xs text-muted leading-relaxed line-clamp-4 whitespace-pre-wrap">
                {{ card.text || 'No detailed content added yet.' }}
              </div>
            </div>
          </div>
          
          <!-- Media Section -->
          <div class="sketch-border bg-[var(--c-bg)]/20 overflow-hidden border-border/60">
            <button 
              @click.stop="collapsed.media = !collapsed.media" 
              class="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted hover:bg-[var(--c-bg)]/30 transition-colors"
            >
              <div class="flex items-center gap-2">
                <ImageIcon class="h-3 w-3 opacity-60" />
                <span>Media</span>
              </div>
              <component :is="collapsed.media ? ChevronRight : ChevronDown" class="h-2.5 w-2.5 opacity-50" />
            </button>
            <div v-show="!collapsed.media" class="px-2 pb-3 pt-1">
              <!-- Media Grid (Max 9) -->
              <div v-if="card.content?.media?.length" class="grid grid-cols-3 gap-2 mb-3">
                <div 
                  v-for="(item, idx) in card.content.media.slice(0, 9)" 
                  :key="idx"
                  class="aspect-square sketch-border bg-panel/40 flex items-center justify-center overflow-hidden border border-border/10 group/media relative"
                >
                  <component :is="getMediaIcon(item.type)" class="w-4 h-4 text-faint group-hover/media:text-brand transition-colors" />
                  <div class="absolute inset-0 bg-brand/5 opacity-0 group-hover/media:opacity-100 transition-opacity"></div>
                </div>
                <!-- Plus tile if under 9 -->
                <div 
                  v-if="card.content.media.length < 9"
                  class="aspect-square sketch-border border-dashed border-border/40 flex items-center justify-center cursor-pointer hover:bg-brand/5 transition-colors"
                  @click.stop="triggerUpload"
                >
                  <Plus class="w-3.5 h-3.5 text-faint" />
                </div>
              </div>

              <div 
                v-else
                class="min-h-[80px] sketch-border border-dashed border-border/40 bg-[var(--c-bg)]/10 flex flex-col items-center justify-center p-4 transition-all group/upload cursor-pointer hover:bg-[var(--c-bg)]/20"
                @click="triggerUpload"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <input type="file" ref="fileInput" class="hidden" multiple @change="handleFileSelect" />
                <ImageIcon class="w-5 h-5 text-faint mb-2 group-hover/upload:text-brand group-hover/upload:scale-110 transition-all" />
                <span class="text-[9px] font-bold text-faint uppercase tracking-tighter">Add Media</span>
              </div>

              <!-- Media Thumbnails when collapsed -->
              <div v-if="collapsed.media && card.content?.media?.length" class="flex -space-x-1 mb-1 mt-2">
                 <div v-for="(item, idx) in card.content.media.slice(0, 4)" :key="idx" class="h-5 w-5 rounded border border-surface bg-panel/60 p-1">
                    <component :is="getMediaIcon(item.type)" class="w-full h-full text-brand/40" />
                 </div>
                 <div v-if="card.content.media.length > 4" class="h-5 w-5 rounded border border-surface bg-panel/60 flex items-center justify-center text-[8px] font-bold text-faint">
                    +{{ card.content.media.length - 4 }}
                 </div>
              </div>
            </div>
          </div>
        </div>

          <!-- Thumbnail Grid (Shown when unfocused and has media) -->
          <div v-if="!isSelected && card.content?.media?.length" class="mt-2 grid grid-cols-3 gap-1">
            <div 
              v-for="(item, i) in card.content.media.slice(0, 9)" 
              :key="i"
              class="aspect-square sketch-border bg-surface/80 flex items-center justify-center border-border/30"
            >
              <component :is="getMediaIcon(item.type)" class="h-3 w-3 text-brand/30" />
            </div>
          </div>

          <!-- Context Section (Minimal) -->
          <div v-if="isSelected" class="sketch-border bg-[var(--c-bg)]/20 overflow-hidden border-border/60 opacity-40">
            <button 
              @click.stop="collapsed.tasks = !collapsed.tasks" 
              class="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted hover:bg-[var(--c-bg)]/30 transition-colors"
            >
              <div class="flex items-center gap-2">
                <Hash class="h-3 w-3 opacity-60" />
                <span>Production Context</span>
              </div>
              <component :is="collapsed.tasks ? ChevronRight : ChevronDown" class="h-2.5 w-2.5 opacity-50" />
            </button>
            <div v-show="!collapsed.tasks" class="px-3 pb-3 pt-1">
              <div class="text-[10px] text-muted italic p-2 leading-relaxed opacity-70">
                Managed via Business Sidebar.
              </div>
            </div>
          </div>
      </div>
    </div>

    <!-- Link Handles (Visible until hover) -->
    <div 
      v-for="anchor in (['top', 'right', 'bottom', 'left'] as const)" 
      :key="anchor"
      class="absolute h-3.5 w-3.5 rounded-full bg-brand/80 border-2 border-surface opacity-0 group-hover:opacity-100 transition-all cursor-crosshair z-20 hover:scale-125 shadow-sm"
      :class="{
        '-top-1.75 left-1/2 -translate-x-1/2': anchor === 'top',
        '-right-1.75 top-1/2 -translate-y-1/2': anchor === 'right',
        '-bottom-1.75 left-1/2 -translate-x-1/2': anchor === 'bottom',
        '-left-1.75 top-1/2 -translate-y-1/2': anchor === 'left'
      }"
      @mousedown.stop.prevent="emit('link-start', { id: card.id, anchor, event: $event })"
      @mouseenter="emit('link-hover', card.id)"
      @mouseleave="emit('link-hover', null)"
    ></div>
  </article>
</template>

<script setup lang="ts">
import { 
  GripHorizontal,
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  PlayCircle,
  Hash,
  ChevronDown,
  ChevronRight,
  Plus,
  Link2
} from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import type { Card } from '~/stores/workspace'

const props = defineProps<{
  card: Card
  isSelected: boolean
  isLinkingTarget: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  'drag-start': [payload: { id: string; event: MouseEvent }]
  update: [payload: any]
  'link-start': [payload: { id: string; anchor: 'top' | 'right' | 'bottom' | 'left'; event: MouseEvent }]
  'link-hover': [id: string | null]
  'link-drop': [id: string]
}>()

const workspace = useWorkspaceStore()
const rootRef = ref<HTMLElement | null>(null)
let resizeObserver: ResizeObserver | null = null

const draftTitle = ref(props.card.title)
const draftText = ref(props.card.text || '')
const collapsed = ref({
  notes: true,
  media: true,
  tasks: true
})

const fileInput = ref<HTMLInputElement | null>(null)

const triggerUpload = () => fileInput.value?.click()

const getMediaIcon = (type: string) => {
  if (type === 'video') return PlayCircle
  if (type === 'image') return ImageIcon
  return FileText
}

const addMediaFiles = (files: FileList | File[]) => {
  const currentMedia = [...(props.card.content?.media || [])]
  let lockedType = props.card.content?.lockedType || null
  
  for (const file of Array.from(files)) {
    let type = 'file'
    if (file.type.startsWith('image/')) type = 'image'
    else if (file.type.startsWith('video/')) type = 'video'
    
    if (!lockedType) {
      lockedType = type
    }
    
    if (type !== lockedType) {
      continue
    }
    
    currentMedia.push({ name: file.name, type })
  }
  
  emit('update', {
    id: props.card.id,
    content: { ...props.card.content, media: currentMedia.slice(0, 18), lockedType }
  })
}

const handleFileSelect = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) addMediaFiles(target.files)
}

const handleDrop = (e: DragEvent) => {
  if (e.dataTransfer?.files) addMediaFiles(e.dataTransfer.files)
}

const cardStyle = computed(() => ({
  left: `${props.card.x_pos}px`,
  top: `${props.card.y_pos}px`,
  width: `${props.card.width || 300}px`
}))

const cardIcon = computed(() => {
  if (props.card.content?.media?.length) return ImageIcon
  return FileText
})

const commitTitle = () => {
  if (draftTitle.value !== props.card.title) {
    emit('update', { id: props.card.id, title: draftTitle.value })
  }
}

const commitText = () => {
  if (draftText.value !== (props.card.text || '')) {
    emit('update', { 
      id: props.card.id, 
      text: draftText.value
    })
  }
}

onMounted(() => {
  if (rootRef.value) {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === rootRef.value) {
          workspace.updateCard(props.card.id, { height: rootRef.value.offsetHeight })
        }
      }
    })
    resizeObserver.observe(rootRef.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})

watch(() => props.card.title, (v) => draftTitle.value = v)
watch(() => props.card.text, (v) => draftText.value = v || '')

watch(() => props.isSelected, (val) => {
  if (!val) {
    collapsed.value = {
      notes: true,
      media: true,
      tasks: true
    }
  } else {
    // Auto open notes when selected
    collapsed.value.notes = false
  }
}, { immediate: true })
// isLinkingTarget is now a prop

const handleMouseUp = (e: MouseEvent) => {
  emit('link-drop', props.card.id)
}
</script>

<style scoped>
@reference "~/assets/css/main.css";

.sketch-border {
  border-radius: 10px 14px 9px 12px;
}

.premium-scroll::-webkit-scrollbar {
  width: 3px;
}
.premium-scroll::-webkit-scrollbar-thumb {
  background: rgba(var(--c-brand), 0.2);
  border-radius: 10px;
}
</style>
