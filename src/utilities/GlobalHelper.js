import { ref } from 'vue'

const DB_BASE_URL = ref('http://localhost:3000')
// const DB_BASE_URL = ref('https://api-prmn.curaweda.com:3031')
const USER_BASE_URL = ref('keraton-pos/user')
const TRANSFER_URL = ref('curaweda-income')
const ORDER_BASE_URL = ref('keraton-pos/order')
const ORDERTYPE_BASE_URL = ref('keraton-pos/order-type')
const ORDERSUBTYPE_BASE_URL = ref('keraton-pos/order-subtype')
const CATEGORY_BASE_URL = ref('keraton-pos/category')
const TRANSACTION_BASE_URL = ref('keraton-pos/transaction')
const DETAILTRANS_BASE_URL = ref('keraton-pos/detail-trans')
const GUIDE_BASE_URL = ref('keraton-pos/guide')
const NATIONALITY_BASE_URL = ref('keraton-pos/nationality')
const LOGS_BASE_URL = ref('keraton-pos/logs')

const showLoader = ref(false)

const sendQueue = ref([])

const showAlert = ref(false)
const alertTitle = ref('')
const alertType = ref('')
const alertMessage = ref('')

const giveAccessRoute = ref(false)
const grantAccessRoute = (value) => {
  giveAccessRoute.value = value
}

const assignAlert = (show, title, type, message) => {
  showAlert.value = show
  alertTitle.value = title
  alertType.value = type
  alertMessage.value = message
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}
const getImageURL = (imageName) => {
  if (imageName.startsWith('http')) {
    return imageName
  } else if (imageName.startsWith('./public')) {
    const formattedImageName = imageName.substring(8)
    return `${DB_BASE_URL.value}/${formattedImageName}`
  } else {
    return `${DB_BASE_URL.value}/uploads/${imageName}`
  }
}

export default {
  DB_BASE_URL,
  USER_BASE_URL,
  ORDER_BASE_URL,
  ORDERTYPE_BASE_URL,
  ORDERSUBTYPE_BASE_URL,
  CATEGORY_BASE_URL,
  TRANSACTION_BASE_URL,
  DETAILTRANS_BASE_URL,
  GUIDE_BASE_URL,
  NATIONALITY_BASE_URL,
  LOGS_BASE_URL,
  giveAccessRoute,
  grantAccessRoute,
  assignAlert,
  showLoader,
  sendQueue,
  showAlert,
  alertTitle,
  alertType,
  TRANSFER_URL,
  alertMessage,
  getImageURL
}
