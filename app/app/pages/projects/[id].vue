<template>
  <div class="relative h-full w-full overflow-hidden bg-bg">
    <!-- Canvas Grid -->
    <div 
      class="canvas-bg absolute inset-0 z-0 transition-transform duration-0 ease-linear"
      :style="canvasTransform"
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      @wheel="onCanvasWheel"
    >
      <LinkLayer :edges="workspace.edges" :cards="workspace.cards" />
      
      <CardNode
        v-for="card in workspace.cards"
        :key="card.id"
        :card="card"
        :is-selected="selectedCardId === card.id"
        @select="selectCard"
        @update="updateCard"
        @drag-start="onCardDragStart"
      />
    </div>

    <!-- UI Overlay -->
    <div class="absolute left-6 top-6 z-10 flex flex-col gap-4">
      <div class="flex items-center gap-2 rounded-xl border border-border bg-surface/80 p-1.5 backdrop-blur-md shadow-lg">
        <button class="btn btn-ghost h-9 w-9 p-0" @click="addCard">
          <Plus class="h-4 w-4" />
        </button>
        <div class="h-4 w-px bg-border mx-1"></div>
        <button class="btn btn-ghost h-9 w-9 p-0" title="Zoom In" @click="zoomIn">
          <ZoomIn class="h-4 w-4" />
        </button>
        <button class="btn btn-ghost h-9 w-9 p-0" title="Zoom Out" @click="zoomOut">
          <ZoomOut class="h-4 w-4" />
        </button>
        <button class="btn btn-ghost h-9 w-9 p-0" title="Reset View" @click="resetView">
          <Maximize class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div class="absolute right-6 top-6 z-10">
      <div class="flex items-center gap-3 rounded-xl border border-border bg-surface/80 p-2 backdrop-blur-md shadow-lg">
        <div class="flex -space-x-2">
          <div v-for="i in 3" :key="i" class="h-7 w-7 rounded-full border-2 border-surface bg-brand/20 flex items-center justify-center text-[10px] font-bold">
            {{ ['AM', 'MC', 'JH'][i-1] }}
          </div>
        </div>
        <button class="btn btn-primary h-8 px-3 text-xs">Share</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Plus, ZoomIn, ZoomOut, Maximize } from 'lucide-vue-next'
import { useWorkspaceStore } from '~/stores/workspace'
import { useWorkspaceBoot } from '~/composables/useWorkspaceBoot'

const route = useRoute()
const workspace = useWorkspaceStore()
const { ensureSession } = useWorkspaceBoot()

const selectedCardId = ref<string | null>(null)
const panX = ref(0)
const panY = ref(0)
const zoom = ref(1)

const isPanning = ref(false)
const lastMousePos = ref({ x: 0, y: 0 })

const canvasTransform = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
  transformOrigin: '0 0'
}))

const selectCard = (id: string) => {
  selectedCardId.value = id
}

const updateCard = (payload: any) => {
  workspace.updateCard(payload.id, payload)
}

const addCard = () => {
  const x = (window.innerWidth / 2 - panX.value) / zoom.value
  const y = (window.innerHeight / 2 - panY.value) / zoom.value
  workspace.createCard(route.params.id as string, 'New Concept', x, y)
}

const onCanvasMouseDown = (e: MouseEvent) => {
  if (e.button === 1 || (e.button === 0 && e.altKey)) {
    isPanning.value = true
    lastMousePos.value = { x: e.clientX, y: e.clientY }
  } else if (e.target === e.currentTarget) {
    selectedCardId.value = null
  }
}

const onCanvasMouseMove = (e: MouseEvent) => {
  if (isPanning.value) {
    const dx = e.clientX - lastMousePos.value.x
    const dy = e.clientY - lastMousePos.value.y
    panX.value += dx
    panY.value += dy
    lastMousePos.value = { x: e.clientX, y: e.clientY }
  }
}

const onCanvasMouseUp = () => {
  isPanning.value = false
}

const onCanvasWheel = (e: WheelEvent) => {
  if (e.ctrlKey) {
    e.preventDefault()
    const delta = -e.deltaY * 0.001
    const newZoom = Math.min(Math.max(0.1, zoom.value + delta), 2)
    zoom.value = newZoom
  } else {
    panX.value -= e.deltaX
    panY.value -= e.deltaY
  }
}

const zoomIn = () => zoom.value = Math.min(zoom.value + 0.1, 2)
const zoomOut = () => zoom.value = Math.max(zoom.value - 0.1, 0.1)
const resetView = () => {
  panX.value = 0
  panY.value = 0
  zoom.value = 1
}

// Drag logic
const draggingCardId = ref<string | null>(null)
const dragStartPos = ref({ x: 0, y: 0 })

const onCardDragStart = (payload: any) => {
  draggingCardId.value = payload.id
  const event = payload.event as MouseEvent
  const card = workspace.cards.find(c => c.id === payload.id)
  if (card) {
    dragStartPos.value = {
      x: event.clientX - card.x_pos * zoom.value,
      y: event.clientY - card.y_pos * zoom.value
    }
    
    const onMouseMove = (e: MouseEvent) => {
      if (draggingCardId.value) {
        const x = (e.clientX - dragStartPos.value.x) / zoom.value
        const y = (e.clientY - dragStartPos.value.y) / zoom.value
        workspace.updateCard(draggingCardId.value, { x_pos: x, y_pos: y })
      }
    }
    
    const onMouseUp = () => {
      draggingCardId.value = null
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
    
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
}

onMounted(async () => {
  await ensureSession()
  await workspace.fetchCards(route.params.id as string)
})
</script>

<style scoped>
.canvas-bg {
  background-image: radial-gradient(circle, rgba(var(--c-border), 0.3) 1px, transparent 1px);
  background-size: 32px 32px;
}
</style>
