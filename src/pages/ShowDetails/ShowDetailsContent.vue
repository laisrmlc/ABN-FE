<script setup lang="ts">
import { getShows } from '@/utils/showsList'
import { nextTick, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Show } from '@/types/showTypes'

const daysOnAir = ref('')
const route = useRoute()
const showId = route.params.id

const selectedShow = ref()

const showTitleRef = ref<HTMLElement | null>(null)

onBeforeMount(async () => {
  const shows = await getShows()

  const selectedShowInfo = shows.find((show: Show) => show.id.toString() === showId?.toString())

  selectedShow.value = selectedShowInfo

  if (selectedShow.value) {
    daysOnAir.value = selectedShow.value.schedule.days.join(' and ')
    document.title = `${selectedShow.value.name} | TV Shows`

    await nextTick()
    showTitleRef.value?.focus()
  }
})
</script>

<template>
  <main class="show-details">
    <p v-if="!selectedShow" role="status">Loading show details…</p>

    <template v-else>
      <div class="show-details__summary" aria-labelledby="show-title">
        <h1 id="show-title" ref="showTitleRef" tabindex="-1">
          {{ selectedShow.name }}
        </h1>

        <div class="show-details__image">
          <img :src="selectedShow.image.medium" :alt="`${selectedShow.name} poster`" />
        </div>
      </div>

      <div class="show-details__content">
        <div v-html="selectedShow.summary"></div>
        <div class="show-details__info" aria-labelledby="show-info-heading">
          <h2 id="show-info-heading">Details</h2>

          <p>
            <strong>Genres:</strong>
            {{ selectedShow.genres.join(', ') }}
          </p>

          <p>
            <strong>Rating:</strong>
            {{ selectedShow.rating.average }}
          </p>

          <p>
            <strong>Status:</strong>
            {{ selectedShow.status || 'Still running' }}
          </p>

          <p>
            <strong>Where to watch:</strong>
            {{ selectedShow.network?.name || selectedShow.webChannel?.name || 'Not available' }}
          </p>

          <p v-if="selectedShow.network?.name && daysOnAir">
            Every {{ daysOnAir }}
            <span v-if="selectedShow.schedule.time"> at {{ selectedShow.schedule.time }} </span>
          </p>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped lang="scss">
.show-details {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem;
  align-items: start;

  #show-title {
    padding: 0;
  }

  &__image {
    img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 5px;
      box-shadow: 10px 10px 20px grey;
    }
  }

  &__content {
    color: #288254;
    min-width: 0;
    align-self: center;
  }

  &__summary {
    margin: 1rem;
    color: #288254;
  }

  &__info {
    color: #288254;
    margin-top: 2rem;

    h2 {
      margin-bottom: 0.5rem;
    }
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;

    &__image {
      max-width: 300px;
      margin: 0 auto;
    }
  }
}
</style>
