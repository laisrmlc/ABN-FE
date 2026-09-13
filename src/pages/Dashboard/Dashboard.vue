<script setup lang="ts">
import { getShows } from '@/utils/showsList'
import { computed, nextTick, onBeforeMount, ref } from 'vue'
import DashboardHeader from './DashboardHeader.vue'
import DashboardShowList from './DashboardShowList.vue'

const shows = ref([])
const titleRef = ref<HTMLElement | null>(null)
const genres = computed(() => {
  const genresFromShows = shows.value.flatMap((show) => show.genres)

  return [...new Set(genresFromShows)].sort()
})
const selectedGenre = ref('all')
const filteredShows = computed(() => {
  if (selectedGenre.value === 'all') {
    return shows.value
  }

  return shows.value
    .filter((show) => show.genres.includes(selectedGenre.value))
    .sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
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
  await nextTick()
  titleRef.value?.focus()

  const result = await getShows()
  shows.value = result.sort((a, b) => (b.rating.average ?? 0) - (a.rating.average ?? 0))
})
</script>

<template>
  <DashboardHeader
    :genres="genres"
    v-model:selectedGenre="selectedGenre"
    :filterAnnouncement="filterAnnouncement"
  ></DashboardHeader>

  <!--TV SHOWS LIST-->
  <DashboardShowList :filteredShows="filteredShows" />
</template>
