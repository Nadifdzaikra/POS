<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import GlobalHelper from '@/utilities/GlobalHelper'
import CheckoutHelper from '@/utilities/CheckoutHelper'
import DashboardHelper from '@/utilities/DashboardHelper'
import LoginHelper from '@/utilities/LoginHelper'
import SettingsHelper from '@/utilities/SettingsHelper'

import InputFoto from '@/components/InputFoto.vue'
import TriSettingsPopup from '@/components/TriSettingsPopup.vue'

const {
  biayaJasa,
  biayaLayanan,
  maxTickets,
  fetchFeeSettings,
  guideSelectPage,
  guideData,
  guideSelect,
  guideSelectors,
  isGuideChecked,
  fetchGuideData
} = CheckoutHelper

const {
  fetchOrderList,
  formatCurrency,
  showDeleteConfirmation,
  showDeleteConfirmationPopup,
  closeDeletePopup,
  confirmDelete,
  dataDashboard
} = DashboardHelper

const {
  modePopup,
  isPopupVisible,
  targetedData,
  fetchTargetedOrder,
  fetchTargetedGuide,
  fetchOrderType,
  fetchOrderSubType,
  fetchCategory,
  createGuide,
  updateGuide,
  deleteGuide,
  guideId,
  guideName,
  guideDesc,
  guideBirthdate,
  guideGender,
  guideEmail,
  guideSelectedImageURL,
  guideImageName,
  guideSelectedImage
} = SettingsHelper

const { assignAlert, getImageURL } = GlobalHelper

const router = useRouter()

// Modal Guide
const isGuideModalVisible = ref(false)
const isAddingGuideModalVisible = ref(false)
const isEditGuideModalVisible = ref(false)

const editOrder = async (id) => {
  await fetchTargetedOrder(id)
  router.push({ name: 'edit', params: { id: id } })
}

const orderSelect = ref(false)
const orderSelectPage = () => {
  orderSelect.value = !orderSelect.value
}

const feePage = ref(false)
const toggleFeePage = () => {
  feePage.value = !feePage.value
}
const showGuideModal = async (mode, id) => {
  try {
    if (mode === 'create') {
      resetData()
      targetedData.value = []
      isEditGuideModalVisible.value = false
      isAddingGuideModalVisible.value = true
    } else {
      isAddingGuideModalVisible.value = false
      isEditGuideModalVisible.value = true
      await assignEditGuideData(id)
    }
  } catch (err) {
    console.error(err)
  }
  isGuideModalVisible.value = true
}

const hideGuideModal = () => {
  isGuideModalVisible.value = false
}

const createGuideFormData = (action) => {
  const date = new Date(guideBirthdate.value)
  const isoDate = date.toISOString().split('T')[0]
  const formData = new FormData()
  formData.append('image', guideSelectedImage.value)
  if (action === 'update') formData.append('imgName', guideImageName.value)
  formData.append('name', guideName.value)
  formData.append('email', guideEmail.value)
  formData.append('birthdate', `${isoDate}T07:00:00.000Z`)
  formData.append('gender', guideGender.value)
  formData.append('desc', guideDesc.value ? guideDesc.value : '')
  return formData
}

const assignEditGuideData = async (id) => {
  try {
    await fetchTargetedGuide(id)
    const data = targetedData.value
    guideId.value = data.id
    guideName.value = data.name
    guideDesc.value = data.desc
    guideBirthdate.value = data.birthdate
    guideGender.value = data.gender
    guideEmail.value = data.email
    guideImageName.value = data.image ? data.image : ''
    guideSelectedImageURL.value = data.image ? getImageURL(data.image) : ''
    isEditGuideModalVisible.value = true
  } catch (err) {
    console.error(err)
  }
}
const resetData = () => {
  guideId.value = ''
  guideName.value = ''
  guideDesc.value = ''
  guideBirthdate.value = ''
  guideGender.value = ''
  guideEmail.value = ''
  guideImageName.value = ''
  guideSelectedImageURL.value = ''
}

// Modal Type and Subtype
const showSettingsPopup = (value) => {
  modePopup.value = value
  isPopupVisible.value = true
}
const hideSettingsPopup = () => {
  modePopup.value = ''
  isPopupVisible.value = false
}

