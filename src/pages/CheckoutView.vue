<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Slider from '@/components/Slider.vue'
import NationalityDropdown from '@/components/NationalityDropdown.vue'
import CheckoutHelper from '@/utilities/CheckoutHelper'
import DashboardHelper from '@/utilities/DashboardHelper'
import LoginHelper from '@/utilities/LoginHelper'
import GlobalHelper from '@/utilities/GlobalHelper'
import cityName from '../utilities/stores/globalParam'

const router = useRouter()

const {
  getUserCarts,
  paymentSelection,
  paymentSelect,
  showPaymentSelect,
  selectPayment,
  addTicket,
  asalKota,
  reduceTicket,
  custName,
  custEmail,
  selectedDate,
  discountValue,
  cashbackValue,
  nationalityData,
  biayaLayanan,
  biayaJasa,
  biayaJasaCard,
  maxTickets,
  getFlagImageUrl,
  fetchFeeSettings,
  fetchTaxes,
  listOfTaxes,
  formatCurrency,
  totalHarga,
  totalTagihan,
  totalBiaya,
  totalTicketCount,
  recentTransactionId,
  nationalityResult,
  createTransaction,
  fetchNationalityData,
  loadNationalityData,
  selectedNationality,
  inputDomestik,
  checkoutStatus,
  guideData,
  guideSelect,
  guideSelection,
  guideSelectPageBio,
  guideSelectBio,
  guideSelectPage,
  guideSelectors,
  selectedGuide,
  guideSelectTicket,
  guideSelectPageTicket,
  addGuide,
  isGuideChecked,
  formattedGuideSelection,
  fetchGuideData,
  determineAge,
  formatGender,
  fetchUnavailableGuide,
  checkGuideAvailability
} = CheckoutHelper


const { grantAccessRoute, assignAlert, getImageURL } = GlobalHelper
const { isMancanegara, isDomestik, saveToUserCarts, checkUserCarts } = DashboardHelper
const { userData, userCarts } = LoginHelper
const checkoutTransaction = async () => {
  const invalid = checkValidTransaction()
  if (totalTicketCount.value < 1) {
    assignAlert(true, 'Error', 'danger', 'Pilih tipe tiket terlebih dahulu')
    return
  }
  if (invalid.length > 0) {
    assignAlert(true, 'Error', 'danger', `Isi kolom ${invalid.join(', ')} terlebih dahulu.`)
    return
  }

  try {
    await createTransaction()
    if (checkoutStatus.value === 'boleh') {
      sessionStorage.clear()
      showTransactionGenerate()
      assignAlert(true, 'Sukses', 'success', 'Transaksi berhasil dibuat!')
    }
    checkoutStatus.value = ''
  } catch (error) {
    assignAlert(true, 'Error', 'danger', 'Transaksi gagal!')
  }
}
const checkValidTransaction = () => {
  const invalid = []

  if (!custName.value) invalid.push('Nama Pelanggan')
  if (!custEmail.value) invalid.push('Email Pelanggan')
  // if (isDomestik.value) {
  //   if (!inputDomestik.value) {
  //     invalid.push('Daerah')
  //   }
  // }
  if (!selectedDate.value) invalid.push('Tanggal Pemesanan')
  if (!paymentSelection.value) invalid.push('Metode Pembayaran')
  return invalid
}

// Pop up untuk generate tiket
const isTransactionGenerate = ref(false)
const showTransactionGenerate = () => {
  isTransactionGenerate.value = true
}

function selectAll(event) {
  event.target.select()
}

const updateAmount = (amount, index) => {
  if (amount >= maxTickets.value) {
    assignAlert(
      true,
      'Error',
      'danger',
      `Maaf, tiket tidak bisa melebihi ${maxTickets.value} tiket!`
    )
    userCarts.value[index].amount = maxTickets.value
  } else if (amount === '') {
    userCarts.value[index].amount = 1
  } else if (userCarts.value[index].amount === 0) {
    userCarts.value.splice(index, 1)
  } else {
    userCarts.value[index].amount = amount
  }
  saveToUserCarts()
}

const toGenerateTickets = async () => {
  grantAccessRoute(true)
  await router.push({ name: 'generateTickets', params: { id: recentTransactionId.value } })
}

