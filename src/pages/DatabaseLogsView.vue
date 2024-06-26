<script setup>
import { ref, computed, onMounted, watchEffect, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GlobalHelper from '@/utilities/GlobalHelper'

const { DB_BASE_URL, LOGS_BASE_URL, showLoader } = GlobalHelper
const router = useRouter()
const logsData = ref([])
const searchQuery = ref('')
const rawSearch = ref('')
const actionArray = ref([
  {
    action: 'CREATE'
  },
  {
    action: 'UPDATE'
  },
  {
    action: 'DELETE'
  }
])
const selectedAction = ref('')
const isOpen = ref(false)

const searchLogs = () => {
  searchQuery.value = rawSearch.value
  fetchLogsData()
}
const resetSearch = () => {
  rawSearch.value = ''
  searchQuery.value = ''
  fetchLogsData()
}
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}
const selectOption = (action) => {
  isOpen.value = false
  selectedAction.value = action
  fetchLogsData()
}
const resetFilter = () => {
  selectedAction.value = ''
  fetchLogsData()
}
const closeDropdownOnClickOutside = (event) => {
  if (
    !event.target.closest('.action-filter__input-dropdown') &&
    !event.target.closest('.action-filter__input-dropdown_menu')
  ) {
    isOpen.value = false
  }
}

const splitDate = (dateTime) => {
  const parts = dateTime.split('T')
  const dateParts = parts[0].split('-')
  const timeParts = parts[1].split(':')

  const day = dateParts[2]
  const month = dateParts[1]
  const year = dateParts[0]
  const formattedDate = `${day}/${month}/${year}`

  const hours = timeParts[0]
  const minutes = timeParts[1]
  const formattedTime = `${hours}:${minutes}`

  return [formattedDate, formattedTime]
}

