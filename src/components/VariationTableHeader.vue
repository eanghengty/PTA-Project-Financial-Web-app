<template>
  <thead class="sticky top-0 z-20">
    <tr>
      <th class="sticky top-0 z-30 w-12 border-b border-blue-900 bg-blue-700 px-4 py-3 text-center shadow-[0_3px_10px_rgba(15,23,42,0.14)]">
        <input
          type="checkbox"
          :checked="isAllSelected"
          :indeterminate="isIndeterminate"
          class="h-4 w-4 cursor-pointer rounded accent-white"
          title="Select all rows"
          aria-label="Select all rows"
          @change="$emit('toggle-select-all')"
        />
      </th>
      <th class="sticky top-0 z-30 whitespace-nowrap border-b border-blue-900 bg-blue-700 px-5 py-3 text-center text-xs font-bold uppercase tracking-wider text-white shadow-[0_3px_10px_rgba(15,23,42,0.14)]">
        Actions
      </th>
      <th
        v-for="col in renderedColumns"
        :key="col.key"
        :data-column-key="col.key"
        :class="getHeaderCellClass(col)"
      >
        <div class="grid min-h-[46px] grid-cols-[minmax(0,1fr)_34px_12px] items-stretch">
          <button
            type="button"
            class="flex min-w-0 items-center gap-1.5 overflow-hidden px-3 py-3 text-left transition-colors hover:bg-blue-600/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
            :title="col.label"
            :aria-label="getSortLabel(col)"
            @click="$emit('toggle-sort', col.key)"
          >
            <span class="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-white">
              {{ col.headerLabel }}
            </span>
            <span class="shrink-0" :class="sortColumn === col.key ? 'text-white' : 'text-blue-200/80'">
              <svg v-if="sortColumn === col.key && sortDir === 'asc'" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
              <svg v-else-if="sortColumn === col.key && sortDir === 'desc'" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              <svg v-else class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
            </span>
          </button>
          <button
            type="button"
            class="relative flex items-center justify-center border-l border-blue-500/60 transition-colors hover:bg-blue-600/95 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/80"
            :class="isFiltered(col.key) ? 'bg-blue-600/90 text-yellow-300' : 'text-blue-200 hover:text-white'"
            :title="`Filter ${col.label}`"
            :aria-label="getFilterLabel(col)"
            @click.stop="$emit('toggle-filter', col.key, $event)"
          >
            <span class="relative">
              <svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-6.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/></svg>
              <span v-if="isFiltered(col.key)" class="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-yellow-300 ring-1 ring-blue-700"></span>
            </span>
          </button>
          <button
            type="button"
            class="flex cursor-col-resize items-center justify-center bg-blue-700/50 transition-colors hover:bg-blue-500/35 focus:outline-none"
            :title="`Resize ${col.label}`"
            :aria-label="`Resize ${col.label}`"
            @mousedown.stop.prevent="$emit('start-resize', $event, col.key)"
            @dblclick.stop.prevent="$emit('reset-width', col.key)"
          >
            <span class="block h-5 w-px rounded-full bg-blue-200/70"></span>
          </button>
        </div>
      </th>
    </tr>
  </thead>
</template>

<script setup>
const props = defineProps({
  renderedColumns: {
    type: Array,
    required: true
  },
  sortColumn: {
    type: String,
    default: null
  },
  sortDir: {
    type: String,
    default: 'asc'
  },
  filters: {
    type: Object,
    required: true
  },
  isAllSelected: {
    type: Boolean,
    default: false
  },
  isIndeterminate: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'toggle-select-all',
  'toggle-sort',
  'toggle-filter',
  'start-resize',
  'reset-width'
])

const isFiltered = (columnKey) => Boolean(props.filters[columnKey]?.length)

const getHeaderCellClass = (col) => [
  'group sticky top-0 z-30 border-b border-blue-900 bg-blue-700 p-0 align-middle shadow-[0_3px_10px_rgba(15,23,42,0.14)]',
  props.sortColumn === col.key || isFiltered(col.key) ? 'shadow-[0_4px_14px_rgba(15,23,42,0.22)]' : ''
]

const getSortLabel = (col) => {
  if (props.sortColumn !== col.key) return `Sort by ${col.label}`
  return props.sortDir === 'asc'
    ? `Sorted by ${col.label} ascending. Click to sort descending`
    : `Sorted by ${col.label} descending. Click to clear sort`
}

const getFilterLabel = (col) => {
  return isFiltered(col.key) ? `Filter ${col.label}. Filter active` : `Filter ${col.label}`
}
</script>
