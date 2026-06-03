<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between border-b border-gray-100 pb-2">
      <div class="flex items-center gap-3">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
          <svg class="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h10M8 10h10M8 14h6M6 6h.01M6 10h.01M6 14h.01M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-xl font-bold text-gray-900">Issue Log</h2>
          <p class="mt-0.5 text-xs text-gray-400">Track open and cleared site issues</p>
        </div>
      </div>
      <button
        @click="openCreate"
        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Issue
      </button>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div class="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Issues</p>
        <p class="mt-1 text-2xl font-bold text-gray-900">{{ summary.total }}</p>
      </div>
      <div class="rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-orange-600">Open</p>
        <p class="mt-1 text-2xl font-bold text-orange-700">{{ summary.open }}</p>
      </div>
      <div class="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-emerald-600">Clear</p>
        <p class="mt-1 text-2xl font-bold text-emerald-700">{{ summary.clear }}</p>
      </div>
      <div class="rounded-xl border border-gray-200 bg-white px-4 py-3">
        <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total Amount</p>
        <p class="mt-1 text-2xl font-bold text-gray-900">{{ formatCurrency(summary.amount) }}</p>
      </div>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div class="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
        <input
          v-model="searchText"
          type="text"
          placeholder="Search by site, job description, scope, comment, or attachment..."
          class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span class="whitespace-nowrap text-xs font-medium text-gray-500">
          {{ filteredIssues.length }} result{{ filteredIssues.length === 1 ? '' : 's' }}
        </span>
      </div>

      <div v-if="filteredIssues.length === 0" class="px-6 py-12 text-center">
        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
          <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 6h10M8 10h10M8 14h6M6 6h.01M6 10h.01M6 14h.01M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
          </svg>
        </div>
        <p class="text-sm text-gray-500">No issue log records found.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="min-w-full text-sm">
          <thead>
            <tr class="bg-blue-700 text-white">
              <th class="px-4 py-3 text-left font-semibold">Site ID</th>
              <th class="px-4 py-3 text-left font-semibold">Site Name</th>
              <th class="px-4 py-3 text-left font-semibold">Job Description</th>
              <th class="px-4 py-3 text-left font-semibold">Register Log</th>
              <th class="px-4 py-3 text-left font-semibold">Scope</th>
              <th class="px-4 py-3 text-right font-semibold">Amount</th>
              <th class="px-4 py-3 text-left font-semibold">Status</th>
              <th class="px-4 py-3 text-left font-semibold">Comment</th>
              <th class="px-4 py-3 text-center font-semibold">Files</th>
              <th class="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="issue in filteredIssues" :key="issue.id" class="hover:bg-gray-50">
              <td class="whitespace-nowrap px-4 py-3 font-semibold text-gray-900">{{ issue.siteId }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-gray-800">{{ issue.siteName }}</td>
              <td class="px-4 py-3 text-gray-700">{{ issue.jobDescription }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-gray-700">{{ formatDate(issue.registerLog) }}</td>
              <td class="px-4 py-3 text-gray-700">{{ issue.scope }}</td>
              <td class="whitespace-nowrap px-4 py-3 text-right font-semibold text-gray-900">{{ formatCurrency(issue.amount) }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-1 text-xs font-semibold"
                  :class="issue.status === 'clear' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'"
                >
                  {{ issue.status === 'clear' ? 'Clear' : 'Open' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-700">
                <div class="max-w-xs truncate" :title="issue.comment || ''">
                  {{ issue.comment || '-' }}
                </div>
              </td>
              <td class="px-4 py-3 text-center">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  @click="openEdit(issue)"
                >
                  <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828A4 4 0 0012.343 4.17L5.757 10.757a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {{ issue.attachments?.length || 0 }}
                </button>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-center">
                <button @click="openEdit(issue)" class="rounded-md px-3 py-1 font-medium text-blue-600 hover:bg-blue-50">Edit</button>
                <button @click="deleteIssue(issue.id)" class="rounded-md px-3 py-1 font-medium text-red-600 hover:bg-red-50">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4"
      @click.self="closeModal"
    >
      <div
        class="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition-[max-width,max-height] duration-200"
        :class="isPreviewExpanded ? 'max-h-[96vh] max-w-[96vw]' : 'max-h-[94vh] max-w-[112rem]'"
      >
        <div class="flex items-center justify-between bg-blue-700 px-6 py-4">
          <div>
            <h3 class="text-base font-bold text-white">{{ editingId ? 'Edit Issue Log' : 'New Issue Log' }}</h3>
            <p class="mt-1 text-xs text-blue-100">Large layout with inline preview for Outlook `.msg`, PDF, Excel, CSV, images, and text attachments.</p>
          </div>
          <button @click="closeModal" class="h-8 w-8 rounded-lg text-blue-100 hover:bg-blue-600 hover:text-white">
            <svg class="mx-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveIssue" class="flex min-h-0 flex-1 flex-col">
          <div class="min-h-0 flex-1 overflow-y-auto p-6">
            <div
              class="grid grid-cols-1 gap-6"
              :class="isPreviewExpanded ? 'xl:grid-cols-1' : 'xl:grid-cols-[minmax(0,1fr)_minmax(440px,1.05fr)]'"
            >
              <div v-if="!isPreviewExpanded" class="space-y-4">
                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Site (Admin) *</label>
                  <div class="relative">
                    <input
                      v-model="siteSearch"
                      type="text"
                      required
                      placeholder="Search Site ID, Site Name, or Job Number..."
                      @focus="showSiteDropdown = true"
                      @blur="hideSiteDropdown"
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div v-if="showSiteDropdown" class="absolute left-0 right-0 z-20 mt-1 max-h-56 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                      <button
                        v-for="(site, idx) in filteredSites"
                        :key="`${site.siteId}|${site.siteName}|${site.jobNumber}|${idx}`"
                        type="button"
                        @mousedown.prevent="selectSite(site)"
                        class="w-full border-b border-gray-50 px-3 py-2 text-left hover:bg-blue-50 last:border-0"
                      >
                        <div class="flex items-center gap-2">
                          <span class="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-bold text-blue-700">{{ site.siteId || '-' }}</span>
                          <span class="truncate text-sm text-gray-800">{{ site.siteName || '-' }}</span>
                          <span v-if="site.jobNumber" class="shrink-0 font-mono text-xs text-gray-400">{{ site.jobNumber }}</span>
                        </div>
                        <p v-if="site.comment" class="mt-0.5 truncate text-[11px] text-gray-400">{{ site.comment }}</p>
                      </button>
                      <div v-if="filteredSites.length === 0" class="px-4 py-3 text-center text-sm text-gray-400">
                        No matching sites in Admin
                      </div>
                    </div>
                  </div>
                  <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <input :value="form.siteId" disabled class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600" />
                    <input :value="form.siteName" disabled class="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600" />
                  </div>
                  <p class="mt-1 text-[11px] text-gray-400">Site ID and Site Name are locked to Admin selection.</p>
                </div>

                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Issue Description *</label>
                  <textarea
                    v-model.trim="form.jobDescription"
                    required
                    rows="3"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Register Log *</label>
                    <input
                      v-model="form.registerLog"
                      type="date"
                      required
                      class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Scope *</label>
                    <div class="relative">
                      <input
                        v-model="scopeSearch"
                        type="text"
                        required
                        placeholder="Select scope from Admin..."
                        @focus="showScopeDropdown = true"
                        @blur="hideScopeDropdown"
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div v-if="showScopeDropdown" class="absolute left-0 right-0 z-20 mt-1 max-h-52 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                        <button
                          v-for="(scope, idx) in filteredScopes"
                          :key="`${scope.name}|${idx}`"
                          type="button"
                          @mousedown.prevent="selectScope(scope)"
                          class="w-full border-b border-gray-50 px-3 py-2 text-left text-sm text-gray-800 hover:bg-blue-50 last:border-0"
                        >
                          {{ scope.name }}
                          <span v-if="scope.comment" class="text-xs text-gray-400"> - {{ scope.comment }}</span>
                        </button>
                        <div v-if="filteredScopes.length === 0" class="px-4 py-3 text-center text-sm text-gray-400">
                          No matching scopes in Admin
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Status *</label>
                    <select
                      v-model="form.status"
                      required
                      class="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="clear">Clear</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Amount</label>
                  <input
                    v-model.number="form.amount"
                    type="number"
                    step="0.01"
                    min="0"
                    class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label class="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500">Comment</label>
                  <textarea
                    v-model="form.comment"
                    rows="6"
                    placeholder="Add notes, updates, or follow-ups. Press Enter for a new line."
                    class="min-h-[148px] w-full resize-y rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div class="space-y-4">
                <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h4 class="text-sm font-bold text-slate-900">Attachments</h4>
                      <p class="mt-1 text-xs text-slate-500">
                        Add any file to the issue. Inline preview currently supports Outlook `.msg`, PDF, Excel, CSV, images, and text files.
                      </p>
                    </div>
                    <div class="flex flex-wrap items-center gap-2">
                      <input
                        ref="attachmentInput"
                        type="file"
                        multiple
                        accept=".msg,.pdf,.xlsx,.xls,.xlsm,.csv,.png,.jpg,.jpeg,.gif,.webp,.txt,.log,.json,.md"
                        class="hidden"
                        @change="handleAttachmentInput"
                      />
                      <button
                        type="button"
                        @click="openAttachmentPicker"
                        class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828A4 4 0 0012.343 4.17L5.757 10.757a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        Attach Files
                      </button>
                      <button
                        v-if="clipboardReadSupported"
                        type="button"
                        @click="refreshClipboardImagePrompt(false)"
                        class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                        :disabled="clipboardChecking"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5a2 2 0 002 2h2a2 2 0 002-2m-6 9h6" />
                        </svg>
                        {{ clipboardChecking ? 'Checking Clipboard...' : 'Check Clipboard' }}
                      </button>
                      <span class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                        {{ form.attachments.length }} file{{ form.attachments.length === 1 ? '' : 's' }}
                      </span>
                    </div>
                  </div>

                  <div
                    v-if="clipboardImageAttachment || clipboardStatusMessage || clipboardReadSupported"
                    class="mt-4 rounded-2xl border px-4 py-3"
                    :class="clipboardImageAttachment ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'"
                  >
                    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div class="min-w-0">
                        <p v-if="clipboardImageAttachment" class="text-sm font-semibold text-amber-800">
                          Image found in your clipboard. Paste it into this issue?
                        </p>
                        <p v-else-if="clipboardStatusMessage" class="text-sm font-medium text-slate-700">
                          {{ clipboardStatusMessage }}
                        </p>
                        <p v-else class="text-sm font-medium text-slate-700">
                          You can paste a screenshot straight into attachments.
                        </p>
                        <p class="mt-1 text-xs text-slate-500">
                          Press `Ctrl+V` while this modal is open, or use `Check Clipboard` to look for an image ready to paste.
                        </p>
                      </div>
                      <div class="flex shrink-0 flex-wrap items-center gap-2">
                        <button
                          v-if="clipboardImageAttachment"
                          type="button"
                          @click="pasteClipboardImage"
                          class="rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
                        >
                          Paste Image
                        </button>
                        <button
                          v-if="clipboardImageAttachment"
                          type="button"
                          @click="dismissClipboardImagePrompt"
                          class="rounded-xl border border-amber-200 bg-white px-4 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="mt-4 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition"
                    :class="isDragActive ? 'border-blue-400 bg-blue-50' : 'border-slate-300 bg-white'"
                    @dragenter="onAttachmentDragEnter"
                    @dragover="onAttachmentDragOver"
                    @dragleave="onAttachmentDragLeave"
                    @drop="onAttachmentDrop"
                  >
                    <div class="mx-auto max-w-md">
                      <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                        :class="isDragActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'">
                        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <p class="text-sm font-semibold text-slate-800">
                        {{ isDragActive ? 'Drop files here' : 'Drag files or Outlook emails here' }}
                      </p>
                      <p class="mt-1 text-xs text-slate-500">
                        Outlook drag-and-drop usually arrives as a `.msg` file in the browser, and this drop zone will attach it directly to the issue.
                      </p>
                    </div>
                  </div>

                  <div v-if="form.attachments.length === 0" class="mt-4 rounded-xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
                    No files attached yet.
                  </div>

                  <div v-else class="mt-4 space-y-2">
                    <div
                      v-for="attachment in form.attachments"
                      :key="attachment.id"
                      class="flex flex-wrap items-center gap-3 rounded-xl border px-3 py-3 transition"
                      :class="attachment.id === selectedAttachmentId ? 'border-blue-300 bg-blue-50' : 'border-slate-200 bg-white'"
                    >
                      <div v-if="renameAttachmentId === attachment.id" class="min-w-0 flex-1">
                        <div class="flex items-center gap-2">
                          <span class="rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wider"
                            :class="attachmentBadgeClass(attachment)">
                            {{ attachmentKindLabel(attachment) }}
                          </span>
                          <input
                            v-model.trim="renameAttachmentName"
                            type="text"
                            class="min-w-0 flex-1 rounded-lg border border-blue-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter file name"
                            @keydown.enter.prevent="applyAttachmentRename(attachment.id)"
                            @keydown.esc.prevent="cancelAttachmentRename"
                          />
                        </div>
                        <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>{{ formatFileSize(attachment.size) }}</span>
                          <span v-if="attachment.type">{{ attachment.type }}</span>
                          <span>Press Enter to save or Esc to cancel</span>
                        </div>
                      </div>
                      <button
                        v-else
                        type="button"
                        class="min-w-0 flex-1 text-left"
                        @click="setSelectedAttachment(attachment.id)"
                      >
                        <div class="flex items-center gap-2">
                          <span class="rounded-full px-2 py-1 text-[11px] font-bold uppercase tracking-wider"
                            :class="attachmentBadgeClass(attachment)">
                            {{ attachmentKindLabel(attachment) }}
                          </span>
                          <span class="truncate text-sm font-semibold text-slate-900">{{ attachment.name }}</span>
                        </div>
                        <div class="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                          <span>{{ formatFileSize(attachment.size) }}</span>
                          <span v-if="attachment.type">{{ attachment.type }}</span>
                          <span v-if="isPreviewableAttachment(attachment)">Inline preview ready</span>
                          <span v-else>Stored only</span>
                        </div>
                      </button>
                      <div class="flex items-center gap-2">
                        <template v-if="renameAttachmentId === attachment.id">
                          <button
                            type="button"
                            class="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                            @click="applyAttachmentRename(attachment.id)"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            @click="cancelAttachmentRename"
                          >
                            Cancel
                          </button>
                        </template>
                        <template v-else>
                          <button
                            type="button"
                            class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            @click="downloadAttachment(attachment)"
                          >
                            Download
                          </button>
                          <button
                            type="button"
                            class="rounded-lg border border-blue-200 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                            @click="startAttachmentRename(attachment)"
                          >
                            Rename
                          </button>
                          <button
                            type="button"
                            class="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                            @click="removeAttachment(attachment.id)"
                          >
                            Remove
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <div class="border-b border-slate-200 bg-slate-50 px-4 py-3">
                    <div class="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h4 class="text-sm font-bold text-slate-900">Attachment Preview</h4>
                        <p class="mt-1 text-xs text-slate-500">
                          <template v-if="selectedAttachment">
                            {{ selectedAttachment.name }}
                            <span v-if="previewSheetName">- showing sheet: {{ previewSheetName }}</span>
                          </template>
                          <template v-else>Select a file to preview it here.</template>
                        </p>
                      </div>
                      <div class="flex items-center gap-2">
                        <div
                          v-if="selectedAttachmentType === 'image'"
                          class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1"
                        >
                          <button
                            type="button"
                            class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="imageZoom <= IMAGE_ZOOM_MIN"
                            @click="changeImageZoom(-IMAGE_ZOOM_STEP)"
                          >
                            -
                          </button>
                          <span class="min-w-[3.5rem] text-center text-xs font-semibold text-slate-600">{{ imageZoomLabel }}</span>
                          <button
                            type="button"
                            class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                            :disabled="imageZoom >= IMAGE_ZOOM_MAX"
                            @click="changeImageZoom(IMAGE_ZOOM_STEP)"
                          >
                            +
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                            @click="resetImageZoom"
                          >
                            Reset
                          </button>
                        </div>
                        <button
                          type="button"
                          class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          @click="isPreviewExpanded = !isPreviewExpanded"
                        >
                          {{ isPreviewExpanded ? 'Collapse View' : 'Expand View' }}
                        </button>
                        <span v-if="selectedAttachment" class="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                          {{ attachmentKindLabel(selectedAttachment) }}
                        </span>
                        <button
                          v-if="selectedAttachment"
                          type="button"
                          class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                          @click="downloadAttachment(selectedAttachment)"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    class="bg-slate-100 transition-[height,min-height] duration-200"
                    :class="isPreviewExpanded ? 'h-[72vh] min-h-[560px]' : 'h-[58vh] min-h-[420px]'"
                  >
                    <div v-if="!selectedAttachment" class="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                      Attach a file, then select it from the list to preview it in this larger reading area.
                    </div>

                    <div v-else-if="previewLoading" class="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                      Loading attachment preview...
                    </div>

                    <div v-else-if="previewError" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                      <div>
                        <p class="text-sm font-semibold text-slate-800">Preview unavailable</p>
                        <p class="mt-1 max-w-lg text-sm text-slate-500">{{ previewError }}</p>
                      </div>
                      <button
                        type="button"
                        class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        @click="downloadAttachment(selectedAttachment)"
                      >
                        Download File
                      </button>
                    </div>

                    <div v-else-if="selectedAttachmentType === 'msg' && previewMsgData" class="h-full overflow-auto bg-white p-4">
                      <div class="space-y-4">
                        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div class="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Subject</p>
                              <h5 class="mt-1 text-lg font-bold text-slate-900">{{ previewMsgData.subject || selectedAttachment.name }}</h5>
                            </div>
                            <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">MSG Email Preview</span>
                          </div>

                          <div class="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-2">
                            <div class="rounded-xl bg-white p-3">
                              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">From</p>
                              <p class="mt-1 text-sm text-slate-800">{{ previewMsgData.from || previewMsgData.fromName || '-' }}</p>
                            </div>
                            <div class="rounded-xl bg-white p-3">
                              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Sent</p>
                              <p class="mt-1 text-sm text-slate-800">{{ previewMsgData.sentAt ? formatDate(previewMsgData.sentAt) : '-' }}</p>
                            </div>
                            <div class="rounded-xl bg-white p-3 lg:col-span-2">
                              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">To</p>
                              <p class="mt-1 text-sm text-slate-800 break-words">{{ previewMsgData.to || '-' }}</p>
                            </div>
                            <div v-if="previewMsgData.cc" class="rounded-xl bg-white p-3 lg:col-span-2">
                              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">CC</p>
                              <p class="mt-1 text-sm text-slate-800 break-words">{{ previewMsgData.cc }}</p>
                            </div>
                            <div v-if="previewMsgData.bcc" class="rounded-xl bg-white p-3 lg:col-span-2">
                              <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">BCC</p>
                              <p class="mt-1 text-sm text-slate-800 break-words">{{ previewMsgData.bcc }}</p>
                            </div>
                          </div>
                        </div>

                        <div v-if="previewMsgData.nestedAttachments.length" class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Email Attachments</p>
                          <div class="mt-3 space-y-2">
                            <div v-for="(nestedAttachment, index) in previewMsgData.nestedAttachments" :key="`${nestedAttachment.name}-${index}`" class="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-sm">
                              <span class="truncate pr-3 text-slate-800">{{ nestedAttachment.name }}</span>
                              <span class="shrink-0 text-xs text-slate-500">{{ formatFileSize(nestedAttachment.size) }}</span>
                            </div>
                          </div>
                        </div>

                        <div class="rounded-2xl border border-slate-200 bg-white">
                          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
                            <p class="text-xs font-semibold uppercase tracking-wider text-slate-500">Body</p>
                            <div v-if="previewMsgData.hasHtml" class="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1">
                              <button
                                type="button"
                                class="rounded-md px-3 py-1.5 text-xs font-semibold transition"
                                :class="previewMsgMode === 'html' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                                @click="previewMsgMode = 'html'"
                              >
                                HTML View
                              </button>
                              <button
                                type="button"
                                class="rounded-md px-3 py-1.5 text-xs font-semibold transition"
                                :class="previewMsgMode === 'text' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'"
                                @click="previewMsgMode = 'text'"
                              >
                                Text View
                              </button>
                            </div>
                          </div>
                          <div v-if="previewMsgData.hasHtml" class="border-b border-slate-200 px-4 py-2 text-xs text-slate-500">
                            Rendering source: {{ previewMsgData.htmlSource === 'rtf' ? 'Outlook RTF converted to HTML' : 'Original email HTML' }}
                          </div>
                          <iframe
                            v-if="previewMsgData.hasHtml && previewMsgMode === 'html'"
                            :srcdoc="previewMsgData.html"
                            sandbox=""
                            class="h-[22rem] w-full bg-white"
                            :title="`HTML preview of ${selectedAttachment.name}`"
                          ></iframe>
                          <pre
                            v-else
                            class="max-h-[22rem] overflow-auto whitespace-pre-wrap px-4 py-4 text-sm leading-6 text-slate-700"
                          >{{ previewMsgData.body }}</pre>
                        </div>

                        <details v-if="previewMsgData.headers" class="rounded-2xl border border-slate-200 bg-slate-50">
                          <summary class="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-800">Raw Headers</summary>
                          <pre class="max-h-[18rem] overflow-auto border-t border-slate-200 bg-white px-4 py-4 text-xs leading-5 text-slate-600">{{ previewMsgData.headers }}</pre>
                        </details>
                      </div>
                    </div>

                    <iframe
                      v-else-if="selectedAttachmentType === 'pdf' && previewUrl && pdfPreviewSupported"
                      :src="previewUrl"
                      :title="`Preview of ${selectedAttachment.name}`"
                      class="h-full w-full bg-white"
                    ></iframe>

                    <div v-else-if="selectedAttachmentType === 'pdf' && !pdfPreviewSupported" class="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
                      <p class="max-w-lg text-sm text-slate-500">
                        This browser cannot show PDF files inline, so the file is ready for download instead.
                      </p>
                      <button
                        type="button"
                        class="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        @click="downloadAttachment(selectedAttachment)"
                      >
                        Download PDF
                      </button>
                    </div>

                    <div
                      v-else-if="selectedAttachmentType === 'image' && previewUrl"
                      class="flex h-full flex-col bg-slate-200"
                    >
                      <div class="border-b border-slate-300 bg-slate-100 px-4 py-2 text-xs text-slate-500">
                        Use the zoom controls above, or hold `Ctrl` / `Cmd` and scroll to zoom.
                      </div>
                      <div class="flex flex-1 items-center justify-center overflow-auto p-4" @wheel="handleImagePreviewWheel">
                        <img
                          :src="previewUrl"
                          :alt="selectedAttachment.name"
                          class="rounded-lg bg-white shadow-sm transition-transform duration-150 ease-out"
                          :style="{ transform: `scale(${imageZoom})` }"
                        />
                      </div>
                    </div>

                    <div v-else-if="selectedAttachmentType === 'spreadsheet'" class="h-full overflow-auto bg-white p-4">
                      <div class="issue-spreadsheet-preview" v-html="previewHtml"></div>
                    </div>

                    <pre v-else-if="selectedAttachmentType === 'text'" class="h-full overflow-auto whitespace-pre-wrap bg-white p-4 text-sm leading-6 text-slate-700">{{ previewText }}</pre>

                    <div v-else class="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                      Preview is not available for this file type yet. The attachment is still saved with this issue.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 px-6 py-4">
            <div v-if="validationError" class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {{ validationError }}
            </div>

            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p class="text-xs text-gray-500">
                Attachment files are stored with the issue record in your local IndexedDB data.
              </p>
              <div class="flex justify-end gap-2">
                <button type="button" @click="closeModal" class="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" class="rounded-xl bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
                  {{ editingId ? 'Save Changes' : 'Create Issue' }}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { decompressRTF } from '@kenjiuno/decompressrtf'
import MsgReader from '@kenjiuno/msgreader'
import { EMFJS, RTFJS, WMFJS } from 'rtf.js'
import * as XLSX from 'xlsx'
import { useVOStore } from '../stores/voStore'
import { formatCurrency, formatDate } from '../utils/formatters'

const spreadsheetExtensions = new Set(['xlsx', 'xls', 'xlsm', 'csv'])
const spreadsheetMimeTypes = new Set([
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-excel',
  'text/csv',
  'application/csv'
])
const textExtensions = new Set(['txt', 'log', 'json', 'md', 'csv'])
const IMAGE_ZOOM_MIN = 0.5
const IMAGE_ZOOM_MAX = 4
const IMAGE_ZOOM_STEP = 0.25

const store = useVOStore()

const showModal = ref(false)
const editingId = ref(null)
const searchText = ref('')
const validationError = ref('')

const globalData = ref({ sites: [], scopes: [] })
const siteSearch = ref('')
const showSiteDropdown = ref(false)
const selectedSiteKey = ref('')
const scopeSearch = ref('')
const showScopeDropdown = ref(false)
const selectedScopeName = ref('')

const attachmentInput = ref(null)
const selectedAttachmentId = ref('')
const previewUrl = ref('')
const previewHtml = ref('')
const previewText = ref('')
const previewMsgData = ref(null)
const previewMsgMode = ref('html')
const previewSheetName = ref('')
const previewLoading = ref(false)
const previewError = ref('')
const isDragActive = ref(false)
const isPreviewExpanded = ref(false)
const renameAttachmentId = ref('')
const renameAttachmentName = ref('')
const imageZoom = ref(1)
const clipboardImageAttachment = ref(null)
const clipboardStatusMessage = ref('')
const clipboardChecking = ref(false)
const pdfPreviewSupported = typeof navigator === 'undefined' ? true : navigator.pdfViewerEnabled !== false
const clipboardReadSupported = typeof navigator !== 'undefined' && typeof navigator.clipboard?.read === 'function'

let activePreviewUrl = ''
let previewRequestId = 0
let dragDepth = 0

RTFJS.loggingEnabled(false)
WMFJS.loggingEnabled(false)
EMFJS.loggingEnabled(false)

function createBlankForm() {
  return {
    siteId: '',
    siteName: '',
    jobDescription: '',
    registerLog: '',
    scope: '',
    amount: 0,
    status: 'open',
    comment: '',
    attachments: []
  }
}

const form = ref(createBlankForm())
const imageZoomLabel = computed(() => `${Math.round(imageZoom.value * 100)}%`)

function getAttachmentExtension(name = '') {
  const parts = String(name).toLowerCase().split('.')
  return parts.length > 1 ? parts.pop() : ''
}

function normalizeAttachment(attachment) {
  const blob = attachment?.blob instanceof Blob
    ? attachment.blob
    : (attachment?.file instanceof Blob ? attachment.file : null)

  if (!(blob instanceof Blob)) return null

  const attachmentId = globalThis.crypto?.randomUUID?.()
    || `attachment-${Date.now()}-${Math.random().toString(16).slice(2)}`

  return {
    id: attachment?.id || attachmentId,
    name: sanitizeAttachmentNameInput(attachment?.name, 'Attachment'),
    type: attachment?.type || blob.type || '',
    size: Number(attachment?.size ?? blob.size ?? 0),
    lastModified: Number(attachment?.lastModified ?? Date.now()),
    blob
  }
}

function sanitizeAttachmentNameInput(value, fallbackName = 'Attachment') {
  const fallback = String(fallbackName || 'Attachment').trim() || 'Attachment'
  const fallbackExtension = getAttachmentExtension(fallback)
  let nextName = String(value || '')
    .replace(/[\\/:*?"<>|]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!nextName) return fallback

  const nextExtension = getAttachmentExtension(nextName)
  if (!nextExtension && fallbackExtension) {
    nextName = `${nextName}.${fallbackExtension}`
  }

  return nextName
}

function extensionForMimeType(type = '') {
  const normalized = String(type || '').toLowerCase()
  if (normalized === 'image/png') return 'png'
  if (normalized === 'image/jpeg') return 'jpg'
  if (normalized === 'image/webp') return 'webp'
  if (normalized === 'image/gif') return 'gif'
  if (normalized === 'image/bmp') return 'bmp'
  return 'png'
}

function makeClipboardImageName(type = 'image/png') {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  return `clipboard-image-${stamp}.${extensionForMimeType(type)}`
}

function createClipboardImageAttachment(blob, sourceType = '') {
  if (!(blob instanceof Blob)) return null
  return normalizeAttachment({
    name: makeClipboardImageName(sourceType || blob.type),
    type: sourceType || blob.type || 'image/png',
    size: blob.size,
    lastModified: Date.now(),
    blob
  })
}

async function extractClipboardImageFromItems(items = []) {
  for (const item of items) {
    const types = Array.from(item?.types || [])
    const imageType = types.find((type) => String(type).toLowerCase().startsWith('image/'))
    if (!imageType || typeof item.getType !== 'function') continue
    const blob = await item.getType(imageType)
    return createClipboardImageAttachment(blob, imageType)
  }
  return null
}

function normalizeAttachments(attachments = []) {
  return (Array.isArray(attachments) ? attachments : [])
    .map(normalizeAttachment)
    .filter(Boolean)
}

function classifyAttachment(attachment) {
  if (!attachment) return null

  const extension = getAttachmentExtension(attachment.name)
  const type = String(attachment.type || '').toLowerCase()

  if (type === 'application/vnd.ms-outlook' || extension === 'msg') return 'msg'
  if (type === 'application/pdf' || extension === 'pdf') return 'pdf'
  if (type.startsWith('image/')) return 'image'
  if (spreadsheetMimeTypes.has(type) || spreadsheetExtensions.has(extension)) return 'spreadsheet'
  if (type.startsWith('text/') || textExtensions.has(extension)) return 'text'
  return 'other'
}

function isPreviewableAttachment(attachment) {
  return ['msg', 'pdf', 'image', 'spreadsheet', 'text'].includes(classifyAttachment(attachment))
}

function attachmentKindLabel(attachment) {
  const kind = classifyAttachment(attachment)
  if (kind === 'msg') return 'MSG'
  if (kind === 'pdf') return 'PDF'
  if (kind === 'image') return 'Image'
  if (kind === 'spreadsheet') return 'Excel'
  if (kind === 'text') return 'Text'
  return 'File'
}

function attachmentBadgeClass(attachment) {
  const kind = classifyAttachment(attachment)
  if (kind === 'msg') return 'bg-blue-100 text-blue-700'
  if (kind === 'pdf') return 'bg-red-100 text-red-700'
  if (kind === 'image') return 'bg-amber-100 text-amber-700'
  if (kind === 'spreadsheet') return 'bg-emerald-100 text-emerald-700'
  if (kind === 'text') return 'bg-indigo-100 text-indigo-700'
  return 'bg-slate-100 text-slate-700'
}

function formatFileSize(bytes) {
  const value = Number(bytes || 0)
  if (value < 1024) return `${value} B`
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`
  return `${(value / (1024 * 1024 * 1024)).toFixed(1)} GB`
}

function revokePreviewUrl() {
  if (activePreviewUrl) {
    URL.revokeObjectURL(activePreviewUrl)
    activePreviewUrl = ''
  }
  previewUrl.value = ''
}

function resetPreviewState(clearSelection = false) {
  previewLoading.value = false
  previewError.value = ''
  previewHtml.value = ''
  previewText.value = ''
  previewMsgData.value = null
  previewMsgMode.value = 'html'
  previewSheetName.value = ''
  imageZoom.value = 1
  revokePreviewUrl()
  if (clearSelection) {
    selectedAttachmentId.value = ''
  }
}

function loadGlobalData() {
  try {
    const saved = localStorage.getItem('globalData')
    if (!saved) {
      globalData.value = { sites: [], scopes: [] }
      return
    }
    const data = JSON.parse(saved)
    const rawSites = (data.sites || []).map((site) =>
      typeof site === 'string' ? { siteId: '', siteName: site, jobNumber: '', comment: '' } : site
    )
    const seen = new Set()
    const sites = rawSites.filter((site) => {
      const key = `${site.siteId || ''}|${site.siteName || ''}|${site.jobNumber || ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })

    globalData.value = {
      sites,
      scopes: data.scopes || []
    }
  } catch {
    globalData.value = { sites: [], scopes: [] }
  }
}

const filteredSites = computed(() => {
  const q = siteSearch.value.trim().toLowerCase()
  if (!q) return globalData.value.sites
  return globalData.value.sites.filter((site) =>
    (site.siteId || '').toLowerCase().includes(q) ||
    (site.siteName || '').toLowerCase().includes(q) ||
    (site.jobNumber || '').toLowerCase().includes(q) ||
    (site.comment || '').toLowerCase().includes(q)
  )
})

const filteredScopes = computed(() => {
  const q = scopeSearch.value.trim().toLowerCase()
  if (!q) return globalData.value.scopes
  return globalData.value.scopes.filter((scope) => (scope.name || '').toLowerCase().includes(q))
})

function siteKey(siteId, siteName) {
  return `${siteId || ''}|${siteName || ''}`
}

function selectSite(site) {
  form.value.siteId = site.siteId || ''
  form.value.siteName = site.siteName || ''
  selectedSiteKey.value = siteKey(site.siteId, site.siteName)
  siteSearch.value = `${site.siteId || '-'} - ${site.siteName || ''}`.trim()
  showSiteDropdown.value = false
  validationError.value = ''
}

function selectScope(scope) {
  form.value.scope = scope.name || ''
  selectedScopeName.value = scope.name || ''
  scopeSearch.value = scope.name || ''
  showScopeDropdown.value = false
  validationError.value = ''
}

watch(siteSearch, (value) => {
  const expected = `${form.value.siteId || '-'} - ${form.value.siteName || ''}`.trim()
  if (value !== expected) {
    selectedSiteKey.value = ''
    form.value.siteId = ''
    form.value.siteName = ''
  }
})

watch(scopeSearch, (value) => {
  if (value !== form.value.scope) {
    selectedScopeName.value = ''
    form.value.scope = ''
  }
})

function hideSiteDropdown() {
  setTimeout(() => {
    showSiteDropdown.value = false
  }, 120)
}

function hideScopeDropdown() {
  setTimeout(() => {
    showScopeDropdown.value = false
  }, 120)
}

const summary = computed(() => store.issueLogSummary.value)

const filteredIssues = computed(() => {
  const q = searchText.value.trim().toLowerCase()
  const rows = [...(store.issueLogs.value || [])]
  if (!q) return rows

  return rows.filter((issue) => {
    const attachmentNames = (issue.attachments || []).map((attachment) => attachment?.name || '').join(' ')
    return issue.siteId?.toLowerCase().includes(q) ||
      issue.siteName?.toLowerCase().includes(q) ||
      issue.jobDescription?.toLowerCase().includes(q) ||
      issue.scope?.toLowerCase().includes(q) ||
      issue.comment?.toLowerCase().includes(q) ||
      attachmentNames.toLowerCase().includes(q)
  })
})

const selectedAttachment = computed(() =>
  form.value.attachments.find((attachment) => attachment.id === selectedAttachmentId.value) || null
)

const selectedAttachmentType = computed(() => classifyAttachment(selectedAttachment.value))

function resetForm() {
  form.value = createBlankForm()
  validationError.value = ''
  siteSearch.value = ''
  showSiteDropdown.value = false
  selectedSiteKey.value = ''
  scopeSearch.value = ''
  showScopeDropdown.value = false
  selectedScopeName.value = ''
  dragDepth = 0
  isDragActive.value = false
  isPreviewExpanded.value = false
  renameAttachmentId.value = ''
  renameAttachmentName.value = ''
  clipboardImageAttachment.value = null
  clipboardStatusMessage.value = ''
  clipboardChecking.value = false
  resetPreviewState(true)
  if (attachmentInput.value) {
    attachmentInput.value.value = ''
  }
}

function syncSelectedAttachment() {
  if (!form.value.attachments.length) {
    resetPreviewState(true)
    return
  }

  if (!form.value.attachments.some((attachment) => attachment.id === selectedAttachmentId.value)) {
    selectedAttachmentId.value = form.value.attachments[0].id
  }

  void loadSelectedAttachmentPreview()
}

function openCreate() {
  loadGlobalData()
  editingId.value = null
  resetForm()
  showModal.value = true
  void refreshClipboardImagePrompt(true)
}

function openEdit(issue) {
  loadGlobalData()
  editingId.value = issue.id
  form.value = {
    siteId: issue.siteId || '',
    siteName: issue.siteName || '',
    jobDescription: issue.jobDescription || '',
    registerLog: issue.registerLog ? String(issue.registerLog).slice(0, 10) : '',
    scope: issue.scope || '',
    amount: Number(issue.amount || 0),
    status: issue.status === 'clear' ? 'clear' : 'open',
    comment: issue.comment || '',
    attachments: normalizeAttachments(issue.attachments)
  }

  const matchedSite = globalData.value.sites.find((site) =>
    siteKey(site.siteId, site.siteName) === siteKey(form.value.siteId, form.value.siteName)
  )
  if (matchedSite) {
    selectedSiteKey.value = siteKey(matchedSite.siteId, matchedSite.siteName)
    siteSearch.value = `${matchedSite.siteId || '-'} - ${matchedSite.siteName || ''}`.trim()
  } else {
    selectedSiteKey.value = ''
    siteSearch.value = `${form.value.siteId || '-'} - ${form.value.siteName || ''}`.trim()
  }

  const matchedScope = globalData.value.scopes.find((scope) => (scope.name || '') === form.value.scope)
  if (matchedScope) {
    selectedScopeName.value = matchedScope.name || ''
    scopeSearch.value = matchedScope.name || ''
  } else {
    selectedScopeName.value = ''
    scopeSearch.value = form.value.scope || ''
  }

  validationError.value = ''
  showModal.value = true
  syncSelectedAttachment()
  void refreshClipboardImagePrompt(true)
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  resetForm()
}

function openAttachmentPicker() {
  attachmentInput.value?.click()
}

function handleSelectedFiles(fileList) {
  const files = Array.from(fileList || [])
  if (!files.length) return

  const nextAttachments = files
    .map((file) => normalizeAttachment({
      name: file.name,
      type: file.type,
      size: file.size,
      lastModified: file.lastModified,
      blob: file
    }))
    .filter(Boolean)

  form.value.attachments = [...form.value.attachments, ...nextAttachments]
  validationError.value = ''

  if (!selectedAttachmentId.value && nextAttachments[0]) {
    selectedAttachmentId.value = nextAttachments[0].id
  }

  syncSelectedAttachment()
}

function appendNormalizedAttachments(nextAttachments = []) {
  const normalized = normalizeAttachments(nextAttachments)
  if (!normalized.length) return

  form.value.attachments = [...form.value.attachments, ...normalized]
  validationError.value = ''
  clipboardStatusMessage.value = `Added ${normalized.length} clipboard image${normalized.length === 1 ? '' : 's'} to this issue.`
  clipboardImageAttachment.value = null

  if (normalized[0]) {
    selectedAttachmentId.value = normalized[0].id
  }

  syncSelectedAttachment()
}

function handleAttachmentInput(event) {
  handleSelectedFiles(event.target?.files)
  if (attachmentInput.value) {
    attachmentInput.value.value = ''
  }
}

function setSelectedAttachment(attachmentId) {
  selectedAttachmentId.value = attachmentId
  void loadSelectedAttachmentPreview()
}

function removeAttachment(attachmentId) {
  form.value.attachments = form.value.attachments.filter((attachment) => attachment.id !== attachmentId)
  if (renameAttachmentId.value === attachmentId) {
    cancelAttachmentRename()
  }
  syncSelectedAttachment()
}

function startAttachmentRename(attachment) {
  const normalized = normalizeAttachment(attachment)
  if (!normalized) return
  renameAttachmentId.value = normalized.id
  renameAttachmentName.value = normalized.name
}

function cancelAttachmentRename() {
  renameAttachmentId.value = ''
  renameAttachmentName.value = ''
}

function applyAttachmentRename(attachmentId) {
  const currentAttachment = form.value.attachments.find((attachment) => attachment.id === attachmentId)
  if (!currentAttachment) {
    cancelAttachmentRename()
    return
  }

  const nextName = sanitizeAttachmentNameInput(renameAttachmentName.value, currentAttachment.name)
  form.value.attachments = form.value.attachments.map((attachment) =>
    attachment.id === attachmentId
      ? {
          ...attachment,
          name: nextName
        }
      : attachment
  )
  cancelAttachmentRename()
}

async function refreshClipboardImagePrompt(silent = false) {
  if (!clipboardReadSupported || !showModal.value) return

  clipboardChecking.value = true
  if (!silent) {
    clipboardStatusMessage.value = ''
  }

  try {
    const items = await navigator.clipboard.read()
    const imageAttachment = await extractClipboardImageFromItems(items)
    clipboardImageAttachment.value = imageAttachment

    if (!imageAttachment && !silent) {
      clipboardStatusMessage.value = 'No image was found in your clipboard right now.'
    }
  } catch (error) {
    clipboardImageAttachment.value = null
    if (!silent) {
      clipboardStatusMessage.value = 'Clipboard access is blocked right now. You can still press Ctrl+V to paste an image directly.'
    }
  } finally {
    clipboardChecking.value = false
  }
}

function dismissClipboardImagePrompt() {
  clipboardImageAttachment.value = null
}

function pasteClipboardImage() {
  if (!clipboardImageAttachment.value) return
  appendNormalizedAttachments([clipboardImageAttachment.value])
}

function resetImageZoom() {
  imageZoom.value = 1
}

function setImageZoom(nextZoom) {
  imageZoom.value = Math.min(IMAGE_ZOOM_MAX, Math.max(IMAGE_ZOOM_MIN, Math.round((nextZoom + Number.EPSILON) * 100) / 100))
}

function changeImageZoom(delta) {
  setImageZoom(imageZoom.value + delta)
}

function handleImagePreviewWheel(event) {
  if (!(event.ctrlKey || event.metaKey)) return
  event.preventDefault()
  changeImageZoom(event.deltaY < 0 ? IMAGE_ZOOM_STEP : -IMAGE_ZOOM_STEP)
}

function handleWindowPaste(event) {
  if (!showModal.value) return

  const items = Array.from(event.clipboardData?.items || [])
  const imageItem = items.find((item) => item.kind === 'file' && String(item.type || '').toLowerCase().startsWith('image/'))
  if (!imageItem) return

  const blob = imageItem.getAsFile()
  const attachment = createClipboardImageAttachment(blob, imageItem.type)
  if (!attachment) return

  event.preventDefault()
  appendNormalizedAttachments([attachment])
}

function handleWindowFocus() {
  if (!showModal.value || !clipboardReadSupported) return
  void refreshClipboardImagePrompt(true)
}

function downloadAttachment(attachment) {
  const normalized = normalizeAttachment(attachment)
  if (!normalized) return

  const objectUrl = URL.createObjectURL(normalized.blob)
  const link = document.createElement('a')
  link.href = objectUrl
  link.download = normalized.name || 'attachment'
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
}

function transferHasFiles(event) {
  return Array.from(event.dataTransfer?.types || []).includes('Files')
}

function onAttachmentDragEnter(event) {
  if (!transferHasFiles(event)) return
  event.preventDefault()
  dragDepth += 1
  isDragActive.value = true
}

function onAttachmentDragOver(event) {
  if (!transferHasFiles(event)) return
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'copy'
  }
  isDragActive.value = true
}

function onAttachmentDragLeave(event) {
  if (!transferHasFiles(event)) return
  event.preventDefault()
  dragDepth = Math.max(0, dragDepth - 1)
  if (dragDepth === 0) {
    isDragActive.value = false
  }
}

function onAttachmentDrop(event) {
  if (!transferHasFiles(event)) return
  event.preventDefault()
  dragDepth = 0
  isDragActive.value = false
  handleSelectedFiles(event.dataTransfer?.files)
}

function htmlToText(html = '') {
  if (!html) return ''
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  return (doc.body?.textContent || '')
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function sanitizeEmailHtml(html = '') {
  if (!html) return ''

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  doc.querySelectorAll('script, iframe, object, embed, form, input, button, textarea, select').forEach((node) => {
    node.remove()
  })

  doc.querySelectorAll('*').forEach((node) => {
    Array.from(node.attributes).forEach((attribute) => {
      const name = attribute.name.toLowerCase()
      if (name.startsWith('on')) {
        node.removeAttribute(attribute.name)
      }
    })
  })

  doc.querySelectorAll('a[href]').forEach((link) => {
    link.setAttribute('target', '_blank')
    link.setAttribute('rel', 'noopener noreferrer')
  })

  const bodyContent = doc.body?.innerHTML || html
  const headContent = doc.head?.innerHTML || ''

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<base target="_blank">
${headContent}
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #0f172a;
    font-family: Arial, sans-serif;
  }
  body {
    padding: 16px;
    overflow-wrap: anywhere;
  }
  img {
    max-width: 100%;
    height: auto;
  }
  table {
    max-width: 100%;
  }
</style>
</head>
<body>${bodyContent}</body>
</html>`
}

async function renderCompressedRtfToHtml(compressedRtf) {
  const decompressed = decompressRTF(Array.from(compressedRtf || []))
  if (!decompressed.length) return ''

  const rtfBuffer = new Uint8Array(decompressed).buffer
  const doc = new RTFJS.Document(rtfBuffer)
  const htmlElements = await doc.render()

  const container = document.createElement('div')
  container.append(...htmlElements)

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #0f172a;
    font-family: Arial, sans-serif;
  }
  body {
    padding: 16px;
    overflow-wrap: anywhere;
  }
  img, svg {
    max-width: 100%;
    height: auto;
  }
</style>
</head>
<body>${container.innerHTML}</body>
</html>`
}

function formatRecipientLine(recipients = []) {
  return recipients
    .map((recipient) => recipient.email || recipient.name || '')
    .filter(Boolean)
    .join(', ')
}

async function loadSelectedAttachmentPreview() {
  const attachment = selectedAttachment.value
  resetPreviewState(false)

  if (!attachment) return

  const requestId = ++previewRequestId
  previewLoading.value = true

  try {
    const type = classifyAttachment(attachment)

    if (type === 'msg') {
      const buffer = await attachment.blob.arrayBuffer()
      if (requestId !== previewRequestId) return

      const reader = new MsgReader(buffer)
      const data = reader.getFileData()

      if (data?.error) {
        previewError.value = data.error
        return
      }

      const rawHtml = data.bodyHtml || (data.html ? new TextDecoder().decode(data.html) : '')
      const richHtml = rawHtml
        ? sanitizeEmailHtml(rawHtml)
        : (data.compressedRtf ? await renderCompressedRtfToHtml(data.compressedRtf) : '')
      const bodyText = (data.body || '').trim()
        || htmlToText(rawHtml)
        || (data.preview || '').trim()

      previewMsgData.value = {
        subject: data.subject || attachment.name,
        from: data.senderEmail || data.senderSmtpAddress || data.senderName || '',
        fromName: data.senderName || '',
        to: formatRecipientLine((data.recipients || []).filter((recipient) => recipient.recipType === 'to')),
        cc: formatRecipientLine((data.recipients || []).filter((recipient) => recipient.recipType === 'cc')),
        bcc: formatRecipientLine((data.recipients || []).filter((recipient) => recipient.recipType === 'bcc')),
        sentAt: data.messageDeliveryTime || data.clientSubmitTime || data.creationTime || '',
        html: richHtml,
        hasHtml: Boolean(richHtml),
        htmlSource: rawHtml ? 'html' : (richHtml ? 'rtf' : ''),
        body: bodyText || 'No readable plain-text body found in this MSG file.',
        headers: data.headers || '',
        nestedAttachments: (data.attachments || []).map((item) => ({
          name: item.fileName || item.name || 'Attachment',
          size: item.contentLength || 0
        }))
      }
      previewMsgMode.value = richHtml ? 'html' : 'text'
      return
    }

    if (type === 'pdf' || type === 'image') {
      activePreviewUrl = URL.createObjectURL(attachment.blob)
      if (requestId !== previewRequestId) {
        URL.revokeObjectURL(activePreviewUrl)
        activePreviewUrl = ''
        return
      }
      previewUrl.value = activePreviewUrl
      return
    }

    if (type === 'spreadsheet') {
      const buffer = await attachment.blob.arrayBuffer()
      if (requestId !== previewRequestId) return

      const workbook = XLSX.read(buffer, { type: 'array' })
      const firstSheetName = workbook.SheetNames[0]
      if (!firstSheetName) {
        previewError.value = 'This spreadsheet does not contain a readable worksheet.'
        return
      }

      const worksheet = workbook.Sheets[firstSheetName]
      previewSheetName.value = firstSheetName
      previewHtml.value = XLSX.utils.sheet_to_html(worksheet, { id: 'issue-spreadsheet-preview' })
      return
    }

    if (type === 'text') {
      const text = await attachment.blob.text()
      if (requestId !== previewRequestId) return
      previewText.value = text
      return
    }

    previewError.value = 'Preview is not available for this file type yet.'
  } catch (error) {
    console.error('Attachment preview error:', error)
    previewError.value = 'This file could not be previewed. You can still download it from the attachment list.'
  } finally {
    if (requestId === previewRequestId) {
      previewLoading.value = false
    }
  }
}

async function saveIssue() {
  loadGlobalData()

  const matchedSite = globalData.value.sites.find((site) =>
    siteKey(site.siteId, site.siteName) === selectedSiteKey.value &&
    siteKey(site.siteId, site.siteName) === siteKey(form.value.siteId, form.value.siteName)
  )
  const matchedScope = globalData.value.scopes.find((scope) =>
    (scope.name || '') === selectedScopeName.value &&
    (scope.name || '') === form.value.scope
  )

  if (!matchedSite) {
    validationError.value = 'Site must be selected from Admin Sites. Please re-select a valid site.'
    return
  }

  if (!matchedScope) {
    validationError.value = 'Scope must be selected from Admin Scopes. Please re-select a valid scope.'
    return
  }

  const payload = {
    siteId: form.value.siteId,
    siteName: form.value.siteName,
    jobDescription: form.value.jobDescription,
    registerLog: form.value.registerLog,
    scope: form.value.scope,
    amount: Number(form.value.amount || 0),
    status: form.value.status,
    comment: form.value.comment,
    attachments: normalizeAttachments(form.value.attachments)
  }

  if (editingId.value) {
    await store.editIssueLog(editingId.value, payload)
  } else {
    await store.createIssueLog(payload)
  }

  closeModal()
}

async function deleteIssue(id) {
  if (!confirm('Delete this issue log record?')) return
  await store.removeIssueLog(id)
}

onMounted(async () => {
  loadGlobalData()
  if (!store.issueLogs.value.length) {
    await store.loadAllIssueLogs()
  }
})

watch(showModal, (isOpen) => {
  if (isOpen) {
    window.addEventListener('paste', handleWindowPaste)
    window.addEventListener('focus', handleWindowFocus)
    return
  }

  window.removeEventListener('paste', handleWindowPaste)
  window.removeEventListener('focus', handleWindowFocus)
  clipboardImageAttachment.value = null
  clipboardStatusMessage.value = ''
  clipboardChecking.value = false
})

onBeforeUnmount(() => {
  previewRequestId += 1
  dragDepth = 0
  isDragActive.value = false
  window.removeEventListener('paste', handleWindowPaste)
  window.removeEventListener('focus', handleWindowFocus)
  resetPreviewState(true)
})
</script>

<style scoped>
.issue-spreadsheet-preview :deep(table) {
  min-width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.issue-spreadsheet-preview :deep(td),
.issue-spreadsheet-preview :deep(th) {
  border: 1px solid rgb(226 232 240);
  padding: 0.5rem 0.75rem;
  vertical-align: top;
}

.issue-spreadsheet-preview :deep(tr:nth-child(odd)) {
  background: rgb(248 250 252);
}
</style>
