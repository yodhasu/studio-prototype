<template>
  <svg class="absolute inset-0 h-full w-full overflow-visible pointer-events-none">
    <g v-for="edge in edges" :key="edge.id" class="pointer-events-auto">
      <path
        :d="edgePath(edge).path"
        fill="none"
        stroke="transparent"
        stroke-width="18"
        class="cursor-pointer"
      />
      <path
        :d="edgePath(edge).path"
        fill="none"
        stroke="rgba(var(--c-cyan), 0.5)"
        stroke-width="2"
        stroke-linecap="round"
        class="transition-all hover:stroke-cyan duration-300"
      />
      
      <foreignObject
        :x="edgePath(edge).mid.x - 34"
        :y="edgePath(edge).mid.y - 12"
        width="68"
        height="24"
      >
        <div class="flex justify-center">
          <span class="badge badge-cyan !px-2 !py-0.5 !text-[9px] bg-bg/80 backdrop-blur-sm border-cyan/30">{{ edge.type.replace('_', ' ') }}</span>
        </div>
      </foreignObject>
    </g>
  </svg>
</template>

<script setup lang="ts">
import type { Card, CardEdge } from '~/stores/workspace'

const props = defineProps<{
  cards: Card[]
  edges: CardEdge[]
}>()

const cardMap = computed(() => new Map(props.cards.map((card) => [card.id, card])))

const anchorPoint = (card: Card, anchor: 'top' | 'right' | 'bottom' | 'left') => {
  const width = card.width || 300
  const height = 200 // Default height
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
