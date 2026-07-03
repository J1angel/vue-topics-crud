<script setup>
defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  pageStart: { type: Number, required: true },
  pageEnd: { type: Number, required: true },
  totalItems: { type: Number, required: true },
})

const emit = defineEmits(['update:currentPage'])

function goTo(page) {
  emit('update:currentPage', page)
}
</script>

<template>
  <nav
    v-if="totalPages > 1"
    class="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
    aria-label="Topics pagination"
  >
    <button class="btn-secondary" :disabled="currentPage === 1" @click="goTo(1)">
      First
    </button>
    <button class="btn-secondary" :disabled="currentPage === 1" @click="goTo(currentPage - 1)">
      Previous
    </button>
    <span class="min-w-32 text-center">
      Page {{ currentPage }} of {{ totalPages }}
      <span class="block text-xs text-slate-500">
        ({{ pageStart }}–{{ pageEnd }} of {{ totalItems }})
      </span>
    </span>
    <button
      class="btn-secondary"
      :disabled="currentPage === totalPages"
      @click="goTo(currentPage + 1)"
    >
      Next
    </button>
    <button
      class="btn-secondary"
      :disabled="currentPage === totalPages"
      @click="goTo(totalPages)"
    >
      Last
    </button>
  </nav>
</template>
