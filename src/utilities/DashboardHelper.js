import { ref, computed } from 'vue'
import GlobalHelper from './GlobalHelper'
import SettingsHelper from './SettingsHelper'
import LoginHelper from './LoginHelper'
import CheckoutHelper from './CheckoutHelper'

const { DB_BASE_URL, USER_BASE_URL, ORDER_BASE_URL, assignAlert, showLoader } = GlobalHelper
const { targetedData, fetchTargetedOrder } = SettingsHelper
const { userData, userCarts } = LoginHelper

const selectedItems = ref([])
const selectedItemToDelete = ref('')

const showCartPopup = ref(false)
const showConfirmationPopup = ref(false)
const showDeleteConfirmationPopup = ref(false)

const dataDashboard = ref([])
// const hasDomestik = ref(false)
// const hasMancanegara = ref(false)
const isMancanegara = ref(false)
const isDomestik = ref(false)
const fetchOrderList = async () => {
  try {
    const response = await fetch(`${DB_BASE_URL.value}/${ORDER_BASE_URL.value}/order-details`)
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    dataDashboard.value = res.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const formatCurrency = (amount) => {
  return Number(amount).toLocaleString('id-ID')
}

const navigateToAdd = () => {
  showConfirmationPopup.value = true
}

const closePopup = () => {
  showConfirmationPopup.value = false
  selectedItems.value = []
}

const increaseAmount = (item) => {
  if (item.amount >= CheckoutHelper.maxTickets.value) {
    assignAlert(true, 'Error', 'danger', `Maaf, tiket tidak bisa melebihi ${CheckoutHelper.maxTickets.value} tiket!`)
    item.amount = CheckoutHelper.maxTickets.value
  } else {
    item.amount++
  }
  saveToUserCarts()
}

const decreaseAmount = (item) => {
  if (item.amount > 0) {
    item.amount--
    saveToUserCarts()
  }
}

const selectItem = (item) => {
  const storedItems = userCarts.value || []
  console.log(storedItems)
  const existingItem = storedItems.find((i) => i.id === item.id)

  if (existingItem) {
    item.amount = existingItem.amount
  } else {
    item.amount = 0
  }

  item.selected = true
  selectedItems.value.push(item)
}

const saveToUserCarts = async () => {
  const storedItems = userCarts.value || []
  selectedItems.value.forEach((item) => {
    const existingItemIndex = storedItems.findIndex((i) => i.id === item.id)
    if (item.amount < 1) {
      if (existingItemIndex !== -1) {
        storedItems.splice(existingItemIndex, 1)
      }
    } else {
      if (existingItemIndex !== -1) {
        storedItems[existingItemIndex].amount = item.amount
      } else {
        storedItems.push(item)
      }
    }
  })
  await updateUserCarts(storedItems)
  isMancanegara.value = false
  isDomestik.value = false

  checkUserCarts()
}

const updateUserCarts = async (storedItems) => {
  try {
    const response = await fetch(`${DB_BASE_URL.value}/${USER_BASE_URL.value}/update-carts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        carts: storedItems,
        user: userData.value
      })
    })
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to update carts data')
    }
    showLoader.value = false
  } catch (error) {
    console.error('Error updating carts data:', error)
  }
}
const checkUserCarts = () => {
  if (userCarts.value && userCarts.value.length > 0) {
    let hasDomestik = false
    let hasMancanegara = false

    for (const item of userCarts.value) {
      if (item && item.category && item.category.name === 'Mancanegara') {
        hasMancanegara = true
      } else if (item && item.category && item.category.name !== 'Mancanegara') {
        hasDomestik = true
      }

      if (hasDomestik && hasMancanegara) {
        isDomestik.value = true
        isMancanegara.value = true
        return 'Domestik & Mancanegara'
      }
    }

    if (hasMancanegara) {
      isMancanegara.value = true
      return 'Mancanegara'
    } else if (hasDomestik) {
      isDomestik.value = true
      return 'Domestik'
    }
  }
  return ''
}


const handleCategorySelection = (filterCategory) => {
  if (filterCategory === 'Mancanegara') {
    dataDashboard.value.forEach((item) => {
      if (item.category.name !== 'Mancanegara') {
        item.disabled = true
      }
    })
  } else if (filterCategory === 'Not_Mancanegara') {
    dataDashboard.value.forEach((item) => {
      if (item.category.name === 'Mancanegara') {
        item.disabled = true
      }
    })
  } else {
    dataDashboard.value.forEach((item) => {
      item.disabled = false
    })
  }
}

const handleItemClick = (item) => {
  const filterCategory = ref(checkUserCarts())
  // handleCategorySelection(filterCategory.value)
  // if (item.disabled) {
  //   if (filterCategory.value === 'Mancanegara') {
  //     assignAlert(
  //       true,
  //       'Error',
  //       'danger',
  //       'Kamu tidak bisa memilih paket selain kategori mancanegara!'
  //     )
  //   } else {
  //     assignAlert(
  //       true,
  //       'Error',
  //       'danger',
  //       'Kamu tidak bisa memilih paket selain kategori umum atau pelajar!'
  //     )
  //   }
  // } else {
  // }
  selectItem(item)
}

const showCart = () => {
  showCartPopup.value = !showCartPopup.value
}
const showDeleteConfirmation = (id) => {
  showDeleteConfirmationPopup.value = true
  selectedItemToDelete.value = id
}
const closeDeletePopup = () => {
  showDeleteConfirmationPopup.value = false
  selectedItemToDelete.value = ''
}

const groupedItems = computed(() => {
  const grouped = {}
  dataDashboard.value.forEach((item) => {
    const category = item.category.name
    if (!grouped[category]) {
      grouped[category] = []
    }
    grouped[category].push(item)
  })

  const sortedGrouped = {}
  Object.keys(grouped)
    .sort((a, b) => b.localeCompare(a))
    .forEach((key) => {
      sortedGrouped[key] = grouped[key]
    })

  return sortedGrouped
})
const deleteOrder = async () => {
  try {
    showLoader.value = true
    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDER_BASE_URL.value}/order-action/delete/${encodeURIComponent(selectedItemToDelete.value)}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.ok) {
      showLoader.value = false
      userCarts.value = {}
      closePopup()
      closeDeletePopup()
      fetchOrderList()
      assignAlert(
        true,
        'Sukses',
        'success',
        `Pesanan ${targetedData.value.name} (${targetedData.value.category.name}) berhasil dihapus!`
      )
    } else {
      assignAlert(
        true,
        'Error',
        'danger',
        `Gagal menghapus pesanan ${targetedData.value.name} (${targetedData.value.category.name})!`
      )
    }
  } catch (error) {
    console.error(error)
  }
}
const confirmDelete = async () => {
  try {
    await fetchTargetedOrder(selectedItemToDelete.value)
    await deleteOrder()
  } catch (error) {
    console.error(error)
  }
}

export default {
  selectedItems,
  selectItem,
  showConfirmationPopup,
  showCartPopup,
  showCart,
  showDeleteConfirmation,
  showDeleteConfirmationPopup,
  confirmDelete,
  dataDashboard,
  isMancanegara,
  fetchOrderList,
  formatCurrency,
  navigateToAdd,
  closePopup,
  closeDeletePopup,
  increaseAmount,
  decreaseAmount,
  saveToUserCarts,
  handleItemClick,
  checkUserCarts,
  isDomestik,
  updateUserCarts,
  groupedItems
}
