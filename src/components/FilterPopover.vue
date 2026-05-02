<template>
  <Teleport to="body">
    <!-- Backdrop to close on outside click -->
    <div class="fixed inset-0 z-[9998]" @click="$emit('close')"></div>

    <!-- Popover -->
    <div
      data-filter-popover
      class="fixed z-[9999] w-72 bg-white rounded-xl shadow-2xl border border-gray-200"
      :style="popoverStyle"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 rounded-t-xl flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-blue-200" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-6.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/>
          </svg>
          <h3 class="text-sm font-semibold text-white">Filter: {{ columnLabel }}</h3>
        </div>
        <button @click="$emit('close')" class="text-blue-200 hover:text-white transition text-lg leading-none">✕</button>
      </div>

      <!-- Select All / Deselect All -->
      <div class="px-4 pt-3 pb-2 border-b border-gray-100 flex items-center justify-between">
        <span class="text-xs text-gray-500 font-medium">
          {{ selectedValues.length }} of {{ (values || []).length }} selected
        </span>
        <div class="flex gap-2">
          <button @click="selectAll" class="text-xs text-blue-600 hover:text-blue-800 font-medium transition">All</button>
          <span class="text-gray-300">|</span>
          <button @click="clearSelection" class="text-xs text-gray-500 hover:text-gray-700 font-medium transition">None</button>
        </div>
      </div>

      <!-- Search input (if many values) -->
      <div v-if="(values || []).length > 5" class="px-4 py-2 border-b border-gray-100">
        <input
          v-model="searchValue"
          type="text"
          placeholder="Search..."
          class="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
        />
      </div>

      <!-- Values list -->
      <div class="max-h-52 overflow-y-auto">
        <div v-if="filteredValues.length === 0" class="text-center py-6 text-gray-400 text-sm">
          No values found
        </div>
        <label
          v-for="value in filteredValues"
          :key="value"
          class="flex items-center gap-3 px-4 py-2 hover:bg-blue-50 cursor-pointer transition-colors group"
        >
          <input
            type="checkbox"
            :checked="selectedValues.includes(value)"
            @change="toggleValue(value)"
            class="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600 flex-shrink-0"
          />
          <span class="text-sm text-gray-700 group-hover:text-gray-900 flex-1 truncate">{{ value }}</span>
        </label>
      </div>

      <!-- Actions -->
      <div class="border-t border-gray-100 px-4 py-3 bg-gray-50 rounded-b-xl flex gap-2 justify-end">
        <button
          @click="$emit('close')"
          class="text-xs px-3 py-1.5 text-gray-600 hover:bg-white rounded-lg transition font-medium border border-gray-200"
        >
          Cancel
        </button>
        <button
          @click="applyFilters"
          :disabled="selectedValues.length === 0"
          class="text-xs px-4 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Apply ({{ selectedValues.length }})
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columnKey: String,
  columnLabel: { type: String, default: '' },
  values: Array,
  anchorRect: Object,
  currentValues: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:filters', 'close'])

const selectedValues = ref([...props.currentValues])
const searchValue = ref('')

// Position popover below anchor; flips upward if it would overflow the viewport bottom
const popoverStyle = computed(() => {
  if (!props.anchorRect) return { top: '100px', left: '100px' }
  const rect = props.anchorRect
  const popoverWidth  = 288  // w-72
  const popoverHeight = 380  // conservative estimate of max popover height
  const viewportWidth  = window.innerWidth
  const viewportHeight = window.innerHeight

  let left = rect.left
  // Prevent right overflow
  if (left + popoverWidth > viewportWidth - 8) left = viewportWidth - popoverWidth - 8
  if (left < 8) left = 8

  // Flip upward when not enough space below
  const spaceBelow = viewportHeight - rect.bottom - 8
  const top = spaceBelow >= popoverHeight
    ? rect.bottom + 4
    : Math.max(8, rect.top - popoverHeight - 4)

  return { top: `${top}px`, left: `${left}px` }
})

const filteredValues = computed(() => {
  if (!searchValue.value.trim()) return props.values || []
  const search = searchValue.value.toLowerCase()
  return (props.values || []).filter(v => String(v).toLowerCase().includes(search))
})

const toggleValue = (value) => {
  const index = selectedValues.value.indexOf(value)
  if (index === -1) {
    selectedValues.value.push(value)
  } else {
    selectedValues.value.splice(index, 1)
  }
}

const selectAll = () => {
  selectedValues.value = [...(props.values || [])]
}

const clearSelection = () => {
  selectedValues.value = []
}

const applyFilters = () => {
  emit('update:filters', props.columnKey, selectedValues.value)
  emit('close')
}
</script>
