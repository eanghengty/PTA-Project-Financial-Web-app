<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between pb-2 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
          <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Variation Orders</h2>
          <p class="text-xs text-gray-400 mt-0.5">{{ voCount }} total records</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="isExpanded = true"
          title="Expand table to full screen"
          class="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
          </svg>
          Expand
        </button>
        <button @click="openNewVOForm"
          class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          New Variation Order
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="voCount === 0" class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-12 text-center border border-blue-200">
      <div class="text-5xl mb-4">📋</div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">No Variation Orders Yet</h3>
      <p class="text-gray-600 mb-6">Start by creating your first variation order to begin tracking.</p>
      <button
        @click="openNewVOForm"
        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
      >
        Create Your First Variation Order
      </button>
    </div>

    <!-- Table Section -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Search/Filter Bar -->
      <div class="px-6 py-4 bg-white border-b border-gray-200 flex gap-4 items-center flex-wrap">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by site, description, ticket number, PO number, or supplier category..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <div class="flex items-center gap-2">
          <label for="combined-filter" class="text-sm font-medium text-gray-600 whitespace-nowrap">Filter Combine</label>
          <select
            id="combined-filter"
            v-model="activeCombinedFilter"
            class="min-w-[240px] px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All combined filters</option>
            <option v-for="option in combinedFilterOptions" :key="option.key" :value="option.key">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- Export Selected Button -->
        <div v-if="selectedCount > 0" class="flex items-center gap-2">
          <span class="text-sm text-gray-600 font-medium whitespace-nowrap">{{ selectedCount }} selected</span>
          <button
            @click="prepForInvoice"
            :disabled="prepDisabled"
            :title="prepTooltip"
            :class="prepDisabled
              ? 'inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-400 rounded-lg font-medium text-sm cursor-not-allowed'
              : 'inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm shadow-sm'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Prep for Invoice
          </button>
          <!-- Export button -->
          <button ref="exportBtnRef" @click="toggleExportMenu"
            class="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm shadow-sm">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            Export
            <svg class="w-3 h-3 transition-transform" :class="showExportMenu ? 'rotate-180' : ''"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          <!-- Bulk Scope Edit -->
          <button
            @click="showBulkScopeEdit = true"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Edit Scope
          </button>
          <!-- Duplicate (single row only) -->
          <button
            v-if="selectedCount === 1"
            @click="duplicateSelectedVO"
            class="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm shadow-sm"
            title="Duplicate selected variation"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
            </svg>
            Duplicate
          </button>
          <button
            @click="clearSelection"
            class="inline-flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition text-sm"
          >
            ✕
          </button>
        </div>

        <!-- Flagged filter toggle -->
        <button @click="showFlaggedOnly = !showFlaggedOnly"
          :class="showFlaggedOnly
            ? 'bg-amber-500 text-white border-amber-500'
            : 'bg-white text-amber-600 border-amber-300 hover:bg-amber-50'"
          class="inline-flex items-center gap-1.5 px-3 py-2 border rounded-lg font-medium text-sm transition whitespace-nowrap">
          <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 13.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-5.586L3.293 9.707A1 1 0 013 9V6z" clip-rule="evenodd"/>
          </svg>
          Flagged
          <span v-if="flaggedCount > 0" class="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
            :class="showFlaggedOnly ? 'bg-white text-amber-600' : 'bg-amber-500 text-white'">{{ flaggedCount }}</span>
        </button>

        <!-- Clear Filters Button -->
        <button
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm"
        >
          ✕ Clear Filters
        </button>

        <!-- Column Visibility Toggle -->
        <div class="relative">
          <button
            @click="toggleColumnPanel"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-gray-700"
            title="Toggle column visibility"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            Columns
          </button>

          <!-- Column Selection Panel -->
          <div v-if="showColumnPanel" class="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            <div class="p-4 border-b border-gray-200">
              <h3 class="font-semibold text-gray-900 mb-3">Show/Hide Columns</h3>
              <div class="space-y-2 max-h-96 overflow-y-auto">
                <label v-for="column in allColumns" :key="column.key" class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    :checked="visibleColumns[column.key]"
                    @change="toggleColumn(column.key)"
                    class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span class="text-sm text-gray-700">{{ column.label }}</span>
                </label>
              </div>
            </div>
            <div class="p-3 bg-gray-50 flex gap-2 justify-end border-t border-gray-200">
              <button
                @click="resetColumns"
                class="text-sm px-3 py-1 text-gray-600 hover:bg-white rounded transition"
              >
                Reset
              </button>
              <button
                @click="toggleColumnPanel"
                class="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Filter amount summary bar — shown when filters or search are active -->
      <div v-if="hasActiveFilters || searchText" class="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center gap-2 flex-wrap text-xs">
        <span class="font-semibold text-blue-700">Filter summary:</span>
        <span class="text-blue-600">{{ filteredVOs.length }} VOs</span>
        <span v-if="activeCombinedFilterLabel" class="px-2 py-0.5 rounded-full font-medium bg-indigo-100 text-indigo-700">
          Combined: {{ activeCombinedFilterLabel }}
        </span>
        <span class="text-blue-300">·</span>
        <span class="font-bold text-blue-800">{{ formatCurrency(filteredTotal) }}</span>
        <span class="text-blue-300 mx-1">|</span>
        <template v-for="(statusConf, idx) in [
          { key: 'approved',         label: 'Approved',         color: 'text-green-700 bg-green-100' },
          { key: 'submitted',        label: 'Submitted',        color: 'text-blue-700 bg-blue-100' },
          { key: 'pending-approval', label: 'Pending',          color: 'text-yellow-700 bg-yellow-100' },
          { key: 'draft',            label: 'Draft',            color: 'text-gray-600 bg-gray-100' },
          { key: 'rejected',         label: 'Rejected',         color: 'text-red-700 bg-red-100' },
          { key: 'cancelled',        label: 'Cancelled',        color: 'text-slate-600 bg-slate-100' },
        ]" :key="statusConf.key">
          <span v-if="filterSummary[statusConf.key]" :class="['px-2 py-0.5 rounded-full font-medium', statusConf.color]">
            {{ statusConf.label }}: {{ formatCurrency(filterSummary[statusConf.key]) }}
          </span>
        </template>
      </div>

      <!-- Scrollable Table Wrapper - scrolls both ways; thead sticks inside this container -->
      <div class="overflow-auto" style="max-height: calc(100vh - 280px);">
        <table class="w-full border-collapse table-fixed" :style="tableStyle">
          <colgroup>
            <col :style="{ width: `${TABLE_SELECT_WIDTH}px` }" />
            <col :style="{ width: `${TABLE_ACTIONS_WIDTH}px` }" />
            <col
              v-for="col in renderedColumns"
              :key="col.key"
              :style="getRenderedColumnStyle(col.key)"
            />
          </colgroup>
          <thead class="sticky top-0 z-20">
            <tr>
              <!-- Select All Checkbox -->
              <th class="px-4 py-3 bg-blue-700 border-b-2 border-blue-800 w-12 text-center">
                <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate"
                  @change="toggleSelectAll" class="w-4 h-4 rounded cursor-pointer accent-white" title="Select all"/>
              </th>
              <th class="px-5 py-3 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap bg-blue-700 border-b-2 border-blue-800">Actions</th>
              <template v-for="col in renderedColumns" :key="col.key">
                <th :data-column-key="col.key" class="relative bg-blue-700 border-b-2 border-blue-800 p-0">
                  <div class="flex items-stretch w-full pr-3">
                    <!-- Sort button (label area) -->
                    <button type="button" @click="toggleSort(col.key)"
                      class="flex-1 px-3 py-3 flex items-center gap-1.5 hover:bg-blue-600 transition-colors text-left min-w-0">
                      <span class="text-xs font-bold text-white uppercase tracking-wider whitespace-normal leading-tight break-words">{{ col.headerLabel }}</span>
                      <!-- sort indicator -->
                      <span class="flex-shrink-0">
                        <svg v-if="sortColumn === col.key && sortDir === 'asc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                        <svg v-else-if="sortColumn === col.key && sortDir === 'desc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                        <svg v-else class="w-3 h-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                      </span>
                    </button>
                    <!-- Filter button (funnel icon) -->
                    <button type="button" @click="toggleFilterMenu(col.key, $event)"
                      class="px-2 py-3 hover:bg-blue-600 transition-colors border-l border-blue-600 flex-shrink-0 flex items-center">
                      <span class="relative">
                        <svg class="w-3.5 h-3.5 transition-colors" :class="filters[col.key]?.length ? 'text-yellow-300' : 'text-blue-300 hover:text-blue-100'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-6.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/></svg>
                        <span v-if="filters[col.key]?.length" class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                      </span>
                    </button>
                  </div>
                  <button
                    type="button"
                    :title="`Resize ${col.label}`"
                    class="absolute top-0 right-0 h-full w-3 cursor-col-resize hover:bg-blue-500/40 transition-colors"
                    @mousedown.stop.prevent="startColumnResize($event, col.key)"
                    @dblclick.stop.prevent="resetColumnWidth(col.key)"
                  >
                    <span class="mx-auto block h-full w-px bg-blue-500/70"></span>
                  </button>
                </th>
              </template>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="vo in paginatedVOs"
              :key="vo.id"
              :class="['transition-colors cursor-pointer',
                store.flaggedIds.value.has(vo.id) ? 'bg-amber-50 hover:bg-amber-100 border-l-4 border-l-amber-400' :
                selectedRows.has(vo.id) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50']"
            >
              <!-- Row Checkbox -->
              <td class="px-4 py-4 text-center w-12">
                <input
                  type="checkbox"
                  :checked="selectedRows.has(vo.id)"
                  @change="toggleRowSelection(vo.id)"
                  @click.stop
                  class="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"
                />
              </td>
              <td class="px-5 py-4 text-sm text-center whitespace-nowrap">
                <button
                  @click="editVO(vo)"
                  class="inline-flex items-center px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition font-medium mr-1"
                >Edit</button>
                <button
                  @click="deleteVO(vo.id)"
                  class="inline-flex items-center px-3 py-1 rounded-md text-red-600 hover:bg-red-50 transition font-medium"
                >Delete</button>
                <button @click.stop="handleFlagClick(vo)"
                  :title="store.flaggedIds.value.has(vo.id) ? (store.flaggedNotes.value[vo.id] || 'Flagged — click to edit or unflag') : 'Flag this VO'"
                  :class="store.flaggedIds.value.has(vo.id) ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'"
                  class="inline-flex items-center px-2 py-1 rounded-md transition ml-1">
                  <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 13.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-5.586L3.293 9.707A1 1 0 013 9V6z" clip-rule="evenodd"/>
                  </svg>
                </button>
              </td>
              <td v-if="visibleColumns.siteId" class="px-5 py-4 text-sm font-semibold text-gray-900 overflow-hidden">
                <div class="block w-full truncate" :title="vo.siteId">{{ vo.siteId }}</div>
              </td>
              <td v-if="visibleColumns.siteName" class="px-5 py-4 text-sm text-gray-900 font-medium overflow-hidden">
                <div class="block w-full truncate" :title="vo.siteName">{{ vo.siteName }}</div>
              </td>
              <td v-if="visibleColumns.jobNumber" class="px-5 py-4 text-sm font-medium text-gray-900 overflow-hidden">
                <div class="block w-full truncate" :title="vo.jobNumber || '—'">{{ vo.jobNumber || '—' }}</div>
              </td>
              <td v-if="visibleColumns.voDescription" class="px-5 py-4 text-sm text-gray-700">
                <div class="block w-full truncate" :title="vo.voDescription">{{ vo.voDescription }}</div>
              </td>
              <td v-if="visibleColumns.scope" class="px-5 py-4 text-sm text-gray-700">
                <div class="block w-full truncate" :title="vo.scope">{{ vo.scope }}</div>
              </td>
              <td v-if="visibleColumns.voCategory" class="px-5 py-4 text-sm text-gray-700 overflow-hidden">
                <div class="block w-full truncate" :title="vo.voCategory">{{ vo.voCategory }}</div>
              </td>
              <td v-if="visibleColumns.poSupplierCategory" class="px-5 py-4 text-sm text-gray-700 overflow-hidden">
                <div class="block w-full truncate" :title="vo.poSupplierCategory || '-'">{{ vo.poSupplierCategory || '-' }}</div>
              </td>
              <td v-if="visibleColumns.voAmount" class="px-5 py-4 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
              <td v-if="visibleColumns.boqRelated" class="px-5 py-4 text-center">
                <span v-if="vo.boqRelated" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">No</span>
              </td>
              <td v-if="visibleColumns.isDuplicate" class="px-5 py-4 text-center whitespace-nowrap">
                <label class="inline-flex items-center gap-2 text-xs font-medium cursor-pointer" @click.stop>
                  <input
                    type="checkbox"
                    :checked="isDuplicateVO(vo)"
                    @change="toggleDuplicateFlag(vo)"
                    class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                  />
                  <span :class="isDuplicateVO(vo) ? 'text-red-700' : 'text-gray-500'">{{ isDuplicateVO(vo) ? 'Yes' : 'No' }}</span>
                </label>
              </td>
              <td v-if="visibleColumns.voStatus" class="px-5 py-4 text-sm whitespace-nowrap">
                <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', getStatusColor(vo.voStatus)]">
                  {{ formatStatus(vo.voStatus) }}
                </span>
              </td>
              <td v-if="visibleColumns.emailSentToNokia" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.emailSentToNokia) }}</td>
              <td v-if="visibleColumns.emailApprovedFromNokia" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.emailApprovedFromNokia) }}</td>
              <td v-if="visibleColumns.ticketSubmissionDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.ticketSubmissionDate) }}</td>
              <td v-if="visibleColumns.ticketNumber" class="px-5 py-4 text-sm font-medium text-gray-900 overflow-hidden">
                <div class="block w-full truncate" :title="vo.ticketNumber || '—'">{{ vo.ticketNumber || '—' }}</div>
              </td>
              <td v-if="visibleColumns.ticketApprovalDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.ticketApprovalDate) }}</td>
              <td v-if="visibleColumns.poStatus" class="px-5 py-4 whitespace-nowrap">
                <span :class="vo.poNumber?.trim() ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {{ vo.poNumber?.trim() ? 'Have PO' : 'No PO' }}
                </span>
              </td>
              <td v-if="visibleColumns.poNumber" class="px-5 py-4 text-sm font-medium text-gray-900 overflow-hidden">
                <div class="block w-full truncate" :title="vo.poNumber || '—'">{{ vo.poNumber || '—' }}</div>
              </td>
              <td v-if="visibleColumns.poReceivedDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.poReceivedDate) }}</td>
              <td v-if="visibleColumns.invoiceStatus" class="px-5 py-4 whitespace-nowrap">
                <span v-if="vo.invoiceStatus"
                  :class="getInvoiceStatusColor(vo.invoiceStatus)"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {{ vo.invoiceStatus }}
                </span>
                <span v-else class="text-gray-300 text-xs">—</span>
              </td>
              <td v-if="visibleColumns.invoiceDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.invoiceDate) }}</td>
              <td v-if="visibleColumns.amountChangeFlag" class="px-5 py-4 text-center whitespace-nowrap">
                <span :class="vo.amountChangeFlag ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">
                  {{ vo.amountChangeFlag ? 'Yes' : 'No' }}
                </span>
              </td>
              <td v-if="visibleColumns.labourCost" class="px-5 py-4 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">{{ vo.labourCost ? formatCurrency(vo.labourCost) : '—' }}</td>
              <td v-if="visibleColumns.thirdPartyCost" class="px-5 py-4 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">{{ vo.thirdPartyCost ? formatCurrency(vo.thirdPartyCost) : '—' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Footer / Summary bar -->
      <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4 flex-wrap">
        <!-- Left: row count + pagination -->
        <div class="flex items-center gap-3">
          <span class="text-sm text-gray-500">
            Showing <span class="font-semibold text-gray-700">{{ paginatedVOs.length }}</span> of <span class="font-semibold text-gray-700">{{ filteredVOs.length }}</span>{{ filteredVOs.length !== voCount ? ` filtered (${voCount} total)` : ' variation orders' }}
          </span>
          <div v-if="totalPages > 1" class="flex items-center gap-1">
            <button @click="currentPage = 1" :disabled="currentPage === 1"
              class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
            <span class="px-3 py-1 text-xs font-semibold text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
            <button @click="currentPage = totalPages" :disabled="currentPage === totalPages"
              class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
          </div>
        </div>

        <!-- Right: amount summary -->
        <div class="flex items-center gap-3">
          <!-- Selected total — shown only when rows are selected -->
          <div v-if="selectedCount > 0" class="flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-xl">
            <svg class="w-3.5 h-3.5 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs font-semibold text-blue-100">{{ selectedCount }} selected</span>
            <span class="w-px h-3.5 bg-blue-400"></span>
            <span class="text-sm font-bold text-white">{{ formatCurrency(selectedTotal) }}</span>
          </div>

          <!-- Filtered total — always shown -->
          <div class="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-xl">
            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="text-xs font-semibold text-gray-500">
              {{ hasActiveFilters || searchText ? 'Filtered total' : 'All rows total' }}
            </span>
            <span class="w-px h-3.5 bg-gray-200"></span>
            <span class="text-sm font-bold text-gray-900">{{ formatCurrency(filteredTotal) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Expanded fullscreen table overlay ── -->
    <Teleport to="body">
      <div v-if="isExpanded" class="fixed inset-0 z-50 bg-gray-900/80 flex flex-col">
        <!-- Expanded header -->
        <div class="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"/>
              </svg>
            </div>
            <span class="font-bold text-gray-900">Variation Orders</span>
            <span class="text-sm text-gray-400">{{ filteredVOs.length }} of {{ voCount }} records</span>
          </div>
          <button @click="isExpanded = false"
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Close
          </button>
        </div>
        <!-- Reuse the same table in fullscreen -->
        <div class="flex-1 overflow-auto bg-white">
          <table class="w-full border-collapse table-fixed" :style="tableStyle">
            <colgroup>
              <col :style="{ width: `${TABLE_SELECT_WIDTH}px` }" />
              <col :style="{ width: `${TABLE_ACTIONS_WIDTH}px` }" />
              <col
                v-for="col in renderedColumns"
                :key="col.key"
                :style="getRenderedColumnStyle(col.key)"
              />
            </colgroup>
            <thead class="sticky top-0 z-20">
              <tr>
                <th class="px-4 py-3 bg-blue-700 border-b-2 border-blue-800 w-12 text-center">
                  <input type="checkbox" :checked="isAllSelected" :indeterminate="isIndeterminate" @change="toggleSelectAll" class="w-4 h-4 rounded cursor-pointer accent-white" />
                </th>
                <th class="px-5 py-3 text-center text-xs font-bold text-white uppercase tracking-wider whitespace-nowrap bg-blue-700 border-b-2 border-blue-800">Actions</th>
                <template v-for="col in renderedColumns" :key="col.key">
                  <th :data-column-key="col.key" class="relative bg-blue-700 border-b-2 border-blue-800 p-0">
                    <div class="flex items-stretch w-full pr-3">
                      <button type="button" @click="toggleSort(col.key)"
                        class="flex-1 px-3 py-3 flex items-center gap-1.5 hover:bg-blue-600 transition-colors text-left min-w-0">
                        <span class="text-xs font-bold text-white uppercase tracking-wider whitespace-normal leading-tight break-words">{{ col.headerLabel }}</span>
                        <span class="flex-shrink-0">
                          <svg v-if="sortColumn === col.key && sortDir === 'asc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clip-rule="evenodd"/></svg>
                          <svg v-else-if="sortColumn === col.key && sortDir === 'desc'" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
                          <svg v-else class="w-3 h-3 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm4 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z"/></svg>
                        </span>
                      </button>
                      <button type="button" @click="toggleFilterMenu(col.key, $event)"
                        class="px-2 py-3 hover:bg-blue-600 transition-colors border-l border-blue-600 flex-shrink-0 flex items-center">
                        <span class="relative">
                          <svg class="w-3.5 h-3.5 transition-colors" :class="filters[col.key]?.length ? 'text-yellow-300' : 'text-blue-300 hover:text-blue-100'" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.553.894l-4 2A1 1 0 017 17v-6.586L3.293 6.707A1 1 0 013 6V3z" clip-rule="evenodd"/></svg>
                          <span v-if="filters[col.key]?.length" class="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"></span>
                        </span>
                      </button>
                    </div>
                    <button
                      type="button"
                      :title="`Resize ${col.label}`"
                      class="absolute top-0 right-0 h-full w-3 cursor-col-resize hover:bg-blue-500/40 transition-colors"
                      @mousedown.stop.prevent="startColumnResize($event, col.key)"
                      @dblclick.stop.prevent="resetColumnWidth(col.key)"
                    >
                      <span class="mx-auto block h-full w-px bg-blue-500/70"></span>
                    </button>
                  </th>
                </template>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="vo in paginatedVOs" :key="vo.id"
                :class="['transition-colors cursor-pointer',
                  store.invoicePrepIds.value.has(vo.id) ? 'bg-gray-100 opacity-50' :
                  store.flaggedIds.value.has(vo.id) ? 'bg-amber-50 hover:bg-amber-100 border-l-4 border-l-amber-400' :
                  selectedRows.has(vo.id) ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50']">
                <td class="px-4 py-4 text-center w-12">
                  <input type="checkbox" :checked="selectedRows.has(vo.id)" @change="toggleRowSelection(vo.id)" @click.stop class="w-4 h-4 rounded border-gray-300 cursor-pointer accent-blue-600"/>
                </td>
                <td class="px-5 py-4 text-sm text-center whitespace-nowrap">
                  <button @click="editVO(vo)" class="inline-flex items-center px-3 py-1 rounded-md text-blue-600 hover:bg-blue-50 transition font-medium mr-1">Edit</button>
                  <button @click="deleteVO(vo.id)" class="inline-flex items-center px-3 py-1 rounded-md text-red-600 hover:bg-red-50 transition font-medium">Delete</button>
                  <button @click.stop="handleFlagClick(vo)"
                    :title="store.flaggedIds.value.has(vo.id) ? (store.flaggedNotes.value[vo.id] || 'Flagged — click to edit or unflag') : 'Flag this VO'"
                    :class="store.flaggedIds.value.has(vo.id) ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-300 hover:text-amber-400 hover:bg-amber-50'"
                    class="inline-flex items-center px-2 py-1 rounded-md transition ml-1">
                    <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 13.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-5.586L3.293 9.707A1 1 0 013 9V6z" clip-rule="evenodd"/>
                    </svg>
                  </button>
                </td>
                <td v-if="visibleColumns.siteId" class="px-5 py-4 text-sm font-semibold text-gray-900 overflow-hidden"><div class="block w-full truncate" :title="vo.siteId">{{ vo.siteId }}</div></td>
                <td v-if="visibleColumns.siteName" class="px-5 py-4 text-sm text-gray-900 font-medium overflow-hidden"><div class="block w-full truncate" :title="vo.siteName">{{ vo.siteName }}</div></td>
                <td v-if="visibleColumns.jobNumber" class="px-5 py-4 text-sm font-medium text-gray-900 overflow-hidden"><div class="block w-full truncate" :title="vo.jobNumber || '—'">{{ vo.jobNumber || '—' }}</div></td>
                <td v-if="visibleColumns.voDescription" class="px-5 py-4 text-sm text-gray-700"><div class="block w-full truncate" :title="vo.voDescription">{{ vo.voDescription }}</div></td>
                <td v-if="visibleColumns.scope" class="px-5 py-4 text-sm text-gray-700"><div class="block w-full truncate" :title="vo.scope">{{ vo.scope }}</div></td>
                <td v-if="visibleColumns.voCategory" class="px-5 py-4 text-sm text-gray-700 overflow-hidden"><div class="block w-full truncate" :title="vo.voCategory">{{ vo.voCategory }}</div></td>
                <td v-if="visibleColumns.poSupplierCategory" class="px-5 py-4 text-sm text-gray-700 overflow-hidden"><div class="block w-full truncate" :title="vo.poSupplierCategory || '-'">{{ vo.poSupplierCategory || '-' }}</div></td>
                <td v-if="visibleColumns.voAmount" class="px-5 py-4 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">{{ formatCurrency(vo.voAmount) }}</td>
                <td v-if="visibleColumns.boqRelated" class="px-5 py-4 text-center">
                  <span v-if="vo.boqRelated" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Yes</span>
                  <span v-else class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">No</span>
                </td>
                <td v-if="visibleColumns.isDuplicate" class="px-5 py-4 text-center whitespace-nowrap">
                  <label class="inline-flex items-center gap-2 text-xs font-medium cursor-pointer" @click.stop>
                    <input
                      type="checkbox"
                      :checked="isDuplicateVO(vo)"
                      @change="toggleDuplicateFlag(vo)"
                      class="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                    />
                    <span :class="isDuplicateVO(vo) ? 'text-red-700' : 'text-gray-500'">{{ isDuplicateVO(vo) ? 'Yes' : 'No' }}</span>
                  </label>
                </td>
                <td v-if="visibleColumns.voStatus" class="px-5 py-4 text-sm whitespace-nowrap">
                  <span :class="['inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold', getStatusColor(vo.voStatus)]">{{ formatStatus(vo.voStatus) }}</span>
                </td>
                <td v-if="visibleColumns.emailSentToNokia" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.emailSentToNokia) }}</td>
                <td v-if="visibleColumns.emailApprovedFromNokia" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.emailApprovedFromNokia) }}</td>
                <td v-if="visibleColumns.ticketSubmissionDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.ticketSubmissionDate) }}</td>
                <td v-if="visibleColumns.ticketNumber" class="px-5 py-4 text-sm font-medium text-gray-900 overflow-hidden"><div class="block w-full truncate" :title="vo.ticketNumber || '—'">{{ vo.ticketNumber || '—' }}</div></td>
                <td v-if="visibleColumns.ticketApprovalDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.ticketApprovalDate) }}</td>
                <td v-if="visibleColumns.poStatus" class="px-5 py-4 whitespace-nowrap">
                  <span :class="vo.poNumber?.trim() ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-500'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ vo.poNumber?.trim() ? 'Have PO' : 'No PO' }}</span>
                </td>
                <td v-if="visibleColumns.poNumber" class="px-5 py-4 text-sm font-medium text-gray-900 overflow-hidden"><div class="block w-full truncate" :title="vo.poNumber || '—'">{{ vo.poNumber || '—' }}</div></td>
                <td v-if="visibleColumns.poReceivedDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.poReceivedDate) }}</td>
                <td v-if="visibleColumns.invoiceStatus" class="px-5 py-4 whitespace-nowrap">
                  <span v-if="vo.invoiceStatus" :class="getInvoiceStatusColor(vo.invoiceStatus)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ vo.invoiceStatus }}</span>
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
                <td v-if="visibleColumns.invoiceDate" class="px-5 py-4 text-sm text-gray-700 whitespace-nowrap">{{ formatDate(vo.invoiceDate) }}</td>
                <td v-if="visibleColumns.amountChangeFlag" class="px-5 py-4 text-center whitespace-nowrap">
                  <span :class="vo.amountChangeFlag ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold">{{ vo.amountChangeFlag ? 'Yes' : 'No' }}</span>
                </td>
                <td v-if="visibleColumns.labourCost" class="px-5 py-4 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">{{ vo.labourCost ? formatCurrency(vo.labourCost) : '—' }}</td>
                <td v-if="visibleColumns.thirdPartyCost" class="px-5 py-4 text-sm text-right font-semibold text-gray-900 whitespace-nowrap">{{ vo.thirdPartyCost ? formatCurrency(vo.thirdPartyCost) : '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Expanded footer -->
        <div class="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between gap-4 flex-wrap shrink-0">
          <div class="flex items-center gap-3">
            <span class="text-sm text-gray-500">Showing <span class="font-semibold text-gray-700">{{ paginatedVOs.length }}</span> of <span class="font-semibold text-gray-700">{{ filteredVOs.length }}</span>{{ filteredVOs.length !== voCount ? ` filtered (${voCount} total)` : ' variation orders' }}</span>
            <div v-if="totalPages > 1" class="flex items-center gap-1">
              <button @click="currentPage = 1" :disabled="currentPage === 1" class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">«</button>
              <button @click="currentPage--" :disabled="currentPage === 1" class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">‹</button>
              <span class="px-3 py-1 text-xs font-semibold text-gray-700">{{ currentPage }} / {{ totalPages }}</span>
              <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">›</button>
              <button @click="currentPage = totalPages" :disabled="currentPage === totalPages" class="px-2 py-1 text-xs rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">»</button>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div v-if="selectedCount > 0" class="flex items-center gap-2 px-4 py-1.5 bg-blue-600 rounded-xl">
              <span class="text-xs font-semibold text-blue-100">{{ selectedCount }} selected</span>
              <span class="w-px h-3.5 bg-blue-400"></span>
              <span class="text-sm font-bold text-white">{{ formatCurrency(selectedTotal) }}</span>
            </div>
            <div class="flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-200 rounded-xl">
              <span class="text-xs font-semibold text-gray-500">{{ hasActiveFilters || searchText ? 'Filtered total' : 'All rows total' }}</span>
              <span class="w-px h-3.5 bg-gray-200"></span>
              <span class="text-sm font-bold text-gray-900">{{ formatCurrency(filteredTotal) }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Export dropdown (teleported to body so nothing clips it) -->
    <Teleport to="body">
      <template v-if="showExportMenu">
        <div class="fixed inset-0 z-40" @click="showExportMenu = false"></div>
        <div class="fixed z-50 w-60 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          :style="exportMenuStyle">
          <button @click="exportDefault(); showExportMenu = false"
            class="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left">
            <svg class="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-gray-800">Export Default</p>
              <p class="text-xs text-gray-400 mt-0.5">Name, Desc, Scope, Amount, Ticket</p>
            </div>
          </button>
          <div class="border-t border-gray-100 mx-1"></div>
          <button @click="exportTableView(); showExportMenu = false"
            class="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition text-left">
            <svg class="w-4 h-4 text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 6h18M3 14h18M3 18h18"/>
            </svg>
            <div>
              <p class="text-sm font-semibold text-gray-800">Export Table View</p>
              <p class="text-xs text-gray-400 mt-0.5">Visible columns only, as displayed</p>
            </div>
          </button>
        </div>
      </template>
    </Teleport>

    <!-- VO Form Modal -->
    <VOForm
      v-if="showForm"
      :key="editingVO?.id || prefillData?.id || 'new-vo'"
      :vo="editingVO"
      :prefill="prefillData"
      @save="saveVO"
      @cancel="closeForm"
    />

    <!-- Bulk Scope Edit Modal -->
    <Teleport to="body">
      <div v-if="showBulkScopeEdit" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40" @click.self="showBulkScopeEdit = false; bulkScopeValue = ''">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
          <!-- Header -->
          <div class="flex items-center gap-3 px-6 py-4 bg-indigo-600">
            <div class="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center flex-shrink-0">
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">Bulk Edit Scope</h3>
              <p class="text-indigo-200 text-xs mt-0.5">{{ selectedCount }} variation order{{ selectedCount !== 1 ? 's' : '' }} selected</p>
            </div>
          </div>
          <!-- Body -->
          <div class="px-6 py-5">
            <label class="block text-sm font-semibold text-gray-700 mb-2">New Scope</label>
            <select
              v-model="bulkScopeValue"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="">— select scope —</option>
              <option v-for="s in availableScopes" :key="s" :value="s">{{ s }}</option>
            </select>
            <p v-if="!availableScopes.length" class="mt-2 text-xs text-amber-600">No scopes configured — add scopes in Admin first.</p>
            <p class="mt-3 text-xs text-gray-400">This will overwrite the scope for all selected VOs. The action cannot be undone.</p>
          </div>
          <!-- Footer -->
          <div class="flex gap-3 px-6 pb-5">
            <button
              @click="applyBulkScope"
              :disabled="!bulkScopeValue"
              :class="bulkScopeValue
                ? 'flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition shadow-sm'
                : 'flex-1 px-4 py-2.5 bg-gray-200 text-gray-400 rounded-xl text-sm font-semibold cursor-not-allowed'"
            >Apply to {{ selectedCount }} VOs</button>
            <button
              @click="showBulkScopeEdit = false; bulkScopeValue = ''"
              class="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition"
            >Cancel</button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Flag Description Modal -->
    <Teleport to="body">
      <div v-if="flagModal.show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="flagModal.show = false">
        <div class="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
          <!-- Header -->
          <div class="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <span class="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100">
              <svg class="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 13.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-5.586L3.293 9.707A1 1 0 013 9V6z" clip-rule="evenodd"/>
              </svg>
            </span>
            <h3 class="text-base font-semibold text-gray-900">{{ flagModal.isFlagged ? 'Edit Flag' : 'Flag this VO' }}</h3>
          </div>
          <!-- Body -->
          <div class="px-6 py-5">
            <label class="block text-sm font-medium text-gray-700 mb-2">Reason / Note</label>
            <textarea
              v-model="flagModal.description"
              rows="3"
              placeholder="e.g. Awaiting client sign-off, disputed amount..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
              autofocus
              @keydown.enter.ctrl="confirmFlag"
            ></textarea>
            <p class="mt-1.5 text-xs text-gray-400">This note appears when you hover over the flag icon.</p>
          </div>
          <!-- Footer -->
          <div class="flex items-center justify-between px-6 pb-5 gap-3">
            <button
              v-if="flagModal.isFlagged"
              @click="confirmUnflag"
              class="px-4 py-2 text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 rounded-lg transition"
            >Unflag</button>
            <div v-else></div>
            <div class="flex gap-2">
              <button @click="flagModal.show = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
              <button @click="confirmFlag" class="px-4 py-2 text-sm font-medium text-white bg-amber-500 hover:bg-amber-600 rounded-lg transition">
                {{ flagModal.isFlagged ? 'Save' : 'Flag' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Single shared Filter Popover (teleported to body to avoid overflow clipping) -->
    <FilterPopover
      v-if="activeFilterMenu"
      :column-key="activeFilterMenu"
      :column-label="allColumns.find(c => c.key === activeFilterMenu)?.label || activeFilterMenu"
      :values="getUniqueValues(activeFilterMenu)"
      :current-values="filters[activeFilterMenu] || []"
      :anchor-rect="activeFilterAnchorRect"
      @update:filters="updateFilter"
      @close="activeFilterMenu = null; activeFilterAnchorRect = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import * as XLSX from 'xlsx'
import { useVOStore } from '../stores/voStore'
import VOForm from './VOForm.vue'
import FilterPopover from './FilterPopover.vue'
import { formatCurrency } from '../utils/formatters'

const store = useVOStore()
const showForm = ref(false)
const editingVO = ref(null)
const showColumnPanel = ref(false)
const activeFilterMenu = ref(null)
const activeFilterAnchorRect = ref(null)
const isExpanded = ref(false)
const showFlaggedOnly = ref(false)
const flaggedCount = computed(() => store.flaggedIds.value.size)

// Flag description modal
const flagModal = ref({ show: false, voId: null, description: '', isFlagged: false })

function handleFlagClick(vo) {
  flagModal.value = {
    show: true,
    voId: vo.id,
    description: store.flaggedNotes.value[vo.id] || '',
    isFlagged: store.flaggedIds.value.has(vo.id)
  }
}

function confirmFlag() {
  store.setFlag(flagModal.value.voId, flagModal.value.description)
  flagModal.value.show = false
}

function confirmUnflag() {
  store.removeFlag(flagModal.value.voId)
  flagModal.value.show = false
}

// Pagination
const currentPage = ref(1)
const PAGE_SIZE = 50

// Bulk scope edit
const showBulkScopeEdit = ref(false)
const bulkScopeValue = ref('')

const availableScopes = computed(() => {
  try {
    const gd = JSON.parse(localStorage.getItem('globalData') || '{}')
    return (gd.scopes || []).map(s => (typeof s === 'string' ? s : s.name)).filter(Boolean)
  } catch { return [] }
})

const applyBulkScope = async () => {
  if (!bulkScopeValue.value) return
  const ids = [...selectedRows.value]
  for (const id of ids) {
    const vo = store.vos.value.find(v => v.id === id)
    if (vo) await store.editVO(id, { ...vo, scope: bulkScopeValue.value })
  }
  bulkScopeValue.value = ''
  showBulkScopeEdit.value = false
  clearSelection()
}

const allSelectedPrepped = computed(() =>
  selectedRows.value.size > 0 &&
  [...selectedRows.value].every(id => store.invoicePrepIds.value.has(id))
)

const selectedVOs = computed(() =>
  filteredVOs.value.filter(vo => selectedRows.value.has(vo.id))
)

const anySelectedNoPO = computed(() =>
  selectedVOs.value.some(vo => !vo.poNumber?.trim())
)

const noPOCount = computed(() =>
  selectedVOs.value.filter(vo => !vo.poNumber?.trim()).length
)

const prepDisabled = computed(() => allSelectedPrepped.value || anySelectedNoPO.value)

const prepTooltip = computed(() => {
  if (allSelectedPrepped.value) return 'Already added to invoice prep'
  if (anySelectedNoPO.value) return `${noPOCount.value} selected VO${noPOCount.value !== 1 ? 's have' : ' has'} no PO — cannot prep for invoice`
  return 'Add selected to invoice prep'
})

const prepForInvoice = () => {
  if (prepDisabled.value) return
  const ids = [...selectedRows.value].filter(id => filteredVOs.value.some(vo => vo.id === id))
  store.addToInvoicePrep(ids)
  clearSelection()
}

// ── Persisted state helpers ──
function loadLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback } catch { return fallback }
}
const saveLS = (key, val) => localStorage.setItem(key, JSON.stringify(val))

const searchText = ref(loadLS('tv_searchText', ''))
const activeCombinedFilter = ref(loadLS('tv_combinedFilterKey', ''))

const combinedFilterOptions = [
  { key: 'po-have-not-invoice', label: 'PO have not invoice' }
]

const activeCombinedFilterLabel = computed(() =>
  combinedFilterOptions.find(option => option.key === activeCombinedFilter.value)?.label || ''
)

// Row selection
const selectedRows = ref(new Set())

const selectedCount = computed(() => selectedRows.value.size)

const filteredTotal = computed(() =>
  filteredVOs.value.reduce((sum, vo) => sum + (vo.voAmount || 0), 0)
)

const filterSummary = computed(() => {
  const vos = filteredVOs.value
  const byStatus = {}
  for (const vo of vos) {
    const s = vo.voStatus || 'draft'
    byStatus[s] = (byStatus[s] || 0) + (vo.voAmount || 0)
  }
  return byStatus
})

const selectedTotal = computed(() =>
  filteredVOs.value
    .filter(vo => selectedRows.value.has(vo.id))
    .reduce((sum, vo) => sum + (vo.voAmount || 0), 0)
)

const isAllSelected = computed(() => {
  const vos = filteredVOs.value
  return vos.length > 0 && vos.every(vo => selectedRows.value.has(vo.id))
})

const isIndeterminate = computed(() => {
  const vos = filteredVOs.value
  const selected = vos.filter(vo => selectedRows.value.has(vo.id)).length
  return selected > 0 && selected < vos.length
})

const toggleRowSelection = (id) => {
  const updated = new Set(selectedRows.value)
  if (updated.has(id)) {
    updated.delete(id)
  } else {
    updated.add(id)
  }
  selectedRows.value = updated
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedRows.value = new Set()
  } else {
    selectedRows.value = new Set(filteredVOs.value.map(vo => vo.id))
  }
}

const clearSelection = () => {
  selectedRows.value = new Set()
}

// ── Export helpers ──
const showExportMenu  = ref(false)
const exportBtnRef    = ref(null)
const exportMenuRect  = ref(null)

const toggleExportMenu = () => {
  if (!showExportMenu.value) {
    exportMenuRect.value = exportBtnRef.value?.getBoundingClientRect() ?? null
  }
  showExportMenu.value = !showExportMenu.value
}

const exportMenuStyle = computed(() => {
  if (!exportMenuRect.value) return {}
  return {
    top:   (exportMenuRect.value.bottom + 6) + 'px',
    right: (window.innerWidth - exportMenuRect.value.right) + 'px',
  }
})

const escapeExcelHtml = (value) => String(value ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

const formatExportDate = (value) => value ? new Date(value).toLocaleDateString('en-AU') : ''

const formatExportAmount = (value) => {
  const amount = Number(value) || 0
  return `$ ${amount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function downloadStyledVariationExport(rows, filename) {
  const columns = [
    { key: 'siteName', label: 'Site Name', width: 200, align: 'left' },
    { key: 'description', label: 'Description', width: 320, align: 'left' },
    { key: 'scope', label: 'Scope', width: 250, align: 'left' },
    { key: 'amount', label: 'Amount', width: 130, align: 'right' },
    { key: 'ticketSubmissionDate', label: 'Ticket Submission Date', width: 190, align: 'left' },
    { key: 'ticketNumber', label: 'Ticket Number', width: 150, align: 'left' },
  ]

  const colGroupHtml = columns.map(col => `<col style="width:${col.width}px">`).join('')
  const headerHtml = columns
    .map(col => `<th style="background:#0b2a66;color:#ffffff;border:1px solid #7f7f7f;padding:4px 6px;font-family:Tahoma, Arial, sans-serif;font-size:10pt;font-weight:400;text-align:left;white-space:nowrap;">${escapeExcelHtml(col.label)}</th>`)
    .join('')

  const bodyHtml = rows.map(row => {
    const cells = columns.map(col => {
      const align = col.align === 'right' ? 'right' : 'left'
      return `<td style="border:1px solid #b7b7b7;padding:4px 6px;font-family:Tahoma, Arial, sans-serif;font-size:10pt;text-align:${align};vertical-align:middle;white-space:nowrap;">${escapeExcelHtml(row[col.key])}</td>`
    }).join('')
    return `<tr>${cells}</tr>`
  }).join('')

  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <style>
      table { border-collapse: collapse; }
    </style>
  </head>
  <body>
    <table>
      <colgroup>${colGroupHtml}</colgroup>
      <thead><tr>${headerHtml}</tr></thead>
      <tbody>${bodyHtml}</tbody>
    </table>
  </body>
</html>`

  const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(link.href)
}

const exportDefault = () => {
  const vosToExport = filteredVOs.value.filter(vo => selectedRows.value.has(vo.id))
  if (vosToExport.length === 0) return

  const rows = vosToExport.map(vo => ({
    siteName:             vo.siteName || '',
    description:          vo.voDescription || '',
    scope:                vo.scope || '',
    amount:               formatExportAmount(vo.voAmount),
    ticketSubmissionDate: formatExportDate(vo.ticketSubmissionDate),
    ticketNumber:         vo.ticketNumber || ''
  }))

  const date = new Date().toLocaleDateString('en-AU').replace(/\//g, '-')
  downloadStyledVariationExport(rows, `Variation_Orders_${date}.xls`)
}

const exportTableView = () => {
  const vosToExport = filteredVOs.value.filter(vo => selectedRows.value.has(vo.id))
  if (vosToExport.length === 0) return

  // Build column definitions in table order, filtered to visible only
  const colDefs = [
    { key: 'siteId',                 label: 'Site ID',               get: vo => vo.siteId || '' },
    { key: 'siteName',               label: 'Site Name',             get: vo => vo.siteName || '' },
    { key: 'jobNumber',              label: 'Job No.',               get: vo => vo.jobNumber || '' },
    { key: 'voDescription',          label: 'Description',           get: vo => vo.voDescription || '' },
    { key: 'scope',                  label: 'Scope',                 get: vo => vo.scope || '' },
    { key: 'voCategory',             label: 'Category',              get: vo => vo.voCategory || '' },
    { key: 'poSupplierCategory',     label: 'PO Supplier Category',  get: vo => vo.poSupplierCategory || '' },
    { key: 'voAmount',               label: 'Amount',                get: vo => vo.voAmount || 0 },
    { key: 'boqRelated',             label: 'BOQ Related',           get: vo => (vo.boqRelated === true || vo.boqRelated === 'yes') ? 'Yes' : 'No' },
    { key: 'isDuplicate',            label: 'Duplicate',             get: vo => isDuplicateVO(vo) ? 'Yes' : 'No' },
    { key: 'voStatus',               label: 'Status',                get: vo => formatStatus(vo.voStatus) },
    { key: 'emailSentToNokia',       label: 'Email Sent to Nokia',   get: vo => vo.emailSentToNokia ? new Date(vo.emailSentToNokia).toLocaleDateString('en-AU') : '' },
    { key: 'emailApprovedFromNokia', label: 'Email Approved',        get: vo => vo.emailApprovedFromNokia ? new Date(vo.emailApprovedFromNokia).toLocaleDateString('en-AU') : '' },
    { key: 'ticketSubmissionDate',   label: 'Ticket Sub Date',       get: vo => vo.ticketSubmissionDate ? new Date(vo.ticketSubmissionDate).toLocaleDateString('en-AU') : '' },
    { key: 'ticketNumber',           label: 'Ticket #',              get: vo => vo.ticketNumber || '' },
    { key: 'ticketApprovalDate',     label: 'Ticket Appr Date',      get: vo => vo.ticketApprovalDate ? new Date(vo.ticketApprovalDate).toLocaleDateString('en-AU') : '' },
    { key: 'poStatus',               label: 'PO Status',             get: vo => vo.poNumber?.trim() ? 'Have PO' : 'No PO' },
    { key: 'poNumber',               label: 'PO Number',             get: vo => vo.poNumber || '' },
    { key: 'poReceivedDate',         label: 'PO Received',           get: vo => vo.poReceivedDate ? new Date(vo.poReceivedDate).toLocaleDateString('en-AU') : '' },
    { key: 'invoiceStatus',          label: 'Invoice Status',        get: vo => vo.invoiceStatus || '' },
    { key: 'invoiceDate',            label: 'Invoice Date',          get: vo => vo.invoiceDate ? new Date(vo.invoiceDate).toLocaleDateString('en-AU') : '' },
    { key: 'amountChangeFlag',       label: 'Amt Changed',           get: vo => vo.amountChangeFlag ? 'Yes' : 'No' },
    { key: 'labourCost',             label: 'Labour Cost',           get: vo => vo.labourCost || 0 },
    { key: 'thirdPartyCost',         label: 'Third Party Cost',      get: vo => vo.thirdPartyCost || 0 },
  ].filter(col => visibleColumns.value[col.key])

  const rows = vosToExport.map(vo => {
    const row = {}
    for (const col of colDefs) row[col.label] = col.get(vo)
    return row
  })

  const worksheet = XLSX.utils.json_to_sheet(rows)
  worksheet['!cols'] = colDefs.map(col => ({
    wch: ['voDescription', 'scope'].includes(col.key) ? 35 : col.key === 'invoiceStatus' ? 22 : 18
  }))
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Variation Orders')
  const date = new Date().toLocaleDateString('en-AU').replace(/\//g, '-')
  XLSX.writeFile(workbook, `Variation_Orders_TableView_${date}.xlsx`)
}

// Filter state - tracks which values are selected for each column
const defaultFilters = {
  siteId: [], siteName: [], jobNumber: [], voDescription: [],
  scope: [], voCategory: [], poSupplierCategory: [], voAmount: [], boqRelated: [], isDuplicate: [],
  voStatus: [], emailSentToNokia: [], emailApprovedFromNokia: [],
  ticketSubmissionDate: [], ticketNumber: [], ticketApprovalDate: [],
  poStatus: [], poNumber: [], poReceivedDate: [], invoiceStatus: [], invoiceDate: [], amountChangeFlag: [],
  labourCost: [], thirdPartyCost: []
}
const filters = ref({ ...defaultFilters, ...loadLS('tv_filters', {}) })

// Column visibility state
const defaultColumns = {
  siteId: true, siteName: true, jobNumber: true, voDescription: true,
  scope: true, voCategory: true, poSupplierCategory: true, voAmount: true, boqRelated: true, isDuplicate: true,
  voStatus: true, emailSentToNokia: true, emailApprovedFromNokia: true,
  ticketSubmissionDate: true, ticketNumber: true, ticketApprovalDate: true,
  poStatus: true, poNumber: true, poReceivedDate: true, invoiceStatus: true, invoiceDate: true, amountChangeFlag: true,
  labourCost: true, thirdPartyCost: true
}
const visibleColumns = ref({ ...defaultColumns, ...loadLS('tv_visibleColumns', {}) })

const TABLE_SELECT_WIDTH = 56
const TABLE_ACTIONS_WIDTH = 190
const COLUMN_WIDTHS_STORAGE_KEY = 'tv_columnWidths_v2'

const columnDefinitions = [
  { key: 'siteId', label: 'Site ID', headerLabel: 'Site ID', width: 130, minWidth: 100 },
  { key: 'siteName', label: 'Site Name', headerLabel: 'Site Name', width: 190, minWidth: 140 },
  { key: 'jobNumber', label: 'Job Number', headerLabel: 'Job No.', width: 140, minWidth: 110 },
  { key: 'voDescription', label: 'Description', headerLabel: 'Description', width: 320, minWidth: 180 },
  { key: 'scope', label: 'Scope', headerLabel: 'Scope', width: 260, minWidth: 160 },
  { key: 'voCategory', label: 'Category', headerLabel: 'Category', width: 170, minWidth: 120 },
  { key: 'poSupplierCategory', label: 'PO Supplier Category', headerLabel: 'PO Supplier Cat', width: 190, minWidth: 140 },
  { key: 'voAmount', label: 'Amount', headerLabel: 'Amount', width: 140, minWidth: 110 },
  { key: 'boqRelated', label: 'BOQ Related', headerLabel: 'BOQ', width: 110, minWidth: 90 },
  { key: 'isDuplicate', label: 'Duplicate', headerLabel: 'Duplicate', width: 130, minWidth: 100 },
  { key: 'voStatus', label: 'Status', headerLabel: 'Status', width: 130, minWidth: 110 },
  { key: 'emailSentToNokia', label: 'Email Sent to Nokia', headerLabel: 'Email Sent', width: 150, minWidth: 120 },
  { key: 'emailApprovedFromNokia', label: 'Email Approved from Nokia', headerLabel: 'Email Approved', width: 170, minWidth: 140 },
  { key: 'ticketSubmissionDate', label: 'Ticket Submission Date', headerLabel: 'Ticket Sub Date', width: 170, minWidth: 140 },
  { key: 'ticketNumber', label: 'Ticket Number', headerLabel: 'Ticket #', width: 150, minWidth: 120 },
  { key: 'ticketApprovalDate', label: 'Ticket Approval Date', headerLabel: 'Ticket Appr Date', width: 170, minWidth: 140 },
  { key: 'poStatus', label: 'PO Status', headerLabel: 'PO Status', width: 120, minWidth: 100 },
  { key: 'poNumber', label: 'PO Number', headerLabel: 'PO Number', width: 150, minWidth: 120 },
  { key: 'poReceivedDate', label: 'PO Received Date', headerLabel: 'PO Received', width: 160, minWidth: 130 },
  { key: 'invoiceStatus', label: 'Invoice Status', headerLabel: 'Invoice Status', width: 160, minWidth: 130 },
  { key: 'invoiceDate', label: 'Invoice Date', headerLabel: 'Invoice Date', width: 150, minWidth: 120 },
  { key: 'amountChangeFlag', label: 'Amount Change Flag', headerLabel: 'Amt Changed', width: 150, minWidth: 120 },
  { key: 'labourCost', label: 'Labour Cost', headerLabel: 'Labour Cost', width: 150, minWidth: 120 },
  { key: 'thirdPartyCost', label: 'Third Party Cost', headerLabel: '3rd Party Cost', width: 170, minWidth: 130 }
]

const allColumns = columnDefinitions.map(({ key, label }) => ({ key, label }))
const defaultColumnWidths = Object.fromEntries(columnDefinitions.map(col => [col.key, col.width]))
const columnMinWidths = Object.fromEntries(columnDefinitions.map(col => [col.key, col.minWidth]))
const savedColumnWidths = loadLS(COLUMN_WIDTHS_STORAGE_KEY, null)
const hasCustomColumnWidths = ref(Boolean(savedColumnWidths && Object.keys(savedColumnWidths).length))
const columnWidths = ref({ ...defaultColumnWidths, ...(savedColumnWidths || {}) })
const renderedColumns = computed(() => columnDefinitions.filter(col => visibleColumns.value[col.key]))

const getColumnWidth = (columnKey) => {
  const fallbackWidth = defaultColumnWidths[columnKey] || 140
  const minWidth = columnMinWidths[columnKey] || 100
  return Math.max(minWidth, Number(columnWidths.value[columnKey]) || fallbackWidth)
}

const tableMinWidth = computed(() =>
  TABLE_SELECT_WIDTH +
  TABLE_ACTIONS_WIDTH +
  renderedColumns.value.reduce((sum, col) => sum + getColumnWidth(col.key), 0)
)

const tableStyle = computed(() => ({
  width: hasCustomColumnWidths.value ? `${tableMinWidth.value}px` : '100%',
  minWidth: '100%'
}))

const getRenderedColumnStyle = (columnKey) => (
  hasCustomColumnWidths.value
    ? { width: `${getColumnWidth(columnKey)}px` }
    : undefined
)

let resizeStartX = 0
let resizeStartWidth = 0
const resizingColumn = ref(null)

const handleColumnResize = (event) => {
  if (!resizingColumn.value) return
  const nextWidth = resizeStartWidth + (event.clientX - resizeStartX)
  columnWidths.value[resizingColumn.value] = Math.max(
    columnMinWidths[resizingColumn.value] || 100,
    nextWidth
  )
}

const stopColumnResize = () => {
  resizingColumn.value = null
  document.removeEventListener('mousemove', handleColumnResize)
  document.removeEventListener('mouseup', stopColumnResize)
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

const syncColumnWidthsFromTable = (tableEl) => {
  if (!tableEl) return

  const measuredWidths = {}
  tableEl.querySelectorAll('th[data-column-key]').forEach((cell) => {
    const key = cell.dataset.columnKey
    if (!key) return
    measuredWidths[key] = Math.max(
      columnMinWidths[key] || 100,
      Math.round(cell.getBoundingClientRect().width)
    )
  })

  if (Object.keys(measuredWidths).length) {
    columnWidths.value = { ...columnWidths.value, ...measuredWidths }
  }
}

const startColumnResize = (event, columnKey) => {
  stopColumnResize()
  if (!hasCustomColumnWidths.value) {
    hasCustomColumnWidths.value = true
    syncColumnWidthsFromTable(event.currentTarget?.closest('table'))
  }
  resizingColumn.value = columnKey
  resizeStartX = event.clientX
  resizeStartWidth = event.currentTarget?.closest('th')?.getBoundingClientRect().width || getColumnWidth(columnKey)
  document.addEventListener('mousemove', handleColumnResize)
  document.addEventListener('mouseup', stopColumnResize)
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
}

const resetColumnWidth = (columnKey) => {
  columnWidths.value[columnKey] = defaultColumnWidths[columnKey]
}

// ── Sort state ──
const sortColumn = ref(loadLS('tv_sortColumn', null))
const sortDir    = ref(loadLS('tv_sortDir', 'asc'))  // 'asc' | 'desc'

const toggleSort = (columnKey) => {
  if (sortColumn.value === columnKey) {
    if (sortDir.value === 'asc') {
      sortDir.value = 'desc'
    } else {
      // third click clears sort
      sortColumn.value = null
      sortDir.value = 'asc'
    }
  } else {
    sortColumn.value = columnKey
    sortDir.value = 'asc'
  }
  localStorage.setItem('tv_sortColumn', JSON.stringify(sortColumn.value))
  localStorage.setItem('tv_sortDir', JSON.stringify(sortDir.value))
  currentPage.value = 1
}

function getSortValue(vo, col) {
  if (col === 'poStatus') return vo.poNumber?.trim() ? 1 : 0
  if (col === 'boqRelated' || col === 'amountChangeFlag' || col === 'isDuplicate') return vo[col] ? 1 : 0
  if (col === 'voAmount' || col === 'labourCost' || col === 'thirdPartyCost') return vo[col] || 0
  const dateFields = ['emailSentToNokia', 'emailApprovedFromNokia', 'ticketSubmissionDate',
    'ticketApprovalDate', 'invoiceDate', 'poReceivedDate', 'createdAt', 'updatedAt']
  if (dateFields.includes(col)) {
    const d = vo[col] ? new Date(vo[col]).getTime() : 0
    return d
  }
  return (vo[col] ?? '').toString().toLowerCase()
}

const voCount = computed(() => {
  const vosArray = store.vos.value || []
  return vosArray.length || 0
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredVOs.value.length / PAGE_SIZE)))

const paginatedVOs = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredVOs.value.slice(start, start + PAGE_SIZE)
})

const filteredVOs = computed(() => {
  let vosArray = store.vos.value || []

  // Flagged filter
  if (showFlaggedOnly.value) {
    vosArray = vosArray.filter(vo => store.flaggedIds.value.has(vo.id))
  }

  // Apply search filter
  if (searchText.value.trim()) {
    const search = searchText.value.toLowerCase()
    vosArray = vosArray.filter(vo =>
      vo.siteId?.toLowerCase().includes(search) ||
      vo.siteName?.toLowerCase().includes(search) ||
      vo.voDescription?.toLowerCase().includes(search) ||
      vo.ticketNumber?.toLowerCase().includes(search) ||
      vo.poNumber?.toLowerCase().includes(search) ||
      vo.poSupplierCategory?.toLowerCase().includes(search)
    )
  }

  if (activeCombinedFilter.value) {
    vosArray = vosArray.filter(vo => matchesCombinedFilter(vo))
  }

  // Apply column filters
  vosArray = vosArray.filter(vo => matchesAllFilters(vo))

  // Apply sort
  if (sortColumn.value) {
    const col = sortColumn.value
    const dir = sortDir.value === 'asc' ? 1 : -1
    vosArray = [...vosArray].sort((a, b) => {
      const av = getSortValue(a, col)
      const bv = getSortValue(b, col)
      if (av < bv) return -1 * dir
      if (av > bv) return  1 * dir
      return 0
    })
  }

  return vosArray
})

const matchesCombinedFilter = (vo) => {
  switch (activeCombinedFilter.value) {
    case 'po-have-not-invoice':
      return Boolean(vo.poNumber?.trim()) && !vo.invoiceDate
    default:
      return true
  }
}

const matchesAllFilters = (vo) => {
  for (const [column, selectedValues] of Object.entries(filters.value)) {
    if (selectedValues.length === 0) continue // No filter active for this column

    let voValue = vo[column]

    // Format value based on column type
    if (column === 'boqRelated' || column === 'amountChangeFlag' || column === 'isDuplicate') {
      voValue = voValue ? 'Yes' : 'No'
    } else if (column === 'poStatus') {
      voValue = vo.poNumber?.trim() ? 'Have PO' : 'No PO'
    } else if (['emailSentToNokia', 'emailApprovedFromNokia', 'ticketSubmissionDate', 'ticketApprovalDate', 'invoiceDate'].includes(column)) {
      voValue = voValue ? new Date(voValue).toLocaleDateString('en-AU') : '—'
    } else if (column === 'voStatus') {
      const statusMap = { 'draft': 'Draft', 'submitted': 'Submitted', 'pending-approval': 'Pending', 'approved': 'Approved', 'rejected': 'Rejected' }
      voValue = statusMap[voValue] || voValue
    } else if (column === 'voAmount') {
      voValue = formatCurrency(voValue)
    }

    // Check if value is in selected values
    if (!selectedValues.includes(String(voValue))) {
      return false
    }
  }
  return true
}

const prefillData = ref(null)

const openNewVOForm = () => {
  editingVO.value = null
  prefillData.value = null
  showForm.value = true
}

const cloneVOForEdit = (vo) => JSON.parse(JSON.stringify(vo))

const editVO = (vo) => {
  editingVO.value = cloneVOForEdit(vo)
  prefillData.value = null
  showForm.value = true
}

const isDuplicateVO = (vo) => vo?.isDuplicate === true

const toggleDuplicateFlag = async (vo) => {
  try {
    await store.editVO(vo.id, { ...vo, isDuplicate: !isDuplicateVO(vo) }, { suppressLoadingToggle: true })
  } catch (err) {
    console.error('Error toggling duplicate flag:', err)
    alert('Error updating duplicate flag: ' + err.message)
  }
}

const duplicateSelectedVO = () => {
  const id = [...selectedRows.value][0]
  const vo = store.vos.value.find(v => v.id === id)
  if (!vo) return
  prefillData.value = vo
  editingVO.value = null
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  editingVO.value = null
  prefillData.value = null
}

const saveVO = async (voData) => {
  try {
    if (editingVO.value) {
      await store.editVO(editingVO.value.id, voData)
    } else {
      await store.createVO(voData)
    }
    closeForm()
  } catch (err) {
    console.error('❌ Error saving VO:', err)
    alert('Error saving VO: ' + err.message)
  }
}

const deleteVO = async (id) => {
  if (confirm('Are you sure you want to delete this variation order?')) {
    try {
      await store.removeVO(id)
    } catch (err) {
      console.error('❌ Error deleting VO:', err)
      alert('Error deleting VO: ' + err.message)
    }
  }
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-AU')
}

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'submitted': 'Submitted',
    'pending-approval': 'Pending',
    'approved': 'Approved',
    'rejected': 'Rejected'
  }
  return statusMap[status] || status
}

const getStatusColor = (status) => {
  const colorMap = {
    'draft': 'bg-gray-200 text-gray-800',
    'submitted': 'bg-blue-200 text-blue-800',
    'pending-approval': 'bg-yellow-200 text-yellow-800',
    'approved': 'bg-green-200 text-green-800',
    'rejected': 'bg-red-200 text-red-800',
    'cancelled': 'bg-slate-200 text-slate-700'
  }
  return colorMap[status] || 'bg-gray-200 text-gray-800'
}

const getInvoiceStatusColor = (status) => {
  const colorMap = {
    'Not Yet Sent': 'bg-gray-100 text-gray-600',
    'To Be Sent to Nokia': 'bg-indigo-100 text-indigo-700',
    'Request to Nokia': 'bg-blue-100 text-blue-700',
    'SIT Approved': 'bg-yellow-100 text-yellow-700',
    'SIT Completed': 'bg-green-100 text-green-700',
    'SIT Wrong Amount': 'bg-rose-100 text-rose-700'
  }
  return colorMap[status] || 'bg-gray-100 text-gray-600'
}

const toggleColumnPanel = () => {
  showColumnPanel.value = !showColumnPanel.value
}

const toggleColumn = (columnKey) => {
  visibleColumns.value[columnKey] = !visibleColumns.value[columnKey]
}

const resetColumns = () => {
  visibleColumns.value = { ...defaultColumns }
  columnWidths.value = { ...defaultColumnWidths }
  hasCustomColumnWidths.value = false
  localStorage.removeItem('tv_visibleColumns')
  localStorage.removeItem('tv_columnWidths')
  localStorage.removeItem(COLUMN_WIDTHS_STORAGE_KEY)
}

// Filter functions
const getUniqueValues = (columnKey) => {
  const vosArray = store.vos.value || []
  const uniqueSet = new Set()

  vosArray.forEach(vo => {
    let value = vo[columnKey]

    // Format value based on column type
    if (columnKey === 'boqRelated' || columnKey === 'amountChangeFlag' || columnKey === 'isDuplicate') {
      value = value ? 'Yes' : 'No'
    } else if (columnKey === 'poStatus') {
      value = vo.poNumber?.trim() ? 'Have PO' : 'No PO'
    } else if (['emailSentToNokia', 'emailApprovedFromNokia', 'ticketSubmissionDate', 'ticketApprovalDate', 'invoiceDate'].includes(columnKey)) {
      value = value ? new Date(value).toLocaleDateString('en-AU') : '—'
    } else if (columnKey === 'voStatus') {
      const statusMap = { 'draft': 'Draft', 'submitted': 'Submitted', 'pending-approval': 'Pending', 'approved': 'Approved', 'rejected': 'Rejected' }
      value = statusMap[value] || value
    } else if (columnKey === 'voAmount') {
      value = formatCurrency(value)
    }

    if (value !== null && value !== undefined && value !== '') {
      uniqueSet.add(String(value))
    }
  })

  return Array.from(uniqueSet).sort()
}

const updateFilter = (columnKey, selectedValues) => {
  filters.value[columnKey] = selectedValues
}

const toggleFilterMenu = (columnKey, event) => {
  if (activeFilterMenu.value === columnKey) {
    activeFilterMenu.value = null
    activeFilterAnchorRect.value = null
  } else {
    activeFilterMenu.value = columnKey
    activeFilterAnchorRect.value = event.currentTarget.getBoundingClientRect()
  }
}

const clearAllFilters = () => {
  Object.keys(filters.value).forEach(key => { filters.value[key] = [] })
  activeCombinedFilter.value = ''
}


const hasActiveFilters = computed(() => {
  return Boolean(activeCombinedFilter.value) || Object.values(filters.value).some(f => f.length > 0)
})

// ── Persist state to localStorage ──
// Clear row selection whenever filters or search change to avoid stale selections
watch([searchText, filters, () => store.selectedFilters.value], () => {
  clearSelection()
  currentPage.value = 1
}, { deep: true })

watch(searchText,      v  => saveLS('tv_searchText', v))
watch(activeCombinedFilter, v => saveLS('tv_combinedFilterKey', v))
watch(showFlaggedOnly, () => { clearSelection(); currentPage.value = 1 })
watch(filters,        v  => saveLS('tv_filters', v),        { deep: true })
watch(visibleColumns, v  => saveLS('tv_visibleColumns', v), { deep: true })
watch(columnWidths, (value) => {
  if (hasCustomColumnWidths.value) saveLS(COLUMN_WIDTHS_STORAGE_KEY, value)
}, { deep: true })
watch(hasCustomColumnWidths, (value) => {
  if (value) {
    saveLS(COLUMN_WIDTHS_STORAGE_KEY, columnWidths.value)
  } else {
    localStorage.removeItem('tv_columnWidths')
    localStorage.removeItem(COLUMN_WIDTHS_STORAGE_KEY)
  }
})

const _onEsc = (e) => { if (e.key === 'Escape') isExpanded.value = false }
onMounted(() => document.addEventListener('keydown', _onEsc))
onUnmounted(() => {
  document.removeEventListener('keydown', _onEsc)
  stopColumnResize()
})
</script>
