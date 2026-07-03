<script setup>
import { ref, computed } from 'vue'
import AppModal from '../AppModal.vue'
import CommentItem from './CommentItem.vue'
import { toLocalInputValue, fromLocalInputValue } from '../../utils/topics.js'

const COMMENTS_PAGE_SIZE = 3

const props = defineProps({
  topic: { type: Object, required: true },
})

const formVisible = ref(false)
const isNew = ref(true)
const editIndex = ref(-1)
const text = ref('')
const by = ref('')
const timeLocal = ref('')
const error = ref('')

const deleteModalVisible = ref(false)
const deleteIndex = ref(-1)

const visibleCount = ref(COMMENTS_PAGE_SIZE)

const visibleComments = computed(() =>
  props.topic.comments.slice(0, visibleCount.value)
)

const hasMoreComments = computed(
  () => visibleCount.value < props.topic.comments.length
)

const hiddenCommentCount = computed(
  () => props.topic.comments.length - visibleCount.value
)

const nextBatchSize = computed(() =>
  Math.min(COMMENTS_PAGE_SIZE, hiddenCommentCount.value)
)

function showMoreComments() {
  visibleCount.value = Math.min(
    visibleCount.value + COMMENTS_PAGE_SIZE,
    props.topic.comments.length
  )
}

function resetForm() {
  formVisible.value = false
  isNew.value = true
  editIndex.value = -1
  text.value = ''
  by.value = ''
  timeLocal.value = ''
  error.value = ''
}

function startCreate() {
  resetForm()
  formVisible.value = true
  isNew.value = true
  by.value = 'me'
  timeLocal.value = toLocalInputValue(new Date().toISOString())
}

function startEdit(index) {
  const c = props.topic.comments[index]
  formVisible.value = true
  isNew.value = false
  editIndex.value = index
  text.value = c.comment
  by.value = c.by || ''
  timeLocal.value = toLocalInputValue(c.date)
  error.value = ''
}

function save() {
  const trimmed = text.value.trim()
  if (!trimmed) {
    error.value = 'Comment text is required.'
    return
  }
  const payload = {
    comment: trimmed,
    by: by.value.trim(),
    date: fromLocalInputValue(timeLocal.value),
  }
  if (isNew.value) {
    props.topic.comments.push(payload)
    if (props.topic.comments.length > visibleCount.value) {
      visibleCount.value = props.topic.comments.length
    }
  } else {
    props.topic.comments[editIndex.value] = payload
  }
  resetForm()
}

function confirmDelete(index) {
  deleteIndex.value = index
  deleteModalVisible.value = true
}

function deleteComment() {
  if (formVisible.value && editIndex.value === deleteIndex.value) resetForm()
  props.topic.comments.splice(deleteIndex.value, 1)
  deleteModalVisible.value = false
  deleteIndex.value = -1
}
</script>

<template>
  <div class="mt-3 border-t border-slate-100 pt-3">
    <div class="mb-2 flex items-center justify-between gap-3">
      <h3 class="text-sm font-medium text-slate-600">
        Comments ({{ topic.comments.length }})
      </h3>
      <button
        v-if="!formVisible"
        type="button"
        class="shrink-0 cursor-pointer border-0 bg-transparent text-sm font-medium text-blue-600 hover:text-blue-700"
        @click="startCreate"
      >
        + Add comment
      </button>
    </div>

    <div
      v-if="formVisible"
      class="mb-3 rounded-xl border border-blue-200 bg-blue-50 p-4"
    >
      <h2 class="mb-3 text-base font-semibold">
        {{ isNew ? 'Add Comment' : 'Edit Comment' }}
      </h2>
      <label class="field-label">Comment</label>
      <textarea
        v-model="text"
        placeholder="Comment text"
        class="field-input min-h-[70px] resize-y"
        :class="{ 'field-input-error': error }"
        @input="error = ''"
      />
      <p v-if="error" class="field-error">{{ error }}</p>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label class="field-label">By</label>
          <input
            v-model="by"
            maxlength="10"
            placeholder="Author initials"
            class="field-input"
          />
        </div>
        <div>
          <label class="field-label">Time</label>
          <input v-model="timeLocal" type="datetime-local" class="field-input" />
        </div>
      </div>
      <div class="mt-1 flex gap-2">
        <button class="btn-primary btn-small" @click="save">
          {{ isNew ? 'Add' : 'Save' }}
        </button>
        <button class="btn-secondary btn-small" @click="resetForm">Cancel</button>
      </div>
    </div>

    <p v-if="topic.comments.length === 0" class="text-sm italic text-slate-400">
      No comments yet.
    </p>

    <CommentItem
      v-for="(comment, index) in visibleComments"
      :key="topic.guid + '-' + index"
      :comment="comment"
      @edit="startEdit(index)"
      @delete="confirmDelete(index)"
    />

    <button
      v-if="hasMoreComments"
      type="button"
      class="mt-2 flex w-full cursor-pointer items-center justify-center gap-1 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-100"
      @click="showMoreComments"
    >
      Show {{ nextBatchSize }} more
      <span class="text-slate-400">· {{ hiddenCommentCount }} left</span>
    </button>

    <AppModal
      :show="deleteModalVisible"
      title="Delete Comment"
      @close="deleteModalVisible = false"
    >
      <p>Are you sure you want to delete this comment?</p>
      <template #footer>
        <button class="btn-secondary" @click="deleteModalVisible = false">Cancel</button>
        <button class="btn-danger" @click="deleteComment">Delete</button>
      </template>
    </AppModal>
  </div>
</template>
