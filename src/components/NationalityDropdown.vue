<script setup>
import { onMounted, watchEffect } from 'vue'
import CheckoutHelper from '@/utilities/CheckoutHelper'
import LoginHelper from '@/utilities/LoginHelper';

const {
  fetchNationalityData,
  nationalityQuery,
  nationalityResult,
  isNationalityDropdownOpen,
  showFlag,
  selectedFlagImageUrl,
  loadNationalityData,
  openNationalityDropdown,
  getFlagImageUrl,
  getNationality,
  closeDropdownOutside
} = CheckoutHelper
const { userData, userCarts } = LoginHelper

const props = defineProps({
  nationalityWidth: { type: String, default: '11.8rem' },
  itemIndex: { type: Number,  }
})

const chooseNationality = (data) =>  {
  userCarts.value[props.itemIndex].nationalityId = data.id
}

watchEffect((onInvalidate) => {
  onInvalidate(() => {
    document.removeEventListener('click', closeDropdownOutside)
  })
  if (nationalityQuery.value.trim() === '') {
    showFlag.value = false
    selectedFlagImageUrl.value = ''
  }
})
onMounted(() => {
  fetchNationalityData()
  loadNationalityData()
  document.addEventListener('click', closeDropdownOutside)
})
</script>

<template>
  <div class="nationality-dropdown__container" :style="{ width: nationalityWidth }">
    <input
      type="text"
      v-model="nationalityQuery"
      placeholder="Kebangsaan"
      @input="loadNationalityData"
      @focus="openNationalityDropdown"
      class="nationality-dropdown__input"
      :class="{ focus: isNationalityDropdownOpen, flag: showFlag }"
      :style="{ backgroundImage: `url(${selectedFlagImageUrl})` }"
    />
    <div class="select-icon">
      <div class="arrow-icon" :class="{ active: isNationalityDropdownOpen }">
        <ph-caret-down :size="16" weight="bold" class="icon" />
      </div>
    </div>
    <div
      :class="{ 'location__search-dropdown': true, active: isNationalityDropdownOpen }"
      class="w-full"
    >
      <div class="dropdown-nationality__result" :class="{ active: isNationalityDropdownOpen }">
        <div v-for="result in nationalityResult" :key="result.id">
          <div
            class="nationality-item"
            @click="chooseNationality(result)"
          >
            <img :src="getFlagImageUrl(result.code)" class="flag-icon" />
            <p class="dropdown-nationality__name">{{ result.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nationality-dropdown__container {
  height: 43px;
  border-radius: 3px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: transparent;
  position: relative;
  outline: none;
}
input {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  padding: 0.75rem 0.75rem;
  border: 2px solid black;
}
input::placeholder {
  font-family: 'Inter';
  color: black;
  font-size: 16px;
  line-height: 19px;
}
input.focus {
  outline: none;
  border: 2px solid rgba(218, 165, 32, 1);
}
.nationality-dropdown__container .select-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.arrow-icon {
  transition: all 300ms ease;
}
.arrow-icon.active {
  transform: rotate(180deg);
}
.nationality-dropdown__container .select-icon i {
  font-size: 18px;
}
.nationality-dropdown__input.flag {
  background-repeat: no-repeat;
  background-position: 1.5rem center;
  padding-left: 4rem;
  background-size: 25px;
}
.dropdown-nationality__result {
  position: absolute;
  top: 2.6rem;
  background-color: white;
  width: 100%;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.25);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  border-radius: 10px;
  max-height: 0;
  overflow-y: scroll;
  transition: max-height 0.3s ease;
}
.dropdown-nationality__result::-webkit-scrollbar {
  width: 6px;
}
.dropdown-nationality__result::-webkit-scrollbar-track {
  background-color: lightgrey;
  border-radius: 2px;
}
.dropdown-nationality__result::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.dropdown-nationality__result.active {
  max-height: 360px;
}
.dropdown-nationality__result div {
  padding: 0.5rem 1.5rem;
}
.dropdown-nationality__result div:hover {
  background-color: rgb(233, 233, 233);
}
.dropdown-nationality__result div:hover:first-child {
  border-radius: 0.5rem 0.5rem 0 0;
}
.dropdown-nationality__result div:hover:last-child {
  border-radius: 0 0 0.5rem 0.5rem;
}
.dropdown-nationality__name {
  font-family: 'Open Sans';
  font-size: 14px;
  line-height: 19px;
}
.nationality-item {
  display: flex;
  align-items: center;
}
.flag-icon {
  width: 25px;
  margin-right: 10px;
}
</style>
