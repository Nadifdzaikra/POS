<script setup>
import { onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import GlobalHelper from "src/utilities/GlobalHelper";
import LoginHelper from "src/utilities/GlobalHelper";
import DashboardHelper from "src/utilities/DashboardHelper";
import CheckoutHelper from "src/utilities/CheckoutHelper";

const { userCarts } = LoginHelper;
const { showLoader, assignAlert, getImageURL } = GlobalHelper;
const {
  selectedItems,
  showConfirmationPopup,
  showCartPopup,
  showCart,
  showDeleteConfirmation,
  showDeleteConfirmationPopup,
  confirmDelete,
  dataDashboard,
  fetchOrderList,
  formatCurrency,
  navigateToAdd,
  closePopup,
  closeDeletePopup,
  increaseAmount,
  decreaseAmount,
  saveToUserCarts,
  handleItemClick,
  groupedItems,
} = DashboardHelper;
const { userData, userLogout } = LoginHelper;

const router = useRouter();
const editOrder = () => {
  const id = selectedItems.value[0].id;
  closePopup();
  router.push({ name: "edit", params: { id: id } });
};

const checkData = async () => {
  try {
    showLoader.value = true;
    await fetchOrderList();
    await CheckoutHelper.getUserCarts();
  } catch (error) {
    console.error(error);
  }
};
function selectAll(event) {
  event.target.select();
}
const updateAmount = (amount) => {
  if (amount >= CheckoutHelper.maxTickets.value) {
    assignAlert(
      true,
      "Error",
      "danger",
      `Maaf, tiket tidak bisa melebihi ${CheckoutHelper.maxTickets.value} tiket!`
    );
    selectedItems.value[0].amount = CheckoutHelper.maxTickets.value;
  } else if (amount === "") {
    selectedItems.value[0].amount = 1;
  } else {
    selectedItems.value[0].amount = amount;
  }
  saveToUserCarts();
};
const closeCartOnClickOutside = (event) => {
  if (
    !event.target.closest(".dashboard-cart__button") &&
    !event.target.closest(".dashboard-cart-popup__container") &&
    !event.target.closest(".popup-order__overlay")
  ) {
    showCartPopup.value = false;
  }
};
onMounted(() => {
  checkData();
  CheckoutHelper.fetchFeeSettings();
  window.addEventListener("click", closeCartOnClickOutside);
});
onUnmounted(() => {
  window.removeEventListener("click", closeCartOnClickOutside);
});
</script>

<template>
  <div
    class="dashboard__container flex fd-col align-items-f-start gap[0.5] pd-sd-2 pd-top-2"
  >
    <div
      :class="{
        disabled:
          showCartPopup || showConfirmationPopup || showDeleteConfirmationPopup,
      }"
      class="dashboard-cart__button flex align-items-center justify-content-center pd-1"
      @click="showCart"
    >
      <ph-shopping-cart :size="32" />
      <span
        class="dashboard-cart__button-counter flex align-items-center justify-content-center"
        :class="{ 'long-text': userCarts?.length >= 100 }"
        >{{ userCarts?.length }}</span
      >
    </div>
    <div
      class="dashboard-cart-popup__container h-full flex fd-col"
      :class="{ active: showCartPopup }"
    >
      <div
        class="dashboard-cart-popup__header flex align-items-center justify-content-sb pd-1"
      >
        <h6 class="fw-600">Cart</h6>
        <ph-x
          :size="24"
          weight="bold"
          @click="showCart()"
          class="cursor-pointer"
        />
      </div>
      <div
        class="dashboard-cart-popup__content h-full flex fd-col justify-content-sb"
      >
        <div
          class="dashboard-cart-popup__content-items-container pd-1 flex fd-col gap[0.5]"
        >
          <div
            v-for="(item, index) in userCarts"
            :key="index"
            @click="handleItemClick(item)"
            class="dashboard-cart-popup__content-items flex align-items-center pd[0.5] gap[0.5]"
          >
            <img
              :src="
                item.image
                  ? getImageURL(item.image)
                  : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
              "
            />
            <div
              class="dashboard-cart-popup__items-desc flex fd-col align-items-f-start justify-content-sb pd[0.5]"
            >
              <p class="to-ellipsis">{{ item.name }}</p>
              <p class="to-ellipsis">{{ item.category?.name }}</p>
              <p class="to-ellipsis">
                Rp. {{ `${formatCurrency(item.price)} x ${item.amount} Tiket` }}
              </p>
            </div>
          </div>
        </div>
        <div
          class="dashboard-cart-popup__checkout w-full flex justify-content-center pd-block-1"
        >
          <button
            type="submit"
            class="dashboard-cart-popup__checkout-btn flex align-items-center justify-content-sb fw-700 cursor-pointer"
            @click="router.push({ name: 'checkout' })"
          >
            Pergi ke Checkout
            <ph-arrow-circle-right :size="20" weight="fill" />
          </button>
        </div>
      </div>
    </div>

    <div
      class="dashboard-header__container w-full flex fd-row align-items-center overflow-hidden"
    >
      <div class="dashboard-add__container" v-if="userData?.role !== 'CASHIER'">
        <button
          class="dashboard-add__button flex fd-col align-items-center justify-content-center"
          @click="navigateToAdd"
        >
          <span class="dashboard-add__icon flex align-self-center">
            <ph-plus :size="32" weight="light" />
          </span>
          <p>Tambah</p>
        </button>
      </div>

      <div class="dashboard-recent__container flex fd-col">
        <h6>Baru Ditambahkan</h6>
        <div
          class="dashboard__card-container flex fd-row pd[0.5]"
          :class="{ expanded: dataDashboard?.length > 5 }"
          style="width: 100vw"
        >
          <div
            v-for="(item, index) in dataDashboard"
            :key="index"
            class="dashboard__card"
            @click="handleItemClick(item)"
          >
            <img
              :src="
                item.image
                  ? getImageURL(item.image)
                  : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
              "
            />
            <div
              class="dashboard__card-content flex fd-col align-items-f-start pd[0.5]"
            >
              <p class="to-ellipsis">{{ item.name }}</p>
              <p>{{ item.category.name }}</p>
              <p>Rp. {{ formatCurrency(item.price) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-for="(items, category) in groupedItems"
      :key="category"
      :class="`dashboard-${category.toLowerCase()}__container w-full`"
    >
      <h4>{{ category }}</h4>
      <div
        class="dashboard__card-container flex fd-row w-full pd-top-1 pd-sd-2"
        :class="{ expanded: items?.length > 5 }"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="dashboard__card"
          @click="handleItemClick(item)"
        >
          <img
            :src="
              item.image
                ? getImageURL(item.image)
                : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
            "
            loading="lazy"
          />
          <div
            class="dashboard__card-content flex fd-col align-items-f-start pd[0.5]"
          >
            <p class="to-ellipsis">{{ item.name }}</p>
            <p>{{ item.category.name }}</p>
            <p>Rp. {{ formatCurrency(item.price) }}</p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="overlay popup-order__overlay flex align-items-center justify-content-center w-full h-full"
      :class="{ active: selectedItems?.length > 0 }"
      @click="closePopup"
    >
      <div
        class="popup-order__container h-full"
        v-if="selectedItems?.length > 0"
        @click.stop
      >
        <div class="popup-order__item-details flex fd-col gap[0.5] pd-2 h-full">
          <div class="flex justify-content-end w-full">
            <ph-x
              :size="32"
              weight="bold"
              @click="closePopup"
              class="cursor-pointer"
            />
          </div>
          <div class="flex">
            <img
              :src="
                selectedItems[0].image
                  ? getImageURL(selectedItems[0].image)
                  : 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
              "
              class="popup-order__image"
            />
            <div class="flex fd-col sm-sd-2">
              <div>
                <h4 class="fw-600">{{ selectedItems[0].name }}</h4>
                <h6>{{ selectedItems[0].category.name }}</h6>
                <h5 class="sm-top-1">
                  Rp. {{ selectedItems[0].price }} / tiket
                </h5>
              </div>
              <div
                class="popup-order__amount-controls flex align-items-center pd[0.5] gap-1 sm-top-1"
              >
                <button @click.stop="decreaseAmount(selectedItems[0])">
                  <ph-minus-circle :size="24" />
                </button>
                <input
                  type="number"
                  class="popup-order__amount-input fs-h5"
                  v-model="selectedItems[0].amount"
                  @input="updateAmount(selectedItems[0].amount)"
                  @focus="selectAll($event)"
                />
                <button @click.stop="increaseAmount(selectedItems[0])">
                  <ph-plus-circle :size="24" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex fd-col justify-content-sb h-full">
            <p>{{ selectedItems[0].desc }}</p>
            <div
              class="flex fd-row justify-content-start"
              v-if="userData.role !== 'CASHIER'"
            >
              <button
                class="popup-order__remove-button flex align-items-center justify-content-center gap[0.5]"
                @click="showDeleteConfirmation(selectedItems[0].id)"
              >
                <ph-trash :size="16" weight="bold" />
                <span class="fw-600">Delete</span>
              </button>
              <button
                class="popup-order__edit-button flex align-items-center justify-content-center gap[0.5]"
                @click="editOrder()"
              >
                <ph-pencil-simple :size="16" weight="bold" />
                <span class="fw-600">Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="popup-confirmation__overlay w-full flex justify-content-center align-items-center"
      :class="{ active: showConfirmationPopup }"
      @click="closePopup()"
    >
      <div
        class="popup-confirmation__container flex fd-col gap-1 justify-content-center align-items-center"
        @click.stop
      >
        <h5 class="text-align-center">Pindah ke Halaman Tambah?</h5>
        <div
          class="popup-confimation__button-confirmation w-full flex justify-content-sa"
        >
          <button @click="router.push({ name: 'add' }), closePopup()">
            Ya
          </button>
          <button @click="closePopup()">Batal</button>
        </div>
      </div>
    </div>
    <!-- Pop up untuk delete -->
    <div
      class="popup-confirmation__overlay w-full flex justify-content-center align-items-center"
      :class="{ active: showDeleteConfirmationPopup }"
      @click="closeDeletePopup()"
    >
      <div
        class="popup-confirmation__container flex fd-col gap-1 justify-content-center align-items-center"
        @click.stop
      >
        <h5 class="text-align-center">
          Apakah Anda Yakin Ingin Menghapus Tiket?
        </h5>
        <div
          class="popup-confimation__button-confirmation w-full flex justify-content-sa"
        >
          <button @click="confirmDelete()">Hapus</button>
          <button @click="closeDeletePopup()">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-cart__button {
  position: fixed;
  bottom: 8vh;
  right: 4vw;
  border-radius: 100%;
  background: var(--color-primary);
  box-shadow: -2px 2px 6px 2px rgba(0, 0, 0, 0.15);
  opacity: 1;
  transition: opacity ease-in-out 0.6s;
  cursor: pointer;
}
.dashboard-cart__button.disabled {
  opacity: 0;
}
.dashboard-cart__button-counter {
  position: absolute;
  border-radius: 100%;
  width: 16px;
  height: 16px;
  padding: 2px;
  top: 5%;
  right: 30%;
  transform: translate(50%, 50%);
  background: white;
  font-size: 0.75em;
}
.dashboard-cart__button-counter.long-text {
  font-size: 0.5em;
}
.dashboard-cart-popup__container {
  position: fixed;
  top: 0;
  right: 0;
  transform: translateX(120%);
  min-width: 24vw;
  width: 32vw;
  background: white;
  box-shadow: -2px 0 4px 2px rgba(0, 0, 0, 0.15);
  transition: transform ease-in-out 0.6s;
}
.dashboard-cart-popup__container.active {
  transform: translateX(0%);
}
.dashboard-cart-popup__header {
  border-bottom: 2px solid black;
}
.dashboard-cart-popup__content {
  overflow: auto;
}
.dashboard-cart-popup__content::-webkit-scrollbar {
  width: 0px;
}
.dashboard-cart-popup__content-items {
  cursor: pointer;
  border-radius: 0.25rem;
  box-shadow: -2px 2px 4px 2px rgba(0, 0, 0, 0.15);
}
.dashboard-cart-popup__content-items img {
  max-height: 80px;
  width: 120px;
  border-radius: 0.25rem;
  object-fit: cover;
}
.dashboard-cart-popup__items-desc {
  max-width: 60%;
}
.dashboard-cart-popup__checkout {
  position: sticky;
  bottom: 0;
  right: 0;
  backdrop-filter: blur(4px);
}
.dashboard-cart-popup__checkout-btn {
  width: 80%;
  background-color: #ffdd8f;
  border: none;
  padding: 10px 20px;
  color: black;
  border-radius: 6px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-weight: 700;
}

.dashboard-cart-popup__checkout-btn:hover {
  background-color: #e6be58;
}

.dashboard-cart-popup__checkout-btn i {
  font-size: 20px;
}
.dashboard-header__container {
  gap: 2.5rem;
  white-space: nowrap;
  width: 100%;
}
.dashboard-add__container {
  transform: translateY(-25%);
}
.dashboard-add__button {
  background-color: #eeeded;
  width: 120px;
  height: 120px;
  color: #000000;
  border-radius: 8px;
  font-size: 15px;
  font-weight: bold;
  border: 2px dashed #000000;
  cursor: pointer;
  transition: 0.2s;
  outline: none;
}
.dashboard-add__button:hover {
  background-color: #4f4f4f;
  border: 2px dashed #000000;
}
.dashboard-add__button:hover + ph-plus {
  background-color: #d9d9d9;
}
.dashboard__card-container {
  -ms-overflow-style: none;
  white-space: nowrap;
  padding: 0.5rem;
  width: 100%;
  overflow-x: auto;
  gap: 1rem;
  flex: 1;
}
.dashboard__card-container.expanded {
  overflow-x: scroll;
}
.dashboard__card-container::-webkit-scrollbar {
  height: 4px;
}
.dashboard__card-container::-webkit-scrollbar-track {
  background-color: lightgrey;
  border-radius: 2px;
}
.dashboard__card-container::-webkit-scrollbar-thumb {
  border-radius: 2px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.dashboard__card {
  display: flex;
  flex-direction: column;
  width: 230px;
  cursor: pointer;
}
.dashboard__card > img {
  object-fit: cover;
  object-position: center;
  height: 140px;
  width: 230px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
}
.dashboard__card:hover img {
  outline: 4px solid rgba(255, 217, 120, 1);
}
.popup-order__overlay {
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
  pointer-events: none;
}
.popup-order__overlay.active {
  opacity: 1;
  pointer-events: auto;
}
.popup-order__container {
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 80vw;
  max-height: 80vh;
  overflow: hidden;
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
  overflow: hidden;
  margin-top: auto;
  transform: translateY(0);
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
.popup-order__image {
  max-height: 32vh;
  width: 24vw;
  object-fit: cover;
  border-radius: 0.5rem;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
.popup-order__amount-input {
  outline: none;
  border: 2px solid black;
  border-radius: 4px;
  text-align: center;
  max-width: 60px;
}
.popup-order__remove-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  width: 7rem;
  background-color: var(--color-red-600);
  color: #fff;
  font-weight: bold;
  margin-right: 0.5rem;
}
.popup-order__edit-button {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  width: 7rem;
  background-color: var(--color-yellow);
  color: #fff;
  font-weight: bold;
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
</style>
