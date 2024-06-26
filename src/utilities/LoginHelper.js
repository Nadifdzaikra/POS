import { ref } from 'vue'
import GlobalHelper from './GlobalHelper'

const { DB_BASE_URL, USER_BASE_URL, assignAlert, showLoader } = GlobalHelper

const loggedIn = ref(false)

const username = ref('')
const password = ref('')
const userData = ref([])
const userCarts = ref([])

const isAuthenticated = async () => {
  const token = getCookie('token')
  if (token) {
    try {
      const success = await authLogin(token)

      if (success) {
        loggedIn.value = true
        return true
      } else {
        loggedIn.value = false
        return false
      }
    } catch (error) {
      console.error(error)
      removeCookie('token')
      return false
    }
  }
  return false
}

const authLogin = async (token) => {
  try {
    const response = await fetch(`${DB_BASE_URL.value}/${USER_BASE_URL.value}/admin-auth`, {
      headers: {
        Authorization: token
      }
    })

    if (!response.ok) {
      const error = await response.json()
      showLoader.value = false
      removeCookie('token')
      return false
      throw new Error(error.message)
    }

    const res = await response.json()
    if (res.data) {
      userData.value = res.data
      userCarts.value = Object.values(res.data.carts)
      showLoader.value = false
      return true
    } else {
      removeCookie('token')
      return false
    }
  } catch (error) {
    console.error(error)
    return false
  }
}

const userLogin = async () => {
  try {
    showLoader.value = true

    const response = await fetch(`${DB_BASE_URL.value}/${USER_BASE_URL.value}/admin-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: username.value,
        password: password.value
      })
    })

    if (!response.ok) {
      const error = await response.json()
      showLoader.value = false
      removeCookie('token')
      assignAlert(true, 'Error', 'danger', `Login gagal! ${error.message}`)
      throw new Error(error.message)
    }

    const res = await response.json()
    setCookie('token', res.data, 1)
    isAuthenticated()
  } catch (error) {
    console.error(error)
  }
}

const userLogout = () => {
  removeCookie('token')
  loggedIn.value = false
  userData.value
    ? assignAlert(true, 'Sukses', 'success', `${userData.value.name} berhasil logout!`)
    : null
  userData.value = []
}
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}
const setCookie = (name, value, days) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}
const removeCookie = (name) => {
  document.cookie = `${name}=; Max-Age=-99999999;`
}

export default {
  loggedIn,
  username,
  password,
  isAuthenticated,
  userLogin,
  userLogout,
  userData,
  userCarts,
  getCookie,
  setCookie,
  removeCookie
}
