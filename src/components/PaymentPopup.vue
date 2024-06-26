<script setup>
import { ref, computed } from 'vue'
import PaymentDropdown from './PaymentDropdown.vue'
import logoBJB from '@/assets/images/logoBJB.png'

const { totalPayment } = defineProps(['totalPayment'])
const virtualAccount = ref(8883123456789012)

const showPopup = ref(false)

const showPaymentPopup = () => {
  showPopup.value = true
}

const closePopup = () => {
  showPopup.value = false
}

const copyContent = (content) => {
  if (content === 'copyVirtualAccount') {
    navigator.clipboard
      .writeText(virtualAccount.value)
      .then(() => {
        console.log('Konten berhasil disalin!')
      })
      .catch((err) => {
        console.error('Gagal menyalin konten:', err)
      })
  } else {
    navigator.clipboard
      .writeText(totalPayment.trim())
      .then(() => {
        console.log('Konten berhasil disalin!')
      })
      .catch((err) => {
        console.error('Gagal menyalin konten:', err)
      })
  }
}

const displayedVirtualAccount = computed(() => {
  const virtualAccountString = virtualAccount.value.toString()
  const firstDigits = virtualAccountString.substring(0, 4)
  return firstDigits + 'xxxxxxxx'
})
defineExpose({
  showPaymentPopup
})
</script>

<template>
  <main>
    <div class="waiting-payment__container">
      <div v-if="showPopup" class="waiting-payment__content-overlay">
        <div class="waiting-payment__container-content">
          <div class="waiting-payment__content-header">
            <p class="fs-h5 fw-700">Cara Pembayaran</p>
            <span @click="closePopup" class="waiting-payment__close-button">
              <ph-x :size="24" weight="bold" class="icon"/>
            </span>
          </div>
          <div class="waiting-payment__content-data">
            <div class="waiting-payment__content-desc">
              <p class="fs-h4">BJB Virtual Account</p>
              <img :src="logoBJB" alt="logoBJB" />
            </div>
            <div class="waiting-payment__content-desc">
              <div class="waiting-payment__content-sub fs-h5">
                <p style="color: rgba(94, 94, 94, 1)">Nomor Virtual Account</p>
                <p ref="copyVirtualAccount">{{ displayedVirtualAccount }}</p>
              </div>
              <span class="waiting-payment__copy-desc" @click="copyContent('copyVirtualAccount')">
                Salin <ph-clipboard-text :size="32" weight="bold" class="icon" />
              </span>
            </div>

            <div class="waiting-payment__content-desc">
              <div class="waiting-payment__content-sub fs-h5">
                <p style="color: rgba(94, 94, 94, 1)">Total Pembayaran</p>
                <p ref="copyTotalPayment">
                  Rp. <span>{{ totalPayment }}</span>
                </p>
              </div>
              <span class="waiting-payment__copy-desc" @click="copyContent('copyTotalPayment')">
                Salin <ph-clipboard-text :size="32" weight="bold" class="icon" />
              </span>
            </div>
            <div>
              <PaymentDropdown />
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
main {
  font-family: 'Raleway';
}

.waiting-payment__content-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.waiting-payment__container-content {
  position: relative;
  background-color: white;
  border-radius: 10px;
  width: 671px;
  height: 512px;
  display: flex;
  flex-direction: column;
}
.waiting-payment__content-header {
  display: flex;
  flex-direction: row;
  height: 73px;
  padding: 1.5rem 3rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(208, 213, 221, 1);
}
.waiting-payment__close-button {
  font-size: 32px;
  color: rgba(52, 51, 48, 1);
}
.waiting-payment__close-button:hover {
  opacity: 0.5;
}
.waiting-payment__content-data {
  display: flex;
  flex-direction: column;
  padding: 2rem 3rem;
  gap: 1rem;
  overflow-y: auto;
}
.waiting-payment__content-desc {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.waiting-payment__content-desc img {
  width: 58px;
  height: 28px;
}
.waiting-payment__copy-desc {
  color: rgba(218, 165, 32, 1);
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}
.waiting-payment__copy-desc i {
  font-size: 32px;
}
.waiting-payment__copy-desc:hover {
  filter: brightness(70%);
}
.waiting-payment__content-sub {
  display: flex;
  flex-direction: column;
}
</style>
