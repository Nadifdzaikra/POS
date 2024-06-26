<template>
  <div
    style="
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 5px;
    "
  >
    <div style="width: 95%; display: flex; gap: 20px; justify-content: center">
      <Chart
        :targetDate="currentYear"
        :dataSeries="yearlyData"
        :dataCategory="yearlyCategory"
        :width="widthcart"
      />
      <Chart
        :targetDate="monthName"
        :dataSeries="monthlyData"
        :dataCategory="monthlyCategory"
        :width="widthcart"
      />
    </div>

    <h2>Data Penjualan Tiket Tahun {{ currentYear }}</h2>
    <table class="history-report-table" style="margin-top: 2rem">
      <thead>
        <tr>
          <th v-for="(header, i) in yearlyCategory" :key="i">{{ header }}</th>
          <th>Total</th>
          <!-- <th>Mancanegara 'Dalam Negri</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(year, i) in yearlyData" :key="i">
          <td>{{ year.name }}</td>
          <td v-for="(yearData, i) in year.data">{{ yearData }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Data Penjualan Tiket Bulan {{ monthName }}</h2>
    <table class="history-report-table" style="margin-top: 2rem">
      <thead>
        <tr>
          <th v-for="(header, i) in monthlyCategory" :key="i">{{ header }}</th>
          <th>Total</th>
          <!-- <th>Mancanegara 'Dalam Negri</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(month, i) in monthlyData" :key="i">
          <td>{{ month.name }}</td>
          <td v-for="(monthData, i) in month.data">{{ monthData }}</td>
        </tr>
      </tbody>
    </table>

    <!-- <h2 style="margin-top: 2rem">Data Tingkat Keramaian Bulan</h2>
      <table class="history-report-table" style="margin-top: 2rem">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Umum</th>
            <th>Pelajar</th>
            <th>Mancanegara 'Luar Negri'</th>
            <th>Mancanegara 'Dalam Negri</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in historyRecords" :key="record.date">
            <td>{{ record.date }}</td>
            <td>{{ formatCurrency(record.revenueKeraton.COH) }}</td>
            <td>{{ formatCurrency(record.revenueKeraton.CIA) }}</td>
            <td>{{ formatCurrency(record.revenueCuraweda) }}</td>
            <td>{{ formatCurrency(record.totalRevenue) }}</td>
          </tr>
        </tbody>
      </table> -->
  </div>
</template>

<script>
import Chart from '@/components/Chart.vue'
import GlobalHelper from '@/utilities/GlobalHelper'
import { ref } from 'vue'
const { DB_BASE_URL, TRANSACTION_BASE_URL, ORDER_BASE_URL, DETAILTRANS_BASE_URL, showLoader } =
  GlobalHelper

export default {
  components: {
    Chart
  },
  data() {
    return {
      yearlyData: ref([]),
      yearlyCategory: ref([]),
      monthlyData: ref([]),
      monthlyCategoryDatas: ref([]),
      currentYear: ref(),
      currentMonth: ref(),
      monthName: ref(),
      widthcart: ref('250')
    }
  },
  beforeMount() {},
  mounted() {
    const today = new Date()
    today.setHours(7, 0, 0, 0)
    this.currentYear = today.getFullYear()
    this.currentMonth = today.getMonth() + 1
    this.monthName = today.toLocaleString('id-ID', { month: 'long' })
    this.fetchData().then(() => {
      window.print()
    })
    // window.location.reload()
  },
  methods: {
    async fetchData() {
      try {
        const responseYear = await fetch(
          `${DB_BASE_URL.value}/${ORDER_BASE_URL.value}/chart-data/${encodeURIComponent(this.currentYear)}`
        )
        const responseMonth = await fetch(
          `${DB_BASE_URL.value}/${ORDER_BASE_URL.value}/chart-data/${encodeURIComponent(this.currentYear)}/${encodeURIComponent(this.currentMonth)}`
        )
        if (!responseYear.ok) throw new Error('Failed to fetch data')
        if (!responseMonth.ok) throw new Error('Failed to fetch data')
        const resYear = await responseYear.json()
        const resMonth = await responseMonth.json()
        this.yearlyCategory = resYear.data.yearlyCategory
        this.yearlyData = resYear.data.yearlyData
        this.monthlyCategory = resMonth.data.monthlyCategory
        this.monthlyData = resMonth.data.monthlyData
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
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
