<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import GlobalHelper from '@/utilities/GlobalHelper'

const router = useRouter()

const { sendQueue, grantAccessRoute } = GlobalHelper
const isExpanded = ref(false)
const showSendProgress = ref(false)
const sentCount = computed(() => {
  return sendQueue.value.filter((item) => item.sent).length
})
const closeSendProgressPopup = () => {
  sendQueue.value = []
  showSendProgress.value = false
}
const goToDetails = async (uuid) => {
  grantAccessRoute(true)
  await router.push({ name: 'generateTickets', params: { id: uuid } })
}
const toggleContent = () => {
  isExpanded.value = !isExpanded.value
}
watchEffect(() => {
  if (sendQueue.value.length > 0) {
    showSendProgress.value = true
  }
})
</script>

<template>
  <div
    v-if="sendQueue.length > 0"
    :class="{ active: showSendProgress, expanded: isExpanded }"
    class="send-progress__container pd-top-2"
  >
    <div
      class="send-progress__header flex align-items-center justify-content-sb"
      @click="toggleContent"
    >
      <p>Email Queue {{ sentCount }} of {{ sendQueue.length }}</p>
      <ph-caret-up
        v-if="sentCount < sendQueue.length"
        class="cursor-pointer send-progress__header-icon"
        :size="20"
        weight="bold"
        :class="{ expanded: isExpanded }"
      />
      <ph-x
        v-else
        :size="20"
        weight="bold"
        @click="closeSendProgressPopup()"
        class="cursor-pointer"
      />
    </div>
    <div v-if="isExpanded" class="send-progress__content">
      <div
        v-for="(queue, index) in sendQueue"
        :key="index"
        class="send-progress__content-item flex align-items-center justify-content-sb pd-1"
        @click="goToDetails(queue.uuid)"
      >
        <p class="to-ellipsis">{{ queue.email }}</p>
        <div class="send-progress__status flex fd-col align-items-f-end">
          <span v-if="queue.sent" class="flex align-items-center">
            <ph-check-circle
              v-if="queue.status === 'success'"
              :size="24"
              color="#ffd978"
              weight="fill"
            />
            <ph-x-circle v-else :size="24" color="#ffd978" weight="fill" />
          </span>
          <span v-else class="send-progress__loading"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.send-progress__container {
  position: fixed;
  opacity: 0;
  bottom: 0;
  right: 0;
  z-index: 6;
  min-width: 16rem;
  width: 20vw;
  backdrop-filter: blur(0);
  border-radius: 0.5rem 0.5rem 0 0;
  transition: opacity ease-in-out 0.3s;
}
.send-progress__container.active {
  opacity: 1;
}
.send-progress__container.expanded {
  backdrop-filter: blur(4px);
}
.send-progress__header {
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  border-radius: 0.5rem 0.5rem 0 0;
  border-bottom: 1px solid black;
  cursor: pointer;
}
.send-progress__header-icon {
  margin-right: 0.25rem;
  transition: transform 0.3s;
}
.send-progress__header-icon.expanded {
  transform: rotate(180deg);
}
.send-progress__content {
  max-height: 20rem;
  background: white;
  overflow-y: scroll;
}
.send-progress__content::-webkit-scrollbar {
  width: 4px;
}
.send-progress__content::-webkit-scrollbar-track {
  background-color: lightgrey;
  border-radius: 2px;
}
.send-progress__content::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.send-progress__content-item {
  border-bottom: 1px solid black;
}
.send-progress__status {
  width: 2rem;
}
.send-progress__loading {
  display: block;
  border: 3.5px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--color-primary);
  border-radius: 50%;
  width: 1.25rem;
  height: 1.25rem;
  animation: spinLoader 1s linear infinite;
}

@keyframes spinLoader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
