<template>
  <Teleport to="body">
    <Transition name="base-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <button
          type="button"
          class="absolute inset-0 cursor-default bg-bg/80 backdrop-blur-sm"
          aria-label="Close modal"
          @click="close"
        />

        <section
          class="relative z-[101] w-full overflow-hidden bg-surface shadow-2xl sketch-border"
          :class="[maxWidthClass]"
        >
          <header v-if="title || $slots.header" class="flex items-center justify-between border-b border-border/50 p-6">
            <slot name="header">
              <h3 class="text-base font-semibold leading-6 text-text">
                {{ title }}
              </h3>
            </slot>
            <button
              v-if="showClose"
              type="button"
              class="btn btn-ghost btn-icon"
              aria-label="Close modal"
              @click="close"
            >
              x
            </button>
          </header>

          <slot />

          <footer v-if="$slots.footer" class="border-t border-border/50 bg-panel/30 p-6">
            <slot name="footer" />
          </footer>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, watch } from 'vue'

const isOpen = defineModel<boolean>('open', { default: false })

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  showClose: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: String,
    default: '2xl',
    validator: (val: string) => ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'].includes(val)
  }
})

const maxWidthClass = computed(() => {
  return `max-w-${props.maxWidth}`
})

function close() {
  isOpen.value = false
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    close()
  }
}

watch(isOpen, (newVal) => {
  document.body.style.overflow = newVal ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.base-modal-enter-active,
.base-modal-leave-active {
  transition: opacity 0.2s ease;
}

.base-modal-enter-from,
.base-modal-leave-to {
  opacity: 0;
}

.base-modal-enter-active section,
.base-modal-leave-active section {
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.base-modal-enter-from section,
.base-modal-leave-to section {
  transform: scale(0.95) translateY(10px);
}
</style>
