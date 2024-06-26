<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import InputFoto from '@/components/InputFoto.vue'
import CategoryDropdown from '@/components/CategoryDropdown.vue'
import GlobalHelper from '@/utilities/GlobalHelper'
import AddHelper from '@/utilities/AddHelper'
import SettingsHelper from '@/utilities/SettingsHelper'
import OrderTypeDropdown from '@/components/OrderTypeDropdown.vue'

const { DB_BASE_URL, ORDER_BASE_URL, showLoader, assignAlert, getImageURL } = GlobalHelper
const {
  title,
  desc,
  category,
  categoryId,
  orderPrice,
  selectedImageURL,
  defaultImageURL,
  submitAlert,
  confirmAlert,
  updatePrice,
  resetData,
  createFormData,
  handleFileSelected,
  formattedPrice,
  updateCategory,
  confirmAdd,
  orderType,
  orderTypeId,
  orderSubType,
  isSubtypeDropdownOpen,
  toggleSubtypeDropdown,
  selectSubtypeOption,
  isSubtypeDisabled,
  subTypeOptions,
  fetchOrderSubType,
  combinedOrderType,
  updateOrderType,
  closeDropdownOnClickOutside,
  assignEditData
} = AddHelper
const { fetchTargetedOrder, fetchOrderType, fetchCategory } = SettingsHelper

const router = useRouter()
const route = useRoute()
const currentPath = ref(route.name)

const createOrder = async () => {
  try {
    showLoader.value = true
    const data = createFormData('create')

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDER_BASE_URL.value}/order-action/create`,
      {
        method: 'POST',
        body: data
      }
    )

    if (!response.ok) {
      showLoader.value = false
      submitAlert.value = false
      assignAlert(true, 'Error', 'danger', 'Gagal membuat pesanan! Silahkan coba lagi.')
    } else {
      showLoader.value = false
      submitAlert.value = true
      setTimeout(() => {
        router.push('/')
        assignAlert(
          true,
          'Sukses',
          'success',
          `Berhasil membuat pesanan ${title.value} (${category.value})`
        )
        submitAlert.value = false
      }, 1200)
    }
  } catch (error) {
    console.log(error)
  }
}
const updateOrder = async () => {
  try {
    showLoader.value = true

    const data = createFormData('update')

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDER_BASE_URL.value}/order-action/update/${encodeURIComponent(route.params.id)}`,
      {
        method: 'POST',
        body: data
      }
    )

    if (!response.ok) {
      showLoader.value = false
      submitAlert.value = false
      assignAlert(true, 'Error', 'danger', 'Gagal mengubah pesanan! Silahkan coba lagi.')
    } else {
      showLoader.value = false
      submitAlert.value = true
      setTimeout(() => {
        router.push('/')
        assignAlert(
          true,
          'Sukses',
          'success',
          `Berhasil mengubah pesanan ke ${title.value} (${category.value})`
        )
        submitAlert.value = false
      }, 1200)
    }
  } catch (error) {
    console.log(error)
  }
}
const submitOrder = () => {
  confirmAlert.value = false
  createOrder()
}
const isEditPage = async () => {
  if (currentPath.value === 'edit') {
    const id = route.params.id
    await fetchTargetedOrder(id)
    assignEditData()
  }
}
const checkData = async () => {
  try {
    await fetchOrderType()
    await fetchOrderSubType(orderTypeId.value)
    await fetchCategory()
    resetData()
    await isEditPage()
  } catch (err) {
    console.error(err)
  }
}

watchEffect(() => {
  currentPath.value = route.name
  fetchOrderSubType(orderTypeId.value)
})

onMounted(() => {
  checkData()
  window.addEventListener('click', closeDropdownOnClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside)
})
</script>

