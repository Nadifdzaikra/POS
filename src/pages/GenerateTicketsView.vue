<script setup>
import { onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import GlobalHelper from '@/utilities/GlobalHelper'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import CheckoutHelper from '@/utilities/CheckoutHelper'
import DashboardHelper from '@/utilities/DashboardHelper'
import LoginHelper from '@/utilities/LoginHelper'
import html2pdf from 'html2pdf.js'

const { DB_BASE_URL, TRANSACTION_BASE_URL, showLoader, getImageURL } = GlobalHelper
const { ticketsData, emailCooldown, sendEmailToUser } = CheckoutHelper

const router = useRouter()
const route = useRoute()
const generatePDFcooldown = ref(false)

const formatCurrency = (amount) => {
  return Number(amount).toLocaleString('id-ID')
}

const calculateTotal = (price, amount) => {
  return formatCurrency(price * amount)
}

const toHomepage = async () => {
  LoginHelper.userCarts.value = []
  await DashboardHelper.saveToUserCarts()
  await router.replace('/')
}

const fetchTickets = async (id) => {
  try {
    showLoader.value = true
    const response = await fetch(
      `${DB_BASE_URL.value}/${TRANSACTION_BASE_URL.value}/generate-tickets/${encodeURIComponent(id)}`
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    ticketsData.value = res.data
    console.log(ticketsData.value)
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const isLoading = ref(false)
const generatePDF = async () => {
  try {
    const element = document.getElementById('ticket')
    console.log(element)
    isLoading.value = true
    element.style.display = 'block'

    // Use html2canvas to capture the element
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const canvasWidth = canvas.width
    const canvasHeight = canvas.height

    // Create a PDF with the same dimensions as the canvas
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [canvasWidth, canvasHeight]
    })

    // Add the image to the PDF
    pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight)

    // Auto print the PDF
    pdf.autoPrint()

    // Hide the element again
    element.style.display = 'none'

    // Get the PDF as a blob
    const blob = pdf.output('blob')

    // Open the PDF in a new tab and trigger the print dialog
    const pdfUrl = URL.createObjectURL(blob)
    const pdfWindow = window.open(pdfUrl)
    pdfWindow.onload = function () {
      pdfWindow.print()
    }

    isLoading.value = false
  } catch (err) {
    console.log(err)
    isLoading.value = false
  }
}

// const generatePDF = async () => {
//   try{
//     const element = document.getElementById('ticket');
//     console.log(element)
//       const canvas = await html2canvas(element);
//       const imgData = canvas.toDataURL('image/png');
//       const canvasWidth = canvas.width;
//       const canvasHeight = canvas.height;

//       // Create a PDF with the same dimensions as the canvas
//       const pdf = new jsPDF({
//         orientation: 'portrait',
//         unit: 'pt',
//         format: [canvasWidth, canvasHeight]
//       });

//       // Add the image to the PDF
//       pdf.addImage(imgData, 'PNG', 0, 0, canvasWidth, canvasHeight);
//       pdf.save('ticket.pdf')
//       pdf.autoPrint()
//   }catch(err){
//     console.log(err)
//   }
// }

onMounted(() => {
  fetchTickets(route.params.id)
})
</script>

<template>
  <div class="generate-tickets__container flex fd-col h-full">
    <div class="generate-tickets__header flex align-items-center pd-1">
      <h3 class="fw-600">Generate Tickets</h3>
    </div>
    <div class="generate-tickets__content pd-sd-2 pd-block-1">
      <div class="preview flex fd-col gap-1 pd-1">
        <h5>Pratinjau</h5>
        <div
          v-for="(ticket, index) in ticketsData.detailTrans"
          :key="index"
          class="generate-tickets__detail-transaction flex justify-content-sb"
        >
          <div class="flex gap-1">
            <img
              :src="
                ticket.order.image
                  ? getImageURL(ticket.order.image)
                  : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
              "
              class="generate-tickets__detail-transaction-image"
            />
            <div class="flex fd-col">
              <p class="fw-600">{{ `${ticket.order.name} (${ticket.order.category.name})` }}</p>
              <p>{{ `${formatCurrency(ticket.order.price)} x ${ticket.amount} Tiket` }}</p>
              <p>Rp {{ calculateTotal(ticket.order.price, ticket.amount) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div></div>

    <div
      class="generate-tickets__cta-container flex align-items-center justify-content-center gap-1"
    >
      <button
        class="generate-tickets__btn-print flex align-items-center gap[0.5]"
        @click="generatePDF"
        v-if="!generatePDFcooldown"
      >
        <p class="fw-700">Print Tickets</p>
        <ph-printer :size="32" />
      </button>
      <div v-else>
        <p class="fw-700">Generate PDF<span class="send-email__text-cooldown"></span></p>
      </div>
      <button class="generate-tickets__btn-email">
        <div
          v-if="!emailCooldown"
          @click="sendEmailToUser()"
          class="flex align-items-center gap[0.5]"
        >
          <p class="fw-700">Kirim ke Email</p>
          <ph-paper-plane-tilt :size="32" />
        </div>
        <div v-else>
          <p class="fw-700">Mengirim Email<span class="send-email__text-cooldown"></span></p>
        </div>
      </button>
    </div>
    <button
      class="generate-tickets__return-btn flex align-self-center align-items-center justify-content-center gap[0.5] sm-top-2"
      @click="toHomepage"
    >
      <ph-caret-left :size="16" weight="bold" />
      <p>Kembali ke Dashboard</p>
    </button>
    <div v-if="isLoading" class="loading-overlay">
      <div class="loading-spinner"></div>
    </div>
    <!-- <div>
      <div ref="dataRef" id="ticket" style="width: fit-content; height: fit-content">
        <div>
          <div style="display: grid; width: 100%; overflow-x: auto; flex-wrap: wrap">
            <div style="gap: 5px">
              <section class="ticket">
                <div style="display: block; width: 100%; justify-content: center">
                  <div style="display: flex; width: 100%">
                    <img src="../assets/images/logo.png" alt="Keraton Kasepuhan Cirebon" style="
                        width: 150px;
                        height: 150px;
                        margin-inline: auto;
                        margin-top: 10px;
                        margin-bottom: 10px;
                      " />
                  </div>
                  <div style="width: 90%; margin: auto">
                    <h5>
                      Jl. Kasepuhan No.43, Kasepuhan, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat
                    </h5>
                    <p class="desc">Selamat datang di wisata Keraton Kesepuhan Cirebon</p>
                    <p class="desc">
                      {{
          `${ticketsData.plannedDate ? ticketsData.plannedDate.split('T')[0] : '0%'}`
        }}
                    </p>
                  </div>
                  <section class="separator" style="margin-inline: auto; margin-top: 20px; padding-bottom: 5px">
                  </section>
                  <div style="width: 90%; margin: auto" v-for="(ticket, index) in ticketsData.detailTrans" :key="index">
                    <div style="display: flex; justify-content: space-between; width: 100%">
                      <p class="descList">
                        {{
          `${ticket.order.name} (${ticket.order.category.name}) x ${ticket.amount} Tiket`
        }}
                      </p>
                      <p class="descList" style="
                          display: inline;
                          max-width: 40%;
                          text-align: right;
                          height: fit-content;
                          word-break: break-all;
                        ">
                        {{ `Rp.${formatCurrency(ticket.order.price)}` }}
                      </p>
                    </div>
                  </div>
                  <section class="separator" style="margin-inline: auto; margin-top: 20px; padding-bottom: 5px">
                  </section>
                  <div style="
                      display: flex;
                      justify-content: space-between;
                      width: 90%;
                      margin-inline: auto;
                    ">
                    <p class="descList">Pembayaran</p>
                    <p class="descList" style="
                        display: inline;
                        max-width: 40%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      ">
                      {{ `${ticketsData.method}` }}
                    </p>
                  </div>
                  <div style="
                      display: flex;
                      justify-content: space-between;
                      width: 90%;
                      margin-inline: auto;
                    ">
                    <p class="descList">Potongan</p>
                    <p class="descList" style="
                        display: inline;
                        max-width: 40%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      ">
                      {{ `${ticketsData.discount ? ticketsData.discount.split('|')[1] : '0%'}` }}
                    </p>
                  </div>
                  <div style="
                      display: flex;
                      justify-content: space-between;
                      width: 90%;
                      margin-inline: auto;
                    ">
                    <p class="descList">Cashback</p>
                    <p class="descList" style="
                        display: inline;
                        max-width: 40%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      ">
                      {{ `${ticketsData.cashback ? ticketsData.cashback.split('|')[1] : '0%'}` }}
                    </p>
                  </div>
                  <div style="
                      display: flex;
                      justify-content: space-between;
                      width: 90%;
                      margin-inline: auto;
                    ">
                    <p class="descList">Total</p>
                    <p class="descList" style="
                        display: inline;
                        max-width: 50%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      ">
                      {{ `Rp.${formatCurrency(+ticketsData.total + ticketsData.additionalFee)}` }}
                    </p>
                  </div>
                  <div style="width: 70%; margin: auto">
                    <h5 style="text-transform: uppercase; font-size: small">Enjoy The Tour !</h5>
                  </div>
                  <div style="width: 90%; margin: auto" v-for="(ticket, index) in ticketsData.BarcodeUsage"
                    :key="index">
                    <div style="display: flex; width: 100%">
                      <img id="qrImage" :src="ticket.qrPath ? ticket.qrPath : '../assets/images/testqr.jpg'" style="
                          width: 200px;
                          height: 200px;
                          margin-inline: auto;
                          margin-top: 10px;
                          margin-bottom: 10px;
                        " alt="Keraton Kasepuhan Cirebon" />
                    </div>
                  </div>
                  <div style="width: 100%; margin: auto">
                    <h5 style="font-size: 10px">www.KeratonKesepuhanCirebon.com</h5>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <div style="visibility: hidden">
      <div ref="dataRef" id="ticket" style="width: fit-content; height: fit-content">
        <div>
          <div style="display: grid; width: 100%; overflow-x: auto; flex-wrap: wrap">
            <div style="gap: 5px">
              <section class="ticket">
                <div style="display: block; width: 100%; justify-content: center">
                  <div style="display: flex; width: 100%">
                    <img
                      src="../assets/images/logo.png"
                      alt="Keraton Kasepuhan Cirebon"
                      style="
                        width: 120px;
                        height: 120px;
                        margin-inline: auto;
                        margin-top: 10px;
                        margin-bottom: 10px;
                      "
                    />
                  </div>
                  <div style="width: 90%; margin: auto">
                    <h5>
                      Jl. Kasepuhan No.43, Kasepuhan, Kec. Lemahwungkuk, Kota Cirebon, Jawa Barat
                    </h5>
                    <p class="desc">Selamat datang di wisata Keraton Kesepuhan Cirebon</p>
                    <p class="desc">
                      {{ ticketsData.plannedDate ? ticketsData.plannedDate.split('T')[0] : '0%' }}
                    </p>
                  </div>
                  <section class="separator" style="margin-inline: auto; margin-top: 8px"></section>
                  <div
                    style="width: 95%; margin: auto"
                    v-for="(ticket, index) in ticketsData.detailTrans"
                    :key="index"
                  >
                    <div style="display: flex; justify-content: space-between; width: 100%">
                      <p class="descList">
                        {{
                          `${ticket.order.name} (${ticket.order.category.name}) x ${ticket.amount} Tiket`
                        }}
                      </p>
                      <p
                        class="descList"
                        style="
                          display: inline;
                          max-width: 45%;
                          text-align: right;
                          height: fit-content;
                          word-break: break-all;
                        "
                      >
                        {{ `Rp.${formatCurrency(ticket.order.price)}` }}
                      </p>
                    </div>
                  </div>
                  <section class="separator" style="margin-inline: auto; margin-top: 8px"></section>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 95%;
                      margin-inline: auto;
                    "
                  >
                    <p class="descList">Pembayaran</p>
                    <p
                      class="descList"
                      style="
                        display: inline;
                        max-width: 40%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      "
                    >
                      {{ ticketsData.method }}
                    </p>
                  </div>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 95%;
                      margin-inline: auto;
                    "
                  >
                    <p class="descList">Potongan</p>
                    <p
                      class="descList"
                      style="
                        display: inline;
                        max-width: 40%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      "
                    >
                      {{ ticketsData.discount ? ticketsData.discount.split('|')[1] : '0%' }}
                    </p>
                  </div>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 95%;
                      margin-inline: auto;
                    "
                  >
                    <p class="descList">Cashback</p>
                    <p
                      class="descList"
                      style="
                        display: inline;
                        max-width: 40%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      "
                    >
                      {{ ticketsData.cashback ? ticketsData.cashback.split('|')[1] : '0%' }}
                    </p>
                  </div>
                  <div
                    style="
                      display: flex;
                      justify-content: space-between;
                      width: 90%;
                      margin-inline: auto;
                    "
                  >
                    <p class="descList">Total</p>
                    <p
                      class="descList"
                      style="
                        display: inline;
                        max-width: 50%;
                        text-align: right;
                        height: fit-content;
                        word-break: break-all;
                      "
                    >
                      {{ `Rp.${formatCurrency(+ticketsData.total + ticketsData.additionalFee)}` }}
                    </p>
                  </div>
                  <div style="width: 70%; margin: auto">
                    <!-- <h5>Total Items: {{ `${ticketsData.detailTrans.length}` }}</h5> -->
                    <h5 style="text-transform: uppercase; font-size: x-small">Enjoy The Tour !</h5>
                  </div>
                  <div
                    style="width: 90%; margin: auto"
                    v-for="(ticket, index) in ticketsData.BarcodeUsage"
                    :key="index"
                  >
                    <div style="display: flex; width: 100%">
                      <img
                        id="qrImage"
                        :src="ticketsData.qrImage"
                        style="
                          width: 140px;
                          height: 140px;
                          margin-inline: auto;
                          margin-top: 5px;
                          margin-bottom: 5px;
                        "
                        alt="Keraton Kasepuhan Cirebon"
                      />
                    </div>
                  </div>
                  <div style="width: 100%; margin: auto">
                    <h5 style="font-size: 10px">www.KeratonKesepuhanCirebon.com</h5>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.generate-tickets__return-btn {
  background-color: var(--color-primary);
  width: fit-content;
  padding: 0.5rem;
  border-radius: 0.5rem;
}

.generate-tickets__header {
  border-bottom: 1px solid black;
}

.generate-tickets__detail-transaction {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.generate-tickets__detail-transaction-image {
  height: 70px;
  width: 100px;
}

.generate-tickets__detail-transaction-btn {
  padding: 0.5rem;
  background-color: var(--color-primary);
  border-radius: 0.25rem;
}

.generate-tickets__btn-print,
.generate-tickets__btn-email {
  min-width: 12rem;
  height: 5rem;
  border: 2px solid #e6be58;
  padding: 1rem 2rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.generate-tickets__btn-print:hover,
.generate-tickets__btn-email:hover {
  border-color: #ffdd8f;
}

.send-email__text-cooldown::after {
  content: '.';
  animation: loadingDots 1.5s infinite;
}

@keyframes loadingDots {
  0% {
    content: '.';
  }

  33% {
    content: '..';
  }

  66% {
    content: '...';
  }
}

.send-email-overview__modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

/* ticket design new */
.ticket {
  width: 256px;
  height: fit-content;
}

.ticket h5 {
  font-size: x-small;
  padding: 5px;
  line-height: 1.5;
  font-weight: 600;
  text-align: center;
}

.ticket .desc {
  font-size: small;
  padding: 5px;
  font-size: x-small;
  width: 80%;
  margin: auto;
  line-height: 1.5;

  text-align: center;
}

.descList {
  font-size: small;
  padding: 5px;
  font-size: x-small;
  width: 100%;
  margin: auto;
  line-height: 1.5;
  text-align: left;
}

.separator {
  width: 90%;
  border-bottom: 2px dashed #000;
  margin: 5px 0;
}

@media print {
  .only-pdf {
    page-break-after: always;
    display: block !important;
  }
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-spinner {
  border: 8px solid rgba(0, 0, 0, 0.1);
  border-left-color: #000;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
