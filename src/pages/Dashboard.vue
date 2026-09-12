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

const getGenreList = (shows) => {
  const genresFromShows = shows.flatMap((show) => show.genres)
  const uniqueGenres = new Set(genresFromShows)
  const genresList = Array.from(uniqueGenres)

  return genresList.sort()
}

const showGenres = (show) => {
  return show.genres.join(', ')
}

onBeforeMount(async () => {
  shows.value = await getShows()
})
</script>

<template>
  <h1>TV SHOWS</h1>
  <!--genres-->
  <select v-model="selectedGenre">
    <option value="all" key="all">All genres</option>
    <option v-for="category in genres" :key="category" :value="category" @click="handleSelectGenre">
      {{ category }}
    </option>
  </select>

  <!--TV SHOWS LIST-->
  <div>
    <div v-for="show in filteredShows" :key="show.id">
      <img :src="show.image.medium" :alt="show.name" />
      <h2>{{ show.name }}</h2>
      <p>{{ showGenres(show) }}</p>
    </div>
  </div>
</template>

<style scoped></style>
