<script setup>
import { onMounted, ref, watch } from 'vue'

const { targetDate, dataSeries, dataCategory, widthcart } = defineProps([
  'targetDate',
  'dataSeries',
  'dataCategory',
  'widthcart'
])

const chartOptions = ref({
  chart: {
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: false,
        zoom: false,
        zoomin: false,
        zoomout: false,
        pan: true,
        reset: '<i class="ri-loop-left-line"></i>'
      }
    },
    type: 'line',
    pan: {
      enabled: true,
      type: 'x'
    },
    width: 460,
    events: {
      beforeResetZoom: (chartContext, opts) => {
        return {
          xaxis: {
            min: dataCategory.length - 13,
            max: dataCategory.length
          }
        }
      },
      beforeZoom: (chartContext, opts) => {
        return {
          xaxis: {
            min: opts.xaxis.min < 0 ? 0 : opts.xaxis.min,
            max: opts.xaxis.max > dataCategory.length ? dataCategory.length : opts.xaxis.max
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    type: 'category',
    categories: dataCategory,
    position: 'start',
    axisTicks: {
      show: false
    },
    axisBorder: {
      show: true,
      color: '#000000',
      height: 1,
      offsetX: 0,
      offsetY: 0
    },
    labels: {
      show: true,
      color: '#000000',
      height: 1,
      maxWidth: 10,
      offsetX: 0
    },
    tooltip: {
      enabled: false
    },
    min: 1,
    max: 13
  },
  yaxis: {
    axisBorder: {
      show: true,
      forceNiceScale: true,
      color: '#000000',
      height: 1,
      offsetX: 0,
      offsetY: 0
    },
    labels: {
      show: true,
      align: 'right',
      color: '#000000',
      height: 1,
      offsetX: 0,
      offsetY: 2
    },
    min: 0
  },
  grid: {
    borderColor: '#000000'
  },
  legend: {
    show: false
  }
})

watch(
  dataCategory,
  (newValue, oldValue) => {
    chartOptions.value.xaxis.categories = newValue
  },
  { immediate: true }
)
</script>

<template>
  <div class="revenue-details flex fd-col gap-1 align-items-center justify-content-sb">
    <div class="revenue-details__desc flex fd-row align-items-f-start justify-content-sb w-full">
      <div class="revenue-details__desc-text flex fd-col">
        <p class="revenue-details__desc-title">Tingkat Keramaian</p>
        <p class="revenue-details__desc-subtitle">{{ targetDate }}</p>
      </div>
      <div class="revenue-details__legend">
        <div
          class="revenue-details__legend-item flex align-items-center"
          v-for="(item, index) in dataSeries"
          :key="index"
        >
          <span
            class="revenue-details__legend-color"
            :style="{ backgroundColor: item.color }"
          ></span>
          <p class="revenue-details__legend-name">{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div id="chart" class="revenue-details__chart-container">
      <apexchart
        type="line"
        height="240"
        :width="widthcart"
        :options="chartOptions"
        :series="dataSeries"
      ></apexchart>
    </div>
  </div>
</template>

<style>
.revenue-details {
  width: 565px;
  padding: 1rem;
  border-radius: 20px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.25);
  overflow-x: auto; /* Tambahkan overflow agar dapat digulir */
}

@media (min-width: 1500px) {
  .revenue-details {
    width: 565px;
  }
}
@media (max-width: 1400px) {
  .revenue-details {
    width: 535px;
  }
}

@media (max-width: 1250px) {
  .revenue-details {
    width: 499px;
  }
}
@media (max-width: 1200px) {
  .revenue-details {
    width: 665px;
  }
}

@media (max-width: 924px) {
  .revenue-details {
    width: 720px;
  }
}
@media (max-width: 900px) {
  .revenue-details {
    width: 665px;
  }
}
@media (max-width: 828px) {
  .revenue-details {
    width: 565px;
  }
}

@media (max-width: 724px) {
  .revenue-details {
    width: 510px;
  }
}
@media (max-width: 624px) {
  .revenue-details {
    width: 325px;
  }
}

.revenue-details__desc-title {
  font-size: 14px;
  line-height: 28px;
  font-weight: 600;
}

.revenue-details__desc-subtitle {
  font-size: 12px;
  line-height: 14px;
}

.revenue-details__legend {
  display: flex;
  flex-direction: column;
  margin-right: 40px;
  gap: 2px;
}

.revenue-details__legend-item {
  display: flex;
  flex-direction: row;
}

.revenue-details__legend-color {
  width: 10px;
  height: 10px;
  display: inline-block;
  margin-right: 5px;
  border-radius: 100%;
}

.revenue-details__legend-name {
  font-size: 9px;
  line-height: 14px;
}

.apexcharts-xaxis-label tspan {
  font-size: 12px;
  line-height: 18px;
  font-weight: 600;
}

.apexcharts-yaxis-label tspan {
  font-size: 14px;
  line-height: 21px;
  font-weight: 600;
}
</style>
