<script setup>
defineProps({
  title: { type: String, default: '' },
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])

function onBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4"
      @click="onBackdropClick"
    >
      <div
        class="max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <h2 class="m-0 text-lg font-semibold">{{ title }}</h2>
          <button
            type="button"
            class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-2xl leading-none text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            aria-label="Close"
            @click="emit('close')"
          >
            &times;
          </button>
        </div>
        <div class="px-5 py-5 [&_p]:mb-3 [&_p]:text-slate-600">
          <slot />
        </div>
        <div v-if="$slots.footer" class="flex justify-end gap-2 px-5 pb-5">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
