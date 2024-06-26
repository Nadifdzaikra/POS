import { ref } from 'vue'
import GlobalHelper from './GlobalHelper'
import CheckoutHelper from './CheckoutHelper'

const {
  DB_BASE_URL,
  ORDER_BASE_URL,
  ORDERTYPE_BASE_URL,
  ORDERSUBTYPE_BASE_URL,
  CATEGORY_BASE_URL,
  GUIDE_BASE_URL,
  assignAlert,
  showLoader
} = GlobalHelper


const guideId = ref('')
const guideName = ref('')
const guideDesc = ref('')
const guideBirthdate = ref(null)
const guideGender = ref('')
const guideEmail = ref('')
const guideSelectedImageURL = ref('') // State to hold the selected image URL
const guideSelectedImage = ref(null) // State to hold the selected image File
const defaultImageURL = ref(
  'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
)
const guideImageName = ref('')

const targetedData = ref([])
const popupData = ref([])
const modePopup = ref('')
const isPopupVisible = ref(false)
const isSettingExtended = ref(false)
const popupTitle = ref('')
const dataTarget = ref([])
const modeExtension = ref('')

const fetchTargetedOrder = async (id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDER_BASE_URL.value}/order-details/${encodeURIComponent(id)}`
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    targetedData.value = res.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const fetchTargetedGuide = async (id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${GUIDE_BASE_URL.value}/guide-list/${encodeURIComponent(id)}`
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    targetedData.value = res.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const fetchOrderType = async () => {
  try {
    showLoader.value = true

    const response = await fetch(`${DB_BASE_URL.value}/${ORDERTYPE_BASE_URL.value}/type-details`)
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    popupData.value = res.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const fetchOrderSubType = async () => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERSUBTYPE_BASE_URL.value}/sub-type-details`
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    popupData.value = res.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const fetchCategory = async () => {
  try {
    showLoader.value = true

    const response = await fetch(`${DB_BASE_URL.value}/${CATEGORY_BASE_URL.value}/category-details`)
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    popupData.value = res.data
    showLoader.value = false
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const createOrderType = async (data) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERTYPE_BASE_URL.value}/type-action/create`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to create data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menambahkan Tipe!')
    fetchOrderType()
  } catch (error) {
    console.error('Error creating data:', error)
  }
}
const createOrderSubType = async (data) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERSUBTYPE_BASE_URL.value}/sub-type-action/create`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to create data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menambahkan Sub Tipe!')
    fetchOrderSubType()
  } catch (error) {
    console.error('Error creating data:', error)
  }
}
const createCategory = async (data) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${CATEGORY_BASE_URL.value}/category-action/create`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to create data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menambahkan Kategori!')
    fetchCategory()
  } catch (error) {
    console.error('Error creating data:', error)
  }
}
const createGuide = async (data) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${GUIDE_BASE_URL.value}/guide-action/create`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to create data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menambahkan Guide!')
    CheckoutHelper.fetchGuideData()
  } catch (error) {
    console.error('Error creating data:', error)
  }
}
const updateOrderType = async (data, id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERTYPE_BASE_URL.value}/type-action/update/${encodeURIComponent(id)}`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil mengubah Tipe!')
    fetchOrderType()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const updateOrderSubType = async (data, id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERSUBTYPE_BASE_URL.value}/sub-type-action/update/${encodeURIComponent(id)}`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil mengubah Sub Tipe!')
    fetchOrderSubType()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const updateCategory = async (data, id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${CATEGORY_BASE_URL.value}/category-action/update/${encodeURIComponent(id)}`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil mengubah Kategori!')
    fetchCategory()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const updateGuide = async (data, id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${GUIDE_BASE_URL.value}/guide-action/update/${encodeURIComponent(id)}`,
      {
        method: 'POST',
        body: data
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil mengubah Guide!')
    CheckoutHelper.fetchGuideData()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const deleteGuide = async (id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${GUIDE_BASE_URL.value}/guide-action/delete/${encodeURIComponent(id)}`,
      {
        method: 'POST'
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menghapus Guide!')
    CheckoutHelper.fetchGuideData()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const deleteOrderType = async (id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERTYPE_BASE_URL.value}/type-action/delete/${encodeURIComponent(id)}`,
      {
        method: 'POST'
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menghapus Tipe!')
    fetchOrderType()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const deleteOrderSubType = async (id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERSUBTYPE_BASE_URL.value}/sub-type-action/delete/${encodeURIComponent(id)}`,
      {
        method: 'POST'
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menghapus Sub Tipe!')
    fetchOrderSubType()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
const deleteCategory = async (id) => {
  try {
    showLoader.value = true

    const response = await fetch(
      `${DB_BASE_URL.value}/${CATEGORY_BASE_URL.value}/category-action/delete/${encodeURIComponent(id)}`,
      {
        method: 'POST'
      }
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    showLoader.value = false
    assignAlert(true, 'Sukses', 'success', 'Berhasil menghapus Kategori!')
    fetchCategory()
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}




export default {
  guideId,
  guideName,
  guideDesc,
  guideBirthdate,
  guideGender,
  guideEmail,
  guideSelectedImageURL,
  guideSelectedImage,
  guideImageName,
  defaultImageURL,
  fetchTargetedGuide,
  targetedData,
  popupData,
  modePopup,
  popupTitle,
  dataTarget,
  modeExtension,
  isPopupVisible,
  isSettingExtended,
  fetchTargetedOrder,
  fetchTargetedGuide,
  fetchOrderType,
  fetchOrderSubType,
  fetchCategory,
  createGuide,
  createOrderType,
  createOrderSubType,
  createCategory,
  updateGuide,
  updateOrderType,
  updateOrderSubType,
  updateCategory,
  deleteGuide,
  deleteOrderType,
  deleteOrderSubType,
  deleteCategory,
}
