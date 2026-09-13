<script setup lang="ts">
import type { Show } from '@/types/showTypes'

defineProps<{
  filteredShows: Array<Show>
  filterAnnouncement: string
}>()

const showGenres = (show: Show) => {
  return show.genres.join(', ')
}
</script>

<template>
  <section class="show-list" role="region" aria-label="Available shows">
    <div class="sr-only" aria-live="polite">{{ filterAnnouncement }}</div>
    <router-link
      class="show-card"
      v-for="show in filteredShows"
      :key="show.id"
      :to="{ name: 'show-details', params: { id: show.id } }"
    >
      <div class="show-card__image">
        <img :src="show.image?.medium" alt="" />
      </div>

      <div class="show-card__content">
        <p class="show-card__title">{{ show.name }}</p>
        <p>{{ showGenres(show) }}</p>
      </div>
    </router-link>
  </section>
</template>

<style lang="scss" scoped>
.show-list {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 280px));
  justify-content: start;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(150px, 280px));
    justify-content: center;
  }

  @media (max-width: 440px) {
    grid-template-columns: minmax(150px, 280px);
  }
}

.show-card {
  border: 1px solid #288254;
  color: black;
  text-decoration: none;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 10px 10px 20px grey;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.03);
    z-index: 10;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  }

  &__image {
    aspect-ratio: 4 / 5;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__content {
    padding: 0.5rem;
  }

  &__title {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0 0 0.3rem;
  }
}
</style>