const handleFileSelected = (file) => {
  const imageURL = URL.createObjectURL(file)
  guideSelectedImage.value = file
  guideSelectedImageURL.value = imageURL
}

const saveSettings = () => {
  biayaLayanan.value = Number(newBiayaLayanan.value)
  biayaJasa.value = Number(newBiayaJasa.value)
  maxTickets.value = Number(newMaxTickets.value)
  localStorage.setItem('biayaLayanan', biayaLayanan.value)
  localStorage.setItem('biayaJasa', biayaJasa.value)
  localStorage.setItem('maxTickets', maxTickets.value)

  assignAlert(true, 'Sukses', 'success', 'Biaya dan Maks. Tiket berhasil diubah!')
  feePage.value = false
}

const resetSettings = () => {
  biayaLayanan.value = 0
  biayaJasa.value = 0
  maxTickets.value = 80
  newBiayaLayanan.value = biayaLayanan.value
  newBiayaJasa.value = biayaJasa.value
  newMaxTickets.value = maxTickets.value
  localStorage.setItem('biayaLayanan', biayaLayanan.value)
  localStorage.setItem('biayaJasa', biayaJasa.value)
  localStorage.setItem('maxTickets', maxTickets.value)

  assignAlert(true, 'Sukses', 'success', 'Biaya berhasil di-reset!')
}

const newBiayaLayanan = ref(biayaLayanan.value)
const newBiayaJasa = ref(biayaJasa.value)
const newMaxTickets = ref(maxTickets.value)

const checkSettingsData = async () => {
  try {
    targetedData.value = []
    await fetchOrderList()
    await fetchGuideData()
    await fetchOrderType()
    await fetchOrderSubType()
    await fetchCategory()
  } catch (error) {
    console.error(error)
  }
}

const callAction = async (action) => {
  const data = createGuideFormData(action)

  switch (action) {
    case 'create':
      createGuide(data)
      break
    case 'update':
      updateGuide(data, guideId.value)
      break
    case 'delete':
      deleteGuide(guideId.value)
      break
  }
  hideGuideModal()
}

const formattedDate = ref(formatDate(guideBirthdate.value))
function formatDate(isoDate) {
  const date = new Date(isoDate)
  const year = date.getUTCFullYear()
  const month = `${date.getUTCMonth() + 1}`.padStart(2, '0')
  const day = `${date.getUTCDate()}`.padStart(2, '0')
  return `${year}-${month}-${day}`
}
watch(guideBirthdate, (newValue) => {
  formattedDate.value = formatDate(newValue)
})
function updateGuideBirthdate(event) {
  guideBirthdate.value = event.target.value
}
onMounted(() => {
  checkSettingsData()
  fetchFeeSettings()
})
</script>

