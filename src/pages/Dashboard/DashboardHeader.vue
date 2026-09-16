<script setup lang="ts">
import { debounce } from '@/utils/debounce'
import { nextTick, onMounted, ref } from 'vue'

defineProps<{
  genres: string[]
  selectedGenre: string
}>()

const emit = defineEmits<{
  'update:selectedGenre': [value: string]
  search: [value: string]
}>()

const titleRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  await nextTick()
  titleRef.value?.focus()
})

const handleSearch = debounce((event: Event) => {
  const target = event.target as HTMLInputElement
  emit('search', target.value)
}, 200)
</script>

<template>
  <div class="header">
    <h1 class="header__title" ref="titleRef" tabindex="-1">TV SHOWS</h1>

    <div class="header__filters">
      <div class="header__genre-filter">
        <label class="header__genre-select-label" for="genre-select">Filter shows by genre</label>
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

      <div class="header__search">
        <label class="sr-only" for="filter-by-name-input">Filter shows list by name</label>
        <input id="filter-by-name-input" @input="handleSearch" placeholder="Search by name" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header {
  padding: 1rem;
  background-color: var(--color-primary);
  height: fit-content;

  &__title {
    color: var(--color-accent);

    &:focus {
      outline: none;
    }
  }

  &__genre-select {
    width: 100%;
    max-width: 20rem;
    border: 1px solid var(--color-primary);
    border-radius: 5px;
    color: black;
  }

  &__genre-select-label {
    color: var(--color-accent);
    margin-right: 0.5rem;
    white-space: nowrap;
  }

  &__filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  &__genre-filter {
    display: flex;
    align-items: center;
    flex: 1 1 260px;
    min-width: 0;
  }

  &__search {
    margin-left: auto;
    display: flex;
    align-items: center;
    flex: 1 1 260px;
    max-width: 20rem;

    input {
      width: 100%;
      box-sizing: border-box;
      border: 1px solid var(--color-primary);
      border-radius: 5px;
      max-width: 20rem;
    }
  }

  @media (max-width: 570px) {
    .header__genre-filter {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
    }

    .header__search {
      margin-left: 0;
      max-width: none;
      width: 100%;
    }
  }
}
</style>
