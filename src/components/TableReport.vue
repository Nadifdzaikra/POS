<script setup>
import { onMounted } from 'vue'
import ReportHelper from '@/utilities/ReportHelper'

const { activityReportData, fetchTableDataReport, formatDate, formatCurrency } = ReportHelper

onMounted(() => {
  fetchTableDataReport()
})
</script>

<template>
  <div class="report-activity__table">
    <table class="report-activity__table-data">
      <thead>
        <tr class="report-activity__table-header">
          <th>No</th>
          <th>Pembelian</th>
          <th>Kategori</th>
          <th>Tanggal</th>
          <th>Jumlah</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr
          class="report-activity__table-items"
          v-for="(item, index) in activityReportData"
          :key="index"
        >
          <td>{{ index + 1 }}</td>
          <td class="to-ellipsis">{{ item.order.name }}</td>
          <td>{{ item.order.category.name }}</td>
          <td>{{ formatDate(item.transaction.createdDate) }}</td>
          <td>{{ item.amount }}</td>
          <td>{{ formatCurrency(item.total_price) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
th,
td {
  cursor: pointer;
}

.report-activity__table {
  max-height: calc(374px - 2rem);
  overflow-y: overlay;
  overflow-x: auto;
}
.report-activity__table::-webkit-scrollbar {
  width: 4px;
}
.report-activity__table::-webkit-scrollbar-track {
  background-color: lightgrey;
  border-radius: 2px;
}
.report-activity__table::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.report-activity__table-data {
  border-collapse: collapse;
  outline: 0;
  overflow-x: auto;
  width: 100%;
}
.report-activity__table-header th {
  font-size: 24px;
  font-weight: 600;
  line-height: 28px;
  background-color: white;
  box-shadow: inset 0 -1px 0 #000000;
  position: sticky;
  z-index: 3;
  top: 0;
}
.report-activity__table-items td {
  font-size: 18px;
  line-height: 28px;
  border-bottom: 1px solid #000;
}
.report-activity__table-header th,
.report-activity__table-items td {
  text-align: center;
  padding: 0.5rem 1.5rem;
}
.report-activity__table-header th:nth-child(2),
.report-activity__table-items td:nth-child(2) {
  max-width: 20rem;
  text-align: start;
  padding-left: 2rem;
}
</style>