const fetchLogsData = async () => {
  try {
    showLoader.value = true
    let url = `${DB_BASE_URL.value}/${LOGS_BASE_URL.value}/database-logs`
    const queryParams = []
    if (searchQuery.value) {
      queryParams.push(`search=${encodeURIComponent(searchQuery.value)}`)
    }
    if (selectedAction.value) {
      queryParams.push(`action=${encodeURIComponent(selectedAction.value)}`)
    }

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`
    }
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    logsData.value = res.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

// Pagination Start
const rowsPerPage = 10
const currentPage = ref(1)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * rowsPerPage
  const end = start + rowsPerPage
  return logsData.value.slice(start, end)
})
const totalPages = computed(() => {
  return Math.ceil(logsData.value.length / rowsPerPage)
})
const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page
  }
}
const visiblePages = computed(() => {
  const maxVisible = 3
  let startPage = Math.max(currentPage.value - Math.floor(maxVisible / 2), 1)
  let endPage = startPage + maxVisible - 1

  if (endPage > totalPages.value) {
    endPage = totalPages.value
    startPage = Math.max(endPage - maxVisible + 1, 1)
  }

  const pages = []
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  return pages
})
watchEffect(() => {
  if (rawSearch.value === '' && searchQuery.value !== rawSearch.value) resetSearch()
})
onMounted(() => {
  fetchLogsData()
  window.addEventListener('click', closeDropdownOnClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside)
})
</script>

<template>
  <div
    class="breadcrumb flex align-items-center gap[0.5] cursor-pointer"
    @click="router.push('/settings')"
  >
    <ph-caret-left size="24" weight="bold" />
    <p>Kembali</p>
  </div>
  <h5 class="fw-600 sm-top-1">Catatan Basis Data</h5>

  <div class="database-logs__content pd-right-1 sm-top-2">
    <div class="flex align-items-center justify-content-sb pd-sd-2">
      <div class="flex gap align-items-center gap[0.5]">
        <div class="database-logs-search flex align-items-center">
          <i
            class="ri-search-line database-logs-search__icon flex align-items-center justify-content-center"
            :width="50"
          ></i>
          <input
            type="text"
            class="database-logs-search__input-field"
            v-model="rawSearch"
            placeholder="Cari..."
          />
          <ph-x v-if="rawSearch" class="cursor-pointer" @click="resetSearch()" :size="16"></ph-x>
        </div>
        <button class="database-logs__content_cta-search" @click="searchLogs">
          <ph-magnifying-glass size="18" weight="bold" />
        </button>
      </div>
      <div class="flex gap align-items-center gap[0.5]">
        <div class="action-filter__input-dropdown">
          <input
            readonly
            @click="toggleDropdown"
            :value="selectedAction"
            placeholder="Pilih Filter"
          />
          <div class="select-icon" @click="toggleDropdown">
            <div class="arrow-icon" :class="{ active: isOpen }">
              <ph-caret-down :size="14" weight="bold" class="icon" />
            </div>
          </div>
          <div class="action-filter__input-dropdown_menu" :class="{ active: isOpen }">
            <p v-for="(list, index) in actionArray" :key="index" @click="selectOption(list.action)">
              {{ list.action }}
            </p>
          </div>
        </div>
        <button class="action-filter__cta fw-600 pd-sd-1" @click="resetFilter">Reset</button>
      </div>
    </div>
    <table>
      <thead>
        <th>User</th>
        <th>Aksi</th>
        <th>Aktivitas</th>
        <th>Page</th>
        <th>Status</th>
        <th>Tanggal</th>
      </thead>
      <tbody>
        <tr v-for="logData in paginatedData" :key="logData.user">
          <td>{{ logData.user.email }}</td>
          <td>{{ logData.action }}</td>
          <td>{{ logData.activity }}</td>
          <td>{{ logData.changedAt }}</td>
          <td>
            <div
              class="logdata-status"
              :class="{
                'status-success': logData.status === 'Success',
                'status-failed': logData.status === 'Failed'
              }"
            >
              {{ logData.status }}
            </div>
          </td>
          <td>{{ `${splitDate(logData.createdDate)[0]} | ${splitDate(logData.createdDate)[1]}` }}</td>
        </tr>
      </tbody>
    </table>

    <div class="pagination-container">
      <button
        class="pagination-button"
        @click="changePage(currentPage - 1)"
        :class="{ invisible: currentPage === 1 }"
      >
        <ph-caret-left />
      </button>
      <div class="pagination-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="changePage(page)"
          :class="{ active: page === currentPage }"
        >
          {{ page }}
        </button>
      </div>
      <button
        class="pagination-button"
        @click="changePage(currentPage + 1)"
        :class="{ invisible: currentPage === totalPages }"
      >
        <ph-caret-right />
      </button>
    </div>
  </div>
</template>

<style scoped>
.database-logs-search {
  width: 20rem;
  height: 2rem;
  border-radius: 0.5rem;
  border: 1px solid;
  border-color: #000;
  gap: 0.5rem;
  padding: 0.5rem;
  overflow: hidden;
  margin-inline: 0.5rem;
}
.database-logs-search__input-field {
  flex: 1;
  border: none;
  width: 95%;
  font-family: 'Poppins';
}
.database-logs-search__input-field:focus {
  outline: none;
}
.database-logs__content_cta-search,
.action-filter__cta {
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2rem;
  border-radius: 0.5rem;
}
.database-logs__content_cta-search {
  width: 2rem;
}
.action-filter__input-dropdown {
  position: relative;
  height: 2rem;
  width: 15rem;
  border-radius: 0.5rem;
  border: 1px solid black;
  cursor: pointer;
}

.action-filter__input-dropdown input {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: transparent;
  cursor: pointer;
}

.select-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.arrow-icon {
  transition: all 300ms ease;
}

.arrow-icon.active {
  transform: rotate(180deg);
}

.action-filter__input-dropdown_menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  display: none;
  overflow: hidden;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
  z-index: 200;
}

.action-filter__input-dropdown_menu.active {
  display: block;
}

.action-filter__input-dropdown_menu p {
  padding: 0.3rem 0.6rem;
}

.action-filter__input-dropdown_menu p:hover {
  background-color: rgb(233, 233, 233);
}

.action-filter__input-dropdown_menu p:hover:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}

.action-filter__input-dropdown_menu p:hover:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}

table {
  border-collapse: collapse;
  outline: 0;
  margin-top: 1rem;
  width: 100%;
  box-shadow: 1px 5px 10px 1px #0000012c;
  border-radius: 1rem;
  padding: 1rem;
}
thead {
  border-bottom: 1px solid #000;
}
th {
  height: 3rem;
  font-weight: 600;
}
th:nth-child(3) {
  text-align: start;
  padding: 0 1rem;
}
tr {
  max-height: 2rem;
}
td {
  max-height: 1.5rem;
  height: 1.5rem;
  text-align: center;
  max-width: 15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 1rem;
  font-size: clamp(10px, 1vw, 14px);
}

td:nth-child(3) {
  text-align: start;
}

td:nth-child(1) {
  max-width: 10rem;
}
td:nth-child(5) {
  max-width: 4.5rem;
}
td:hover:nth-child(1),
td:hover:nth-child(3) {
  position: relative;
  overflow: visible;
  white-space: normal;
}
td:hover:nth-child(3) {
  padding: 0 1rem;
}
.logdata-status span {
  font-weight: 600;
  text-align: center;
  display: flex;
  justify-content: center;
  align-self: center;
}

.status-success {
  color: #1d8335;
  background-color: #36d65b7a;
  border-radius: 1rem;
}
.status-failed {
  color: #831d1d;
  background-color: #d636367a;
  border-radius: 1rem;
}
.pagination-container {
  display: flex;
  width: 100%;
  justify-content: center;
  margin-top: 1rem;
  gap: 1rem;
}

.pagination-numbers {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.pagination-container button {
  width: 2.5rem;
  height: 2.5rem;
  box-shadow: 1px 5px 10px 1px #0000012c;
  border-radius: 0.5rem;
}

.pagination-container button.active {
  background-color: var(--color-primary);
  color: white;
}

.pagination-button.invisible {
  visibility: hidden;
}

.pagination-container button:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
}
</style>
