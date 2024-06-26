<template>
  <div style="
      margin-top: 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    ">
    <h2>Data Wisatawan Keraton</h2>
    <table class="history-report-table" style="margin-top: 2rem">
      <thead>
        <tr>
          <th>Nama Negara</th>
          <th>Total</th>
          <th>Nama Kota</th>
          <th>Total</th>
          <!-- <th>Mancanegara 'Dalam Negri</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tabel, i) in tableData" :key="i">
          <td>{{ tabel.countryName}}</td>
          <td>{{ tabel.countryTotal }}</td>
          <td>{{ tabel.cityName}}</td>
          <td>{{ tabel.cityTotal }}</td>
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
import GlobalHelper from '@/utilities/GlobalHelper';
import { ref } from 'vue';
const { DB_BASE_URL, TRANSACTION_BASE_URL, ORDER_BASE_URL, DETAILTRANS_BASE_URL, showLoader } = GlobalHelper

export default {
  data() {
    return {
      tableData: ref()
    }
  },
  mounted() {
    this.fetchData().then(() => {
      window.print()
    })
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch(`${DB_BASE_URL.value}/${TRANSACTION_BASE_URL.value}/get-all-detail`)
        if (!response.ok) throw Error('Gagal Fetching Data')
        const responseData = await response.json()
        this.tableData = this.formatTabel(responseData.data)
        console.log(this.tableData)
      } catch (err) {
        console.log(err)
      }
    },
    formatTabel(datas) {
      let rawTabel = { city: {}, country: {}, cityLength: 0, countryLength: 0 }, rawFormatedTabel = []
      for (let data of datas) {
        let identifier = "city", dataName = data.cityName
        if (data.nationalityId) {
          identifier = "country"
          dataName = data.nationality.name
        }
        if (!rawTabel[identifier][dataName]){
          rawTabel[identifier][dataName] = {
            amount: 0,
            name: dataName
          }
          rawTabel[`${identifier}Length`]++
        } 
        rawTabel[identifier][dataName].amount += data.amount
      }
      const highestLenght = Math.max(rawTabel.cityLength, rawTabel.countryLength);
      const cityData = Object.values(rawTabel.city)
      const countryData = Object.values(rawTabel.country)
      for(let num = 0; num < highestLenght; num++){
        rawFormatedTabel.push({
          countryName: countryData[num]?.name || "",
          countryTotal: countryData[num]?.amount || "",
          cityName: cityData[num]?.name || "",
          cityTotal: cityData[num]?.amount || "",
        })
      }
      console.log(rawFormatedTabel)
      return rawFormatedTabel
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
