<script setup>
import { onMounted, watch, ref } from 'vue'
import GlobalHelper from '@/utilities/GlobalHelper'
import InvoiceDetail from '@/components/InvoiceDetail.vue'
import InvoiceHelper from '@/utilities/InvoiceHelper'
import { useRoute } from 'vue-router'

const route = useRoute()

// Akses rute saat ini
const currentRoute = route.name

const {
  dataInvoice,
  getSearchQuery,
  data,
  fetchTransactionList,
  searchQuery,
  resetSearch,
  mapInvoiceOrders,
  selectedItem,
  splitDate,
  detailPopup,
  showDetail
} = InvoiceHelper

watch(
  () => searchQuery.value,
  (newValue) => {
    if (typeof newValue === 'string') {
      searchQuery.value = newValue.toLowerCase()
      fetchTransactionList()
      getSearchQuery(searchQuery.value)
      // searchList(searchQuery.value)
    }
  }
)

onMounted(() => {
  GlobalHelper.showLoader.value = true
  fetchTransactionList()
})
</script>

<template>
  <div class="invoice-container">
    <div style="justify-content: space-between; display: flex; width: 100%">
      <div style="text-transform: capitalize; font-weight: 500; font-size: 1.875rem; width: 100%">
        {{ currentRoute }}
      </div>
      <div class="invoice-search flex align-items-center" style="width: 30%">
        <i class="ri-search-line invoice-search__icon"></i>
        <input
          type="text"
          class="invoice-search__input-field"
          v-model="searchQuery"
          placeholder="Cari..."
          id="search"
          autocomplete="search"
        />
        <ph-x v-if="searchQuery" class="cursor-pointer" @click="resetSearch()" :size="16"></ph-x>
      </div>
    </div>

    <!-- Invoice -->
    <div class="invoice-table" style="overflow-x: auto">
      <table>
        <thead>
          <tr class="invoice-table__row-header">
            <th class="invoice-table__header">No.</th>
            <th class="invoice-table__header">Nama</th>
            <th class="invoice-table__header">Pembelian</th>
            <th class="invoice-table__header">Tanggal</th>
            <th class="invoice-table__header">Jadwal</th>
            <th class="invoice-table__header">Email</th>
          </tr>
        </thead>
        <tbody v-if="dataInvoice">
          <tr v-for="(item, index) in dataInvoice" :key="index" class="invoice-table__row-data">
            <td class="invoice-table__data">{{ index + 1 }}</td>
            <td class="invoice-table__data">
              {{ item.customer ? item.customer.name : item.user.name }}
            </td>
            <td class="invoice-table__data">{{ mapInvoiceOrders(item) }}</td>
            <td class="invoice-table__data">{{ splitDate(item.plannedDate)[0] }}</td>
            <td class="invoice-table__data">{{ splitDate(item.plannedDate)[1] }}</td>
            <td class="invoice-table__data">
              {{ item.customer ? item.customer.email : item.user.email }} <br />
              <button class="btn-primary invoice-table__button" @click="showDetail(item)">
                Detail
              </button>
            </td>
          </tr>
        </tbody>
        <tbody v-else>
          Data Tidak ada
        </tbody>
      </table>
    </div>
  </div>
  <InvoiceDetail :selectedItem="selectedItem" ref="detailPopup" />
</template>

<style scoped>
.invoice-container {
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

/* Search */
.invoice-search {
  width: 601px;
  background-color: #d9d9d9;
  border-radius: 10px;
  overflow: hidden;
  height: 42px;
  padding: 0.5rem;
  margin-inline: 0.5rem;
}
.invoice-search__icon {
  align-items: center;
  justify-content: center;
  width: 50px;
  display: flex;
}
.invoice-search__input-field {
  flex: 1;
  border: none;
  width: 95%;
  background-color: #d9d9d9;
  font-family: 'Poppins';
}
.invoice-search__input-field:focus {
  outline: none;
}

/* Invoice Table */
.invoice-table {
  margin-top: 1.5rem;
  padding: 1.1rem;
  width: 100%;
  text-align: left;
}
.invoice-table table {
  width: 100%;
  border-collapse: collapse;
}
.invoice-table__header {
  padding: 7px;
  text-align: center;
  font-size: 20px;
}
.invoice-table__data:first-child,
.invoice-table__header:first-child {
  border-right: 1px solid black;
}
.invoice-table__data:nth-child(2),
.invoice-table__header:nth-child(2),
.invoice-table__data:nth-child(3),
.invoice-table__header:nth-child(3) {
  text-align: left;
  padding-left: 1rem;
}
.invoice-table__row-header,
.invoice-table__row-data:not(:last-child) {
  border-bottom: 1px solid black;
}
.invoice-table__data {
  padding: 7px;
  text-align: center;
  font-size: 20px;
  vertical-align: top;
  max-width: 200px;
  white-space: wrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-primary {
  background-color: #ffe29a;
  font-family: 'Poppins';
  font-size: 22px;
  border-radius: 5px;
  height: 31px;
  width: 129px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
}
.btn-primary:hover {
  background-color: #ffd477;
}
.invoice-table__button {
  background-color: #ffe29a;
  font-family: 'Poppins';
  font-size: 22px;
  border-radius: 5px;
  height: 31px;
  width: 129px;
  margin-top: 10px;
  border: none;
  cursor: pointer;
}
.invoice-table__button:hover {
  background-color: #ffd477;
}
</style>
