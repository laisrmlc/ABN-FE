<script setup lang="ts">
import { debounce } from '@/utils/debounce'

defineProps<{
  genres: string[]
  selectedGenre: string
}>()

const emit = defineEmits<{
  'update:selectedGenre': [value: string]
  search: [value: string]
}>()

const handleSearch = debounce((event: Event) => {
  const target = event.target as HTMLInputElement
  emit('search', target.value)
}, 200)
</script>

<template>
  <div class="header">
    <h1 class="header__title" ref="titleRef" tabindex="-1">TV SHOWS</h1>

    <div class="show-list-filters">
      <div class="genre-filter">
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
      </div>

      <div class="filter-by-name__input">
        <label for="filter-by-name-input" aria-label="Filter shows list by name"></label>
        <input id="filter-by-name-input" @input="handleSearch" />
        <svg
          class="filter-by-name__search-icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  padding: 1rem;
  background-color: #288254;
  height: fit-content;

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
      white-space: nowrap;
    }
  }

  .show-list-filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  .genre-filter {
    display: flex;
    align-items: center;
    flex: 1 1 260px;
    min-width: 0;
  }

  .filter-by-name__input {
    position: relative;
    margin-left: auto;
    display: flex;
    align-items: center;
    flex: 1 1 260px;
    max-width: 20rem;

    input {
      width: 100%;
      box-sizing: border-box;
      padding-right: 2rem;
      border: 1px solid #288254;
      border-radius: 5px;
      max-width: 20rem;
    }
  }

  .filter-by-name__search-icon {
    position: absolute;
    right: 0.5rem;
    color: #288254;
    pointer-events: none;
  }

  @media (max-width: 570px) {
    .genre-filter {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
    }

    .filter-by-name__input {
      margin-left: 0;
      max-width: none;
      width: 100%;
    }
  }
}
</style>
