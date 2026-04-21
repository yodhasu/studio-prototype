<template>
  <div class="relative h-full w-full overflow-hidden bg-[var(--c-bg)]">
    <!-- Canvas Grid -->
    <div 
      class="canvas-bg absolute z-0 transition-transform duration-0 ease-linear"
      style="top: 0; left: 0; right: 0; bottom: 0;"
      :style="canvasTransform"
      @mousedown="onCanvasMouseDown"
      @mousemove="onCanvasMouseMove"
      @mouseup="onCanvasMouseUp"
      @wheel="onCanvasWheel"
    >
      <LinkLayer 
        :edges="workspace.edges" 
        :cards="workspace.cards" 
        :pending-edge="(linkingState.isLinking && linkingState.startId) ? {
          source: workspace.cards.find(c => c.id === linkingState.startId),
          sourceAnchor: linkingState.startAnchor!,
          targetPos: linkingState.mousePos
        } : null"
      />
      
      <CardNode 
        v-for="card in workspace.cards" 
        :key="card.id" 
        :card="card"
        :is-selected="selectedCardId === card.id"
        :is-linking-target="linkingState.targetId === card.id"
        @select="selectCard"
        @drag-start="onCardDragStart"
        @update="updateCard"
        @link-start="onLinkStart"
        @link-drop="onLinkDrop"
      />
    </div>

    <!-- PREMIUM WORKSPACE TOOLBAR -->
    <div class="absolute left-6 top-6 z-10 flex items-center gap-3">
      <!-- Main Actions Block -->
      <div class="flex items-center gap-1.5 sketch-border bg-surface/90 backdrop-blur-md p-1.5 shadow-lg">
        <div class="flex items-center px-1">
          <button class="btn btn-ghost h-8 w-8 !p-0 hover:bg-brand/5 hover:text-brand transition-all" title="Add Card" @click="addCard">
            <Plus class="h-4.5 w-4.5" />
          </button>
        </div>
        <div class="h-6 w-px bg-border/40 mx-0.5"></div>
        <div class="flex items-center gap-0.5">
          <button class="btn btn-ghost h-8 w-8 !p-0 hover:bg-brand/5" title="Zoom In" @click="zoomIn">
            <ZoomIn class="h-3.5 w-3.5" />
          </button>
          <button class="btn btn-ghost h-8 w-8 !p-0 hover:bg-brand/5" title="Zoom Out" @click="zoomOut">
            <ZoomOut class="h-3.5 w-3.5" />
          </button>
          <button class="btn btn-ghost h-8 w-8 !p-0 hover:bg-brand/5" title="Reset View" @click="resetView">
            <Maximize class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <!-- Collaborative Stack (Integrated look) -->
      <div 
        class="flex items-center gap-2.5 sketch-border bg-surface/90 backdrop-blur-md px-3 py-1.5 shadow-lg cursor-pointer hover:bg-panel/40 transition-all group"
        @click="isSidebarOpen = true"
      >
        <div class="flex -space-x-1.5">
          <div v-for="i in 2" :key="i" class="h-5.5 w-5.5 rounded-full border border-surface bg-brand/10 flex items-center justify-center text-[8px] font-bold text-brand">
            {{ ['AM', 'JH'][i-1] }}
          </div>
        </div>
        <span class="text-[9px] font-black uppercase tracking-[0.15em] text-muted group-hover:text-brand transition-colors">Team</span>
      </div>
    </div>

    <ProjectDetailSidebar 
      v-model:open="isSidebarOpen" 
      :project-id="(route.params.id as string)" 
    />
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

const linkingState = ref({
  isLinking: false,
  startId: null as string | null,
  startAnchor: null as 'top' | 'right' | 'bottom' | 'left' | null,
  targetId: null as string | null,
  mousePos: { x: 0, y: 0 }
})

const isSidebarOpen = ref(false)

const canvasTransform = computed(() => ({
  transform: `translate(${panX.value}px, ${panY.value}px) scale(${zoom.value})`,
  transformOrigin: '0 0'
}))

const selectCard = (id: string) => {
  selectedCardId.value = id
  isSidebarOpen.value = true
}

const updateCard = (payload: any) => {
  workspace.updateCard(payload.id, payload)
}

const addCard = () => {
  const ws = workspace.workspaces.find(w => w.project_id === route.params.id)
  if (!ws) return

  const jitter = () => (Math.random() - 0.5) * 40
  const x = (window.innerWidth / 2 - panX.value) / zoom.value + jitter()
  const y = (window.innerHeight / 2 - panY.value) / zoom.value + jitter()
  workspace.createCard(ws.id, 'New Concept', x, y)
}

const onCanvasMouseDown = (e: MouseEvent) => {
  if (e.button === 1 || (e.button === 0 && e.altKey)) {
    isPanning.value = true
    lastMousePos.value = { x: e.clientX, y: e.clientY }
  } else if (e.target === e.currentTarget) {
    selectedCardId.value = null
    isSidebarOpen.value = false
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

  if (linkingState.value.isLinking) {
    linkingState.value.mousePos = {
      x: (e.clientX - panX.value) / zoom.value,
      y: (e.clientY - panY.value) / zoom.value
    }
  }
}

const onCanvasMouseUp = () => {
  isPanning.value = false
  // If we release on the canvas (not a card), cancel linking
  setTimeout(() => {
    if (linkingState.value.isLinking) {
      linkingState.value.isLinking = false
      linkingState.value.startId = null
    }
  }, 50)
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


const onLinkDrop = (targetId: string) => {
  if (linkingState.value.isLinking && linkingState.value.startId) {
    if (linkingState.value.startId !== targetId) {
      workspace.createEdge(linkingState.value.startId, targetId)
    }
    linkingState.value.isLinking = false
    linkingState.value.startId = null
  }
}

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

const onLinkStart = (payload: { id: string, anchor: 'top' | 'right' | 'bottom' | 'left', event: MouseEvent }) => {
  linkingState.value.isLinking = true
  linkingState.value.startId = payload.id
  linkingState.value.startAnchor = payload.anchor
  
  const updateMouse = (e: MouseEvent) => {
    linkingState.value.mousePos = {
      x: (e.clientX - panX.value) / zoom.value,
      y: (e.clientY - panY.value) / zoom.value
    }
  }
  
  const endLinking = () => {
    if (linkingState.value.targetId && linkingState.value.targetId !== linkingState.value.startId) {
      workspace.createEdge(linkingState.value.startId!, linkingState.value.targetId!)
    }
    linkingState.value.isLinking = false
    linkingState.value.startId = null
    linkingState.value.startAnchor = null
    linkingState.value.targetId = null
    window.removeEventListener('mousemove', updateMouse)
    window.removeEventListener('mouseup', endLinking)
  }
  
  updateMouse(payload.event)
  window.addEventListener('mousemove', updateMouse)
  window.addEventListener('mouseup', endLinking)
}

const onLinkHover = (id: string | null) => {
  linkingState.value.targetId = id
}

onMounted(async () => {
  await ensureSession()
  await workspace.fetchCards(route.params.id as string)
})
</script>

<style scoped>
@reference "~/assets/css/main.css";

.canvas-bg {
  @apply bg-[var(--c-bg)] absolute inset-0 z-0;
  background-image: radial-gradient(circle, rgba(var(--c-border-hi), 0.3) 1px, transparent 1px);
  background-size: 32px 32px;
}
</style>
