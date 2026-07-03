<script setup>
import { ref, watch } from 'vue'
import AppModal from '../AppModal.vue'
import { toLocalInputValue, fromLocalInputValue } from '../../utils/topics.js'

const props = defineProps({
  show: { type: Boolean, default: false },
  topic: { type: Object, default: null },
})

const emit = defineEmits(['close', 'save'])

const isNew = ref(true)
const guid = ref('')
const name = ref('')
const by = ref('')
const timeLocal = ref('')
const error = ref('')

watch(
  () => props.show,
  (visible) => {
    if (!visible) return
    error.value = ''
    if (props.topic) {
      isNew.value = false
      guid.value = props.topic.guid
      name.value = props.topic.name
      by.value = props.topic.by || ''
      timeLocal.value = toLocalInputValue(props.topic.time)
    } else {
      isNew.value = true
      guid.value = ''
      name.value = ''
      by.value = 'me'
      timeLocal.value = toLocalInputValue(new Date().toISOString())
    }
  }
)

function close() {
  emit('close')
}

function save() {
  const trimmedName = name.value.trim()
  if (!trimmedName) {
    error.value = 'Topic name is required.'
    return
  }
  emit('save', {
    isNew: isNew.value,
    guid: guid.value,
    name: trimmedName.substring(0, 50),
    by: by.value.trim(),
    time: fromLocalInputValue(timeLocal.value),
  })
}
</script>

<template>
  <AppModal
    :show="show"
    :title="isNew ? 'Create Topic' : 'Edit Topic'"
    @close="close"
  >
    <label for="topic-name" class="field-label">Name (max 50 chars)</label>
    <input
      id="topic-name"
      v-model="name"
      maxlength="50"
      placeholder="Topic name"
      class="field-input"
      :class="{ 'field-input-error': error }"
      @input="error = ''"
    />
    <p v-if="error" class="field-error">{{ error }}</p>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label for="topic-by" class="field-label">By</label>
        <input
          id="topic-by"
          v-model="by"
          maxlength="10"
          placeholder="Author initials"
          class="field-input"
        />
      </div>
      <div>
        <label for="topic-time" class="field-label">Time</label>
        <input id="topic-time" v-model="timeLocal" type="datetime-local" class="field-input" />
      </div>
    </div>
    <template #footer>
      <button class="btn-secondary" @click="close">Cancel</button>
      <button class="btn-primary" @click="save">{{ isNew ? 'Create' : 'Save' }}</button>
    </template>
  </AppModal>
</template>
