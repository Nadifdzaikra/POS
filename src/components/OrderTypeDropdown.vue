<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import GlobalHelper from '@/utilities/GlobalHelper'
import AddHelper from '@/utilities/AddHelper'

const { DB_BASE_URL, ORDERTYPE_BASE_URL, showLoader } = GlobalHelper
const { fetchOrderSubType } = AddHelper

const emit = defineEmits(['option-selected'])
const props = defineProps({
  initialOrderType: { type: Object, default: {} }
})

const isOpen = ref(false)
const selectedOrderType = ref(props.initialOrderType)
const orderType = ref(props.initialOrderType.orderType)

const orderTypeOptions = ref([])

const fetchOrderType = async () => {
  try {
    showLoader.value = true

    const response = await fetch(`${DB_BASE_URL.value}/${ORDERTYPE_BASE_URL.value}/type-details`)
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    orderTypeOptions.value = data.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (id, name) => {
  selectedOrderType.value[0] = { id, name }
  isOpen.value = false
  orderType.value = name
  fetchOrderSubType(id)
  emit('option-selected', selectedOrderType.value)
}

const closeDropdownOnClickOutside = (event) => {
  if (
    !event.target.closest('.order-type__input-dropdown') &&
    !event.target.closest('.order-type__input-dropdown_menu')
  ) {
    isOpen.value = false
  }
}

onMounted(() => {
  fetchOrderType()
  window.addEventListener('click', closeDropdownOnClickOutside)
})
onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside)
})
watchEffect(() => {
  selectedOrderType.value = props.initialOrderType
  orderType.value = props.initialOrderType.orderType
})
</script>

<template>
  <div class="order-type__input-dropdown">
    <input readonly @click="toggleDropdown" :value="orderType" placeholder="Pilih Tipe Tiket" />
    <div class="select-icon" @click="toggleDropdown">
      <div class="arrow-icon" :class="{ active: isOpen }">
        <ph-caret-down :size="14" weight="bold" class="icon" />
      </div>
    </div>
    <div class="order-type__input-dropdown_menu" :class="{ active: isOpen }">
      <p
        v-for="option in orderTypeOptions"
        :key="option.id"
        @click="selectOption(option.id, option.name)"
      >
        {{ option.name }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.order-type__input-dropdown {
  position: relative;
  height: 2rem;
  width: 15rem;
  border-radius: 0.5rem;
  border: 1px solid black;
  cursor: pointer;
}

.order-type__input-dropdown input {
  width: 100%;
  height: 100%;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem;
  background-color: transparent;
  cursor: pointer;
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

.order-type__input-dropdown_menu {
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

.order-type__input-dropdown_menu.active {
  display: block;
}

.order-type__input-dropdown_menu p {
  padding: 0.3rem 0.6rem;
}

.order-type__input-dropdown_menu p:hover {
  background-color: rgb(233, 233, 233);
}

.order-type__input-dropdown_menu p:hover:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}

.order-type__input-dropdown_menu p:hover:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
