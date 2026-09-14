<script setup lang="ts">
import { getShowInfo } from '@/utils/showsList'
import { computed, nextTick, onBeforeMount, ref } from 'vue'
import { useRoute } from 'vue-router'
import DOMPurify from 'dompurify'
import NotFound from '../NotFound/NotFound.vue'
import type { Show } from '@/types/showTypes.ts'

const daysOnAir = ref('')
const route = useRoute()
const showId = route.params.id

const selectedShow = ref<Show | null>(null)
const loading = ref(false)

const plainTextSummary = computed(() =>
  selectedShow.value ? DOMPurify.sanitize(selectedShow.value.summary, { ALLOWED_TAGS: [] }) : '',
)

const showTitleRef = ref<HTMLElement | null>(null)

onBeforeMount(async () => {
  try {
    loading.value = true
    selectedShow.value = await getShowInfo(showId?.toString() || '')
  } finally {
    loading.value = false
  }

  if (selectedShow.value) {
    daysOnAir.value = selectedShow.value.schedule.days.join(' and ')
    document.title = `${selectedShow.value.name} | TV Shows`

    await nextTick()
    showTitleRef.value?.focus()
  }
})
</script>

<template>
  <p v-if="!selectedShow && loading" role="status">Loading show details…</p>

  <NotFound v-else-if="!selectedShow && !loading" :isShow="true"></NotFound>

  <main v-if="selectedShow" class="show-details">
    <div class="show-details__summary" aria-labelledby="show-title">
      <h1 id="show-title" ref="showTitleRef" tabindex="-1">
        {{ selectedShow?.name }}
      </h1>

      <div class="show-details__image">
        <img :src="selectedShow.image?.medium" :alt="`${selectedShow.name} poster`" />
      </div>
    </div>

    <div class="show-details__content">
      <p>{{ plainTextSummary }}</p>
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
          <strong>
            Every {{ daysOnAir }}
            <span v-if="selectedShow.schedule.time">
              at {{ selectedShow.schedule.time }}
            </span></strong
          >
        </p>
      </div>
    </div>
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
      box-shadow: var(--shadow-card);
    }
  }

  &__content {
    min-width: 0;
    align-self: center;
  }

  &__summary {
    margin: 1rem;
    color: var(--color-primary);
  }

  &__info {
    margin-top: 2rem;

    strong {
      color: var(--color-primary);
    }

    h2 {
      color: var(--color-primary);
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
