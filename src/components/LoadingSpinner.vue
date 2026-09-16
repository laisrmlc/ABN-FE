<script setup lang="ts">
import spinnerIcon from '@/assets/icons/spinner.svg'
</script>

<template>
  <p class="loading" role="status">
    <img :src="spinnerIcon" class="loading__spinner" aria-hidden="true" alt="" />
    Loading…
  </p>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;

  &__spinner {
    width: 1.25rem;
    height: 1.25rem;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