<template>
  <main>
    <div
      class="popup-confirmation__overlay w-full h-full flex justify-content-center"
      :class="{ active: showDeleteConfirmationPopup }"
      @click="closeDeletePopup()"
    >
      <div
        class="popup-confirmation__container flex fd-col gap-1 justify-content-center align-items-center"
        @click.stop
      >
        <h5 class="text-align-center">Apakah Anda Yakin Ingin Menghapus Tiket?</h5>
        <div class="popup-confimation__button-confirmation w-full flex justify-content-sa">
          <button @click="confirmDelete()">Hapus</button>
          <button @click="closeDeletePopup()">Batal</button>
        </div>
      </div>
    </div>

    <h4 class="fw-600 sm-bottom-1">Pengaturan</h4>

    <section class="admin">
      <div class="settings__menu">
        <!-- <button
          class="settings__menu-items"
          @click="toggleFeePage"
          v-if="LoginHelper.userData.value.role === 'SUPER_ADMIN'"
        >
          <ph-coins :size="48" color="var(--color-primary)" />
          <span>Pembelian</span>
        </button> -->
        <button class="settings__menu-items" @click="guideSelectPage">
          <ph-binoculars :size="48" color="var(--color-primary)" weight="fill" />
          <span>Pemandu</span>
        </button>
        <button class="settings__menu-items" @click="orderSelectPage">
          <ph-ticket :size="48" color="var(--color-primary)" />
          <span>Pesanan</span>
        </button>

        <button
          class="settings__menu-items"
          @click="showSettingsPopup('category')"
          v-if="LoginHelper.userData.value.role === 'SUPER_ADMIN'"
        >
          <ph-squares-four :size="48" color="var(--color-primary)" />
          <span>Kategori</span>
        </button>
        <button
          class="settings__menu-items"
          @click="showSettingsPopup('type')"
          v-if="LoginHelper.userData.value.role === 'SUPER_ADMIN'"
        >
          <ph-folder :size="48" color="var(--color-primary)" />
          <span>Tipe</span>
        </button>
        <button
          class="settings__menu-items"
          @click="showSettingsPopup('subtype')"
          v-if="LoginHelper.userData.value.role === 'SUPER_ADMIN'"
        >
          <ph-folders :size="48" color="var(--color-primary)" />
          <span>Sub Tipe</span>
        </button>
        <button
          class="settings__menu-items"
          v-if="LoginHelper.userData.value.role === 'SUPER_ADMIN'"
          @click="router.push({ name: 'databaseLogs' })"
        >
          <ph-database :size="48" color="var(--color-primary)" />
          <span>Catatan Basis Data</span>
        </button>
      </div>
    </section>

    <section
      class="settings_modal-overla overlay w-full h-full"
      v-if="LoginHelper.userData.value.role === 'SUPER_ADMIN' && feePage"
    >
      <div class="settings_modal-container fee">
        <div class="settings__orders-content_modal-header">
          <h5 class="fw-600">Pembelian</h5>
          <ph-x class="cursor-pointer" :size="20" weight="bold" @click="toggleFeePage" />
        </div>
        <div class="settings__fees-content_modal pd-1 flex fd-col gap-1">
          <div class="settings__fees-content_modal_input-group flex fd-col gap-1">
            <div class="service">
              <p>Biaya Layanan</p>
              <input class="input_biaya" name="layanan" v-model="newBiayaLayanan" />
            </div>
            <div class="service">
              <p>Biaya Jasa Aplikasi</p>
              <input class="input_biaya" name="jasa" v-model="newBiayaJasa" />
            </div>
            <div class="service">
              <p>Maksimal Pembelian Tiket</p>
              <input class="input_biaya" name="maks. tiket" v-model="newMaxTickets" />
            </div>
          </div>
          <div class="settings__fees-content_modal_cta-container flex align-content-center gap-1">
            <button class="save" @click="saveSettings">Simpan</button>
            <button class="reset" @click="resetSettings">Reset</button>
          </div>
        </div>
      </div>
    </section>

    <section
      class="order-details__select-content_modal-overlay overlay w-full h-full flex align-items-center justify-content-center"
      v-if="guideSelect"
    >
      <div class="order-details__guide-select-content_modal">
        <div class="order-details__guide-select-content_modal-header">
          <h5 class="fw-600">Pemandu</h5>
          <ph-x class="cursor-pointer" :size="20" weight="bold" @click="guideSelectPage" />
        </div>
        <div class="order-details__content-container flex fd-col gap-1 pd-1">
          <button
            class="addGuide flex justify-content-center align-items-center gap[0.5] pd-1"
            @click="showGuideModal('create')"
          >
            <p>Tambah Pemandu</p>
            <ph-plus :size="16" weight="bold"></ph-plus>
          </button>
          <div
            class="order-detail__guide-select-content_modal-content relative"
            :class="{ grid: guideSelectors }"
          >
            <div
              v-if="guideSelectors"
              v-for="(guide, index) in guideData"
              :key="index"
              class="order-detail__guide-select-content_guide-selector flex"
            >
              <span class="flex align-items-center gap[0.5] pd[0.5]" @click.prevent>
                <div class="order-detail__guide-select-content_guide-selector_radio">
                  <div v-if="isGuideChecked(guide.id)" class="selected"></div>
                </div>
                <p>{{ guide.name }}</p>
              </span>
              <div
                class="bg-yellow flex align-items-center pd[0.5] cursor-pointer"
                @click="showGuideModal('edit', guide.id)"
              >
                <ph-caret-right :size="16" weight="bold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="order-details__select-content_modal-overlay overlay w-full h-full flex align-items-center justify-content-center"
        v-if="isGuideModalVisible"
      >
        <div class="order-details__guide-select-content_modal" @click.stop>
          <div class="order-details__guide-select-content_modal-header">
            <h5 class="fw-600" v-if="isAddingGuideModalVisible">Tambah Guide</h5>
            <h5 class="fw-600" v-if="isEditGuideModalVisible">Edit Guide</h5>

            <ph-x :size="20" weight="bold" @click="guideSelectPage" />
          </div>
          <div
            class="order-details__guide-select_breadcrumb flex align-items-center gap-1 cursor-pointer"
            @click="hideGuideModal"
          >
            <ph-caret-left :size="16" weight="bold" />
            <h6 weight="light">Kembali</h6>
          </div>
          <div class="flex gap-2 w-full">
            <div
              class="guide-select_ticket flex fd-col justify-content-sb align-items-center pd-1 gap-1"
            >
              <div class="input-image-preview">
                <div class="image-preview flex fd-col gap-1">
                  <h6 class="image-preview-label">Pratinjau</h6>
                  <img
                    :src="
                      guideSelectedImageURL
                        ? guideSelectedImageURL
                        : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
                    "
                    alt="Image"
                    class="preview-image"
                  />
                </div>
              </div>
              <InputFoto
                @file-selected="handleFileSelected"
                :selectedImageURL="guideSelectedImageURL"
              />
            </div>

            <div class="input-biodata">
              <div class="input_wrapper flex fd-col">
                <input type="text" placeholder="Nama" required v-model="guideName" />
                <div class="gender">
                  <input
                    type="radio"
                    name="gender"
                    value="MALE"
                    v-model="guideGender"
                    :checked="guideGender === 'MALE'"
                  />Pria
                  <input
                    type="radio"
                    name="gender"
                    value="FEMALE"
                    v-model="guideGender"
                    :checked="guideGender === 'FEMALE'"
                  />
                  Wanita
                </div>
                <input
                  type="date"
                  name="date"
                  v-model="formattedDate"
                  @input="updateGuideBirthdate"
                />
                <input type="text" name="email" placeholder="Email" v-model="guideEmail" required />
              </div>
              <textarea rows="1" v-model="guideDesc" placeholder="Deskripsi"></textarea>
              <button
                class="sv-guide sm-1"
                @click="callAction('create')"
                v-if="isAddingGuideModalVisible"
              >
                Simpan
              </button>
              <div class="flex gap-1" v-if="isEditGuideModalVisible">
                <button class="edit-guide" @click="callAction('update')">Edit</button>
                <button class="delete-guide" @click="callAction('delete')">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section
      class="settings_modal-overlay overlay flex align-items-center justify-content-center w-full h-full"
      v-if="orderSelect"
    >
      <div class="settings_modal-container">
        <div class="settings__fees-content_modal-header">
          <h5 class="fw-600">Pesanan</h5>
          <ph-x class="cursor-pointer" :size="20" weight="bold" @click="orderSelectPage" />
        </div>

        <div class="settings__orders-content align-items-center pd-1">
          <div
            class="settings__orders-content_item flex align-items-center gap-1 pd-1"
            v-for="(item, index) in dataDashboard"
            :key="index"
          >
            <img
              style="width: 6rem; height: 5rem"
              :src="
                item.image
                  ? getImageURL(item.image)
                  : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
              "
            />
            <div class="settings__orders-group-content h-full flex fd-col justify-content-sb">
              <div class="settings__orders-content_item-head">
                <h6 class="to-ellipsis">{{ item.name }}</h6>
                <p>Rp{{ formatCurrency(item.price) }}</p>
                <p>{{ item.category.name }}</p>
              </div>
              <div class="settings__orders-content_item-cta flex justify-content-end gap-1">
                <button
                  class="settings-order__edit-button flex align-items-center justify-content-center gap[0.5]"
                  @click="editOrder(item.id)"
                >
                  <ph-pencil-simple :size="16" weight="bold" />
                </button>
                <button
                  class="settings-order__remove-button flex align-items-center justify-content-center gap[0.5]"
                  @click="showDeleteConfirmation(item.id)"
                >
                  <ph-trash :size="16" weight="bold" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!--Tri Settings Modal-->
    <TriSettingsPopup @closeModal="hideSettingsPopup()" />
  </main>
