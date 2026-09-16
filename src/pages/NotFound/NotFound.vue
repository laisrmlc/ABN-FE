<script setup lang="ts">
import { onBeforeMount } from 'vue'
import EmptyState from '@/components/EmptyState.vue'

defineProps<{ message?: string }>()

onBeforeMount(() => {
  document.title = 'Page not found | TV Shows'
})
</script>

<template>
  <div class="page-not-found">
    <h1 class="page-not-found__heading">Page not found</h1>
    <EmptyState :message="message" />
    <div class="page-not-found__link">
      <router-link key="dashboard-link" :to="{ name: 'dashboard' }">
        Go back to shows list
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-not-found {
  color: var(--color-primary);

  &__heading {
    padding: 2rem 2rem 0;
  }

  &__link {
    display: flex;
    justify-content: center;
    padding: 0 2rem 2rem;
  }
}
</style>
