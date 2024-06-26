<script setup>
import { ref, watchEffect } from 'vue'
import SettingsHelper from '@/utilities/SettingsHelper'

import TriSettingsExtend from '@/components/TriSettingsExtend.vue'

const {
  popupData,
  modePopup,
  isPopupVisible,
  isSettingExtended,
  popupTitle,
  dataTarget,
  modeExtension,
  fetchOrderType,
  fetchOrderSubType,
  fetchCategory,
  deleteOrderType,
  deleteOrderSubType,
  deleteCategory
} = SettingsHelper

const showDeleteSettingsPopup = ref(false)

const showSettingsExtension = (mode, value) => {
  isSettingExtended.value = true
  isPopupVisible.value = false
  modeExtension.value = mode
  dataTarget.value = value ? value : []
}
const hideSettingsExtension = () => {
  isSettingExtended.value = false
  isPopupVisible.value = true
  modeExtension.value = ''
}

const showDeleteConfirmation = (value) => {
  showDeleteSettingsPopup.value = true
  dataTarget.value = value
}
const closeDeleteConfirmation = () => {
  showDeleteSettingsPopup.value = false
  dataTarget.value = []
}

const emits = defineEmits(['closeModal'])
const closeModal = () => {
  emits('closeModal')
}
const deleteItem = (id) => {
  switch (modePopup.value) {
    case 'type':
      deleteOrderType(id)
      break
    case 'subtype':
      deleteOrderSubType(id)
      break
    case 'category':
      deleteCategory(id)
      break
  }
  showDeleteSettingsPopup.value = false
  isPopupVisible.value = false
}




watchEffect(() => {
  switch (modePopup.value) {
    case 'type':
      popupTitle.value = 'Tipe'
      fetchOrderType()
      break
    case 'subtype':
      popupTitle.value = 'Sub Tipe'
      fetchOrderSubType()
      break
    case 'category':
      popupTitle.value = 'Kategori'
      fetchCategory()
      break
  }
})
</script>

<template>
  <div class="settings-popup-extension__overlay overlay w-full h-full flex align-items-center justify-content-center" v-if="isSettingExtended">
    <TriSettingsExtend @closeExtension="hideSettingsExtension()" />
  </div>

  <div class="settings-popup__overlay overlay w-full h-full flex align-items-center justify-content-center" v-if="isPopupVisible">
    <div class="settings-popup__container">
      <div class="settings-popup__header flex justify-content-sb align-items-center pd-1">
        <h6 class="fw-600">{{ popupTitle }}</h6>
        <ph-x :size="20" weight="bold" class="cursor-pointer" @click="closeModal()" />
      </div>
      <div class="settings-popup__content scrollable flex fd-col gap-1 pd-1">
        <button
          class="settings-popup__add-button flex justify-content-center align-items-center gap[0.5]"
          @click="showSettingsExtension('create')"
        >
          <p class="fw-600">Tambah</p>
          <ph-plus :size="16" weight="bold" />
        </button>
        <div class="settings-popup__content-data  h-full flex fd-col gap[0.5]" >
          <div
            class="settings-popup__item flex align-items-center justify-content-sb pd-1 w-full"
            v-for="(item, index) in popupData"
            :key="index"
          >
            <p>{{ item.name }}</p>
            <div class="settings-popup__item-cta flex justify-items-sb gap[0.5]">
              <ph-pencil-simple
                class="cursor-pointer"
                :size="24"
                color="#e6be58"
                weight="fill"
                @click="showSettingsExtension('update', item)"
              />
              <ph-trash
                class="cursor-pointer"
                :size="24"
                color="#eb0000"
                weight="fill"
                @click="showDeleteConfirmation(item)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="popup-confirmation__overlay w-full h-full flex justify-content-center"
    :class="{ active: showDeleteSettingsPopup }"
    @click="closeDeleteConfirmation()"
  >
    <div
      class="popup-confirmation__container flex fd-col gap-1 justify-content-center align-items-center"
      @click.stop
    >
      <h5 class="text-align-center">Apakah Anda Yakin Ingin Menghapus {{ popupTitle }}?</h5>
      <div class="popup-confimation__button-confirmation w-full flex justify-content-sa">
        <button @click="deleteItem(dataTarget.id)">Hapus</button>
        <button @click="closeDeleteConfirmation()">Batal</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-popup__container {
  background: white;
  border-radius: 5px;
  width: 30rem;
  font-family: 'Raleway';
  display: flex;
  flex-direction: column;
  max-height: 80vh;
}

.settings-popup__header {
  text-align: left;
  border-bottom: 1px solid black;
}

.settings-popup__add-button {
  width: 8rem;
  height: 2rem;
  color: black;
  border-radius: 10px;
  background-color: #e6be58;
}

.settings-popup__item {
  height: 3rem;
  border-radius: 10px;
  border: 0.5px solid #333;
  box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.25);
}

.popup-confirmation__overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
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
.scrollable {
  overflow-y: scroll;
}
</style>
