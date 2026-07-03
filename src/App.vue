<script setup>
import { storeToRefs } from 'pinia'
import TopicPagination from './components/TopicPagination.vue'
import TopicList from './components/topics/TopicList.vue'
import TopicFormModal from './components/topics/TopicFormModal.vue'
import TopicDeleteModal from './components/topics/TopicDeleteModal.vue'
import { useTopicsStore } from './stores/topics.js'

const store = useTopicsStore()

const {
  topics,
  currentPage,
  topicFormVisible,
  deleteModalVisible,
  editingTopic,
  deletingTopic,
  totalPages,
  pagedTopics,
  pageStart,
  pageEnd,
} = storeToRefs(store)
</script>

<template>
  <div class="mx-auto max-w-4xl p-6">
    <h1 class="mb-1 text-3xl font-bold">Topics CRUD</h1>
    <p class="mb-5 text-sm text-slate-500">Create, read, update, and delete topics and comments.</p>

    <div class="mb-4 flex flex-wrap items-center gap-3">
      <button class="btn-primary" @click="store.openCreateForm()">+ New Topic</button>
      <span class="text-sm text-slate-500">{{ topics.length }} topic(s) total</span>
    </div>

    <TopicPagination
      class="mb-5"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-start="pageStart"
      :page-end="pageEnd"
      :total-items="topics.length"
      @update:current-page="store.setCurrentPage($event)"
    />

    <TopicFormModal
      :show="topicFormVisible"
      :topic="editingTopic"
      @close="store.closeTopicForm()"
      @save="store.saveTopic($event)"
    />

    <TopicDeleteModal
      :show="deleteModalVisible"
      :topic-name="deletingTopic?.name ?? ''"
      @close="store.closeDeleteModal()"
      @confirm="store.deleteTopic()"
    />

    <TopicList
      :topics="pagedTopics"
      @edit="store.openEditForm($event)"
      @delete="store.openDeleteModal($event)"
    />

    <TopicPagination
      class="mt-5"
      :current-page="currentPage"
      :total-pages="totalPages"
      :page-start="pageStart"
      :page-end="pageEnd"
      :total-items="topics.length"
      @update:current-page="store.setCurrentPage($event)"
    />
  </div>
</template>
