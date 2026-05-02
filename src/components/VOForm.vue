<template>
  <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.self="emit('cancel')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">

      <!-- ── Header ── -->
      <div class="flex items-center justify-between px-6 py-4 bg-blue-700 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <svg v-if="!vo" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            <svg v-else class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-white">{{ vo ? 'Edit Variation Order' : 'New Variation Order' }}</h3>
              <span v-if="isBasePOForm"                    class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">Base PO</span>
              <span v-if="isBOQForm"                      class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 uppercase tracking-wider">BOQ Related</span>
              <span v-if="form.voStatus === 'cancelled'"  class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-600 border border-slate-300 uppercase tracking-wider">Cancelled</span>
            </div>
            <p class="text-xs text-blue-200 mt-0.5">{{ vo ? `Editing · ${vo.siteId} — ${vo.siteName}` : 'Fill in the details below' }}</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Required legend -->
          <span class="text-xs text-blue-200 hidden sm:block">Fields marked <span class="text-yellow-300 font-semibold">*</span> required</span>
          <button @click="emit('cancel')"
            class="w-8 h-8 flex items-center justify-center rounded-lg text-blue-200 hover:text-white hover:bg-blue-600 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- ── Body ── -->
      <form @submit.prevent="submitForm" class="flex-1 overflow-y-auto min-h-0">
        <div class="grid grid-cols-5 divide-x divide-gray-100 min-h-full">

          <!-- ════ LEFT PANEL (3/5) ════ -->
          <div class="col-span-3 p-6 space-y-5 overflow-y-auto">

            <!-- Site row -->
            <div class="bg-blue-50/60 border border-blue-100 rounded-xl p-4 space-y-3">
              <div class="flex items-center gap-2 mb-1">
                <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="text-xs font-bold text-blue-700 uppercase tracking-wider">Site</span>
              </div>

              <!-- Site search -->
              <div class="relative">
                <svg class="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input v-model="siteSearch" type="text" placeholder="Search by ID, name, job or note…"
                  @focus="showSiteDropdown = true" @blur="hideSiteDropdown"
                  class="w-full pl-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 transition"
                  :class="siteSearch ? 'pr-7' : 'pr-3'" />
                <!-- Clear button -->
                <button v-if="siteSearch" type="button" @mousedown.prevent="clearSiteSearch"
                  class="absolute right-2 top-2 w-4 h-4 flex items-center justify-center rounded-full bg-gray-300 hover:bg-gray-400 transition">
                  <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
                <div v-if="showSiteDropdown && filteredSites.length > 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-52 overflow-y-auto" @mousedown.prevent>
                  <div v-for="(site, idx) in filteredSites" :key="`${site.siteId}|${site.siteName}|${site.jobNumber}|${idx}`"
                    @mousedown.prevent="selectSite(site)"
                    class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition">
                    <div class="flex items-center gap-2">
                      <span class="px-1.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-700 shrink-0">{{ site.siteId }}</span>
                      <span class="text-sm text-gray-800 flex-1 truncate font-medium">{{ site.siteName }}</span>
                      <span v-if="site.jobNumber" class="text-xs text-gray-400 font-mono shrink-0">{{ site.jobNumber }}</span>
                    </div>
                    <p v-if="site.comment" class="mt-0.5 text-[11px] text-gray-400 truncate pl-0.5">{{ site.comment }}</p>
                  </div>
                </div>
                <div v-if="showSiteDropdown && siteSearch.trim() && filteredSites.length === 0"
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow z-20 px-4 py-3 text-sm text-gray-400 text-center">
                  No matching sites
                </div>
              </div>

              <!-- Site ID / Name / Job -->
              <div class="grid grid-cols-3 gap-2">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Site ID <span class="text-red-400">*</span></label>
                  <input v-model="form.siteId" type="text" required placeholder="R07"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 transition" />
                </div>
                <div class="col-span-2">
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Site Name <span class="text-red-400">*</span></label>
                  <input v-model="form.siteName" type="text" required placeholder="e.g. Glen Iris"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 transition" />
                </div>
              </div>
              <div>
                <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Job Number</label>
                <input v-model="form.jobNumber" type="text" placeholder="e.g. JOB-2024-001"
                  class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 transition" />
              </div>
            </div>

            <!-- Variation Details -->
            <div class="border border-blue-100 rounded-xl p-4 space-y-3">
              <div class="flex items-center gap-2">
                <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">Variation Details</span>
              </div>

              <!-- Description -->
              <div>
                <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Description <span class="text-red-400">*</span></label>
                <textarea v-model="form.voDescription" required placeholder="Describe this variation order…" rows="3"
                  class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-gray-50 placeholder-gray-400 transition resize-none"
                  :class="duplicateErrors.voDescription ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-500'"></textarea>
                <p v-if="duplicateErrors.voDescription" class="mt-1 flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Duplicate — {{ duplicateErrors.voDescription }}
                </p>
              </div>

              <!-- Amount + Category -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Amount <span class="text-red-400">*</span></label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input
                      :value="amountDisplay"
                      @focus="amountDisplay = form.voAmount ? String(form.voAmount) : ''"
                      @input="e => { amountDisplay = e.target.value; form.voAmount = parseFloat(e.target.value.replace(/,/g, '')) || 0 }"
                      @blur="amountDisplay = form.voAmount ? form.voAmount.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''"
                      type="text" inputmode="decimal" :required="form.voStatus !== 'cancelled'" placeholder="0.00"
                      class="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition" />
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Category <span class="text-red-400">*</span></label>
                  <div class="relative">
                    <input v-model="form.voCategory" type="text" required placeholder="Select or type…"
                      @focus="showCategoryDropdown = true" @blur="showCategoryDropdown = false"
                      class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition" />
                    <div v-if="showCategoryDropdown && filteredCategories.length > 0"
                      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-44 overflow-y-auto" @mousedown.prevent>
                      <div v-for="cat in filteredCategories" :key="cat.name"
                        @mousedown.prevent="selectCategory(cat.name)"
                        class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition text-sm text-gray-800">
                        {{ cat.name }}
                        <span v-if="cat.comment" class="text-xs text-gray-400 ml-1">— {{ cat.comment }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Labour Cost + Third Party Cost -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Labour Cost</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input
                      :value="form.labourCost ? form.labourCost.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''"
                      @focus="e => { e.target.value = form.labourCost ? String(form.labourCost) : '' }"
                      @input="e => { form.labourCost = parseFloat(e.target.value.replace(/,/g, '')) || 0 }"
                      @blur="e => { e.target.value = form.labourCost ? form.labourCost.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '' }"
                      type="text" inputmode="decimal" placeholder="0.00"
                      class="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition" />
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Third Party Cost</label>
                  <div class="relative">
                    <span class="absolute left-3 top-2 text-gray-400 text-sm">$</span>
                    <input
                      :value="form.thirdPartyCost ? form.thirdPartyCost.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''"
                      @focus="e => { e.target.value = form.thirdPartyCost ? String(form.thirdPartyCost) : '' }"
                      @input="e => { form.thirdPartyCost = parseFloat(e.target.value.replace(/,/g, '')) || 0 }"
                      @blur="e => { e.target.value = form.thirdPartyCost ? form.thirdPartyCost.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '' }"
                      type="text" inputmode="decimal" placeholder="0.00"
                      class="w-full pl-6 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 transition" />
                  </div>
                </div>
              </div>

              <!-- Amount Change Log (read-only) -->
              <div v-if="amountLog.length > 0">
                <div class="flex items-center gap-2 mb-2">
                  <svg class="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                  <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Amount Change Log</span>
                  <span class="ml-auto text-[10px] text-gray-400 italic">Read-only</span>
                </div>
                <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  <div v-for="(entry, idx) in amountLog" :key="idx"
                    class="flex items-start gap-2.5 px-3 py-2 rounded-lg border bg-orange-50 border-orange-100">
                    <div class="mt-0.5 w-2 h-2 rounded-full bg-orange-400 shrink-0"></div>
                    <div class="flex-1 min-w-0 text-xs">
                      <span class="font-semibold text-orange-700">
                        ${{ Number(entry.from).toLocaleString('en-AU', { minimumFractionDigits: 2 }) }}
                        <span class="text-gray-400 font-normal mx-1">→</span>
                        ${{ Number(entry.to).toLocaleString('en-AU', { minimumFractionDigits: 2 }) }}
                      </span>
                      <span class="ml-2 font-semibold" :class="entry.delta >= 0 ? 'text-green-600' : 'text-red-600'">
                        {{ entry.delta >= 0 ? '+' : '' }}${{ Number(entry.delta).toLocaleString('en-AU', { minimumFractionDigits: 2 }) }}
                      </span>
                      <span class="ml-2 px-1.5 py-0.5 rounded text-[10px] font-medium"
                        :class="entry.source === 'amount-import' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-600'">
                        {{ entry.source === 'amount-import' ? 'Import' : 'Invoice Prep' }}
                      </span>
                    </div>
                    <span class="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{{ formatLogDateTime(entry.loggedAt) }}</span>
                  </div>
                </div>
              </div>

              <!-- Scope -->
              <div>
                <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Scope <span class="text-red-400">*</span></label>
                <div class="relative">
                  <textarea v-model="form.scope" required placeholder="Describe the scope…" rows="2"
                    @focus="showScopeDropdown = true" @blur="showScopeDropdown = false"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition resize-none"></textarea>
                  <div v-if="showScopeDropdown && filteredScopes.length > 0"
                    class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-44 overflow-y-auto" @mousedown.prevent>
                    <div v-for="scope in filteredScopes" :key="scope.name"
                      @mousedown.prevent="selectScope(scope.name)"
                      class="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition text-sm text-gray-800">
                      {{ scope.name }}
                      <span v-if="scope.comment" class="text-xs text-gray-400 ml-1">— {{ scope.comment }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- BOQ -->
              <div>
                <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">BOQ Related</label>
                <div class="flex gap-2">
                  <label v-for="opt in [{val: true, label: 'Yes', active: 'border-green-500 bg-green-50 text-green-700'}, {val: false, label: 'No', active: 'border-gray-400 bg-gray-100 text-gray-700'}]"
                    :key="opt.label"
                    class="flex-1 flex items-center justify-center py-1.5 rounded-lg border-2 cursor-pointer transition text-sm font-semibold"
                    :class="form.boqRelated === opt.val ? opt.active : 'border-gray-200 text-gray-400 hover:border-gray-300'">
                    <input type="radio" :value="opt.val" v-model="form.boqRelated" class="hidden" />
                    {{ opt.label }}
                  </label>
                </div>
              </div>
            </div>

            <!-- Comment -->
            <div class="border border-blue-100 rounded-xl p-4">
              <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Comment</label>
              <textarea v-model="form.comment" placeholder="Any notes or remarks…" rows="3"
                class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-400 transition resize-none"></textarea>
            </div>

            <!-- Invoice Log (read-only) -->
            <div v-if="invoiceLog.length > 0">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Invoice Activity Log</span>
                <span class="ml-auto text-[10px] text-gray-400 italic">Read-only · cannot be modified</span>
              </div>
              <div class="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                <div v-for="(entry, idx) in invoiceLog" :key="idx"
                  class="flex items-start gap-2.5 px-3 py-2 rounded-lg border"
                  :class="entry.status === 'Not Yet Sent' || entry.status === 'Cleared' ? 'bg-gray-50 border-gray-200' : entry.status === 'To Be Sent to Nokia' ? 'bg-indigo-50 border-indigo-100' : 'bg-blue-50 border-blue-100'">
                  <div class="mt-0.5 w-2 h-2 rounded-full shrink-0"
                    :class="{
                      'bg-gray-400':   entry.status === 'Not Yet Sent' || entry.status === 'Cleared',
                      'bg-indigo-400': entry.status === 'To Be Sent to Nokia',
                      'bg-blue-400':   entry.status === 'Request to Nokia',
                      'bg-yellow-400': entry.status === 'SIT Approved',
                      'bg-green-400':  entry.status === 'SIT Completed'
                    }">
                  </div>
                  <div class="flex-1 min-w-0">
                    <span class="text-xs font-semibold"
                      :class="{
                        'text-gray-500':   entry.status === 'Not Yet Sent' || entry.status === 'Cleared',
                        'text-indigo-700': entry.status === 'To Be Sent to Nokia',
                        'text-blue-700':   entry.status === 'Request to Nokia',
                        'text-yellow-700': entry.status === 'SIT Approved',
                        'text-green-700':  entry.status === 'SIT Completed'
                      }">
                      {{ entry.status }}
                    </span>
                    <span class="text-xs text-gray-500 ml-2">— {{ formatLogDate(entry.date) }}</span>
                    <span v-if="entry.source === 'manual'" class="ml-2 text-[10px] text-gray-400 italic">manual</span>
                  </div>
                  <span class="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{{ formatLogDateTime(entry.loggedAt) }}</span>
                </div>
              </div>
            </div>

            <!-- PO Log (read-only) -->
            <div v-if="poLog.length > 0">
              <div class="flex items-center gap-2 mb-2">
                <svg class="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">PO Change Log</span>
                <span class="ml-auto text-[10px] text-gray-400 italic">Read-only · cannot be modified</span>
              </div>
              <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                <div v-for="(entry, idx) in poLog" :key="idx"
                  class="flex items-start gap-2.5 px-3 py-2 rounded-lg border bg-teal-50 border-teal-100">
                  <div class="mt-0.5 w-2 h-2 rounded-full shrink-0"
                    :class="entry.to ? 'bg-teal-400' : 'bg-gray-400'">
                  </div>
                  <div class="flex-1 min-w-0 text-xs">
                    <span v-if="entry.from && entry.to" class="font-semibold text-teal-700">
                      {{ entry.from }} <span class="text-gray-400 font-normal">→</span> {{ entry.to }}
                    </span>
                    <span v-else-if="entry.to" class="font-semibold text-teal-700">Set to {{ entry.to }}</span>
                    <span v-else class="text-gray-500">PO cleared<span v-if="entry.from"> (was {{ entry.from }})</span></span>
                  </div>
                  <span class="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{{ formatLogDateTime(entry.loggedAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ════ RIGHT PANEL (2/5) ════ -->
          <div class="col-span-2 p-4 space-y-3 overflow-y-auto">

            <!-- Base PO notice (replaces Status + Ticket when category is Base PO) -->
            <div v-if="isBasePOForm" class="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 space-y-1.5">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-xs font-bold text-amber-700 uppercase tracking-wider">Base PO Category</span>
              </div>
              <p class="text-xs text-amber-700 leading-relaxed">
                This category (<span class="font-semibold">{{ form.voCategory }}</span>) is tracked as a <span class="font-semibold">Base PO</span>, not a variation order. VO status and ticket fields are not required.
              </p>
            </div>

            <!-- BOQ Related notice (hides Ticket; status auto-driven by PO) -->
            <div v-if="isBOQForm" class="rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 space-y-1.5">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-xs font-bold text-green-700 uppercase tracking-wider">BOQ Related</span>
              </div>
              <p class="text-xs text-green-700 leading-relaxed">
                This VO is <span class="font-semibold">BOQ Related</span> — no ticket uplift required. Status is set automatically: <span class="font-semibold">Approved</span> when a PO is assigned, <span class="font-semibold">Pending Approval</span> when no PO.
              </p>
            </div>

            <!-- Cancelled notice -->
            <div v-if="form.voStatus === 'cancelled'" class="rounded-xl border border-slate-300 bg-slate-50 px-4 py-3.5 space-y-1.5">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"/>
                </svg>
                <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Cancelled</span>
              </div>
              <p class="text-xs text-slate-600 leading-relaxed">
                This VO has been <span class="font-semibold">cancelled</span>. Amount has been set to <span class="font-semibold">$0</span> and all ticket, timeline and email fields have been cleared. The removed data is preserved in the activity log.
              </p>
            </div>

            <!-- Status (hidden for Base PO) -->
            <div v-if="!isBasePOForm" class="border border-blue-100 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">Status</span>
              </div>
              <div class="space-y-1.5">
                <label v-for="opt in statusOptions" :key="opt.value"
                  class="flex items-center gap-2.5 px-3 py-2 rounded-xl border-2 cursor-pointer transition"
                  :class="form.voStatus === opt.value ? [opt.border, opt.bg] : 'border-gray-200 hover:border-gray-300 bg-white'">
                  <input type="radio" :value="opt.value" v-model="form.voStatus" class="hidden" />
                  <span class="w-2 h-2 rounded-full shrink-0" :class="opt.dot"></span>
                  <span class="text-sm font-semibold flex-1" :class="form.voStatus === opt.value ? opt.text : 'text-gray-600'">{{ opt.label }}</span>
                  <svg v-if="form.voStatus === opt.value" class="w-3.5 h-3.5 shrink-0" :class="opt.text" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </label>
              </div>
            </div>

            <!-- Approval Timeline -->
            <div class="border border-blue-100 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">Approval Timeline</span>
              </div>
              <div class="space-y-2">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Sent to Nokia</label>
                  <input v-model="form.emailSentToNokia" type="date"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition" />
                </div>
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Email Approved from Nokia</label>
                  <input v-model="form.emailApprovedFromNokia" type="date"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition" />
                </div>
              </div>
            </div>

            <!-- Ticket (hidden for Base PO and BOQ VOs) -->
            <div v-if="!isBasePOForm && !isBOQForm" class="border border-blue-100 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
                <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">Ticket</span>
              </div>
              <div class="space-y-2">
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Ticket Number</label>
                  <input v-model="form.ticketNumber" type="text" placeholder="e.g. TK-12345"
                    class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white placeholder-gray-400 transition"
                    :class="duplicateErrors.ticketNumber ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-500'" />
                  <p v-if="duplicateErrors.ticketNumber" class="mt-1 flex items-center gap-1 text-xs text-red-600 font-medium">
                    <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Duplicate ticket number
                  </p>
                </div>
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Sub. Date</label>
                    <input v-model="form.ticketSubmissionDate" type="date"
                      class="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Appr. Date</label>
                    <input v-model="form.ticketApprovalDate" type="date"
                      class="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition" />
                  </div>
                </div>
              </div>
            </div>

            <!-- PO & Invoice -->
            <div class="border border-blue-100 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-3.5 h-3.5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                <span class="text-xs font-bold text-gray-600 uppercase tracking-wider">PO & Invoice</span>
              </div>
              <div class="space-y-2">
                <!-- PO Status badge + PO Number -->
                <div class="flex items-end gap-2">
                  <div class="shrink-0">
                    <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">PO Status</label>
                    <span class="inline-flex items-center px-2.5 py-2 rounded-lg text-xs font-bold border"
                      :class="form.poNumber?.trim() ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-gray-100 border-gray-200 text-gray-500'">
                      {{ form.poNumber?.trim() ? 'Have PO' : 'No PO' }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">PO Number</label>
                    <input v-model="form.poNumber" type="text" placeholder="PO-12345"
                      class="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white placeholder-gray-400 transition"
                      :class="duplicateErrors.poNumber ? 'border-red-400 focus:ring-red-400' : 'border-gray-200 focus:ring-blue-500'" />
                  </div>
                </div>
                <p v-if="duplicateErrors.poNumber" class="flex items-center gap-1 text-xs text-red-600 font-medium">
                  <svg class="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  Duplicate PO number
                </p>

                <!-- PO Received Date -->
                <div>
                  <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">PO Received Date</label>
                  <input v-model="form.poReceivedDate" type="date"
                    class="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white transition" />
                </div>

                <!-- Invoice Status -->
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Invoice Status</label>
                    <button v-if="form.invoiceStatus" @click="form.invoiceStatus = ''" type="button"
                      class="text-[10px] text-gray-400 hover:text-red-500 transition font-medium">✕ clear</button>
                  </div>
                  <div class="grid grid-cols-2 gap-1.5">
                    <label v-for="opt in invoiceStatusOpts" :key="opt.value"
                      class="flex items-center justify-center py-1.5 rounded-lg border-2 cursor-pointer transition text-[11px] font-semibold text-center leading-tight"
                      :class="form.invoiceStatus === opt.value ? [opt.border, opt.bg, opt.text] : 'border-gray-200 text-gray-500 hover:border-gray-300 bg-white'">
                      <input type="radio" :value="opt.value" v-model="form.invoiceStatus" class="hidden" />
                      {{ opt.label }}
                    </label>
                  </div>
                </div>

                <!-- Wrong Invoice Amount (shown only for SIT Wrong Amount status) -->
                <div v-if="form.invoiceStatus === 'SIT Wrong Amount'"
                  class="rounded-xl border border-rose-200 bg-rose-50 p-3 space-y-2">
                  <div class="flex items-center gap-1.5 mb-1">
                    <svg class="w-3.5 h-3.5 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    </svg>
                    <span class="text-[11px] font-bold text-rose-700 uppercase tracking-wider">SIT Wrong Amount — enter what customer invoiced</span>
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-rose-600 uppercase tracking-wider mb-1">Amount Invoiced by Customer (AUD)</label>
                    <input v-model="form.wrongInvoiceAmount" type="number" min="0" step="0.01" placeholder="0.00"
                      class="w-full px-2 py-2 border border-rose-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white transition" />
                  </div>
                  <div v-if="form.wrongInvoiceAmount !== null && form.wrongInvoiceAmount !== ''" class="flex items-center justify-between text-xs pt-1 border-t border-rose-200">
                    <span class="text-rose-600">VO Amount: <strong>{{ Number(form.voAmount).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }}</strong></span>
                    <span class="text-rose-600">Invoiced: <strong>{{ Number(form.wrongInvoiceAmount).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }}</strong></span>
                    <span class="font-bold" :class="(Number(form.voAmount) - Number(form.wrongInvoiceAmount)) >= 0 ? 'text-rose-700' : 'text-orange-600'">
                      Delta: {{ (Number(form.voAmount) - Number(form.wrongInvoiceAmount)).toLocaleString('en-AU', { style: 'currency', currency: 'AUD' }) }}
                    </span>
                  </div>
                </div>

                <!-- Invoice Date + Amount Flag -->
                <div class="grid grid-cols-2 gap-2">
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Invoice Date</label>
                    <input v-model="form.invoiceDate" type="date"
                      class="w-full px-2 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition" />
                  </div>
                  <div>
                    <label class="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Amt Changed
                      <span v-if="form.amountChangeFlag" class="ml-1 text-red-500">⚑</span>
                    </label>
                    <div class="flex gap-1.5">
                      <label v-for="opt in [{val: true, label: 'Yes', cls: 'border-red-400 bg-red-50 text-red-700'}, {val: false, label: 'No', cls: 'border-gray-400 bg-gray-100 text-gray-700'}]"
                        :key="opt.label"
                        class="flex-1 flex items-center justify-center py-2 rounded-lg border-2 cursor-pointer transition text-xs font-semibold"
                        :class="form.amountChangeFlag === opt.val ? opt.cls : 'border-gray-200 text-gray-400 hover:border-gray-300 bg-white'">
                        <input type="radio" :value="opt.val" v-model="form.amountChangeFlag" class="hidden" />
                        {{ opt.label }}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Activity History -->
            <div v-if="voActivityLog.length > 0" class="border border-blue-100 rounded-xl overflow-hidden">
              <div class="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-blue-100">
                <svg class="w-3.5 h-3.5 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Activity History</span>
                <span class="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500">{{ voActivityLog.length }}</span>
              </div>
              <div class="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                <div v-for="entry in voActivityLog" :key="entry.id"
                  class="px-4 py-3"
                  :class="entry.action === 'created' ? 'bg-blue-50' : entry.voStatus === 'cancelled' ? 'bg-slate-50' : 'bg-white'">
                  <!-- Entry header -->
                  <div class="flex items-center justify-between gap-2 mb-2">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="w-1.5 h-1.5 rounded-full shrink-0"
                        :class="entry.action === 'created' ? 'bg-blue-400' : entry.voStatus === 'cancelled' ? 'bg-slate-400' : 'bg-amber-400'"/>
                      <span class="text-[11px] font-bold capitalize"
                        :class="entry.action === 'created' ? 'text-blue-700' : entry.voStatus === 'cancelled' ? 'text-slate-600' : 'text-gray-700'">
                        {{ entry.action }}
                      </span>
                      <span v-if="entry.voStatus" class="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                        :class="statusBadge(entry.voStatus)">
                        {{ formatStatus(entry.voStatus) }}
                      </span>
                    </div>
                    <span class="text-[10px] text-gray-400 whitespace-nowrap shrink-0">{{ formatLogDateTime(entry.timestamp) }}</span>
                  </div>
                  <!-- Field changes -->
                  <div v-if="entry.changes && entry.changes.length > 0" class="space-y-1.5">
                    <div v-for="(c, i) in entry.changes" :key="i" class="text-[11px]"
                      :class="c.field === '_cancellation' ? 'text-slate-600 font-medium' : ''">
                      <span class="font-semibold text-gray-500">{{ c.label }}</span>
                      <template v-if="c.field !== '_cancellation'">
                        <div class="flex items-start gap-1 mt-0.5 flex-wrap">
                          <span class="line-through text-gray-400 break-all">{{ c.from }}</span>
                          <span class="text-gray-400 shrink-0">→</span>
                          <span class="text-gray-800 font-medium break-all">{{ c.to }}</span>
                        </div>
                      </template>
                      <template v-else>
                        <span class="ml-1 text-slate-600">{{ c.to }}</span>
                      </template>
                    </div>
                  </div>
                  <p v-else-if="entry.action === 'created'" class="text-[11px] text-blue-500">VO record created</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── Footer ── -->
        <div class="sticky bottom-0 bg-white border-t border-blue-100 shrink-0">
          <!-- Duplicate error banner -->
          <div v-if="duplicateError" class="px-6 pt-3">
            <div class="flex items-start gap-2.5 px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl">
              <svg class="w-4 h-4 shrink-0 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="flex-1 flex flex-wrap gap-x-4 gap-y-0.5">
                <p class="text-xs font-bold text-red-700 w-full">Duplicate detected — cannot save</p>
                <span v-if="duplicateErrors.voDescription" class="text-xs text-red-600">📄 Description conflict</span>
                <span v-if="duplicateErrors.ticketNumber"  class="text-xs text-red-600">🎫 Ticket # conflict</span>
                <span v-if="duplicateErrors.poNumber"      class="text-xs text-red-600">📦 PO # conflict</span>
              </div>
              <button @click="duplicateErrors.voDescription = duplicateErrors.ticketNumber = duplicateErrors.poNumber = ''"
                class="shrink-0 text-red-400 hover:text-red-600 transition">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="flex items-center justify-end gap-3 px-6 py-3">
            <button type="button" @click="emit('cancel')"
              class="px-5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition">
              Cancel
            </button>
            <button type="submit"
              class="px-6 py-2 rounded-xl text-sm font-semibold text-white transition shadow-sm disabled:opacity-50"
              :class="vo ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'"
              :disabled="!!duplicateError">
              {{ vo ? 'Save Changes' : 'Create Variation' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted, nextTick } from 'vue'
import { useVOStore } from '../stores/voStore'
import { getLogs } from '../utils/logger'
import { formatStatus } from '../utils/formatters'

const props = defineProps({
  vo:      { type: Object, default: null },
  prefill: { type: Object, default: null }
})
const store = useVOStore()
const emit = defineEmits(['save', 'cancel'])

const invoiceLog  = computed(() => [...(props.vo?.invoiceLog  || [])].reverse())
const poLog       = computed(() => [...(props.vo?.poLog       || [])].reverse())
const amountLog   = computed(() => [...(props.vo?.amountLog   || [])].reverse())

const voActivityLog = computed(() => {
  if (!props.vo?.id) return []
  return getLogs().filter(e => e.voId === props.vo.id)
})

const statusBadge = (status) => {
  const map = {
    draft: 'bg-gray-100 text-gray-600',
    submitted: 'bg-blue-100 text-blue-700',
    'pending-approval': 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    cancelled: 'bg-slate-200 text-slate-600',
  }
  return map[status] || 'bg-gray-100 text-gray-500'
}

const formatLogDate = (d) => {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-AU')
}
const formatLogDateTime = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleString('en-AU', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const BASE_PO_FORM_CATEGORIES = new Set(['Site Survey', 'WOP', 'C&I', 'SAT&SIT', 'Snag Closure'])
const isBasePOForm = computed(() => BASE_PO_FORM_CATEGORIES.has(form.value.voCategory?.trim()))
const isBOQForm    = computed(() => form.value.boqRelated === true && !isBasePOForm.value)

// Prevents the auto-status watcher from firing during initial form population
const isInitializing = ref(false)

const statusOptions = [
  { value: 'draft',            label: 'Draft',            dot: 'bg-gray-500',   border: 'border-gray-400',   bg: 'bg-gray-50',   text: 'text-gray-700'   },
  { value: 'submitted',        label: 'Submitted',        dot: 'bg-blue-500',   border: 'border-blue-400',   bg: 'bg-blue-50',   text: 'text-blue-700'   },
  { value: 'pending-approval', label: 'Pending Approval', dot: 'bg-yellow-500', border: 'border-yellow-400', bg: 'bg-yellow-50', text: 'text-yellow-700' },
  { value: 'approved',         label: 'Approved',         dot: 'bg-green-500',  border: 'border-green-400',  bg: 'bg-green-50',  text: 'text-green-700'  },
  { value: 'rejected',         label: 'Rejected',         dot: 'bg-red-500',    border: 'border-red-400',    bg: 'bg-red-50',    text: 'text-red-700'    },
  { value: 'cancelled',        label: 'Cancelled',        dot: 'bg-slate-400',  border: 'border-slate-400',  bg: 'bg-slate-50',  text: 'text-slate-600'  },
]

const invoiceStatusOpts = [
  { value: 'Not Yet Sent',        label: 'Not Yet Sent',        border: 'border-gray-400',   bg: 'bg-gray-100',   text: 'text-gray-600'   },
  { value: 'To Be Sent to Nokia', label: 'To Be Sent to Nokia', border: 'border-indigo-400', bg: 'bg-indigo-50',  text: 'text-indigo-700' },
  { value: 'Request to Nokia',    label: 'Request to Nokia',    border: 'border-blue-400',   bg: 'bg-blue-50',    text: 'text-blue-700'   },
  { value: 'SIT Approved',        label: 'SIT Approved',        border: 'border-yellow-400', bg: 'bg-yellow-50',  text: 'text-yellow-700' },
  { value: 'SIT Completed',       label: 'SIT Completed',       border: 'border-green-400',  bg: 'bg-green-50',   text: 'text-green-700'  },
  { value: 'SIT Wrong Amount',    label: 'SIT Wrong Amount',    border: 'border-rose-400',   bg: 'bg-rose-50',    text: 'text-rose-700'   },
]

const fmtAmount = v => v ? Number(v).toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''
const amountDisplay = ref('')

const form = ref({
  siteId: '', siteName: '', jobNumber: '',
  voDescription: '', voAmount: 0, voCategory: '', scope: '',
  boqRelated: false,
  emailSentToNokia: null, emailApprovedFromNokia: null,
  ticketSubmissionDate: null, ticketNumber: '', ticketApprovalDate: null,
  voStatus: 'draft',
  comment: '',
  poNumber: '',
  poReceivedDate: null,
  invoiceStatus: '',
  invoiceDate: null,
  wrongInvoiceAmount: null,
  amountChangeFlag: false,
  labourCost: 0,
  thirdPartyCost: 0
})

// Track original amount to auto-set flag on edit
const originalAmount = ref(null)

// ── Global data ──
const globalData = ref({ sites: [], voCategories: [], scopes: [] })

const loadGlobalData = () => {
  try {
    const saved = localStorage.getItem('globalData')
    if (saved) {
      const data = JSON.parse(saved)
      const rawSites = data.sites || []
      const mapped = rawSites.map(s =>
        typeof s === 'string' ? { siteId: '', siteName: s, jobNumber: '', comment: '' } : s
      )
      // Deduplicate by composite key siteId+siteName+jobNumber
      const seen = new Set()
      globalData.value.sites = mapped.filter(s => {
        const key = `${s.siteId}|${s.siteName}|${s.jobNumber}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      globalData.value.voCategories = data.voCategories || []
      globalData.value.scopes = data.scopes || []
    }
  } catch (err) { console.error('Error loading global data:', err) }
}

// ── Site autocomplete ──
const siteSearch = ref('')
const showSiteDropdown = ref(false)

const filteredSites = computed(() => {
  const q = siteSearch.value.trim().toLowerCase()
  if (!q) return globalData.value.sites
  return globalData.value.sites.filter(s =>
    s.siteId?.toLowerCase().includes(q) ||
    s.siteName?.toLowerCase().includes(q) ||
    s.jobNumber?.toLowerCase().includes(q) ||
    s.comment?.toLowerCase().includes(q)
  )
})

const selectSite = (site) => {
  form.value.siteId   = site.siteId
  form.value.siteName = site.siteName
  form.value.jobNumber = site.jobNumber || ''
  siteSearch.value = `${site.siteId} — ${site.siteName}`
  showSiteDropdown.value = false
}
const hideSiteDropdown = () => setTimeout(() => { showSiteDropdown.value = false }, 150)

const clearSiteSearch = () => {
  siteSearch.value = ''
  form.value.siteId   = ''
  form.value.siteName = ''
  form.value.jobNumber = ''
  showSiteDropdown.value = false
}

// ── Category autocomplete ──
const showCategoryDropdown = ref(false)
const filteredCategories = computed(() => {
  if (!form.value.voCategory.trim()) return globalData.value.voCategories
  const q = form.value.voCategory.toLowerCase()
  return globalData.value.voCategories.filter(c => c.name.toLowerCase().includes(q))
})
const selectCategory = (name) => { form.value.voCategory = name; showCategoryDropdown.value = false }

// ── Scope autocomplete ──
const showScopeDropdown = ref(false)
const filteredScopes = computed(() => {
  if (!form.value.scope.trim()) return globalData.value.scopes
  const q = form.value.scope.toLowerCase()
  return globalData.value.scopes.filter(s => s.name.toLowerCase().includes(q))
})
const selectScope = (name) => { form.value.scope = name; showScopeDropdown.value = false }

onMounted(loadGlobalData)

// ── Duplicate field guards ──
const duplicateErrors = ref({ voDescription: '', ticketNumber: '', poNumber: '' })
// Convenience computed so template/submit can check any active error
const duplicateError = computed(() => Object.values(duplicateErrors.value).find(e => e) || '')

function checkDuplicate(field, val) {
  const norm = val?.trim().toLowerCase()
  if (!norm) { duplicateErrors.value[field] = ''; return }
  // Description duplicate: allowed if the current form already has a PO number
  if (field === 'voDescription' && form.value.poNumber?.trim()) {
    duplicateErrors.value[field] = ''
    return
  }
  const allVOs = store.vos.value ?? []
  const dup = allVOs.find(existing => {
    if (props.vo && existing.id === props.vo.id) return false
    return existing[field]?.trim().toLowerCase() === norm
  })
  if (dup) {
    const label = field === 'voDescription' ? 'description' : field === 'ticketNumber' ? 'ticket number' : 'PO number'
    duplicateErrors.value[field] = `This ${label} already exists on "${dup.siteName || dup.siteId || 'another VO'}" (${dup.voStatus}).`
  } else {
    duplicateErrors.value[field] = ''
  }
}

// Live duplicate checks as user types / pastes
watch(() => form.value.voDescription, val => checkDuplicate('voDescription', val))
watch(() => form.value.ticketNumber, (val, oldVal) => {
  if (val?.trim()) checkDuplicate('ticketNumber', val)
  else duplicateErrors.value.ticketNumber = ''
  // Auto-fill email approval date when ticket number is first entered and email was sent but not yet approved
  if (!isInitializing.value && val?.trim() && !oldVal?.trim() && form.value.emailSentToNokia && !form.value.emailApprovedFromNokia) {
    form.value.emailApprovedFromNokia = new Date().toISOString().split('T')[0]
  }
})
watch(() => form.value.poNumber,      val => {
  if (val?.trim()) checkDuplicate('poNumber', val)
  else duplicateErrors.value.poNumber = ''
  // Re-evaluate description duplicate — having a PO lifts the block
  checkDuplicate('voDescription', form.value.voDescription)
})

// Auto-update status based on ticket fields and PO number
// Guard: skip during initial form population to avoid overwriting the saved status
watch([() => form.value.ticketNumber, () => form.value.ticketSubmissionDate, () => form.value.ticketApprovalDate, () => form.value.poNumber, () => form.value.boqRelated], ([num, subDate, aprDate, po]) => {
  if (isInitializing.value) return
  if (form.value.voStatus === 'rejected' || form.value.voStatus === 'cancelled') return
  if (isBOQForm.value) {
    // BOQ VOs: PO present → approved; no PO → pending-approval
    form.value.voStatus = po?.trim() ? 'approved' : 'pending-approval'
  } else {
    const hasTicket = num?.trim() && subDate
    if (po?.trim() || aprDate) {
      // PO or approval date present → approved
      if (form.value.voStatus !== 'approved') form.value.voStatus = 'approved'
    } else if (hasTicket) {
      // Ticket + submission date present but no PO/approval → submitted
      if (form.value.voStatus === 'draft' || form.value.voStatus === 'pending-approval') form.value.voStatus = 'submitted'
    } else {
      // Ticket cleared (no ticket number or no submission date), no PO, no approval date
      // Revert submitted/approved → pending-approval and clear email approval date
      if (form.value.voStatus === 'submitted' || form.value.voStatus === 'approved') {
        form.value.voStatus = 'pending-approval'
        form.value.emailApprovedFromNokia = null
      }
    }
  }
})

// When status changes TO cancelled: zero amount and wipe timeline/ticket fields
watch(() => form.value.voStatus, (newStatus, oldStatus) => {
  if (isInitializing.value) return
  if (newStatus !== 'cancelled' || oldStatus === 'cancelled') return
  form.value.voAmount = 0
  amountDisplay.value = '0.00'
  form.value.ticketNumber = ''
  form.value.ticketSubmissionDate = null
  form.value.ticketApprovalDate = null
  form.value.emailSentToNokia = null
  form.value.emailApprovedFromNokia = null
  form.value.amountChangeFlag = false
})

watch(() => props.vo, (newVO) => {
  isInitializing.value = true
  if (newVO) {
    siteSearch.value = newVO.siteId && newVO.siteName ? `${newVO.siteId} — ${newVO.siteName}` : ''
    originalAmount.value = newVO.voAmount || 0
    form.value = {
      siteId: newVO.siteId || '', siteName: newVO.siteName || '', jobNumber: newVO.jobNumber || '',
      voDescription: newVO.voDescription || '', voAmount: newVO.voAmount || 0,
      voCategory: newVO.voCategory || '', scope: newVO.scope || '',
      boqRelated: newVO.boqRelated || false,
      emailSentToNokia:       newVO.emailSentToNokia       ? new Date(newVO.emailSentToNokia).toISOString().split('T')[0]       : null,
      emailApprovedFromNokia: newVO.emailApprovedFromNokia ? new Date(newVO.emailApprovedFromNokia).toISOString().split('T')[0] : null,
      ticketSubmissionDate:   newVO.ticketSubmissionDate   ? new Date(newVO.ticketSubmissionDate).toISOString().split('T')[0]   : null,
      ticketNumber: newVO.ticketNumber || '',
      ticketApprovalDate:     newVO.ticketApprovalDate     ? new Date(newVO.ticketApprovalDate).toISOString().split('T')[0]     : null,
      voStatus: newVO.voStatus || 'draft',
      comment: newVO.comment || '',
      poNumber: newVO.poNumber || '',
      poReceivedDate: newVO.poReceivedDate ? new Date(newVO.poReceivedDate).toISOString().split('T')[0] : null,
      invoiceStatus: newVO.invoiceStatus || '',
      invoiceDate: newVO.invoiceDate ? new Date(newVO.invoiceDate).toISOString().split('T')[0] : null,
      wrongInvoiceAmount: newVO.wrongInvoiceAmount ?? null,
      amountChangeFlag: newVO.amountChangeFlag || false,
      labourCost: newVO.labourCost || 0,
      thirdPartyCost: newVO.thirdPartyCost || 0
    }
    amountDisplay.value = fmtAmount(newVO.voAmount)
  } else if (props.prefill) {
    const p = props.prefill
    siteSearch.value = p.siteId && p.siteName ? `${p.siteId} — ${p.siteName}` : ''
    originalAmount.value = null
    duplicateErrors.value = { voDescription: '', ticketNumber: '', poNumber: '' }
    form.value = {
      siteId: p.siteId || '', siteName: p.siteName || '', jobNumber: p.jobNumber || '',
      voDescription: p.voDescription || '', voAmount: p.voAmount || 0,
      voCategory: p.voCategory || '', scope: p.scope || '',
      boqRelated: p.boqRelated || false,
      emailSentToNokia: null, emailApprovedFromNokia: null,
      ticketSubmissionDate: null, ticketNumber: '', ticketApprovalDate: null,
      voStatus: 'draft',
      comment: p.comment || '',
      poNumber: '',
      poReceivedDate: null,
      invoiceStatus: '',
      invoiceDate: null,
      wrongInvoiceAmount: null,
      amountChangeFlag: false,
      labourCost: p.labourCost || 0,
      thirdPartyCost: p.thirdPartyCost || 0
    }
    amountDisplay.value = fmtAmount(p.voAmount)
  } else {
    siteSearch.value = ''
    originalAmount.value = null
    duplicateErrors.value = { voDescription: '', ticketNumber: '', poNumber: '' }
    form.value = {
      siteId: '', siteName: '', jobNumber: '',
      voDescription: '', voAmount: 0, voCategory: '', scope: '',
      boqRelated: false,
      emailSentToNokia: null, emailApprovedFromNokia: null,
      ticketSubmissionDate: null, ticketNumber: '', ticketApprovalDate: null,
      voStatus: 'draft',
      comment: '',
      poNumber: '',
      poReceivedDate: null,
      invoiceStatus: '',
      invoiceDate: null,
      wrongInvoiceAmount: null,
      amountChangeFlag: false,
      labourCost: 0,
      thirdPartyCost: 0
    }
    amountDisplay.value = ''
  }
  nextTick(() => { isInitializing.value = false })
}, { immediate: true })

// Auto-flag amount change when editing and amount differs from original
watch(() => form.value.voAmount, (newAmt) => {
  if (props.vo && originalAmount.value !== null && Number(newAmt) !== Number(originalAmount.value)) {
    form.value.amountChangeFlag = true
  }
})

const submitForm = () => {
  if (duplicateError.value) return

  let invoiceLog = JSON.parse(JSON.stringify(props.vo?.invoiceLog || []))
  let poLog      = JSON.parse(JSON.stringify(props.vo?.poLog      || []))

  // Append a log entry when invoice status changes on an existing VO
  const prevStatus = props.vo?.invoiceStatus || ''
  const newStatus  = form.value.invoiceStatus || ''
  if (props.vo && newStatus !== prevStatus) {
    invoiceLog.push({
      status:   newStatus || 'Cleared',
      date:     form.value.invoiceDate || null,
      loggedAt: new Date().toISOString(),
      source:   'manual'
    })
  }

  // Append a PO log entry when poNumber changes (or is set on a new VO)
  const prevPO = (props.vo?.poNumber || '').trim()
  const newPO  = (form.value.poNumber || '').trim()
  if (!props.vo && newPO) {
    // New VO with a PO — log the initial assignment
    poLog.push({ from: null, to: newPO, loggedAt: new Date().toISOString() })
  } else if (props.vo && newPO !== prevPO) {
    poLog.push({
      from:     prevPO || null,
      to:       newPO  || null,
      loggedAt: new Date().toISOString(),
    })
  }

  const voData = {
    ...form.value,
    emailSentToNokia:       form.value.emailSentToNokia       ? new Date(form.value.emailSentToNokia)       : null,
    emailApprovedFromNokia: form.value.emailApprovedFromNokia ? new Date(form.value.emailApprovedFromNokia) : null,
    ticketSubmissionDate:   form.value.ticketSubmissionDate   ? new Date(form.value.ticketSubmissionDate)   : null,
    ticketApprovalDate:     form.value.ticketApprovalDate     ? new Date(form.value.ticketApprovalDate)     : null,
    poReceivedDate:         form.value.poReceivedDate         ? new Date(form.value.poReceivedDate)         : null,
    invoiceDate:            form.value.invoiceDate            ? new Date(form.value.invoiceDate)            : null,
    voAmount: Number(form.value.voAmount),
    wrongInvoiceAmount: form.value.invoiceStatus === 'SIT Wrong Amount' && form.value.wrongInvoiceAmount !== null && form.value.wrongInvoiceAmount !== ''
      ? Number(form.value.wrongInvoiceAmount) : null,
    invoiceLog,
    poLog,
  }
  emit('save', voData)
}
</script>
