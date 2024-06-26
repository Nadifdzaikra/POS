<script setup>
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import GlobalHelper from "src/utilities/GlobalHelper";
import LoginHelper from "src/utilities/LoginHelper";

const $q = useQuasar();
const router = useRouter();
const { loggedIn, username, password, userLogin, isAuthenticated } =
  LoginHelper;

const checkLogin = async () => {
  try {
    await userLogin();
    const authenticated = await isAuthenticated();
    if (authenticated) {
      GlobalHelper.assignAlert(
        true,
        "Sukses",
        "success",
        `Login berhasil! Selamat datang ${username.value}`
      );
      router.replace("/");
    }
  } catch (error) {
    GlobalHelper.assignAlert(true, "Error", "danger", "Login gagal!");
    console.error(error);
  }
};

const showPasswordText = ref("Show Password");
const passwordFieldType = ref("password");

const toggleShowPassword = () => {
  if (passwordFieldType.value === "password") {
    passwordFieldType.value = "text";
    showPasswordText.value = "Hide Password";
  } else {
    passwordFieldType.value = "password";
    showPasswordText.value = "Show Password";
  }
};

watch(loggedIn, (newValue) => {
  if (newValue) {
    loggedIn.value = newValue;
  }
});
</script>

<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="login flex flex-center">
        <q-card class="login-container q-pa-md q-mx-auto">
          <div class="login-container__content-img q-my-md">
            <img
              src="../assets/images/Logo KKC.svg"
              alt="Logo Keraton Kasepuhan Cirebon"
            />
          </div>
          <q-form @submit.prevent="checkLogin">
            <div class="txtLogin">LOGIN</div>
            <q-input
              v-model="username"
              placeholder="Username"
              outlined
              dense
              class="q-mb-md"
              id="username"
              required
            />
            <q-input
              v-model="password"
              :type="passwordFieldType"
              placeholder="Password"
              outlined
              dense
              class="q-mb-md"
              id="password"
              required
            >
              <template v-slot:append>
                <q-icon
                  :name="
                    showPasswordText === 'Hide Password'
                      ? 'visibility_off'
                      : 'visibility'
                  "
                  @click="toggleShowPassword"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <q-btn
              label="Login"
              color="primary"
              @click="checkLogin"
              class="q-mt-md"
              type="submit"
              size="lg"
              rounded
            />
          </q-form>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
main {
  font-family: "Raleway";
}

.login {
  background-image: url(../assets/images/bglogin2.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-container {
  background-color: rgba(255, 255, 255, 0.844);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  width: 400px; /* ukuran untuk layar desktop */
  height: auto;
  font-family: "Poppins";
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  height: 500px; /* tinggi card login */
}

.login-container__content-img {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.login-container__content-img img {
  width: 150px;
  height: 150px;
}

.input-field {
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 20px;
  resize: none;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0.5);
  transition: border-color 0.3s, box-shadow 0.3s;
  outline: none;
}

.input-field:focus {
  border-color: #ffd978;
}

.input-field::placeholder {
  opacity: 0.5;
}
.login-button {
  width: 100%;
  text-align: center;
  margin-top: 3px;
}

.login-btn {
  width: 65%;
  padding: 12px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 20px;
  background-color: #ffd978;
  color: black;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: bold;
}

.login-btn:hover {
  background-color: #e6be58;
}

.txtLogin {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 0.7px;
}

.password-input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  top: 52%;
  right: 10px;
  transform: translateY(-50%);
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.password-toggle-btn:focus {
  outline: none;
}

/* Media query untuk tablet dengan lebar maksimum 768px */
@media only screen and (max-width: 768px) {
  .login-container {
    width: 90%; /* Mengubah lebar container untuk tablet */
    padding: 1rem; /* Mengubah padding container untuk tablet */
    height: 450px; /* Mengubah tinggi card login untuk tablet */
  }

  .login-container__content-img img {
    width: 100px; /* Mengubah ukuran gambar untuk tablet */
    height: 100px; /* Mengubah ukuran gambar untuk tablet */
    margin-bottom: 20px; /* Mengubah margin bawah gambar untuk tablet */
  }

  .input-field {
    font-size: 14px; /* Mengubah ukuran font input untuk tablet */
    padding: 10px 15px; /* Mengubah padding input untuk tablet */
    margin: 8px 0; /* Mengubah margin input untuk tablet */
  }

  .login-btn {
    width: 70%; /* Mengubah lebar tombol login untuk tablet */
    padding: 10px 15px; /* Mengubah padding tombol login untuk tablet */
    font-size: 14px; /* Mengubah ukuran font tombol login untuk tablet */
  }

  .txtLogin {
    font-size: 20px; /* Mengubah ukuran font judul login untuk tablet */
    margin-bottom: 15px; /* Mengubah margin bawah judul login untuk tablet */
  }
}
.login-container__content-img img {
  width: 150px;
  height: 150px;
}

.txtLogin {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  font-weight: 600;
  letter-spacing: 0.7px;
}

/* Media query untuk tablet dengan lebar maksimum 768px */
@media only screen and (max-width: 768px) {
  .login-container {
    width: 90%;
    padding: 1rem;
  }

  .login-container__content-img img {
    width: 100px;
    height: 100px;
    margin-bottom: 20px;
  }

  .txtLogin {
    font-size: 20px;
    margin-bottom: 15px;
  }
}
</style>
