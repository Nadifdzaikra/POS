<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Chart from '@/components/Chart.vue'
import TicketInfoCard from '@/components/TicketInfoCard.vue'
import TableReport from '@/components/TableReport.vue'
import CategoryDropdown from '@/components/CategoryDropdown.vue'
import GlobalHelper from '@/utilities/GlobalHelper'
import ReportHelper from '@/utilities/ReportHelper'
import html2canvas from 'html2canvas'

const {
  incomeRevenue,
  fetchIncomeRevenue,
  formatCurrency,
  currentYear,
  selectedYear,
  targetYears,
  yearlyCategory,
  yearlyData,
  fetchTargetYears,
  changeSelectedYear,
  fetchYearlyChartData,
  currentMonth,
  selectedMonth,
  selectedMonthName,
  targetMonths,
  monthlyCategory,
  monthlyData,
  fetchTargetMonths,
  setMonthLocaleString,
  changeSelectedMonth,
  fetchMonthlyChartData,
  generateExcel,
  printData,
  updateCategory,
  totalSum
} = ReportHelper

const checkData = async () => {
  try {
    isShowChart.value = false
    GlobalHelper.showLoader.value = true
    await fetchIncomeRevenue()
    await fetchTargetYears()
    await fetchTargetMonths()
    selectedYear.value = currentYear
    selectedMonth.value = currentMonth
    setMonthLocaleString()
    await fetchYearlyChartData()
    await fetchMonthlyChartData()
    isShowChart.value = true
  } catch (error) {
    console.error(error)
  }
}
const showDetail = ref(false)
const isShowChart = ref(false)
const yearDropdownOpen = ref(false)
const monthDropdownOpen = ref(false)

const toggleShow = () => {
  showDetail.value = !showDetail.value
}
const toggleYearDropdown = () => {
  yearDropdownOpen.value = !yearDropdownOpen.value
}
const toggleMonthDropdown = () => {
  monthDropdownOpen.value = !monthDropdownOpen.value
}
const closeDropdownOnClickOutside = (event) => {
  if (
    !event.target.closest('.filter__input-dropdown') &&
    !event.target.closest('.filter__input-dropdown_menu')
  ) {
    yearDropdownOpen.value = false
    monthDropdownOpen.value = false
  }
}
const selectYearOption = (year) => {
  changeSelectedYear(year)
  yearDropdownOpen.value = false
}
const selectMonthOption = (month) => {
  selectedMonthName.value = month
  changeSelectedMonth(month)
  monthDropdownOpen.value = false
}
// const takeScreenshot = async (elementId) => {
//   const element = document.getElementById(elementId)
//   try {
//     const canvas = await html2canvas(element)
//     canvas.toBlob((blob) => {
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement('a')
//       a.href = url
//       a.download = `Report Tahun ${selectedYear.value} Bulan ${selectedMonthName.value}.png`
//       document.body.appendChild(a)
//       a.click()
//       window.URL.revokeObjectURL(url)
//       console.log('Screenshot saved as image file!')
//     }, 'image/png')
//   } catch (error) {
//     console.error('Error saving screenshot as image file:', error)
//   }
// }
const incomeRevenueClass = () => {
  const length = incomeRevenue.value.toString().length
  if (length > 18) {
    return 'fs-h5'
  } else if (length > 15) {
    return 'fs-h4'
  } else if (length > 12) {
    return 'fs-h3'
  } else if (length > 9) {
    return 'fs-h2'
  }
}

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside)
})

onMounted(() => {
  checkData()
  window.addEventListener('click', closeDropdownOnClickOutside)
  setMonthLocaleString()
})
</script>

