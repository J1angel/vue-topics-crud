<script setup>
import { formatDate } from '../../utils/topics.js'

defineProps({
  comment: { type: Object, required: true },
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <div class="mb-2 rounded-md bg-slate-50 px-3 py-2.5 text-sm">
    <div>{{ comment.comment }}</div>
    <div class="mt-1 text-xs text-slate-400">
      By: {{ comment.by || '—' }} · {{ formatDate(comment.date) }}
    </div>
    <div class="mt-1.5 flex gap-1.5">
      <button class="btn-secondary btn-small" @click="emit('edit')">Edit</button>
      <button class="btn-danger btn-small" @click="emit('delete')">Delete</button>
    </div>
  </div>
</template>
