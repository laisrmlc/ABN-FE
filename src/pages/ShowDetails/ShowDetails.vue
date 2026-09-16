<script setup lang="ts">
import { useRouter } from 'vue-router'
import ShowDetailsContent from './ShowDetailsContent.vue'

const router = useRouter()

const handleNavigation = () => router.push({ name: 'dashboard' })
</script>

<template>
  <header class="header">
    <div class="header__title">TV SHOWS</div>

    <button type="button" class="dashboard-button" @click="handleNavigation">Dashboard</button>
  </header>

  <ShowDetailsContent></ShowDetailsContent>
</template>

<style scoped lang="scss">
.header {
  background-color: var(--color-primary);
  color: var(--color-accent);
  height: 15vh;
  padding: 1rem;

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }
}

.dashboard-button {
  background-color: var(--color-primary);
  color: var(--color-accent);
  border: none;
  transition: transform 0.25s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
}
</style>
