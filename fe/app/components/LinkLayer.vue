<template>
  <svg class="absolute inset-0 h-full w-full overflow-visible pointer-events-none">
    <g
      v-for="edge in edges"
      :key="edge.id"
      class="group pointer-events-auto"
      @mouseenter="hoveredEdgeId = edge.id"
      @mouseleave="hoveredEdgeId = null"
    >
      <!-- Broad Hit Area -->
      <path
        :d="edgePath(edge).path"
        fill="none"
        stroke="transparent"
        stroke-width="20"
        class="cursor-pointer"
      />
      
      <!-- Inked Path: Background Bleed -->
      <path
        :d="edgePath(edge).path"
        fill="none"
        stroke="rgb(var(--c-brand) / 0.1)"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <!-- Inked Path: Main Stroke (More weight and darker) -->
      <path
        :d="edgePath(edge).path"
        fill="none"
        stroke="var(--c-brand)"
        stroke-width="1.8"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-dasharray="180 2 120 1 200 1.5"
        class="transition-all hover:stroke-brand/80 hover:stroke-[2.2px] duration-300"
      />
      
      <foreignObject
        v-if="hoveredEdgeId === edge.id"
        :x="edgePath(edge).mid.x - 40"
        :y="edgePath(edge).mid.y - 14"
        width="80"
        height="28"
      >
        <div class="flex justify-center">
          <span class="badge badge-brand !px-3 !py-1 !text-[8.5px] bg-[var(--c-bg)]/95 backdrop-blur-md border-brand/20 sketch-border shadow-md uppercase tracking-widest font-black">{{ edge.type.replace('_', ' ') }}</span>
        </div>
      </foreignObject>
    </g>
    
    <!-- Pending Connection Line (Live Drag) -->
    <g v-if="pendingEdge" class="pointer-events-none">
      <path
        :d="curve(anchorPoint(pendingEdge.source, pendingEdge.sourceAnchor), pendingEdge.targetPos).path"
        fill="none"
        stroke="rgb(var(--c-brand) / 0.4)"
        stroke-width="2"
        stroke-dasharray="8 6"
        stroke-linecap="round"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { Card, CardEdge } from '~/stores/workspace'

const hoveredEdgeId = ref<string | null>(null)

const props = defineProps<{ 
  cards: Card[]
  edges: CardEdge[]
  pendingEdge?: {
    source: Card
    sourceAnchor: 'top' | 'right' | 'bottom' | 'left'
    targetPos: { x: number; y: number }
  } | null
}>()

const cardMap = computed(() => new Map(props.cards.map((card) => [card.id, card])))

const anchorPoint = (card: Card, anchor: 'top' | 'right' | 'bottom' | 'left') => {
  const width = card.width || 300
  const height = card.height || 200
  const center = { x: card.x_pos + width / 2, y: card.y_pos + height / 2 }

  switch (anchor) {
    case 'top': return { x: center.x, y: card.y_pos }
    case 'right': return { x: card.x_pos + width, y: center.y }
    case 'bottom': return { x: center.x, y: card.y_pos + height }
    case 'left': return { x: card.x_pos, y: center.y }
  }
}

const pickAnchors = (source: Card, target: Card): ['top' | 'right' | 'bottom' | 'left', 'top' | 'right' | 'bottom' | 'left'] => {
  const dx = target.x_pos - source.x_pos
  const dy = target.y_pos - source.y_pos
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx >= 0 ? ['right', 'left'] : ['left', 'right']
  }
  return dy >= 0 ? ['bottom', 'top'] : ['top', 'bottom']
}

const curve = (start: { x: number; y: number }, end: { x: number; y: number }) => {
  const dx = end.x - start.x
  const dy = end.y - start.y
  const controlOffset = Math.max(Math.abs(dx), Math.abs(dy)) * 0.4
  const c1 = { x: start.x + (dx >= 0 ? controlOffset : -controlOffset), y: start.y }
  const c2 = { x: end.x - (dx >= 0 ? controlOffset : -controlOffset), y: end.y }
  const mid = { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2 }
  return {
    path: `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`,
    mid,
  }
}

const edgePath = (edge: CardEdge) => {
  const source = cardMap.value.get(edge.source_card_id)
  const target = cardMap.value.get(edge.target_card_id)
  if (!source || !target) return { path: '', mid: { x: 0, y: 0 } }
  
  const [sourceAnchor, targetAnchor] = pickAnchors(source, target)
  const start = anchorPoint(source, sourceAnchor)
  const end = anchorPoint(target, targetAnchor)
  return curve(start, end)
}
</script>

<style scoped>
.sketch-border {
  border-radius: 6px 8px 5px 7px;
}
</style>
