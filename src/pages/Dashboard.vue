<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'

const shows = ref([])
const categories = ref([])

const getShows = async () => {
  const response = await fetch('https://api.tvmaze.com/shows')
  return await response.json()
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
  categories.value = getGenreList(shows.value)
})
</script>

<template>
  <h1>TV SHOWS</h1>
  <!--CATEGORIES-->
  <select>
    <option value="all">All Genres</option>
    <option v-for="category in categories" :key="category" :value="category">
      {{ category }}
    </option>
  </select>

  <!--TV SHOWS LIST-->
  <div>
    <div v-for="show in shows" :key="show.id">
      <img :src="show.image.medium" :alt="show.name" />
      <h2>{{ show.name }}</h2>
      <p>{{ showGenres(show) }}</p>
    </div>
  </div>
</template>

<style scoped></style>