const fetchAllData = async () => {
  await fetchGuideData()
  await fetchTaxes()
  getUserCarts()
  checkUserCarts()
  fetchFeeSettings()
  fetchNationalityData()
  console.log(nationalityResult.value)
}

const formatTax = (tax) => {
    console.log(tax)
      return tax.multiply ? totalTagihan.value * tax.tax : totalTagihan.value + tax.tax
    }

onMounted(() => {
  fetchAllData().then(() => {
    const date = new Date();
    date.setHours(date.getHours() + 1); // Add 1 hour to the current date and time
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000)); // Adjust for local timezone
    selectedDate.value = localDate
  })
})

</script>

<template>
  <main class="pd-sd-2">
    <div class="checkout__container w-full flex align-items-f-start justify-content-sb gap-2">
      <div class="checkout__form-container w-full">
        <div class="order-details__container">
          <form>
            <div class="order-details__checkout flex fd-col gap[0.5]">
              <h4>Pemesanan Langsung</h4>
              <div class="order-details__cashier flex fd-col">
                <div class="order-details__content w-full flex gap[0.5]">
                  <ph-devices :size="24" weight="bold" color="#e6be58" />
                  <p>Detail Kasir</p>
                </div>
                <div class="order-details__content w-full flex gap[0.5] align-items-center">
                  <p class="fs-h5 fw-700">{{ userData.name }}</p>
                  <p>({{ userData.email }})</p>
                </div>
              </div>
              <div class="order-details__customer">
                <div class="order-details__content w-full flex gap[0.5]">
                  <ph-user :size="24" weight="bold" color="#e6be58" />
                  <p>Detail Pelanggan</p>
                </div>
                <div class="order-details__customer-input flex gap-1">
                  <div class="customer-details__input-placeholder">
                    <input type="text" required rows="1" v-model="custName" id="name" autocomplete="name" />
                    <label for="name">Nama Pelanggan</label>
                  </div>
                  <div class="customer-details__input-placeholder">
                    <input type="email" required rows="1" v-model="custEmail" id="email" autocomplete="email" />
                    <label for="email">Email Pelanggan</label>
                  </div>
                </div>
              </div>
              <div class="order-details__ticket flex fd-col gap[0.5]">
                <div class="order-details__content w-full flex gap[0.5]">
                  <ph-ticket :size="24" weight="bold" color="#e6be58" />
                  <p>Detail Tiket</p>
                </div>
                <div class="order-details__ticket-date">
                  <div class="ticket__input-placeholder">
                    <input type="datetime-local" class="ticket__input-date" v-model="selectedDate"
                      @input="fetchUnavailableGuide()" id="date" />
                    <label for="date">Tanggal Pemesanan</label>
                  </div>
                </div>
                <div v-for="(item, index) in userCarts" :key="index">
                  <div class="order-details__ticket" v-if="item.amount > 0">
                    <div class="order-details__ticket-items">
                      <h6>{{ item.name }} ({{ item.category.name }})</h6>
                      <span class="fs-h6">{{ formatCurrency(item.price) }}</span>
                    </div>
                    <div class="order-details__ticket-value flex align-items-center gap-1">
                      <button class="flex align-items-center justify-content-center" @click="reduceTicket(index)"
                        type="button">
                        <ph-minus :size="14" weight="bold" />
                      </button>
                      <input type="number" class="order-details__ticket-input" v-model="userCarts[index].amount"
                        @input="updateAmount(userCarts[index].amount, index)" @focus="selectAll($event)" min="1" />
                      <button class="flex align-items-center justify-content-center" @click="addTicket(index)"
                        type="button">
                        <ph-plus :size="14" weight="bold" />
                      </button>

                      <!-- <div
                        class="customer-details__input-placeholder"
                        v-if="item.category.name === 'Umum'"
                      >
                        <input
                          type="text"
                          required
                          rows="1"
                          v-model="item.cityName"
                          id="kota"
                          autocomplete="Akota"
                        />
                        <div v-for="(name, i) in cityName.kotaIndonesia" :key="i">
                          <div class="nationality-item" @click="chooseCity(name, index)">
                            <p class="dropdown-nationality__name">{{ name }}</p>
                          </div>
                        </div>
                      </div> -->
                      <div style="margin-right: 1rem; position: relative"
                        v-if="item.category.name === 'Umum' || item.category.name === 'Pelajar'">
                        <label for="city-select" style="
                            position: absolute;
                            top: -0.75rem;
                            left: 0.5rem;
                            background: white;
                            padding: 0 0.25rem;
                            font-size: 14px;
                            color: #000;
                          ">
                          Pilih Kota Asal
                        </label>
                        <select id="city-select" style="
                            height: 2.2rem;
                            border: 2px solid rgba(0, 0, 0, 1);
                            border-radius: 0.2rem;
                            padding-left: 0.5rem;
                            width: 100%;
                          " v-model="item.cityName">
                          <option value="" disabled selected>Pilih Kebangsaan</option>
                          <option v-for="result in cityName.kotaIndonesia" :key="result" :value="result">
                            {{ result }}
                          </option>
                        </select>
                      </div>
                      <div>
                        <!-- <div
                          class="order-details__dropdown"
                          v-if="item.category.name === 'Mancanegara'"
                          style="margin-right: 1rem"
                        >
                          <input v-model="item.nationalityId" type="text" />
                          <div v-for="result in nationalityData" :key="result.id">
                            <div class="nationality-item" @click="chooseNationality(result, index)">
                              <img :src="getFlagImageUrl(result.code)" class="flag-icon" />
                              <p class="dropdown-nationality__name">{{ result.name }}</p>
                            </div>
                          </div>
                        </div> -->
                        <div style="margin-right: 1rem; position: relative" v-if="item.category.name === 'Mancanegara'">
                          <label for="nationality-select" style="
                              position: absolute;
                              top: -0.75rem;
                              left: 0.5rem;
                              background: white;
                              padding: 0 0.25rem;
                              font-size: 14px;
                              color: #000;
                            ">
                            Pilih Kebangsaan
                          </label>
                          <select id="nationality-select" style="
                              height: 2.2rem;
                              border: 2px solid rgba(0, 0, 0, 1);
                              border-radius: 0.2rem;
                              padding-left: 0.5rem;
                              width: 100%;
                            " v-model="item.nationalityId">
                            <option value="" disabled selected>Pilih Kebangsaan</option>
                            <option v-for="result in nationalityData" :key="result.id" :value="result.id">
                              <img :src="getFlagImageUrl(result.code)" class="flag-icon" />
                              {{ result.name }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="pricings-slider__container">
                <div class="discount__slider flex fd-col">
                  <p class="fw-500">Diskon</p>
                  <Slider v-model:targetValue="discountValue" sliderWidth="216px" />
                </div>
                <div class="discount__slider flex fd-col">
                  <p class="fw-500">Cashback</p>
                  <Slider v-model:targetValue="cashbackValue" sliderWidth="216px" />
                </div>
              </div>
              <div class="order-details__content flex gap[0.5]">
                <ph-wallet :size="24" weight="bold" color="#e6be58" />
                <p>Pilih Pembayaran</p>
              </div>
              <div class="order-details__payment-select" @click="showPaymentSelect">
                <div v-if="paymentSelection" class="order-details__payment-select-content if">
                  <div class="flex align-items-center gap[0.5]">
                    <ph-money :size="16" weight="bold" v-if="paymentSelection === 'Cash'" />
                    <ph-credit-card :size="16" weight="bold" v-else />
                    {{ paymentSelection }}
                  </div>
                </div>
                <div v-else class="order-details__payment-select-content else">
                  <ph-warning-octagon :size="16" weight="fill" color="red" />
                  <p>Anda belum memilih metode pembayaran</p>
                </div>
                <ph-caret-right :size="16" weight="bold" />
              </div>

              <div class="order-details__content flex gap[0.5] sm-top-1">
                <ph-binoculars :size="24" weight="bold" color="#e6be58" />
                <p>Pilih Pemandu</p>
              </div>
              <div class="order-details__guide-select" @click="guideSelectPage">
                <div v-if="guideSelection.length > 0" class="order-details__guide-select-content if">
                  <div class="flex align-items-center gap[0.5]">
                    {{ formattedGuideSelection }}
                  </div>
                </div>
                <div v-else class="order-details__guide-select-content else">
                  <ph-warning-octagon :size="16" weight="fill" color="red" />
                  <p>Anda belum memilih pemandu</p>
                </div>
                <ph-caret-right :size="16" weight="bold" />
              </div>

              <section class="order-details__select-content_modal-overlay" v-if="paymentSelect"
                @click="paymentSelect = false">
                <div class="order-details__payment-select-content_modal">
                  <div
                    class="order-details__payment-select-content_modal-header pd-1 flex justify-content-sb align-items-center">
                    <h5 class="fw-600">Pilih Metode Pembayaran</h5>
                    <ph-x class="cursor-pointer" :size="20" weight="bold" @click="showPaymentSelect" />
                  </div>
                  <div
                    class="order-details__payment-select-content_modal-content flex fd-col gap[0.5] pd-bottom-2 pd-sd-1 pd-top-1">
                    <button @click="selectPayment('Cash')">
                      <span><ph-money :size="16" weight="bold" />
                        <h6>Cash</h6>
                      </span>
                      <ph-caret-right :size="16" weight="bold" />
                    </button>
                    <button @click="selectPayment('Kartu Kredit/Debit')">
                      <span><ph-credit-card :size="16" weight="bold" />
                        <h6>Kartu Kredit/Debit</h6>
                      </span>
                      <ph-caret-right :size="16" weight="bold" />
                    </button>
                  </div>
                </div>
              </section>

              <section class="order-details__select-content_modal-overlay" v-if="guideSelect">
                <div class="order-details__guide-select-content_modal sm-4">
                  <div
                    class="order-details__guide-select-content_modal-header flex align-items-center justify-content-sb pd-1">
                    <h5 class="fw-600">Pemandu</h5>
                    <ph-x class="cursor-pointer" :size="20" weight="bold" @click="guideSelectPage" />
                  </div>
                  <div class="order-detail__guide-select-content_modal-content relative pd-sd-2 pd-top-2 pd-bottom-2"
                    :class="{ grid: guideSelectors }">
                    <div v-if="guideSelectors" style="display: flex; flex-wrap: wrap; gap: 1rem">
                      <div v-for="(guide, index) in guideData" :key="index"
                        class="order-detail__guide-select-content_guide-selector flex">
                        <span class="flex align-items-center gap[0.5] pd[0.5]" style="width: 10rem" @click.prevent>
                          <div class="order-detail__guide-select-content_guide-selector_radio">
                            <div v-if="isGuideChecked(guide.id)" class="selected"></div>
                          </div>
                          <label :for="guide.name">{{ guide.name }}</label>
                        </span>
                        <div v-if="!checkGuideAvailability(guide.id)"
                          class="bg-yellow flex align-items-center pd[0.5] cursor-pointer"
                          @click="guideSelectPageBio(guide)">
                          <ph-caret-right :size="16" weight="bold" />
                        </div>
                        <div v-else class="bg-yellow flex align-items-center pd[0.5] cursor-pointer" @click="
                    assignAlert(
                      true,
                      'Error',
                      'danger',
                      `Guide ${guide.name} tidak tersedia!`
                    )
                    ">
                          <ph-caret-right :size="16" weight="bold" />
                        </div>
                      </div>
                    </div>
                    <div class="order-details__guide-select_biodata relative" v-if="guideSelectBio">
                      <div
                        class="order-details__guide-select_breadcrumb flex align-items-center gap-1 sm-bottom-1 cursor-pointer"
                        @click="guideSelectPageBio">
                        <ph-caret-left :size="16" weight="bold" />
                        <h6>Kembali</h6>
                      </div>

                      <div class="guide-select_biodata-content flex gap-2">
                        <div class="">
                          <img :src="selectedGuide.image
                    ? getImageURL(selectedGuide.image)
                    : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
                    " class="guide-select_biodata-image" />
                          <div class="flex justify-content-sb">
                            <div class="guide-select_biodata_add-ticket w-full" @click="guideSelectPageTicket">
                              Tambahkan Tiket<ph-caret-right :size="16" weight="bold" />
                            </div>
                          </div>
                        </div>

                        <div class="guide-select_biodata-information flex fd-col gap-1">
                          <div>
                            <h6>
                              {{ selectedGuide.name }} ({{ formatGender(selectedGuide.gender) }})
                            </h6>
                            <p>{{ `${determineAge(selectedGuide.birthdate)} Tahun` }}</p>
                            <p>{{ selectedGuide.email }}</p>
                          </div>
                          <p>
                            {{ selectedGuide.desc ? selectedGuide.desc : 'Tidak ada deskripsi' }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="order-details__guide-select_ticket relative" v-if="guideSelectTicket">
                      <div
                        class="order-details__guide-select_breadcrumb flex align-items-center gap-1 sm-bottom-1 cursor-pointer"
                        @click="guideSelectPageTicket">
                        <ph-caret-left :size="16" weight="bold" />
                        <h6>Kembali</h6>
                      </div>

                      <div v-for="(item, index) in userCarts" :key="index"
                        class="guide-select_ticket flex justify-content-sb sm-bottom-1">
                        <div class="flex gap-1">
                          <img :src="item.image
                    ? getImageURL(item.image)
                    : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
                    " class="guide-select_ticket-image" />
                          <div class="flex fd-col">
                            <p class="fw-600">{{ item.name }}</p>
                            <p>{{ formatCurrency(item.price) }}</p>
                            <p>{{ `${item.amount} Tiket` }}</p>
                          </div>
                        </div>
                        <div class="guide-select_ticket-cta flex align-items-center">
                          <button class="guide-select_ticket-btn flex align-items-center"
                            @click.prevent="addGuide(index)">
                            <ph-plus :size="16" weight="bold" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </form>
        </div>
      </div>
      <div class="checkout__details-container pd-2 w-full">
        <div class="checkout__details-content w-full">
          <form class="checkout__details-form" @submit.prevent="submitRingkasan">
            <p class="fs-h5">Ringkasan Booking</p>
            <div class="checkout__details-pricing-container">
              <p class="fw-700 fs-h6">Total Pemesanan</p>
              <div v-if="userCarts.length > 1">
                <div v-for="(item, index) in userCarts" :key="index">
                  <div class="checkout__details-pricing" v-if="item.amount > 0">
                    <p>{{ item.name }} ({{ item.category.name }}) x {{ item.amount }}</p>
                    <p>{{ formatCurrency(item.price * item.amount) }}</p>
                  </div>
                </div>
              </div>
              <div class="checkout__details-pricing">
                <p v-if="userCarts.length > 1">Total Tiket ({{ totalTicketCount }} Tiket)</p>
                <p v-else>Jumlah Tiket ({{ totalTicketCount }} Tiket)</p>
                <p>{{ formatCurrency(totalHarga) }}</p>
              </div>
            </div>
            <div class="checkout__details-pricing-container" v-if="listOfTaxes[paymentSelection != 'Cash' ? 'nonCash' : 'cash'] ? listOfTaxes[paymentSelection != 'Cash' ? 'nonCash' : 'cash'].length > 0 : false">
              <p class="fw-700 fs-h6">Biaya Transaksi</p>
              <div class="checkout__details-pricing" v-for="(data, i) in listOfTaxes[paymentSelection != 'Cash' ? 'nonCash' : 'cash']" :key="i">
                <p>{{ data.label }}</p>
                <p>{{ formatCurrency(formatTax(data))}}</p>
              </div>
            </div>
            <div class="checkout__details-pricing-container" v-if="discountValue > 0 || cashbackValue > 0">
              <p class="fw-700 fs-h6">Potongan Harga</p>
              <div class="checkout__details-pricing" v-if="discountValue > 0">
                <p>Diskon</p>
                <p>
                  {{ formatCurrency((totalHarga * discountValue) / 100) }} ({{ discountValue }}%)
                </p>
              </div>
              <div class="checkout__details-pricing" v-if="cashbackValue > 0">
                <p>Cashback</p>
                <p>
                  {{ formatCurrency((totalTagihan * cashbackValue) / 100) }} ({{ cashbackValue }})%
                </p>
              </div>
            </div>
            <div class="checkout__details-total flex fd-row align-items-center justify-content-sb">
              <p class="fw-700 fs-h5">Total Tagihan</p>
              <div class="checkout__details-total--final flex fd-col align-items-f-end">
                <p class="fw-700 fs-h6" :class="{
                    'checkout__details-total--strikethrough': discountValue > 0
                  }">
                  {{ formatCurrency(totalBiaya) }}
                </p>
                <p class="fw-700 fs-h6" v-if="discountValue > 0">
                  {{ formatCurrency(totalTagihan) }}
                </p>
              </div>
            </div>
          </form>
        </div>
        <div class="checkout-btn w-full">
          <button type="submit"
            class="checkout__btn-order w-full flex align-items-center justify-content-sb fw-700 cursor-pointer"
            @click="checkoutTransaction">
            Checkout
            <ph-arrow-circle-right :size="20" weight="fill" />
          </button>
        </div>
      </div>
      <section>
        <div class="overview-transaction-success_modal w-full h-full flex align-items-center justify-content-center"
          v-if="isTransactionGenerate">
          <div class="overview-transaction-success_content">
            <ph-check-circle :size="100" color="green" />
            <p class="fw-700 fs-h6">Transaksi berhasil</p>
            <button class="generate__btn" @click="toGenerateTickets()">Generate Tickets</button>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script>
const { DB_BASE_URL, TRANSACTION_BASE_URL } = GlobalHelper
export default {
  data() {
    return {
      taxes: ref({
        cash: [],
        nonCash: []
      }),
    }
  },
  mounted(){
    this.fetchTaxes()
  },
  methods: {
    async fetchTaxes() {
      try {
        const response = await fetch(`${DB_BASE_URL.value}/${TRANSACTION_BASE_URL.value}/list-tax`)
        if (!response.ok) throw Error('Terjadi kesalahan')
        const responseData = await response.json()
        this.taxes.cash = responseData.data.data.cash.filter((tax) => tax.paidBy === "user")
        this.taxes.nonCash = responseData.data.data.nonCash.filter((tax) => tax.paidBy === "user")
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
main {
  font-family: 'Raleway';
}

.order-details__dropdown {
  margin-top: 0.25rem;
}

.ticket__input-date {
  font-family: Roboto;
}

.order-details__ticket-date input,
.order-details__customer-input input {
  padding: 10px;
  border: 2px solid rgba(0, 0, 0, 1);
  outline: none;
  border-radius: 4px;
}

.order-details__ticket-date p {
  padding: 0.25rem 1rem;
  font-size: 12px;
  line-height: 16px;
}

.order-details__ticket-date label,
.order-details__customer-input label {
  position: absolute;
  top: 1%;
  left: 8px;
  transform: translateY(-50%);
  background-color: white;
  padding: 0 1px;
  pointer-events: none;
  font-size: 12px;
}

.order-details__ticket-date input:focus,
.order-details__customer-input input:focus {
  border: 2px solid rgba(218, 165, 32, 1);
}

.order-details__ticket-date input:focus+label,
.order-details__customer-input input:focus+label {
  color: rgba(218, 165, 32, 1);
}

.ticket__input-placeholder,
.customer-details__input-placeholder {
  position: relative;
}

.order-details__ticket-value {
  font-family: 'Manrope';
}

.order-details__ticket-value button {
  padding: 0.2rem;
  background-color: transparent;
  border: 1px solid black;
  border-radius: 6px;
  width: 24px;
  height: 24px;
  background-color: white;
  color: gray;
  border: 1.4px solid gray;
  cursor: pointer;
  font-size: 15px;
}

.order-details__ticket-value button:hover {
  background-color: black;
  color: #ced4da;
  border: 1.4px solid black;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}

.order-details__ticket-input {
  outline: none;
  border: 2px solid black;
  border-radius: 4px;
  padding-block: 0.25rem;
  text-align: center;
  max-width: 40px;
}

.pricings-slider__container {
  font-family: 'Poppins';
}

.order-details__guide-select,
.order-details__payment-select {
  width: 100%;
  height: 50px;
  border-radius: 0.6rem;
  padding: 0.8rem 1.25rem;
  background: white;
  box-shadow: 0 2px 6px 0px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.order-details__guide-select-content,
.order-details__payment-select-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 14px;
  line-height: 22px;
}

.order-details__select-content_modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.2);
  z-index: 999;
}

.order-details__payment-select-content_modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  z-index: 1000;
  background-color: rgb(245, 245, 245);
  border-radius: 0.5rem;
  box-shadow: 0px 2px 2px 0 rgb(0, 0, 0, 0.2);
}

.order-details__payment-select-content_modal-content {
  border-top: 1px solid black;
}

.order-details__payment-select-content_modal-content button {
  display: flex;
  gap: 0.5rem;
  height: 2.5rem;
  align-items: center;
  justify-content: space-between;
  border: 0;
  background-color: inherit;
  border-bottom: 1px solid grey;
}

.order-details__payment-select-content_modal-content button span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.order-details__payment-select-content.else i {
  font-size: 16px;
  color: rgba(227, 38, 38, 1);
}

.order-details__guide-select-content_modal {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  min-width: 514px;
  height: 80%;
  overflow: hidden;
  z-index: 100;
  position: relative;
}

.order-details__guide-select-content_modal-header {
  border-bottom: 1px solid black;
}

.order-detail__guide-select-content_guide-selector {
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
}

.order-detail__guide-select-content_guide-selector .bg-yellow {
  background-color: #e6be58;
  border-radius: 0 0.5rem 0.5rem 0;
}

.order-detail__guide-select-content_guide-selector_radio {
  background-color: transparent;
  border: 0.5px solid black;
  border-radius: 100%;
  width: 0.8rem;
  height: 0.8rem;
  padding: 0.1rem;
}

.order-detail__guide-select-content_guide-selector_radio>.selected {
  background-color: #e6be58;
  filter: blur(1px);
  border-radius: 100%;
  width: 100%;
  height: 100%;
}

.guide-select_biodata-image {
  width: 300px;
  max-width: 300px;
  height: 300px;
  max-height: 300px;
  object-fit: cover;
}

.guide-select_biodata_add-ticket {
  border-radius: 0.25rem;
  background-color: var(--color-primary);
  display: flex;
  padding: 0.5rem;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.guide-select_ticket {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.guide-select_ticket-image {
  max-height: 70px;
  width: 100px;
}

.guide-select_ticket-btn {
  padding: 0.5rem;
  background-color: var(--color-primary);
  border-radius: 0.25rem;
}

.checkout__form-container {
  min-width: 24rem;
  max-width: 36rem;
}

.checkout__details-container {
  min-width: 24rem;
  max-width: 36rem;
  position: sticky;
  top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 1rem;
}

.checkout__details-form {
  height: fit-content;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkout__details-pricing-container {
  padding: 0.25rem 0;
}

.checkout__details-pricing {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.25rem 0;
}

.checkout__details-pricing:last-child {
  padding-top: 0.5rem;
}

.checkout__details-total {
  border-top: solid 0.5px #ccc;
  padding: 0.5rem 0;
}

.checkout__btn-order {
  background-color: #ffdd8f;
  border: none;
  padding: 10px 20px;
  color: black;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.checkout__btn-order:hover {
  background-color: #e6be58;
}

.checkout__btn-order i {
  font-size: 20px;
}

.checkout__details-total--strikethrough {
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  text-decoration: line-through;
}

.overview-transaction-success_modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.overview-transaction-success_content {
  background: white;
  border-radius: 10px;
  width: 30rem;
  font-family: 'Raleway';
  display: flex;
  flex-direction: column;
  height: 300px;
  max-height: 80vh;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.generate__btn {
  width: 40%;
  background-color: #ffdd8f;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  color: black;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-weight: 700;
  align-items: center;
}

.generate__btn:hover {
  background-color: #e6be58;
}

@media (max-width: 1024px) {
  .input_wrapper {
    flex-direction: column;
  }
}

.order-details__customer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.overview-transaction-success_modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.overview-transaction-success_content {
  background: white;
  border-radius: 10px;
  width: 30rem;
  font-family: 'Raleway';
  display: flex;
  flex-direction: column;
  height: 300px;
  max-height: 80vh;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
}

.generate__btn {
  width: 40%;
  background-color: #ffdd8f;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  color: black;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-weight: 700;
  align-items: center;
}

.generate__btn:hover {
  background-color: #e6be58;
}
</style>
