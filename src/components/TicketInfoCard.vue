<script setup>
import 'swiper/swiper-bundle.css'
import { onMounted } from 'vue'
import { Virtual, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import ReportHelper from '@/utilities/ReportHelper'

const { orderInfoCardData, fetchOrderInfoCardData } = ReportHelper

const getSlidesView = () => {
  const length = orderInfoCardData.value.length
  if (length > 3) return 3
  else return length
}
onMounted(() => {
  fetchOrderInfoCardData()
})
</script>

<template>
  <Swiper
    :modules="[Virtual, Pagination, Navigation]"
    :slides-per-view="getSlidesView()"
    :space-between="10"
    pagination
    navigation
    virtual
  >
    <SwiperSlide v-for="(item, index) in orderInfoCardData" :key="index">
      <div class="ticket-info-card__container flex fd-col pd-1">
        <p class="ticket-info-card__title">{{ item.category }}</p>
        <span class="ticket-info-card__details align-self-center">{{ item.sum }}</span>
        <p class="ticket-info-card__desc align-self-f-end">/ tiket</p>
      </div>
    </SwiperSlide>
  </Swiper>
</template>

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
</style>
