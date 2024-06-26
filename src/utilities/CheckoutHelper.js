import { ref, computed } from 'vue';
import GlobalHelper from './GlobalHelper';
import LoginHelper from './LoginHelper';
import DashboardHelper from './DashboardHelper';

const {
  DB_BASE_URL,
  GUIDE_BASE_URL,
  NATIONALITY_BASE_URL,
  TRANSACTION_BASE_URL,
  DETAILTRANS_BASE_URL,
  showLoader,
  sendQueue,
  assignAlert
} = GlobalHelper;

const { userData, userCarts } = LoginHelper;

/* NationalityDropdown Helper */
const nationalityData = ref([]);
const selectedNationality = ref();

const fetchNationalityData = async () => {
  try {
    const response = await fetch(
      `${DB_BASE_URL}/${NATIONALITY_BASE_URL}/nationality-list`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const res = await response.json();
    nationalityData.value = res.data;
    console.log(nationalityData);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const nationalityQuery = ref('');
const nationalityResult = ref([]);
const isNationalityDropdownOpen = ref(false);
const showFlag = ref(false);
const selectedFlagImageUrl = ref('');

const loadNationalityData = () => {
  if (nationalityQuery.value.trim() !== '') {
    isNationalityDropdownOpen.value = true;
    const filteredData = nationalityData.value.filter((nationality) => {
      return nationality.name.toLowerCase().includes(nationalityQuery.value.trim().toLowerCase());
    });

    console.log(filteredData);
    nationalityResult.value = filteredData;
    isNationalityDropdownOpen.value = nationalityResult.value.length > 0;
  } else {
    nationalityResult.value = [];
    isNationalityDropdownOpen.value = false;
  }
};

const openNationalityDropdown = () => {
  if (nationalityQuery.value.trim() === '') {
    isNationalityDropdownOpen.value = true;
    nationalityResult.value = nationalityData.value;
  } else {
    isNationalityDropdownOpen.value = true;
    loadNationalityData();
  }
};

const closeNationalityDropdown = () => {
  isNationalityDropdownOpen.value = false;
  nationalityResult.value = [];
};

const getFlagImageUrl = (countryCode) => {
  return `https://flagcdn.com/48x36/${countryCode}.png`;
};

const getNationality = (nationalityId, nationalityName, countryCode) => {
  nationalityQuery.value = nationalityName;
  nationalityResult.value = [];
  isNationalityDropdownOpen.value = false;
  showFlag.value = true;

  const flagImageUrl = getFlagImageUrl(countryCode);

  selectedFlagImageUrl.value = flagImageUrl;
  selectedNationality.value = nationalityId;
};

const closeDropdownOutside = (event) => {
  const dropdownContainer = document.querySelector('.nationality-dropdown__container');
  if (dropdownContainer && !dropdownContainer.contains(event.target)) {
    closeNationalityDropdown();
  }
};

/* CheckoutView Helper */
const getUserCarts = () => {
  if (userCarts.value) {
    for (let item of userCarts.value) {
      item.nationalityId = undefined;
      item.cityName = undefined;
      item.guideId = item.guideId || '';
      item.guideName = item.guideName || '';
    }
    console.log(userCarts.value);
    return userCarts.value;
  }
  return [];
};

function addTicket(index) {
  if (userCarts.value[index].amount >= maxTickets.value) {
    assignAlert(
      true,
      'Error',
      'danger',
      `Maaf, tiket tidak bisa melebihi ${maxTickets.value} tiket!`
    );
    userCarts.value[index].amount = maxTickets.value;
  } else {
    userCarts.value[index].amount++;
  }
  DashboardHelper.saveToUserCarts();
}

function reduceTicket(index) {
  if (userCarts.value[index].amount > 0) {
    userCarts.value[index].amount--;
    if (userCarts.value[index].amount === 0) {
      userCarts.value.splice(index, 1);
    }
  }
  DashboardHelper.saveToUserCarts();
}

const custName = ref('');
const custEmail = ref('');
const custNumber = ref('');
const asalKota = ref('');
const selectedDate = ref(null);
const discountValue = ref(0);
const cashbackValue = ref(0);
const cityName = ref('');

const biayaLayanan = ref(0);
const biayaJasa = ref(0);
const biayaJasaCard = ref(0.015);
const maxTickets = ref(80);
const fetchFeeSettings = () => {
  const savedBiayaLayanan = localStorage.getItem('biayaLayanan');
  if (savedBiayaLayanan) {
    biayaLayanan.value = parseInt(savedBiayaLayanan);
  }
  const savedBiayaJasa = localStorage.getItem('biayaJasa');
  if (savedBiayaJasa) {
    biayaJasa.value = parseInt(savedBiayaJasa);
  }
  const savedMaxTickets = localStorage.getItem('maxTickets');
  if (savedMaxTickets) {
    maxTickets.value = parseInt(savedMaxTickets);
  }
  const savedBiayaJasaCard = localStorage.getItem('biayaJasaCard');
  if (savedBiayaJasaCard) {
    biayaJasaCard.value = parseInt(biayaJasaCard);
  }
};

const formatCurrency = (amount) => {
  return parseInt(amount).toLocaleString('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const totalHarga = computed(() => {
  let total = 0;
  for (const ticket of userCarts.value) {
    total += ticket.price * ticket.amount;
  }
  return total;
});

const totalBiaya = computed(() => {
  const diskon = (totalHarga.value * discountValue.value) / 100;
  const biayaJasaAplikasi = paymentSelection.value === 'Cash' ? biayaJasa.value : totalHarga.value * biayaJasaCard.value;
  console.log(paymentSelection.value);
  return totalHarga.value - diskon + biayaLayanan.value + biayaJasaAplikasi;
});

const totalTagihan = computed(() => {
  const diskon = (totalHarga.value * discountValue.value) / 100;
  let taxes = 0;
  const taxesIdentifier = paymentSelection.value !== 'Cash' ? 'nonCash' : 'cash';
  if (listOfTaxes.value[taxesIdentifier]) {
    for (let tax of listOfTaxes.value[taxesIdentifier]) {
      taxes += tax.multiply ? totalTagihan.value * tax.tax : totalTagihan.value + tax.tax;
    }
  }
  return totalHarga.value - diskon + biayaLayanan.value + taxes;
});

const totalTicketCount = computed(() => {
  let totalCount = 0;
  for (const ticket of userCarts.value) {
    totalCount += ticket.amount;
  }
  return Number(totalCount);
});

// Payment Method Selection
const listOfTaxes = ref({});
const paymentSelection = ref('');
const paymentSelect = ref(false);
const showPaymentSelect = () => {
  paymentSelect.value = !paymentSelect.value;
};
const selectPayment = (paymentMethod) => {
  paymentSelection.value = paymentMethod;
  paymentSelect.value = false;
};

const fetchTaxes = async () => {
  try {
    const response = await fetch(`${DB_BASE_URL}/${TRANSACTION_BASE_URL}/list-tax`);
    if (!response.ok) throw new Error('Terjadi kesalahan');
    const responseData = await response.json();
    listOfTaxes.value.cash = responseData.data.data.cash.filter((tax) => tax.paidBy === "user");
    listOfTaxes.value.nonCash = responseData.data.data.nonCash.filter((tax) => tax.paidBy === "user");
  } catch (err) {
    console.log(err);
  }
};

// DateTime
const dateTime = () => {
  const inputDate = new Date(selectedDate.value);
  inputDate.setHours(inputDate.getHours() + 7);
  selectedDate.value = inputDate;
};

const checkoutStatus = ref('');
const paymentStatus = ref('');
const recentTransactionId = ref('');

const createTransaction = async () => {
  const order = userCarts.value
    .filter((item) => item.amount > 0)
    .map((item) => ({
      id: item.id,
      ...(item.nationalityId && { nationalityId: item.nationalityId }),
      ...(item.cityName && { cityName: item.cityName }),
      price: item.price,
      amount: item.amount,
      guideId: item.guideId
    }));

  dateTime();

  try {
    if (order.length < 1) throw new Error('No Item To Checkout');
    showLoader.value = true;
    const response = await fetch(
      `${DB_BASE_URL}/${TRANSACTION_BASE_URL}/create-transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customer: {
            name: custName.value,
            email: custEmail.value,
            number: custNumber.value
          },
          user: { connect: { id: userData.value.id } },
          plannedDate: selectedDate.value,
          method: paymentSelection.value.toUpperCase(),
          status: paymentStatus.value ? paymentStatus.value : 'DAPAT_DIGUNAKAN',
          origin: asalKota.value,
          discounts: discountValue.value,
          cashback: cashbackValue.value,
          order: order,
          taxes: listOfTaxes.value[paymentSelection.value === 'Cash' ? 'cash' : 'nonCash']
        })
      }
    );
    const responseData = await response.json();
    recentTransactionId.value = responseData.data.transaction.id;
    console.log(responseData);
    assignAlert(
      true,
      'Berhasil!',
      'success',
      'Transaksi berhasil dibuat. Silakan lanjut ke proses pembayaran.'
    );
    paymentStatus.value = 'CONFIRMED';
    checkoutStatus.value = 'created';
  } catch (error) {
    assignAlert(
      true,
      'Gagal',
      'danger',
      'Terjadi kesalahan dalam proses pembuatan transaksi. Coba lagi nanti.'
    );
    console.error('Transaction creation error:', error);
  } finally {
    showLoader.value = false;
  }
};

export default {
  setup() {
    return {
      nationalityData,
      selectedNationality,
      fetchNationalityData,
      nationalityQuery,
      nationalityResult,
      isNationalityDropdownOpen,
      showFlag,
      selectedFlagImageUrl,
      loadNationalityData,
      openNationalityDropdown,
      closeNationalityDropdown,
      getFlagImageUrl,
      getNationality,
      closeDropdownOutside,
      getUserCarts,
      addTicket,
      reduceTicket,
      custName,
      custEmail,
      custNumber,
      asalKota,
      selectedDate,
      discountValue,
      cashbackValue,
      cityName,
      biayaLayanan,
      biayaJasa,
      biayaJasaCard,
      maxTickets,
      fetchFeeSettings,
      formatCurrency,
      totalHarga,
      totalBiaya,
      totalTagihan,
      totalTicketCount,
      listOfTaxes,
      paymentSelection,
      paymentSelect,
      showPaymentSelect,
      selectPayment,
      fetchTaxes,
      dateTime,
      checkoutStatus,
      paymentStatus,
      recentTransactionId,
      createTransaction
    };
  }
};
