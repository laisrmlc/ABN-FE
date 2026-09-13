<script setup lang="ts">
defineProps<{
  genres: string[]
  selectedGenre: string
  filterAnnouncement: string
}>()

const emit = defineEmits<{
  'update:selectedGenre': [value: string]
}>()
</script>

<template>
  <div class="header">
    <h1 class="header__title" ref="titleRef" tabindex="-1">TV SHOWS</h1>
    <!--GENRES-->
    <label class="header__genre-select--label" for="genre-select">Filter shows by genre</label>
    <select
      id="genre-select"
      class="header__genre-select"
      :value="selectedGenre"
      @change="emit('update:selectedGenre', ($event.target as HTMLSelectElement).value)"
    >
      <option value="all" key="all">All genres</option>
      <option v-for="category in genres" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <div class="sr-only" aria-live="polite">{{ filterAnnouncement }}</div>
  </div>
</template>

<style scoped lang="scss">
.header {
  padding: 1rem;
  background-color: #288254;
  height: 15vh;

  &__title {
    color: #ffd942;
  }

  &__genre-select {
    width: 100%;
    max-width: 20rem;
    border: 1px solid #288254;
    border-radius: 5px;
    color: #288254;
    &--label {
      color: #ffd942;
      margin-right: 0.5rem;
    }
  }
}
</style>
