<template>
  <div class="auth">
    <div class="auth__wrapper">
      <h3 class="text-h4">Пожалуйста, авторизуйтесь</h3>
      <div class="auth__form-wrapper">
        <q-input
          v-model="authPhone"
          label="Номер телефона администратора без префикса"
          mask="##########"
          :dense="dense"
          class="auth__input"
          />
          <q-btn
            color="secondary"
            label="Войти"
            :disable="!canAuth"
            @click="setAuth"/>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useGeometryStore } from './stores/geometry';
import { useAuthStore } from './stores/auth';

const drawer = ref(false);
const store = useGeometryStore();
const authStore = useAuthStore();
const drawerHeight = computed(() => store.isMobile ? 200 : 300);
const authPhone = ref('');
const mockAuthPhone = ref('9535512834');
const dense = ref(false);
const canAuth = computed(() => authPhone.value === mockAuthPhone.value );

function setAuth() {
  authStore.signIn();
}
function logOut() {
  const authPhone = '';
  authStore.signOut();
}


</script>
<style scoped lang="scss">
.auth {
  display: flex;
  justify-content: center;

  &__input {
    margin-bottom: 24px;
  }
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
