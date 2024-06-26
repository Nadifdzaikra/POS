<template>
  <h2 style="font-weight: bold; text-align: center">Report Curaweda</h2>
  <div style="
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
    ">
    <div class="flex h-full" style="gap: 1rem">
      <div class="ticket-info-card__container flex fd-col pd-1">
        <p class="ticket-info-card__title">Revenue Total</p>
        <span class="ticket-info-card__details align-self-center">{{
          formatCurrency(revenueTotal)
        }}</span>
      </div>
      <div style="background: black; width: 0.1rem"></div>
    </div>

    <div style="
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
      ">
      <div class="ticket-info-card__container flex fd-col pd-1">
        <p class="ticket-info-card__title">Revenue Keraton "COH"</p>
        <span class="ticket-info-card__details align-self-center">{{
            formatCurrency(revenueKeraton.COH)
          }}</span>
      </div>

      <div class="ticket-info-card__container flex fd-col pd-1">
        <p class="ticket-info-card__title">Revenue Keraton "CIA"</p>
        <span class="ticket-info-card__details align-self-center">{{
            formatCurrency(revenueKeraton.CIA)
          }}</span>
      </div>
    </div>
    <div class="flex h-full" style="gap: 1rem">
      <div style="background: black; width: 0.1rem"></div>
      <div class="ticket-info-card__container flex fd-col pd-1">
        <p class="ticket-info-card__title">Revenue Curaweda "COH"</p>
        <span class="ticket-info-card__details align-self-center">{{
            formatCurrency(revenueCuraweda.COH)
          }}</span>
      </div>
      <div class="ticket-info-card__container flex fd-col pd-1">
        <p class="ticket-info-card__title">Revenue Curaweda "CIA"</p>
        <span class="ticket-info-card__details align-self-center">{{
            formatCurrency(revenueCuraweda.CIA)
          }}</span>
      </div>
    </div>
  </div>

  <h2 style="font-weight: bold; text-align: center; margin-top: 10rem">History Report Curaweda</h2>

  <div style="margin-bottom: 1rem">
    <label for="filter-date" style="font-weight: bold; margin-right: 1rem">Filter by Date:</label>
    <div style="display: flex; align-items: center; gap: 1rem">
      <label for="filter-date" style="font-weight: bold; margin-right: 0.1rem">From:</label>
      <input type="date" id="filter-date-from" v-model="filterDateFrom" @change="filterRecords"
        class="datepicker-input" />
      <label for="filter-date" style="font-weight: bold; margin-right: 0.1rem">To:</label>
      <input type="date" id="filter-date-to" v-model="filterDateTo" @change="filterRecords" class="datepicker-input" />
    </div>
  </div>

  <table class="history-report-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Revenue Keraton "COH"</th>
        <th>Revenue Keraton "CIA"</th>
        <th>Revenue Curaweda "COH"</th>
        <th>Revenue Curaweda "CIA"</th>
        <th>Total Revenue</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="record in historyRecords" :key="record.date">
        <td>{{ record.date }}</td>
        <td>{{ formatCurrency(record.revenueKeraton.COH) }}</td>
        <td>{{ formatCurrency(record.revenueKeraton.CIA) }}</td>
        <td>{{ formatCurrency(record.revenueCuraweda.COH) }}</td>
        <td>{{ formatCurrency(record.revenueCuraweda.CIA) }}</td>
        <td>{{ formatCurrency(record.totalRevenue) }}</td>
      </tr>
    </tbody>
  </table>

  <h2 style="font-weight: bold; text-align: center; margin-top: 10rem">History Transaction</h2>

  <table class="history-report-table">
    <thead>
      <tr>
        <th>Date</th>
        <th>Time</th>
        <th>Amount</th>
        <th>Pay Method</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(trans, i) in transactionRecords" :key="i">
        <td>{{ trans.date }}</td>
        <td>{{ formatTimeString(trans.time) }}</td>
        <td>{{ formatCurrency(trans.paymentAmount) }}</td>
        <td>{{ trans.paymentMethod }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { ref, computed } from 'vue'
import GlobalHelper from '../utilities/GlobalHelper'
const { DB_BASE_URL, TRANSACTION_BASE_URL } = GlobalHelper

export default {
  data() {
    return {
      revenueCuraweda: ref(0),
      revenueKeraton: ref({ CIH: 0, CIA: 0 }),
      // revenueCuraweda: ref({ CIH: 0, CIA: 0 }),
      revenueTotal: ref(0),
      historyRecords: ref([]),
      transactionRecords: ref([]),
      filterDateFrom: ref(''),
      filterDateTo: ref('')
    }
  },
  watch: {
    filterDateFrom: {
      handler() {
        this.fetchTabel()
      }
    },
    filterDateFrom: {
      handler() {
        this.fetchTabel()
      }
    },
  },
  mounted() {
    this.fetchData()
    this.fetchTabel()
    this.fetchTabelTransaksi()
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch(
          `${DB_BASE_URL.value}/${TRANSACTION_BASE_URL.value}/income-revenue-curaweda`
        )
        if (!response.ok) throw Error('Failed to fetch Data')
        const responseData = await response.json()
        this.revenueKeraton = responseData.data.revenueKeraton
        this.revenueCuraweda = responseData.data.revenueCuraweda
        this.revenueTotal = responseData.data.total
      } catch (err) {
        console.log(err)
      }
    },
    async fetchTabel() {
      try {
        let url = `${DB_BASE_URL.value}/${TRANSACTION_BASE_URL.value}/income-revenue-tabel?`
        if (this.filterDateFrom) url += `from=${this.filterDateFrom}`
        if (this.filterDateTo) url += `to=${this.filterDateTo}`
        const response = await fetch(url)
        if (!response.ok) throw Error('Failed to fetch Data')
        const responseData = await response.json()
        this.historyRecords = this.formatTabelRecord(responseData.data)
      } catch (err) {
        console.log(err)
      }
    },
    async fetchTabelTransaksi() {
      try {
        const response = await fetch(
          `${DB_BASE_URL.value}/keraton-pos/curaweda-income/`
        )
        if (!response.ok) throw Error('Failed to fetch Data')
        const responseData = await response.json()
        this.transactionRecords = responseData.data.map(trans => ({
          date: trans.createdAt.split('T')[0],
          time: trans.createdAt.split('T')[1],
          ...trans
        }))
      } catch (err) {
        console.log(err)
      }
    },
    formatTimeString(timeString) {
      const [hours, minutes] = timeString.split(':');
      return `${hours}.${minutes}`;
    },
    formatTabelRecord(datas) {
      let tableRaw = {}
      for (let data of datas) {
        const reservedDate = data.plannedDate.split('T')[0]
        if (!tableRaw[reservedDate])
          tableRaw[reservedDate] = {
            date: reservedDate,
            revenueKeraton: {
              COH: 0,
              CIA: 0
            },
            revenueCuraweda: {
              COH: 0,
              CIA: 0
            },
            totalRevenue: 0
          }
        tableRaw[reservedDate].revenueKeraton.COH += data.keratonIncome.COH
        tableRaw[reservedDate].revenueKeraton.CIA += data.keratonIncome.CIA
        tableRaw[reservedDate].revenueCuraweda.COH += data.curawedaIncome.COH
        tableRaw[reservedDate].revenueCuraweda.CIA += data.curawedaIncome.CIA
        tableRaw[reservedDate].totalRevenue += +data.total
      }
      return Object.values(tableRaw)
    },
    formatCurrency(amount) {
      return Number(amount).toLocaleString('id-ID')
    },

    filterRecords() {
      const fromDate = new Date(this.filterDateFrom)
      const toDate = new Date(this.filterDateTo)
      this.filteredRecords = this.historyRecords.filter((record) => {
        const recordDate = new Date(record.date)
        return recordDate >= fromDate && recordDate <= toDate
      })
    }
  },
  computed: {
    filteredRecords() {
      const fromDate = new Date(this.filterDateFrom)
      const toDate = new Date(this.filterDateTo)
      return this.historyRecords.filter((record) => {
        const recordDate = new Date(record.date)
        return recordDate >= fromDate && recordDate <= toDate
      })
    }
  }
}
</script>

<style scoped>
p,
span {
  cursor: default;
}

.ticket-info-card__container {
  height: 186px;
  background: linear-gradient(to bottom, rgba(255, 226, 154, 0.9), rgba(254, 209, 96, 0.9));
  border-radius: 15px;
}

.ticket-info-card__title {
  font-size: 12px;
  line-height: 18px;
  width: fit-content;
  padding: 0 8px;
  border-radius: 5px;
  background-color: rgba(254, 209, 96, 1);
  mix-blend-mode: luminosity;
}

.ticket-info-card__details {
  font-size: 96px;
  font-weight: 500;
  line-height: 128px;
}

.ticket-info-card__desc {
  font-size: 12px;
  font-weight: 500;
  line-height: 18px;
  position: relative;
  bottom: 20px;
}

.datepicker-input {
  width: 200px;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}

.datepicker-input:focus {
  border-color: #66afe9;
  outline: none;
  box-shadow: 0 0 8px rgba(102, 175, 233, 0.6);
}

.history-report-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.history-report-table th,
.history-report-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

.history-report-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>
