<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'

const shows = ref([])
const genres = computed(() => {
  const genresFromShows = shows.value.flatMap((show) => show.genres)

  return [...new Set(genresFromShows)].sort()
})
const selectedGenre = ref('all')
const filteredShows = computed(() => {
  if (selectedGenre.value === 'all') {
    return shows.value
  }

  return shows.value.filter((show) => show.genres.includes(selectedGenre.value))
})

const getShows = async () => {
  const response = await fetch('https://api.tvmaze.com/shows')
  return await response.json()
}

const handleSelectGenre = (genre) => {
  console.log(genre)
}

const showGenres = (show) => {
  return show.genres.join(', ')
}

const filterAnnouncement = computed(() => {
  const count = filteredShows.value.length
  const showsLabel = count === 1 ? 'show' : 'shows'

  if (selectedGenre.value === 'all') {
    return `${count} ${showsLabel} found`
  }

  return `${count} ${showsLabel} found for genre ${selectedGenre.value}`
})

onBeforeMount(async () => {
  shows.value = await getShows()
})
</script>

<template>
  <div class="header">
    <h1 class="header__title">TV SHOWS</h1>
    <!--genres-->
    <label class="header__genre-select--label" for="genre-select">Filter shows by genre</label>
    <select
      id="genre-select"
      class="header__genre-select"
      v-model="selectedGenre"
      @change="handleSelectGenre(selectedGenre)"
    >
      <option value="all" key="all">All genres</option>
      <option v-for="category in genres" :key="category" :value="category">
        {{ category }}
      </option>
    </select>
    <div class="sr-only" aria-live="polite">{{ filterAnnouncement }}</div>
  </div>

  <!--TV SHOWS LIST-->
  <section class="show-list" role="region" aria-label="Available shows">
    <router-link
      class="show-card"
      v-for="show in filteredShows"
      :key="show.id"
      :to="{ name: 'show-details', params: { id: show.id } }"
    >
      <div class="show-card__image">
        <img :src="show.image.medium" alt="" />
      </div>

      <div class="show-card__content">
        <p class="show-card__title">{{ show.name }}</p>
        <p>{{ showGenres(show) }}</p>
      </div>
    </router-link>
  </section>
</template>

<style scoped lang="scss">
.header {
  padding: 1rem;
  background-color: #288254;

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

.show-list {
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 440px) {
    justify-content: center;
    grid-template-columns: minmax(150px, 280px);
  }
}

.show-card {
  border: 1px solid #288254;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 10px 10px 20px grey;
  transition: transform 0.2s ease;
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
