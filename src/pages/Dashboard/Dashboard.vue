<script setup lang="ts">
import { useShows } from '@/composables/useShows'
import { computed, onBeforeMount, ref } from 'vue'
import DashboardHeader from './DashboardHeader.vue'
import DashboardShowList from './DashboardShowList.vue'
import type { Show } from '@/types/showTypes.ts'

const { shows, loading, error, fetchShows } = useShows()
const selectedGenre = ref('all')
const nameFilter = ref('')

const genres = computed(() => {
  const genresFromShows = shows.value.flatMap((show: Show) => show.genres)

  return [...new Set(genresFromShows)].sort()
})

const filteredShows = computed(() => {
  let result = shows.value

  if (selectedGenre.value !== 'all') {
    result = result.filter((show: Show) => show.genres.includes(selectedGenre.value))
  }

  const search = nameFilter.value.trim().toLowerCase()
  if (search) {
    result = result.filter((show: Show) => show.name.toLowerCase().includes(search))
  }

  return result
})

const filterAnnouncement = computed(() => {
  const count = filteredShows.value.length
  const showsLabel = count === 1 ? 'show' : 'shows'

  if (selectedGenre.value === 'all') {
    return `${count} ${showsLabel} found`
  }

  return `${count} ${showsLabel} found for genre ${selectedGenre.value}`
})

onBeforeMount(async () => {
  document.title = 'TV Shows'
  await fetchShows()
})
</script>

<template>
  <DashboardHeader
    :genres="genres"
    v-model:selectedGenre="selectedGenre"
    @search="nameFilter = $event"
  ></DashboardHeader>

  <p v-if="loading" role="status">Loading shows…</p>

  <p v-else-if="error" role="alert">
    Something went wrong while loading shows. Please try again later.
  </p>

  <!--TV SHOWS LIST-->
  <DashboardShowList v-else :filteredShows="filteredShows" :filterAnnouncement="filterAnnouncement" />
</template>
