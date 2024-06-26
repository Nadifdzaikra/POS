<script setup>
import { onMounted, ref } from 'vue'
import { Vue3ColorPicker } from '@cyhnkckali/vue3-color-picker'
import SettingsHelper from '@/utilities/SettingsHelper'
import OrderTypeDropdown from '@/components/OrderTypeDropdown.vue'

const {
  modePopup,
  popupTitle,
  dataTarget,
  modeExtension,
  isPopupVisible,
  isSettingExtended,
  createOrderType,
  createOrderSubType,
  createCategory,
  updateOrderType,
  updateOrderSubType,
  updateCategory
} = SettingsHelper

const id = ref(null)
const name = ref('')
const orderType = ref('')
const orderTypeId = ref(null)
const color = ref('')

const emits = defineEmits(['closeExtension'])
const closeExtension = () => {
  emits('closeExtension')
}

const checkState = () => {
  if (modeExtension.value === 'update') {
    const data = dataTarget.value
    id.value = data.id ? Number(data.id) : null
    name.value = dataTarget.value.name ? data.name : ''
    orderType.value = data.orderType ? data.orderType.name : null
    orderTypeId.value = data.orderTypeId ? data.orderTypeId : null
    color.value = data.color ? data.color : ''
  }
}
const callAction = () => {
  const data = checkFormData()

  if (modeExtension.value === 'update') {
    switch (modePopup.value) {
      case 'type':
        updateOrderType(data, id.value)
        break
      case 'subtype':
        updateOrderSubType(data, id.value)
        break
      case 'category':
        updateCategory(data, id.value)
        break
    }
  } else {
    switch (modePopup.value) {
      case 'type':
        createOrderType(data)
        break
      case 'subtype':
        createOrderSubType(data)
        break
      case 'category':
        createCategory(data)
        break
    }
  }
  isSettingExtended.value = false
  isPopupVisible.value = false
}
const checkFormData = () => {
  const formData = new FormData()
  if (name.value) formData.append('name', name.value)
  if (orderTypeId.value) formData.append('orderTypeId', orderTypeId.value)
  if (color.value) formData.append('color', color.value)

  return formData
}
const updateOrderTypeDropdown = (value) => {
  orderType.value = value[0].name
  orderTypeId.value = value[0].id
}

onMounted(() => {
  checkState()
})
</script>

<template>
  <div class="settings-popup-extension__container flex fd-col">
    <div class="settings-popup-extension__header flex align-items-center justify-content-sb pd-1">
      <h6 class="fw-600">{{ modeExtension === 'update' ? 'Edit' : 'Tambah' }} {{ popupTitle }}</h6>
      <ph-x :size="20" weight="bold" class="cursor-pointer" @click="closeExtension()" />
    </div>
    <div class="settings-popup-extension__content pd-1 flex fd-col gap[0.5]">
      <div class="settings-popup-extension__content--required flex fd-col gap[0.5]">
        <p>Nama</p>
        <input type="text" class="w-full" v-model="name" required />
      </div>
      <div
        class="settings-popup-extension__content-subtype flex fd-col gap[0.5]"
        v-if="modePopup === 'subtype'"
      >
        <p>Type</p>
        <OrderTypeDropdown
          @option-selected="updateOrderTypeDropdown"
          :initial-order-type="{ orderTypeId, orderType }"
        />
      </div>
      <div
        class="settings-popup-extension__content-category flex fd-col gap[0.5]"
        v-if="modePopup === 'category'"
      >
        <p>Color</p>
        <Vue3ColorPicker
          v-model="color"
          mode="solid"
          :showColorList="false"
          :showEyeDrop="false"
          :showAlpha="false"
          type="HEX"
        />
      </div>
      <div class="settings-popup-extension__content-cta pd-top-1">
        <button class="settings-popup-extension__save-btn" @click="callAction()">Simpan</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-popup-extension__container {
  min-width: 20rem;
  background-color: white;
  border-radius: 0.5rem;
  font-family: 'Raleway';
  display: flex;
  flex-direction: column;
}

.settings-popup-extension__header {
  text-align: left;
  border-bottom: 1px solid black;
}

.settings-popup-extension__content input[type='text'] {
  height: 2rem;
  border-radius: 10px;
  padding: 0.5rem;
  font-family: 'Raleway';
  border: 0.5px solid #333;
}

.settings-popup-extension__content input[type='text']:focus {
  border: 2px solid #e6be58;
  outline: none;
}

.settings-popup-extension__save-btn {
  width: 5.5rem;
  height: 2rem;
  color: white;
  border-radius: 20px;
  background-color: #e6be58;
  font-weight: bold;
}
</style>
