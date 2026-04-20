<script setup lang="ts">
definePageMeta({
  middleware: [
    function () {
      return navigateTo('/workspace/dashboard')
    },
  ],
})
</script>

<template>
  <div />
</template>
