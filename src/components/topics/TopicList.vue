<script setup>
import TopicCard from './TopicCard.vue'

defineProps({
  topics: { type: Array, required: true },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div
    v-if="topics.length === 0"
    class="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-slate-500"
  >
    No topics to display. Click <strong>New Topic</strong> to add one.
  </div>

  <TopicCard
    v-for="topic in topics"
    :key="topic.guid"
    :topic="topic"
    @edit="emit('edit', $event)"
    @delete="emit('delete', $event)"
  />
</template>
