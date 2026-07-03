<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import TopicPagination from './components/TopicPagination.vue'
import TopicList from './components/topics/TopicList.vue'
import TopicFormModal from './components/topics/TopicFormModal.vue'
import TopicDeleteModal from './components/topics/TopicDeleteModal.vue'
import seedData from './data/topics.json'
import {
  STORAGE_KEY,
  PAGE_SIZE,
  generateGuid,
  loadTopics,
} from './utils/topics.js'

const topics = ref([])
const currentPage = ref(1)

const topicFormVisible = ref(false)
const editingTopic = ref(null)

const deleteModalVisible = ref(false)
const deletingTopic = ref(null)

const totalPages = computed(() =>
  Math.max(1, Math.ceil(topics.value.length / PAGE_SIZE))
)

const pagedTopics = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return topics.value.slice(start, start + PAGE_SIZE)
})

const pageStart = computed(() => {
  if (topics.value.length === 0) return 0
  return (currentPage.value - 1) * PAGE_SIZE + 1
})

const pageEnd = computed(() =>
  Math.min(currentPage.value * PAGE_SIZE, topics.value.length)
)

watch(
  topics,
  (value) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  },
  { deep: true }
)

watch(totalPages, (newTotal) => {
  if (currentPage.value > newTotal) {
    currentPage.value = newTotal
  }
})

onMounted(() => {
  topics.value = loadTopics(seedData.topics)
})

function startCreateTopic() {
  editingTopic.value = null
  topicFormVisible.value = true
}

function startEditTopic(topic) {
  editingTopic.value = topic
  topicFormVisible.value = true
}

function closeTopicForm() {
  topicFormVisible.value = false
  editingTopic.value = null
}

function saveTopic(payload) {
  if (payload.isNew) {
    topics.value.unshift({
      guid: generateGuid(),
      name: payload.name,
      by: payload.by,
      time: payload.time,
      comments: [],
    })
    currentPage.value = 1
  } else {
    const topic = topics.value.find((t) => t.guid === payload.guid)
    if (topic) {
      topic.name = payload.name
      topic.by = payload.by
      topic.time = payload.time
    }
  }
  closeTopicForm()
}

function confirmDeleteTopic(topic) {
  deletingTopic.value = topic
  deleteModalVisible.value = true
}

function closeDeleteModal() {
  deleteModalVisible.value = false
  deletingTopic.value = null
}

function deleteTopic() {
  if (!deletingTopic.value) return
  const guid = deletingTopic.value.guid
  topics.value = topics.value.filter((t) => t.guid !== guid)
  if (editingTopic.value?.guid === guid) closeTopicForm()
  closeDeleteModal()
}
</script>

<template>
  <div class="mx-auto max-w-4xl p-6">
    <h1 class="mb-1 text-3xl font-bold">Topics CRUD</h1>
    <p class="mb-5 text-sm text-slate-500">Create, read, update, and delete topics and comments.</p>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button class="btn-primary" @click="startCreateTopic">+ New Topic</button>
      <span class="text-sm text-slate-500">{{ topics.length }} topic(s) total</span>
    </div>

    <TopicPagination
      class="mb-5"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-start="pageStart"
      :page-end="pageEnd"
      :total-items="topics.length"
      @update:current-page="currentPage = $event"
    />

    <TopicFormModal
      :show="topicFormVisible"
      :topic="editingTopic"
      @close="closeTopicForm"
      @save="saveTopic"
    />

    <TopicDeleteModal
      :show="deleteModalVisible"
      :topic-name="deletingTopic?.name ?? ''"
      @close="closeDeleteModal"
      @confirm="deleteTopic"
    />

    <TopicList
      :topics="pagedTopics"
      @edit="startEditTopic"
      @delete="confirmDeleteTopic"
    />

    <TopicPagination
      class="mt-5"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-start="pageStart"
      :page-end="pageEnd"
      :total-items="topics.length"
      @update:current-page="currentPage = $event"
    />
  </div>
</template>
