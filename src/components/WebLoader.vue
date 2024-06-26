<template>
  <div class="waiting-payment__container-loading gap-1">
    <div class="waiting-payment__loader">
      <div class="waiting-payment__ball waiting-payment__ball-1"></div>
      <div class="waiting-payment__ball waiting-payment__ball-2"></div>
      <div class="waiting-payment__ball waiting-payment__ball-3"></div>
    </div>
    <div class="waiting-payment__loading-content">
      <p class="waiting-payment__loading-text">
        Hampir selesai<span class="waiting-payment__loading-dots"></span>
      </p>
      <p class="waiting-payment__loading-message">Menunggu server</p>
    </div>
  </div>
</template>

<style scoped>
.waiting-payment__container-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.waiting-payment__loading-content {
  text-align: center;
  margin-bottom: 20px;
}
.waiting-payment__loading-text {
  font-size: 40px;
  line-height: 48px;
  font-family: 'Raleway', sans-serif;
}
.waiting-payment__loading-dots::after {
  content: '.';
  animation: loadingDots 1.5s infinite;
}
@keyframes loadingDots {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
}
.waiting-payment__loader {
  display: flex;
}
.waiting-payment__ball {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin: 0 5px;
  animation: bounce 0.5s infinite alternate;
}
.waiting-payment__ball-1 {
  background-color: rgba(18, 59, 50, 1);
  animation-delay: 0s;
}
.waiting-payment__ball-2 {
  background-color: rgba(217, 165, 32, 1);
  animation-delay: 0.2s;
}
.waiting-payment__ball-3 {
  background-color: rgba(250, 224, 132, 1);
  animation-delay: 0.4s;
}
@keyframes bounce {
  to {
    transform: translateY(-20px);
  }
}
</style>