<template>
  <div class="add__alert-confirmation_overlay" v-if="confirmAlert">
    <div class="add__alert-confirmation">
      <h2>Kamu yakin mau menambahkan {{ title ? title : 'Tiket' }}?</h2>
      <div class="button-group">
        <button @click="confirmAlert = false">Cancel</button>
        <button @click="submitOrder()">Yes</button>
      </div>
    </div>
  </div>
  <div class="bubble-alert_submit" v-if="submitAlert">
    <p v-if="currentPath === 'add'">Data berhasil ditambahkan</p>
    <p v-else>Data berhasil diubah</p>
  </div>

  <main class="add pd-bottom-2">
    <section class="add__input">
      <InputFoto @file-selected="handleFileSelected" :selectedImageURL="selectedImageURL" />
       <!-- <input type="file" v-model="image/"> -->
      <div class="add__input-card_title">
        <h6>Judul</h6>
        <div class="input_wrapper">
          <input class="title-input" type="text" rows="1" v-model="title" />
        </div>
      </div>
      <div class="add__input-card_title">
        <h6>Deskripsi</h6>
        <div class="input_wrapper">
          <textarea class="desc-input" rows="1" v-model="desc"></textarea>
        </div>
      </div>
      <div class="add__input-category">
        <h6>Kategori</h6>
        <CategoryDropdown
          @option-selected="updateCategory"
          :initial-category="{ category, categoryId }"
        />
      </div>
      <div class="add__input-ticket_subtype">
        <h6>Tipe Tiket</h6>
        <div class="flex gap-1">
          <!-- Ticket Type Dropdown -->

          <OrderTypeDropdown
            @option-selected="updateOrderType"
            :initial-order-type="{ orderTypeId, orderType }"
          />

          <!-- Ticket SubType Dropdown -->

          <div class="subtype__input-dropdown" :class="{ active: !isSubtypeDisabled }">
            <input
              readonly
              @click="toggleSubtypeDropdown()"
              :value="orderSubType"
              :class="{ active: !isSubtypeDisabled }"
              placeholder="Pilih Subtipe Tiket"
              id="subtype"
            />
            <div class="select-icon">
              <div class="arrow-icon" :class="{ active: isSubtypeDropdownOpen }">
                <ph-caret-down :size="14" weight="bold" class="icon" />
              </div>
            </div>
            <div
              class="ticket-type__input-dropdown_menu"
              :class="{ active: isSubtypeDropdownOpen }"
            >
              <p
                v-for="option in subTypeOptions"
                :key="option.id"
                @click="selectSubtypeOption(option.id, option.name)"
              >
                {{ option.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="add__input-price">
        <h6>Harga</h6>
        <div class="input-price">
          <p>Rp.</p>
          <input type="number" name="price" id="price" v-model="orderPrice" @input="updatePrice(orderPrice)"/>
        </div>
      </div>
    </section>

    <section class="add__preview w-full sticky">
      <h5>Pratinjau</h5>
      <div class="add__preview-card_container">
        <div class="flex gap[0.5]">
          <h6 class="add__preview-category">{{ category ? category : 'Kategori' }}</h6>
          <h6 class="add__preview-category">
            {{ combinedOrderType ? combinedOrderType : 'Tipe Tiket' }}
          </h6>
        </div>
        <div class="add__preview-image_container">
          <img :src="selectedImageURL ? selectedImageURL : defaultImageURL" alt="" />
        </div>
        <div class="add__preview-card_details sm-top-1">
          <h5 class="fw-600">{{ title ? title : 'Judul' }}</h5>
          <p>{{ desc ? desc : 'Deskripsi' }}</p>
          <div class="add__preview-card-details-price">
            <h5 class="fw-600 sm-top-1">
              <span class="fw-600">{{ formattedPrice }}</span>
            </h5>
          </div>
        </div>
      </div>
      <div class="add__preview-cta_container">
        <button
          v-if="currentPath === 'add'"
          class="add__preview_button"
          type="submit"
          @click="confirmAdd()"
        >
          Tambahkan
        </button>
        <button v-else class="add__preview_button" type="submit" @click="updateOrder()">
          Edit
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.subtype__input-dropdown {
  position: relative;
  height: 2rem;
  width: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(126, 126, 126);
  opacity: 0.7;
  cursor: not-allowed;
}

.subtype__input-dropdown.active {
  position: relative;
  height: 2rem;
  width: 15rem;
  border-radius: 0.5rem;
  border: 1px solid black;
  opacity: 1;
  cursor: pointer;
}

.subtype__input-dropdown input.active,
.ticket-type__input-dropdown input {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: transparent;
  cursor: pointer;
}
.subtype__input-dropdown input {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: transparent;
  cursor: not-allowed;
}

.select-icon {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
}

.arrow-icon {
  transition: all 300ms ease;
}

.arrow-icon.active {
  transform: rotate(180deg);
}
.subtype__input-dropdown_menu,
.ticket-type__input-dropdown_menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  width: 100%;
  background-color: white;
  border-radius: 0.5rem;
  display: none;
  overflow: hidden;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
  z-index: 200;
}

.subtype__input-dropdown_menu.active,
.ticket-type__input-dropdown_menu.active {
  display: block;
}

.subtype__input-dropdown_menu p,
.ticket-type__input-dropdown_menu p {
  padding: 0.3rem 0.6rem;
}

.subtype__input-dropdown_menu p:hover,
.ticket-type__input-dropdown_menu p:hover {
  background-color: rgb(233, 233, 233);
}

.subtype__input-dropdown_menu p:hover:first-child,
.ticket-type__input-dropdown_menu p:hover:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}

.subtype__input-dropdown_menu p:hover:last-child,
.ticket-type__input-dropdown_menu p:hover:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}