</template>

<style scoped>
body {
  font-family: 'Raleway', sans-serif;
}

.input_biaya {
  width: 100%;
  height: 2.5rem;
  font-size: 1rem;
  border-radius: 5px;
  padding: 0.5rem;
  border: 1px solid #000;
}

input:hover,
input:focus {
  border-color: #ffd978;
}

.save,
.reset {
  width: 5.5rem;
  height: 2rem;
  color: white;
  font-weight: bold;
  border-radius: 20px;
}

.save {
  background: #28a745;
}

.save:hover {
  background: #17b53caa;
}

.reset {
  background: #dc3545;
}

.reset:hover {
  background: #cd23349b;
}

.settings__menu {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 170px));
  gap: 2.1rem;
}

.settings__menu-items {
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 10rem;
  height: 10rem;
  margin-top: 1rem;
  font-size: 1.5rem;
  font-family: 'Raleway', sans-serif;
  border: 1px solid black;
  border-radius: 5px;
  box-shadow: 1px 3px 10px rgb(0, 0, 0, 0.2);
}

.settings__menu-items span {
  font-weight: 600;
}

.addGuide {
  background: #e6be58;
  max-width: 12rem;
  height: 2rem;
  color: black;
  border-radius: 10px;
}

.order-details__guide-select_breadcrumb {
  margin: 1rem;
}

