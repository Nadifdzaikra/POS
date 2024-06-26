<script setup>
import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
import GlobalHelper from '@/utilities/GlobalHelper'

const { DB_BASE_URL, CATEGORY_BASE_URL, showLoader } = GlobalHelper
const fetchCategory = async () => {
  try {
    showLoader.value = true

    const response = await fetch(`${DB_BASE_URL.value}/${CATEGORY_BASE_URL.value}/category-details`)
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const data = await response.json()
    categoryOptions.value = data.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const emit = defineEmits(['option-selected'])
const props = defineProps({
  categoryWidth: { type: String, default: '15rem' },
  initialCategory: { type: Object, default: {} }
})

const isDropdownOpen = ref(false)
const categoryOptions = ref([])
const selected = ref(props.initialCategory)
const selectedName = ref(props.initialCategory.category)
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdownOnClickOutside = (event) => {
  if (
    !event.target.closest('.category__input-dropdown') &&
    !event.target.closest('.category__input-dropdown_menu')
  ) {
    isDropdownOpen.value = false
  }
}

const selectOption = (id, name) => {
  selected.value[0] = { id, name }
  isDropdownOpen.value = false
  selectedName.value = name
  emit('option-selected', selected.value)
}

onMounted(() => {
  fetchCategory()
  window.addEventListener('click', closeDropdownOnClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside)
})
watchEffect(() => {
  selected.value = props.initialCategory
  selectedName.value = props.initialCategory.category
})
</script>

<template>
  <div class="category__input-dropdown" :style="{ width: categoryWidth }">
    <input
      readonly
      @click="toggleDropdown()"
      :value="selectedName"
      placeholder="Pilih Kategori"
      id="category"
    />
    <div class="select-icon">
      <div class="arrow-icon" :class="{ active: isDropdownOpen }">
        <ph-caret-down :size="14" weight="bold" class="icon" />
      </div>
    </div>
    <div name="" id="" class="category__input-dropdown_menu" :class="{ active: isDropdownOpen }">
      <p
        v-for="option in categoryOptions"
        :key="option.id"
        @click="selectOption(option.id, option.name)"
      >
        {{ option.name }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.category__input-dropdown {
  height: 2rem;
  width: 15rem;
  border-radius: 0.5rem;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  position: relative;
  border: 1px solid black;
}

input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  border: 0;
  width: 100%;
  height: 100%;
  border-radius: 0.5rem;
  padding: 0.5rem;
}
.category__input-dropdown input:focus {
  border-color: var(--color-primary); /* Change the border color to green */
  outline: none; /* Remove the default focus outline */
  box-shadow: 0 0 0 2px var(--color-primary); /* Add a green box-shadow to indicate focus */
}

.category__input-dropdown .select-icon {
  position: absolute;
  right: 10px; /* Adjust as needed based on select padding */
  top: 50%;
  transform: translateY(-50%);
}
.arrow-icon {
  transition: all 300ms ease;
}
/* Rotate arrow icon when the card is expanded */
.arrow-icon.active {
  transform: rotate(180deg);
}
.category__input-dropdown .select-icon i {
  font-size: 18px; /* Adjust icon size as needed */
}
.category__input-dropdown-container {
  width: 20rem;
  height: 2rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: transparent;
}

.category__input-dropdown_menu {
  position: absolute;
  top: 2.6rem;
  background-color: white;
  width: 100%;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-radius: 0.5rem;
  max-height: 0;
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    box-shadow 0.2s ease;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0);
}

.category__input-dropdown_menu.active {
  max-height: 200px;
  box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);
}

.category__input-dropdown_menu p {
  padding: 0.3rem 0.6rem;
}
.category__input-dropdown_menu p:hover {
  background-color: rgb(233, 233, 233);
}
.category__input-dropdown_menu p:hover:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}
.category__input-dropdown_menu p:hover:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
