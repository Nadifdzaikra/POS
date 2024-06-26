<template>
  <transition name="fade">
    <div v-if="showAlert" class="custom-alert" :class="['alert-' + alertType]">
      <div class="alert__content">
        <h5 class="fw-600">{{ alertTitle }}</h5>
        <p>{{ alertMessage }}</p>
      </div>
      <button @click="closeAlert"><ph-x :size="20" weight="bold" /></button>
    </div>
  </transition>
</template>

<script setup>
import GlobalHelper from '@/utilities/GlobalHelper'

const { showAlert, alertTitle, alertType, alertMessage } = GlobalHelper

const closeAlert = () => {
  showAlert.value = false
}
</script>

<style scoped>
.custom-alert {
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.custom-alert button {
  border: 0;
  background-color: transparent;
}

.alert-danger {
  background-color: #f8d7da; /* Adjust background color for danger alerts */
}

.alert-success {
  background-color: #d4edda; /* Adjust background color for success alerts */
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s; /* Adjust transition duration as needed */
}

.fade-enter {
  opacity: 0; /* Set initial opacity to 0 for fade-in effect */
  transition: opacity 0.5s; /* Adjust transition duration as needed */
}

.fade-enter-active,
.fade-leave-active {
  opacity: 1; /* Ensure opacity is 1 during transition */
}

.fade-leave-to {
  opacity: 0; /* Set final opacity to 0 for fade-out effect */
}
</style>