<template>
  <div class="report__container flex fd-col align-items-center justify-content-center gap[2.25]">
    <div class="report-information__container flex fd-row gap-2 justify-content-sb">
      <div class="report-information__income-container w-half flex fd-col gap-1">
        <div class="report-information__income-revenue flex fd-col pd-2" @click="toggleShow">
          <h5>Pendapatan hari ini</h5>
          <div class="report-information__income-text flex fd-row">
            <h5 class="fw-600">Rp</h5>
            <span class="fs-display fw-600" :class="incomeRevenueClass()">{{
              formatCurrency(incomeRevenue)
            }}</span>
          </div>
          <transition name="jump">
            <div v-if="showDetail" class="flex fd-row detail-section">
              <div class="flex" style="width: 50%">
                <div style="font-size: 20px; font-weight: 600">Rp</div>
                <h3 class="fw-600" :class="incomeRevenueClass()">
                  {{ formatCurrency(incomeRevenue) }}
                </h3>
              </div>
              <div class="flex" style="width: 50%">
                <div style="font-size: 20px; font-weight: 600">Rp</div>
                <h3 class="fw-600" :class="incomeRevenueClass()">
                  {{ formatCurrency(incomeRevenue) }}
                </h3>
              </div>
              <q-btn
                style="
                  background-color: var(--color-primary);
                  height: fit-content;
                  border-radius: 5px;
                  padding: 5px;
                  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.062);
                  margin: auto;
                "
                type="submit"
                >Transfer</q-btn
              >
            </div>
          </transition>
        </div>
        <div class="report-information__ticket-sold flex fd-col pd-2">
          <h5>Total tiket terjual</h5>
          <h4 class="fw-600">{{ totalSum() }} Tiket</h4>
        </div>
      </div>
      <div class="report-information__ticketing-container w-half flex fd-col gap[0.5] pd-2">
        <h5>Tiket terjual</h5>
        <div class="report-information__ticketing-card flex fd-row gap[1.5] pd-left-1">
          <TicketInfoCard />
        </div>
      </div>
    </div>
    <div class="report-revenue__container flex fd-col">
      <div
        id="report__screenshot-target"
        v-if="isShowChart"
        class="report-revenue__chart-container flex fd-row align-items-center justify-content-center gap[1.5]"
      >
        <div
          class="report-revenue__chart flex fd-col align-items-center justify-content-center gap-1"
        >
          <Chart
            :targetDate="selectedYear"
            :dataSeries="yearlyData"
            :dataCategory="yearlyCategory"
          />
          <div class="filter__input-dropdown">
            <input
              readonly
              @click="toggleYearDropdown()"
              :value="selectedYear"
              placeholder="Pilih Tahun"
              id="filter-year"
            />
            <div class="select-icon">
              <div class="arrow-icon" :class="{ active: yearDropdownOpen }">
                <ph-caret-down :size="14" weight="bold" class="icon" />
              </div>
            </div>
            <div class="filter__input-dropdown_menu" :class="{ active: yearDropdownOpen }">
              <p
                v-for="(year, index) in targetYears"
                :key="index"
                :value="year"
                @click="selectYearOption(year)"
              >
                {{ year }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="report-revenue__chart flex fd-col align-items-center justify-content-center gap-1"
        >
          <Chart
            :targetDate="selectedMonthName"
            :dataSeries="monthlyData"
            :dataCategory="monthlyCategory"
          />
          <div class="filter__input-dropdown">
            <input
              readonly
              @click="toggleMonthDropdown()"
              :value="selectedMonthName"
              placeholder="Pilih Bulan"
              id="filter-month"
            />
            <div class="select-icon">
              <div class="arrow-icon" :class="{ active: monthDropdownOpen }">
                <ph-caret-down :size="14" weight="bold" class="icon" />
              </div>
            </div>
            <div class="filter__input-dropdown_menu" :class="{ active: monthDropdownOpen }">
              <p
                v-for="(month, index) in targetMonths"
                :key="index"
                :value="month"
                @click="selectMonthOption(month)"
              >
                {{ month }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="report-revenue__icons flex fd-row align-self-f-end gap-1 pd-sd-1 pd-top-1 align-items-center"
      >
        <!-- <span
          class="icons"
          name="Screenshot Grafik"
          @click="takeScreenshot('report__screenshot-target')"
        >
          <ph-camera :size="32" weight="bold" />
        </span> -->
        <span class="icons" name="Print Data" @click="printData"
          ><ph-printer :size="32" weight="bold"
        /></span>
        <span class="icons" name="Ekspor ke Excel" @click="generateExcel">
          <ph-microsoft-excel-logo :size="32" weight="fill" fill="green" />
        </span>
      </div>
    </div>
    <div class="report-activity__container flex fd-col gap-1">
      <div class="report-activity__head flex fd-row gap[1.5] align-items-center">
        <p class="report-activity__head-text">Aktivitas Terbaru</p>
        <div class="report-activity__head-dropdown-container">
          <CategoryDropdown :categoryWidth="'136px'" @option-selected="updateCategory" />
        </div>
      </div>
      <div class="report-activity__table-container">
        <TableReport />
      </div>
    </div>
  </div>
</template>

<style scoped>
.report-information__income-revenue {
  cursor: pointer;
}

.detail-section {
  margin-top: 10px;
}

.jump-enter-active,
.jump-leave-active {
  transition: all 0.3s ease;
}

.jump-enter-from,
.jump-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.jump-enter-to,
.jump-leave-from {
  transform: translateY(0);
  opacity: 1;
}
.report-information__container {
  width: 1085px;
}
.report-information__income-revenue,
.report-information__ticket-sold,
.report-information__ticketing-container {
  border-radius: 20px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25);
}
.report-revenue__icons .icons {
  font-size: 32px;
  position: relative;
}
.report-revenue__icons .icons:hover {
  opacity: 70%;
  cursor: pointer;
}
.report-revenue__icons .icons:hover::after {
  content: attr(name);
  position: absolute;
  bottom: -2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-family: 'Poppins';
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  white-space: nowrap;
  z-index: 9999;
}
.report-activity__head-text {
  font-size: 20px;
  font-weight: 600;
  line-height: 28px;
}
.report-activity__table-container {
  width: 1081px;
  height: 374px;
  border-radius: 20px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25);
  padding: 1rem;
}
.filter__input-dropdown {
  height: 2rem;
  width: 15rem;
  border-radius: 0.5rem;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  position: relative;
  border: 1px solid black;
}
.filter__input-dropdown input {
  cursor: pointer;
}
input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
.filter__input-dropdown input:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary);
}
.filter__input-dropdown .select-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.arrow-icon {
  transition: all 300ms ease;
}
.arrow-icon.active {
  transform: rotate(180deg);
}
.filter__input-dropdown .select-icon i {
  font-size: 18px;
}
.filter__input-dropdown_menu {
  position: absolute;
  top: 2.6rem;
  background-color: white;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-radius: 0.5rem;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    box-shadow 0.2s ease;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0);
}

.filter__input-dropdown_menu.active {
  max-height: 200px;
  overflow-y: scroll;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
}
.filter__input-dropdown_menu.active::-webkit-scrollbar {
  width: 4px;
}
.filter__input-dropdown_menu.active::-webkit-scrollbar-track {
  background-color: lightgrey;
  border-radius: 2px;
}
.filter__input-dropdown_menu.active::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.filter__input-dropdown_menu p {
  padding: 0.3rem 0.6rem;
}
.filter__input-dropdown_menu p:hover {
  background-color: rgb(233, 233, 233);
}
.filter__input-dropdown_menu p:hover:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}
.filter__input-dropdown_menu p:hover:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
