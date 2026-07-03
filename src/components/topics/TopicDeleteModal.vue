<script setup>
import AppModal from '../AppModal.vue'

defineProps({
  show: { type: Boolean, default: false },
  topicName: { type: String, default: '' },
})

const emit = defineEmits(['close', 'confirm'])
</script>

<template>
  <AppModal :show="show" title="Delete Topic" @close="emit('close')">
    <p>
      Are you sure you want to delete
      <strong>{{ topicName }}</strong> and all its comments? This cannot be undone.
    </p>
    <template #footer>
      <button class="btn-secondary" @click="emit('close')">Cancel</button>
      <button class="btn-danger" @click="emit('confirm')">Delete</button>
    </template>
  </AppModal>
</template>