.order-details__payment-select-content_modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60%;
  z-index: 100;
  background-color: rgb(245, 245, 245);
  border-radius: 0.5rem;
  box-shadow: 0px 2px 2px 0 rgb(0, 0, 0, 0.2);
}

.order-details__payment-select-content_modal-header i {
  cursor: pointer;
}

.order-details__guide-select-content_modal {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 90vw;
  min-height: 70vh;
  overflow: hidden;
  z-index: 100;
  position: relative;
}

.settings__fees-content_modal-header,
.settings__orders-content_modal-header,
.order-details__guide-select-content_modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid black;
}

.order-details__content-container {
  height: 20rem;
  overflow-y: auto;
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: #ccc transparent;
}

.order-detail__guide-select-content_modal-content.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
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

.order-detail__guide-select-content_guide-selector_radio > .selected {
  background-color: #e6be58;
  filter: blur(1px);
  border-radius: 100%;
  width: 100%;
  height: 100%;
}

.settings_modal-overlay {
  opacity: 1;
  transition: opacity 0.2s ease-in-out;
}

.settings_modal-container {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-height: 100vh;
  width: 90vw;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 900;
}
.settings_modal-container.fee {
  width: 40vw;
}
.settings__orders-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  grid-gap: 1rem;
  overflow: auto;
  height: 80vh;
  scrollbar-width: thin; /* For Firefox */
  scrollbar-color: #ccc transparent;
}

.settings__orders-group-content {
  width: 80%;
}

.order-details__content-container::-webkit-scrollbar,
.settings__orders-content::-webkit-scrollbar {
  border-radius: 10px; /* Border radius to match card */
}

/* Track (the area where the scrollbar is) */
.order-details__content-container::-webkit-scrollbar-track,
.settings__orders-content::-webkit-scrollbar-track {
  background: transparent; /* Transparent background */
}

/* Handle (the draggable part of the scrollbar) */
.order-details__content-container::-webkit-scrollbar-thumb,
.settings__orders-content::-webkit-scrollbar-thumb {
  background-color: #ccc; /* Color of the scrollbar handle */
  border-radius: 10px; /* Border radius to match card */
}

/* Handle on hover */
.order-details__content-container::-webkit-scrollbar-thumb:hover,
.settings__orders-content::-webkit-scrollbar-thumb:hover {
  background-color: #aaa; /* Darker color when hovered */
}

