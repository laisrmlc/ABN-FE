<script setup lang="ts">
import notFoundImage from '@/assets/images/not-found-tv.png'

withDefaults(
  defineProps<{
    isShow?: boolean
    message?: string
  }>(),
  {
    isShow: false,
    message: 'Sorry, the content you are looking for is not available.',
  },
)
</script>

<template>
  <div class="page-not-found">
    <h1 v-if="isShow">Page not found</h1>
    <div class="page-not-found__image-wrapper">
      <img
        :src="notFoundImage"
        class="page-not-found__image"
        alt="Image of a vintage yellow TV written 404 in the screen"
      />
    </div>
    <div class="page-not-found__message">
      <p>{{ message }}</p>
      <router-link v-if="isShow" key="dashboard-link" :to="{ name: 'dashboard' }">
        Go back to shows list
      </router-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-not-found {
  display: block;
  padding: 2rem;
  justify-content: center;
  color: var(--color-primary);

  &__message {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__image-wrapper {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  &__image {
    max-height: 40vh;
  }
}
</style>
