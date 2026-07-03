<script setup>
import { formatDate } from '../../utils/topics.js'
import CommentList from '../comments/CommentList.vue'

defineProps({
  topic: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <article class="mb-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="mb-1 text-lg font-semibold break-words">{{ topic.name }}</h2>
        <div class="text-sm text-slate-500">
          <span v-if="topic.by">By: {{ topic.by }}</span>
          <span v-if="topic.by && topic.time"> · </span>
          <span v-if="topic.time">{{ formatDate(topic.time) }}</span>
        </div>
      </div>
      <div class="flex shrink-0 gap-2">
        <button class="btn-secondary btn-small" @click="emit('edit', topic)">Edit</button>
        <button class="btn-danger btn-small" @click="emit('delete', topic)">Delete</button>
      </div>
    </div>

    <CommentList :topic="topic" />
  </article>
</template>