.settings__orders-content_item {
  height: 10rem;
  box-shadow: 0 2px 10px rgb(0, 0, 0, 0.2);
  border-radius: 0.5rem;
}
.settings__orders-content_item img {
  height: 100%;
  width: 12rem;
  object-fit: cover;
}
.settings__orders-content_item-head h6 {
  width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.settings-order__remove-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  width: 4rem;
  background-color: var(--color-red-600);
  color: #fff;
  font-weight: bold;
  margin-right: 0.5rem;
}

.settings-order__edit-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  width: 4rem;
  background-color: var(--color-yellow);
  color: #fff;
  font-weight: bold;
}

.popup-confirmation__overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}

.popup-confirmation__overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.popup-confirmation__container {
  background: #d9d9d9;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 345px;
  max-height: 143px;
  overflow: hidden;
  margin-top: 5rem;
  transform: translateY(-50%);
  transition: transform 0.3s ease;
}

.popup-confirmation_overlay.active .popup-confirmation_container {
  transform: translateY(50%);
}

.popup-confimation__button-confirmation button {
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  color: white;
}

.popup-confimation__button-confirmation button:first-child {
  background: #28a745;
}
.popup-confimation__button-confirmation button:first-child:hover {
  background: #17b53caa;
}
.popup-confimation__button-confirmation button:last-child {
  background: #dc3545;
}
.popup-confimation__button-confirmation button:last-child:hover {
  background: #cd23349b;
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
  margin-left: 2rem;
  margin-bottom: 1rem;
  width: 350px;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.guide-select_ticket-image {
  max-height: 70px;
  max-width: 100px;
  max-height: 70px;
  max-width: 100px;
}

.guide-select_ticket-btn {
  padding: 0.5rem;
  background-color: var(--color-primary);
  border-radius: 0.25rem;
  padding: 0.5rem;
  background-color: var(--color-primary);
  border-radius: 0.25rem;
}

.guide-Add-btn {
  padding: 0.5rem;
  display: flex;
  gap: 1rem;
  background-color: var(--color-primary);
  border: none;
  border-radius: 0.25rem;
  width: 100%;
  height: 2.5rem;
  justify-content: center;
}

.input-biodata {
  width: 100%;
  margin-left: 3rem;
}

.input-biodata input[type='text'],
.input-biodata input[type='date'],
.input-biodata input[type='email'] {
  width: calc(100% - 3rem);
  height: 3rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-family: 'Raleway', sans-serif;
  border-radius: 5px;
  padding: 0.5rem;
}

.input-biodata input[type='email'] {
  margin-right: 8rem;
}

.input-biodata textarea {
  min-height: 200px;
  min-width: calc(100% - 3rem);
  resize: none;
  border: 2px solid black;
  border-radius: 0.5rem;
  padding: 0.5rem;
  box-sizing: border-box;
  font: inherit;
  line-height: inherit;
}

.input-biodata .gender {
  margin-bottom: 1rem;
}

.input-biodata .gender input[type='radio'] {
  margin-right: 0.5rem;
  padding: 0;
  margin-left: 1rem;
  vertical-align: middle;
  appearance: none;
  outline: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid black;
  position: relative;
}

.input-biodata .gender input[type='radio']::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: white;
}

.input-biodata .gender input[type='radio']:checked::before {
  background-color: rgb(64, 64, 64);
}

.sv-guide {
  width: 5.5rem;
  height: 2rem;
  color: white;
  border-radius: 20px;
  background-color: #e6be58;
  font-weight: bold;
}

.sv-guide:hover {
  background-color: #ffd987;
}

.edit-guide {
  background-color: #e6be58;
}

.edit-guide:hover {
  background-color: #ffd987;
}

.delete-guide {
  background: #dc3545;
}

.delete-guide:hover {
  background: #cd23349b;
}
.edit-guide,
.delete-guide {
  margin: 0.5rem;
  width: 5.5rem;
  height: 2rem;
  color: white;
  border-radius: 20px;
  font-weight: bold;
}

.input-image-preview {
  position: relative;
}

.image-preview-label {
  margin-bottom: 0.5rem;
}

.preview-image {
  width: 100%;
  max-height: 200px;
  border-radius: 0.5rem;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.2);
}
</style>
