<script setup lang="ts">
import { getShows, sortByRating } from '@/utils/showsList'
import { computed, nextTick, onBeforeMount, ref } from 'vue'
import DashboardHeader from './DashboardHeader.vue'
import DashboardShowList from './DashboardShowList.vue'
import type { Show } from '@/types/showTypes.ts'

const shows = ref<Show[]>([])
const titleRef = ref<HTMLElement | null>(null)
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
  await nextTick()
  titleRef.value?.focus()

  const result = await getShows()
  shows.value = sortByRating(result)
})
</script>

<template>
  <DashboardHeader
    :genres="genres"
    v-model:selectedGenre="selectedGenre"
    @search="nameFilter = $event"
  ></DashboardHeader>

  <!--TV SHOWS LIST-->
  <DashboardShowList :filteredShows="filteredShows" :filterAnnouncement="filterAnnouncement" />
</template>
