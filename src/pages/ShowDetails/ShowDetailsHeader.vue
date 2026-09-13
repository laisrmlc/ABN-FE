<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <header class="header">
    <div class="header__title">TV SHOWS</div>

    <button type="button" class="dashboard-button" @click="router.push({ name: 'dashboard' })">
      Dashboard
    </button>
  </header>
</template>

<style lang="scss">
.header {
  background-color: #288254;
  color: #ffd942;
  height: 15vh;
  padding: 1rem;

  &__title {
    font-size: 2rem;
    font-weight: bold;
  }
}

.dashboard-button {
  background-color: #288254;
  color: #ffd942;
  border: none;
  transition: transform 0.25s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.2);
  }
}
</style>
