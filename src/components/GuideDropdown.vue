<script setup>
import { ref, onMounted, onUnmounted, defineProps, defineEmits, watchEffect } from 'vue';

const emit = defineEmits(['option-selected']);
const props = defineProps({
  guideWidth: { type: String, default: '15rem' },
  initialguide: { type: String, default: '' } // New prop to accept initial selected guide
});

const isDropdownOpen = ref(false);
const selected = ref(props.initialguide); // Initialize selected with the initialguide prop

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const closeDropdownOnClickOutside = (event) => {
  if (!event.target.closest('.guide__input-dropdown') && !event.target.closest('.guide__input-dropdown_menu')) {
    isDropdownOpen.value = false;
  }
};

const selectOption = (value) => {
  selected.value = value;
  isDropdownOpen.value = false;
  emit('option-selected', selected.value);
};

onMounted(() => {
  window.addEventListener('click', closeDropdownOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOnClickOutside);
});
watchEffect(() => {
  selected.value = props.initialguide;
});
</script>

<template>
  <div class="guide__input-dropdown" :style="{ width: guideWidth }">
    <input readonly @click="toggleDropdown()" :value="selected" placeholder="Pilih Tiket" id="guide">
    <div class="select-icon" >
        <div class="arrow-icon" :class="{ active: isDropdownOpen }">
          <ph-caret-down :size="14" weight="bold" class="icon" />
        </div>
    </div>
    <div name="" id="" class="guide__input-dropdown_menu" :class="{ active: isDropdownOpen }">
      <p @click="selectOption('Umum')">Umum</p>
      <p @click="selectOption('Pelajar')">Pelajar</p>
      <p @click="selectOption('Mancanegara')">Mancanegara</p>
    </div>
  </div>
</template>

<style scoped>
.guide__input-dropdown{
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

input{
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    border: 0;
    width: 100%;
    height: 100%;
    border-radius: 0.5rem;
    padding: 0.5rem;
}
.guide__input-dropdown input:focus {
    border-color: var(--color-primary); /* Change the border color to green */
    outline: none; /* Remove the default focus outline */
    box-shadow: 0 0 0 2px var(--color-primary); /* Add a green box-shadow to indicate focus */
}

.guide__input-dropdown .select-icon {
    position: absolute;
    right: 10px; /* Adjust as needed based on select padding */
    top: 50%;
    transform: translateY(-50%);
}
.arrow-icon{
  transition: all 300ms ease;

}
/* Rotate arrow icon when the card is expanded */
.arrow-icon.active {
  transform: rotate(180deg);
}
.guide__input-dropdown .select-icon i {
    font-size: 18px; /* Adjust icon size as needed */
}
.guide__input-dropdown-container{
    width: 20rem;
    height: 2rem;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: transparent;
}

.guide__input-dropdown_menu {
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
    transition: max-height 0.3s ease, box-shadow 0.2s ease; 
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0);
}

.guide__input-dropdown_menu.active {
    max-height: 200px; 
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.2);

}

.guide__input-dropdown_menu p{
    padding: 0.3rem 0.6rem;
}
.guide__input-dropdown_menu p:hover{
    background-color: rgb(233, 233, 233);
}
.guide__input-dropdown_menu p:hover:first-child{
    border-radius: 0.5rem 0.5rem 0 0;
}
.guide__input-dropdown_menu p:hover:last-child{
    border-radius: 0 0 0.5rem 0.5rem;
}
</style>