.add {
  display: flex;
  width: 100%;
  gap: 10rem;
}

/* input container */
.add__input {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

/* input | title textarea */
.title-input,
/* input | desc textarea */
.desc-input {
  min-width: 320px;
  width: 100%;
  resize: none;
  /* Disable textarea resizing */
  border: none;
  padding: 0.5rem;
  box-sizing: border-box;
  font-size: inherit;
  font-family: inherit;
  border: 1px solid black;
  line-height: inherit;
  border-radius: 0.5rem;
}

.desc-input {
  height: 118px;
}

/* input harga */
input[type='number'] {
  width: 15rem;
  height: 2rem;
  border-radius: 0.5rem;
  appearance: none;
  -webkit-appearance: none;
  /* Remove default appearance for webkit browsers */
  -moz-appearance: textfield;
  /* Show default appearance for Firefox */
  background-color: transparent;
  padding-left: 35px;
  color: rgb(0, 0, 0);
  position: relative;
  border: 1px solid #000;
}

/* Remove spinner buttons for webkit browsers */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  display: none;
}

input:focus,
button:focus,
textarea:focus {
  border-color: var(--color-primary);
  /* Change the border color to green */
  outline: none;
  /* Remove the default focus outline */
  box-shadow: 0 0 0 2px var(--color-primary);
  /* Add a green box-shadow to indicate focus */
}

.input-price {
  position: relative;
}

.input-price p {
  position: absolute;
  top: 4px;
  left: 10px;
}

/* preview */
.add__preview {
  display: flex;
  flex-direction: column;
}

/* preview | card container */
.add__preview-card_container {
  margin-top: 1rem;
  width: calc(100% - 8rem);
  min-width: 449px;
  height: 30rem;
  background-color: #ffffff;
  border-radius: 0.8rem;
  box-shadow: 0px 0px 10px 2px rgb(0, 0, 0, 0.2);
  padding: 1rem;
  overflow-y: auto;
}

/* preview | card category */

.add__preview-category {
  background-color: #d5d5d5;
  border-radius: 0.3rem;
  width: fit-content;
  padding: 0 1rem;
  font-size: 13px;
  margin-bottom: 0.5rem;
}

/* preview | card image container */
.add__preview-image_container {
  background-color: #d9d9d9;
  width: 100%;
  height: 206px;
  border-radius: 0.6rem;
}

.add__preview-image_container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

/* preview | card details container */
.add__preview-card-details {
  margin-top: 1rem;
}

.add__preview-card-details-price {
  font-size: 24px;
}

/* form tambahkan button */
.add__preview-cta_container {
  margin-top: 2rem;
  width: calc(100% - 8rem);
  min-width: 449px;
  display: flex;
  align-items: center;
}

.add__preview_button {
  margin: 0 auto;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 0;
  font-size: 18px;
  line-height: 28px;
  background-color: #d9d9d9;
}

.add__preview button {
  cursor: pointer;
}

/* add | alert */
.add__alert-confirmation_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100dvh;
  background-color: rgb(0, 0, 0, 0.2);
  z-index: 999;
}

.add__alert-confirmation {
  position: fixed;
  top: 2rem;
  left: 50%;
  transform: translate(-50%);
  background-color: #ffffff;
  border: 1px solid rgba(255, 226, 154, 0.9);
  padding: 1rem;
  border-radius: 0.5rem;
}

.add__alert-confirmation .button-group {
  display: flex;
  gap: 0.5rem;
  width: 100%;
  justify-content: end;
  margin-top: 1rem;
}

.add__alert-confirmation .button-group button {
  border: 0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-primary);
  filter: saturate(10);
  color: #ffffff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
}

.add__alert-confirmation .button-group button:first-child {
  border: 0;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #8f8f8f;
  color: #ffffff;
}

/* bubble alert */
.bubble-alert_submit {
  position: fixed;
  z-index: 2;
  top: 1rem;
  right: 1%;
  background-color: #d9d9d9;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

@media screen and (max-width: 1200px) {
  .add {
    gap: 4rem;
    padding-right: 1rem;
  }
}

@media screen and (max-width: 1000px) {
  .add {
    gap: 2rem;
  }
}

/* tablets */
@media screen and (max-width: 768px) {
  .add {
    flex-direction: column;
    /* Change to column layout */
    align-items: center;
    gap: 4rem;
  }

  .add__preview {
    margin-top: 1rem;
    width: 100%;
  }
}

/* For phones */
@media screen and (max-width: 480px) {
  .add__preview {
    margin-top: 1rem;
    /* Add space between sections */
    order: 1;
    /* Move below the input section */
  }

  .add__input {
    width: 100%;
    /* Take full width */
  }
}
</style>
