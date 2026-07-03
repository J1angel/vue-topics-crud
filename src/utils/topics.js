export const STORAGE_KEY = 'vue-topics-crud-data'
export const PAGE_SIZE = 20

export function generateGuid() {
  return Math.random().toString(36).substring(2, 10)
}

export function toLocalInputValue(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function fromLocalInputValue(localValue) {
  if (!localValue) return new Date().toISOString()
  return new Date(localValue).toISOString()
}

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return value
  return d.toLocaleString()
}

export function normalizeTopics(rawTopics) {
  return rawTopics.map((topic) => ({
    guid: topic.guid,
    name: (topic.name || '').substring(0, 50),
    by: topic.by || '',
    time: topic.time || topic.date || '',
    comments: (topic.comments || []).map((c) => ({
      comment: c.comment || '',
      by: c.by || '',
      date: c.date || '',
    })),
  }))
}

export function loadTopics(seedTopics) {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      return JSON.parse(saved)
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }
  return normalizeTopics(seedTopics)
}
