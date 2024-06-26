import { ref, computed } from 'vue'
import GlobalHelper from '@/utilities/GlobalHelper'
import SettingsHelper from '@/utilities/SettingsHelper'

const { DB_BASE_URL, ORDERSUBTYPE_BASE_URL, assignAlert, showLoader, getImageURL } = GlobalHelper
const { targetedData } = SettingsHelper

const title = ref('')
const desc = ref('')
const category = ref('')
const categoryId = ref(null)
const orderType = ref('')
const orderTypeId = ref(null)
const orderSubType = ref('')
const orderSubTypeId = ref(null)
const orderPrice = ref(0)
const imageName = ref('')
const selectedImageURL = ref('')
const selectedImage = ref(null)
const defaultImageURL = ref(
  'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'
)
const submitAlert = ref(false)
const confirmAlert = ref(false)

const updatePrice = (amount) => {
  if (amount >= 1000000000000) {
    assignAlert(true, 'Error', 'danger', 'Maaf, harga tiket tidak bisa melebihi 1 Triliun Rupiah!')
    orderPrice.value = 1000000000000
  } else {
    orderPrice.value = amount
  }
}

const resetData = () => {
  title.value = ''
  desc.value = ''
  category.value = ''
  categoryId.value = null
  orderType.value = ''
  orderTypeId.value = null
  orderSubType.value = ''
  orderSubTypeId.value = null
  orderPrice.value = ''
  imageName.value = ''
  selectedImageURL.value = ''
  selectedImage.value = null
  submitAlert.value = false
  confirmAlert.value = false
}

const createFormData = (action) => {
  const formData = new FormData()
  formData.append('image', selectedImage.value)
  if (action === 'update') formData.append('imgName', imageName.value)
  formData.append('name', title.value)
  formData.append('desc', desc.value ? desc.value : '')
  formData.append('categoryId', categoryId.value)
  formData.append('orderSubTypeId', orderSubTypeId.value)
  formData.append('price', parseFloat(orderPrice.value))
  return formData
}
const handleFileSelected = (file) => {
  const imageURL = URL.createObjectURL(file)
  selectedImage.value = file
  selectedImageURL.value = imageURL
}

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(orderPrice.value)
})

const updateCategory = (value) => {
  category.value = value[0].name
  categoryId.value = value[0].id
}

const getEmptyFields = () => {
  const emptyFields = []
  if (!title.value.trim()) {
    emptyFields.push('Judul')
  }
  if (!desc.value.trim()) {
    emptyFields.push('Desc')
  }
  if (!category.value.trim()) {
    emptyFields.push('Kategori')
  }
  if (!String(orderPrice.value).trim()) {
    emptyFields.push('Harga')
  }
  if (!String(orderType.value).trim()) {
    emptyFields.push('Tipe Tiket')
  }
  if (!String(orderSubType.value).trim()) {
    emptyFields.push('Subtipe Tiket')
  }
  return emptyFields
}
const confirmAdd = () => {
  const emptyFields = getEmptyFields()

  if (emptyFields.length > 0) {
    GlobalHelper.assignAlert(
      true,
      'Error',
      'danger',
      `Isi kolom ${emptyFields.join(', ')} terlebih dahulu.`
    )
    return
  }

  confirmAlert.value = true
}

const isSubtypeDropdownOpen = ref(false)

const toggleSubtypeDropdown = () => {
  if (isSubtypeDisabled.value) {
    assignAlert(true, 'Error', 'danger', 'Tolong pilih tipe tiket terlebih dahulu!')
  } else {
    isSubtypeDropdownOpen.value = !isSubtypeDropdownOpen.value
  }
}

const selectSubtypeOption = (id, name) => {
  orderSubTypeId.value = id
  orderSubType.value = name
  isSubtypeDropdownOpen.value = false
}

const isSubtypeDisabled = computed(() => {
  return !orderType.value
})

const subTypeOptions = ref([])

const fetchOrderSubType = async (id) => {
  try {
    const response = await fetch(
      `${DB_BASE_URL.value}/${ORDERSUBTYPE_BASE_URL.value}/sub-type-details/${encodeURIComponent(id)}`
    )
    if (!response.ok) {
      showLoader.value = false
      throw new Error('Failed to fetch data')
    }
    const res = await response.json()
    subTypeOptions.value = res.data
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

const combinedOrderType = computed(() => {
  const type = orderType.value || 'Tipe Tiket'
  const subtype = orderSubType.value || 'Subtipe Tiket'
  return `${type} | ${subtype}`
})

const updateOrderType = (value) => {
  orderType.value = value[0].name
  orderTypeId.value = value[0].id
}

const closeDropdownOnClickOutside = (event) => {
  if (
    !event.target.closest('.subtype__input-dropdown') &&
    !event.target.closest('.subtype__input-dropdown_menu')
  ) {
    isSubtypeDropdownOpen.value = false
  }
}

const assignEditData = () => {
  const data = targetedData.value
  title.value = data.name
  desc.value = data.desc
  orderPrice.value = data.price
  categoryId.value = data.category ? data.category.id : 0
  category.value = data.category ? data.category.name : ''
  orderTypeId.value = data.orderSubType ? data.orderSubType.orderType.id : 0
  orderType.value = data.orderSubType ? data.orderSubType.orderType.name : ''
  orderSubTypeId.value = data.orderSubType ? data.orderSubType.id : 0
  orderSubType.value = data.orderSubType ? data.orderSubType.name : ''
  imageName.value = data.image ? data.image : ''
  selectedImageURL.value = data.image ? getImageURL(data.image) : ''
}

export default {
  title,
  desc,
  category,
  categoryId,
  orderPrice,
  imageName,
  selectedImageURL,
  selectedImage,
  defaultImageURL,
  submitAlert,
  confirmAlert,
  updatePrice,
  resetData,
  createFormData,
  handleFileSelected,
  formattedPrice,
  updateCategory,
  getEmptyFields,
  confirmAdd,
  orderType,
  orderTypeId,
  orderSubType,
  orderSubTypeId,
  isSubtypeDropdownOpen,
  toggleSubtypeDropdown,
  selectSubtypeOption,
  isSubtypeDisabled,
  subTypeOptions,
  fetchOrderSubType,
  combinedOrderType,
  updateOrderType,
  closeDropdownOnClickOutside,
  assignEditData
}
