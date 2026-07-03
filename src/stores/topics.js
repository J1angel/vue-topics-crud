import { defineStore } from 'pinia'
import seedData from '../data/topics.json'
import {
  STORAGE_KEY,
  PAGE_SIZE,
  generateGuid,
  loadTopics,
} from '../utils/topics.js'

export const useTopicsStore = defineStore('topics', {
  state: () => ({
    topics: [],
    currentPage: 1,
    topicFormVisible: false,
    editingTopicGuid: null,
    deleteModalVisible: false,
    deletingTopicGuid: null,
  }),

  getters: {
    totalPages(state) {
      return Math.max(1, Math.ceil(state.topics.length / PAGE_SIZE))
    },

    pagedTopics(state) {
      const start = (state.currentPage - 1) * PAGE_SIZE
      return state.topics.slice(start, start + PAGE_SIZE)
    },

    pageStart(state) {
      if (state.topics.length === 0) return 0
      return (state.currentPage - 1) * PAGE_SIZE + 1
    },

    pageEnd(state) {
      return Math.min(state.currentPage * PAGE_SIZE, state.topics.length)
    },

    editingTopic(state) {
      if (!state.editingTopicGuid) return null
      return state.topics.find((t) => t.guid === state.editingTopicGuid) ?? null
    },

    deletingTopic(state) {
      if (!state.deletingTopicGuid) return null
      return state.topics.find((t) => t.guid === state.deletingTopicGuid) ?? null
    },
  },

  actions: {
    init() {
      this.topics = loadTopics(seedData.topics)
      this.$subscribe((_mutation, state) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.topics))
      })
    },

    setCurrentPage(page) {
      this.currentPage = page
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
    },

    openCreateForm() {
      this.editingTopicGuid = null
      this.topicFormVisible = true
    },

    openEditForm(topic) {
      this.editingTopicGuid = topic.guid
      this.topicFormVisible = true
    },

    closeTopicForm() {
      this.topicFormVisible = false
      this.editingTopicGuid = null
    },

    saveTopic(payload) {
      if (payload.isNew) {
        this.topics.unshift({
          guid: generateGuid(),
          name: payload.name,
          by: payload.by,
          time: payload.time,
          comments: [],
        })
        this.currentPage = 1
      } else {
        const topic = this.topics.find((t) => t.guid === payload.guid)
        if (topic) {
          topic.name = payload.name
          topic.by = payload.by
          topic.time = payload.time
        }
      }
      this.closeTopicForm()
    },

    openDeleteModal(topic) {
      this.deletingTopicGuid = topic.guid
      this.deleteModalVisible = true
    },

    closeDeleteModal() {
      this.deleteModalVisible = false
      this.deletingTopicGuid = null
    },

    deleteTopic() {
      if (!this.deletingTopicGuid) return
      const guid = this.deletingTopicGuid
      this.topics = this.topics.filter((t) => t.guid !== guid)
      if (this.editingTopicGuid === guid) this.closeTopicForm()
      this.closeDeleteModal()
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages
      }
    },

    addComment(topicGuid, payload) {
      const topic = this.topics.find((t) => t.guid === topicGuid)
      if (topic) topic.comments.push(payload)
    },

    updateComment(topicGuid, index, payload) {
      const topic = this.topics.find((t) => t.guid === topicGuid)
      if (topic) topic.comments[index] = payload
    },

    deleteComment(topicGuid, index) {
      const topic = this.topics.find((t) => t.guid === topicGuid)
      if (topic) topic.comments.splice(index, 1)
    },
  },
})
