<template>
  <div class="auth">
    <div class="auth__wrapper">
      <!-- {{ showGreeting }} -->
      <template v-if="!showGreeting">
        <h3 class="text-h4">Пожалуйста, авторизуйтесь</h3>
        <div class="auth__form-wrapper">
          <!-- <pre>{{ userData }}</pre> -->
          <q-banner
            v-if="showErrorMessage"
            inline-actions
            class="text-white bg-red auth__input"
          >
            {{ errorTextMessage }}
            <template v-slot:action>
              <q-btn
                flat
                color="white"
                label="Закрыть"
                @click="hideErrorBanner"
              />
            </template>
          </q-banner>
          <q-input
            v-if="showPhoneField"
            v-model="authPhone"
            mask="##########"
            :dense="dense"
            label="Номер телефона без префикса"
            class="auth__input"
          >
            <template v-slot:prepend>
              +7
            </template>
          </q-input>
          <q-input
            v-if="showPasswordField"
            v-model="authPassword"
            :type="isPwd ? 'password' : 'text'"
            hint="Введите пароль, предоставленный предстедателем СНТ"
            label="Пароль участка"
            class="auth__input"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-btn
            v-if="showPhoneField"
            color="primary"
            label="Отправить"
            class="auth__button"
            :disable="disable"
            @click="checkPhone"
          />
          <q-btn
            v-if="showPasswordField"
            color="primary"
            label="Войти"
            class="auth__button"
            @click="checkPassword"
          />
        </div>
      </template>
      <template v-else>
        <p class="text-body2">{{ greetingTextMessage }}</p>
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue';
import gql from 'graphql-tag';
import { useQuery } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";

export default {
  setup () {
    const router = useRouter();
    const route = useRoute();
    const userData = reactive({
        name: '',
        surname: '',
        patronymic: '',
        isAdmin: false,
        area: '',
        phone: '',
        password: '',
        role: '',
        note: ''
    });
    const authPhone = ref('');
    const authPassword = ref('');
    const dense = ref(false);
    const isPwd = ref(true);
    const showGreeting = ref(false);
    const showPhoneField = ref(true);
    const showPasswordField = ref(false);
    const showErrorMessage = ref(false);
    const errorTextMessage = ref('');
    const greetingTextMessage = ref('');
    const cache = new InMemoryCache();
    const httpLink = new HttpLink({
      uri: 'http://localhost:3001/graphql',
    });
    const gqlClient = new ApolloClient({
      link: httpLink,
      cache,
    });
    const disable = computed(() => authPhone.value.length < 10);

    function hideErrorBanner(){
      showErrorMessage.value = false;
    }

    async function checkPhone() {
      provideApolloClient(gqlClient);
      const graphql = useQuery(
        gql`
          query findByPhone($phone: String!) {
            userByPhone(phone: $phone) {
              id
              name
              surname
              patronymic
              area
              phone
              isAdmin
              password
              role
              note
            }
          }
        `,
        { phone: authPhone.value },
        {
          fetchPolicy: "no-cache",
        }
      );
      return new Promise((resolve, reject) => {
        graphql.onResult(() => {
          if(graphql.result.value.userByPhone) {
            userData.id = graphql.result.value.userByPhone.id;
            userData.name = graphql.result.value.userByPhone.name;
            userData.surname = graphql.result.value.userByPhone.surname;
            userData.patronymic = graphql.result.value.userByPhone.patronymic;
            userData.area = graphql.result.value.userByPhone.area;
            userData.phone = graphql.result.value.userByPhone.phone;
            userData.isAdmin = graphql.result.value.userByPhone.isAdmin;
            userData.password = graphql.result.value.userByPhone.password;
            userData.role = graphql.result.value.userByPhone.role;
            userData.note = graphql.result.value.userByPhone.note;
            showPasswordField.value = true;
            showPhoneField.value = false;
          }
          resolve(graphql.result.value || []);
        });
        graphql.onError(() => {
          showErrorMessage.value = true;
          errorTextMessage.value = 'Пользователь с таким номером на найден';
          showPasswordField.value = false;
          showPhoneField.value = true;
          reject();
        });
      });
    }
    async function checkPassword() {
      provideApolloClient(gqlClient);
      const graphql = useQuery(
        gql`
          query findByPassword($password: String!) {
              userByPassword(password: $password) {
                  id
                  name
                  surname
                  patronymic
                  area
                  phone
                  isAdmin
                  password
                  role
                  note
              }
          }
        `,
        { password: authPassword.value },
        {
          fetchPolicy: "no-cache",
        }
      );
      return new Promise((resolve, reject) => {
        graphql.onResult(() => {
          if(graphql.result.value.userByPassword) {
            showGreeting.value = true;
            greetingTextMessage.value = `Добро пожаловать, ${userData.name}!`;
          }
          resolve(graphql.result.value || []);
        });
        graphql.onError(() => {
          showErrorMessage.value = true;
          errorTextMessage.value = 'Пароль неверный. Обратитесь к предстедателю';
          reject();
        });
      });
    }

        return {
            userData,
            router,
            route,
            dense,
            authPhone,
            authPassword,
            checkPhone,
            checkPassword,
            httpLink,
            gqlClient,
            cache,
            disable,
            isPwd,
            showPasswordField,
            showPhoneField,
            errorTextMessage,
            hideErrorBanner,
            showErrorMessage,
            showGreeting,
            greetingTextMessage,
        }
    },
}
</script>

<style scoped lang="scss">
.auth {
  display: flex;
  justify-content: center;
  padding: 20px;

  &__wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  &__form-wrapper {
    width: 100%;
  }

  &__input {
    margin-bottom: 24px;
  }

  &__button {
    width: 100%;
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
