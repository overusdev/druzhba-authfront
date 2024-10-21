<template>
  <div class="auth">
    <div class="auth__wrapper">
      <template v-if="!showGreeting">
        <h3 class="text-h4">Пожалуйста, авторизуйтесь</h3>
        <div class="auth__form-wrapper">
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
            color="primary"
            label="Войти"
            class="auth__button"
            @click="sendAuth"
          />
        </div>
      </template>
      <template v-else>
        <p class="text-body2">{{ greetingTextMessage }}</p>
        <q-spinner-puff color="teal" size="5.5em" />
      </template>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue';
import gql from 'graphql-tag';
import { useQuery, useMutation } from "@vue/apollo-composable";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client/core";
import { provideApolloClient } from "@vue/apollo-composable";

export default {
  setup () {
    const router = useRouter();
    const route = useRoute();
    const authPhone = ref('');
    const authPassword = ref('');
    const dense = ref(false);
    const isPwd = ref(true);
    const showGreeting = ref(false);
    const showErrorMessage = ref(false);
    const errorTextMessage = ref('');
    const greetingTextMessage = ref('');
    const cache = new InMemoryCache();
    const httpLink = new HttpLink({
      uri: 'http://localhost:3001/graphql'
    });
    const gqlClient = new ApolloClient({
      link: httpLink,
      credentials: 'include',
      cache,
    });
    const disable = computed(() => authPhone.value.length < 10);

    function hideErrorBanner(){
      showErrorMessage.value = false;
    }

    const { mutate: sendAuth, data, onDone } = useMutation(gql`
        mutation login(
            $phone: String!,
            $password: String!,
        ){
            login(data: { 
                phone: $phone,
                password: $password,
            })  {
                user {
                  id
                  name
                }
                token
              }
            }
        `, () => ({
                variables: {
                    phone: authPhone.value,
                    password: authPassword.value,
                },
            })
    );


    onDone(result => {
      const referrerLink = document.referrer || 'http://localhost:8000/users';
      showGreeting.value = true;
      setCookie('dr_access_token', result.data.login.token);
      setTimeout(() => {
        window.location.replace(referrerLink);
      }, 2500)
    })

    function deleteCookie(name) {
        setCookie(name, "", {
          'max-age': -1
        })
      }
    
    function setCookie(name, value, options = {}) {
    
        options = {
          path: '/',
          ...options
        };
      
        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        }
      
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      
        for (let optionKey in options) {
          updatedCookie += "; " + optionKey;
          let optionValue = options[optionKey];
          if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
          }
        }
      
        document.cookie = updatedCookie;
    }

        return {
            router,
            route,
            dense,
            authPhone,
            authPassword,
            httpLink,
            gqlClient,
            cache,
            disable,
            isPwd,
            errorTextMessage,
            hideErrorBanner,
            showErrorMessage,
            showGreeting,
            greetingTextMessage,
            sendAuth,
            data,
            setCookie,
            deleteCookie,
        }
    },
}
</script>

<style scoped lang="scss">
.auth {
  height: 100vh;
  display: flex;
  justify-content: center;
  padding: 20px;

  &__wrapper {

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
