<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="emit('cancel')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[90vh]">

      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-900">Prep for Invoice</h3>
            <p class="text-xs text-gray-400 mt-0.5">{{ vos.length }} variation order{{ vos.length !== 1 ? 's' : '' }} selected</p>
          </div>
        </div>
        <button @click="emit('cancel')" class="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-6 space-y-5">

        <!-- Invoice Status -->
        <div>
          <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Invoice Status <span class="text-red-400">*</span></label>
          <div class="grid grid-cols-3 gap-2">
            <label v-for="opt in statusOpts" :key="opt.value"
              class="flex items-center justify-center py-2.5 rounded-xl border-2 cursor-pointer transition text-sm font-semibold text-center"
              :class="selectedStatus === opt.value ? [opt.border, opt.bg, opt.text] : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'">
              <input type="radio" :value="opt.value" v-model="selectedStatus" class="hidden" />
              {{ opt.label }}
            </label>
          </div>
        </div>

        <!-- Date -->
        <div>
          <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Date <span class="text-red-400">*</span></label>
          <input v-model="selectedDate" type="date"
            class="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition" />
        </div>

        <!-- Selected VOs list -->
        <div>
          <label class="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Selected Variation Orders</label>
          <div class="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            <div v-for="vo in vos" :key="vo.id"
              class="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100 gap-3">
              <div class="flex items-center gap-2 min-w-0">
                <span class="px-1.5 py-0.5 rounded text-xs font-bold bg-indigo-100 text-indigo-700 shrink-0">{{ vo.siteId }}</span>
                <span class="text-sm text-gray-700 truncate">{{ vo.voDescription }}</span>
              </div>
              <span class="text-sm font-semibold text-gray-900 whitespace-nowrap shrink-0">{{ formatCurrency(vo.voAmount) }}</span>
            </div>
          </div>
        </div>

        <!-- Error -->
        <p v-if="showError" class="text-sm text-red-600 font-medium">Please select an invoice status and date before confirming.</p>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-gray-100 shrink-0">
        <div class="text-sm text-gray-500">
          Total: <span class="font-bold text-gray-900">{{ formatCurrency(totalAmount) }}</span>
        </div>
        <div class="flex gap-2">
          <button @click="emit('cancel')"
            class="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
            Cancel
          </button>
          <button @click="confirm"
            class="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
            Confirm &amp; Log
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatCurrency } from '../utils/formatters'

const props = defineProps({
  vos: { type: Array, required: true }
})
const emit = defineEmits(['confirm', 'cancel'])

const statusOpts = [
  { value: 'To Be Sent to Nokia', label: 'To Be Sent to Nokia', border: 'border-indigo-400', bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  { value: 'Request to Nokia',    label: 'Request to Nokia',    border: 'border-blue-400',   bg: 'bg-blue-50',   text: 'text-blue-700'   },
  { value: 'SIT Approved',        label: 'SIT Approved',        border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  { value: 'SIT Completed',       label: 'SIT Completed',       border: 'border-green-400',  bg: 'bg-green-50',  text: 'text-green-700'  },
]
// Note: "Not Yet Sent" is only available via manual edit in the VO form, not bulk prep

const selectedStatus = ref('')
const selectedDate = ref('')
const showError = ref(false)

const totalAmount = computed(() => props.vos.reduce((s, vo) => s + (vo.voAmount || 0), 0))

const confirm = () => {
  if (!selectedStatus.value || !selectedDate.value) { showError.value = true; return }
  emit('confirm', { status: selectedStatus.value, date: selectedDate.value })
}
</script>
