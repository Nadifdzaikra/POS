<script setup>
import InvoiceHelper from '@/utilities/InvoiceHelper'
import CheckoutHelper from '@/utilities/CheckoutHelper'
import GlobalHelper from '@/utilities/GlobalHelper'
import { computed } from 'vue'

const { getImageURL } = GlobalHelper
const { showPopup, closeDetailPopup, selectedItem } = InvoiceHelper
const { biayaJasa, biayaLayanan } = CheckoutHelper
const invoiceData = computed(() => selectedItem.value || {})
</script>

<template>
  <div
    class="invoice-detail__overlay w-full h-full overlay flex align-items-center justify-content-center pd-4"
    v-if="showPopup"
  >
    <div class="invoice-detail__container-content flex fd-col align-items-center">
      <div class="invoice-detail__content-header flex align-items-center">
        <div class="invoice-detail__header-img flex justify-content-center">
          <img src="../assets/images/Logo KKC.svg" alt="Logo Keraton Kasepuhan Cirebon" />
        </div>
        <div class="invoice-detail__header-data flex fd-col">
          <h6 class="fw-600">Kasir</h6>
          <p>{{ invoiceData.cashier }}</p>
          <h6 class="fw-600">Pelanggan</h6>
          <p>{{ invoiceData.customer }}</p>
          <p>{{ invoiceData.number }}</p>
        </div>
        <div class="invoice-detail__header-date flex fd-col align-items-center">
          <p class="fw-600">Jadwal Reservasi</p>
          <p>{{ invoiceData.appointment }}</p>
          <img :src="invoiceData.qr ? getImageURL(invoiceData.qr) : null" alt="QR Code" />
        </div>
      </div>
      <div class="invoice-detail__content-data w-full sm-top-1 flex fd-col pd-sd-2">
        <h6 class="fw-600">Reservasi</h6>
        <div
          class="invoice-detail__data-pesanan flex fd-col gap[0.5] sm-bottom-1"
          :class="{ expand: invoiceData.reservation.length > 3 }"
        >
          <div
            v-for="(reserve, index) in invoiceData.reservation"
            :key="index"
            :class="{ 'pd-right-1': invoiceData.reservation.length > 3 }"
            class="flex align-items-center justify-content-sb"
          >
            <div class="flex fd-col">
              <p class="to-overflow">
                {{ reserve.order }}
              </p>
              <p>Rp. {{ reserve.price }},00 x {{ reserve.amount }} Tiket</p>
              <p v-if="reserve.guide">Guide : {{ reserve.guide }}</p>
            </div>
            <div class="pesanan-harga flex fd-col align-items-f-end">
              <p>Rp. {{ reserve.totalPrice }},00</p>
              <p v-if="reserve.discountAmount > 0">- {{ reserve.discount }}</p>
            </div>
          </div>
        </div>
        <div class="invoice-detail__data-layanan flex fd-col gap[0.25] sm-top-1">
          <div class="flex justify-content-sb">
            <h6 class="fw-600">Biaya Layanan</h6>
            <p>Rp. {{ biayaLayanan }},00</p>
          </div>
          <div class="flex justify-content-sb">
            <h6 class="fw-600">Biaya Jasa Aplikasi</h6>
            <p>Rp. {{ biayaJasa }},00</p>
          </div>
          <hr />
          <div class="flex justify-content-sb">
            <div class="flex fd-col align-items-center">
              <h6 class="fw-600">Pembayaran</h6>
              <p>{{ invoiceData.payment }}</p>
            </div>
            <div class="flex fd-col align-items-center">
              <h6 class="fw-600">Total</h6>
              <p>{{ invoiceData.total }},00</p>
            </div>
          </div>
        </div>
      </div>
      <button class="invoice-detail__button fw-600" @click="closeDetailPopup">OK</button>
    </div>
  </div>
</template>

<style scoped>
h6,
p {
  cursor: default;
}

.invoice-detail__container-content {
  background-color: white;
  border-radius: 10px;
  width: 900px;
  font-family: 'Poppins';
}

.invoice-detail__content-header {
  width: 100%;
  background-color: #ffd477;
  border-radius: 10px 10px 0 0;
  padding: 20px;
  margin: 0;
}

.invoice-detail__header-img {
  height: 125px;
}

.invoice-detail__header-data {
  margin-left: 2rem;
}

.invoice-detail__header-data p {
  margin-left: 1rem;
}

.invoice-detail__header-date {
  margin-left: auto;
}

.invoice-detail__header-date img {
  height: 100px;
  width: 100px;
}

.invoice-detail__data-pesanan.expand {
  max-height: 10rem;
  overflow-y: scroll;
}
.invoice-detail__data-pesanan::-webkit-scrollbar {
  width: 4px;
}
.invoice-detail__data-pesanan::-webkit-scrollbar-track {
  background-color: lightgrey;
  border-radius: 2px;
}
.invoice-detail__data-pesanan::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.invoice-detail__button {
  background-color: #ffe29a;
  font-family: 'Poppins';
  font-size: 16px;
  width: 120px;
  height: 40px;
  border-radius: 5px;
  border: none;
  padding: 10px 20px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.invoice-detail__button:hover {
  background-color: #ffd477;
}
</style>
