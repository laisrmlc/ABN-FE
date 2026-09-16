<script setup lang="ts">
import notFoundImage from '@/assets/images/not-found-tv.svg'

withDefaults(defineProps<{ message?: string }>(), {
  message: 'Sorry, the content you are looking for is not available.',
})
</script>

<template>
  <div class="empty-state">
    <div class="empty-state__image-wrapper">
      <img
        :src="notFoundImage"
        class="empty-state__image"
        alt="Image of a vintage yellow TV written 404 in the screen"
      />
    </div>
    <div class="empty-state__message">
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-state {
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
