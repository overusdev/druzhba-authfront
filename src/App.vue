<template>
  <div class="auth">
    <div class="auth__wrapper">
      <template v-if="!showGreeting">
        <h3 class="auth__header">Пожалуйста, авторизуйтесь</h3>
        <div class="auth__form-wrapper">
          <div
            v-if="showErrorMessage"
            inline-actions
            class="auth__warning"
          >
            <p class="auth__warning-text">{{ errorTextMessage }}</p>
            <q-icon name="close" color="red" @click="hideErrorBanner"/>
          </div>
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
          <button
            class="auth__button"
            @click="sendAuth"
          >
            Войти
          </button>
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
// import { provideApolloClient } from "@vue/apollo-composable";
// import { logErrorMessages } from '@vue/apollo-util';
// import { onError } from '@apollo/client/link/error';


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

    const domainApi = import.meta.env.MODE === 'production'
      ? 'https://druzba-nn.ru/graphql'
      : 'http://localhost:3001/graphql';
    const httpLink = new HttpLink({
      uri: domainApi
    });

    const gqlClient = new ApolloClient({
      link: httpLink,
      // credentials: 'include',
      // credentials: 'same-origin',
      fetchOptions: {
        mode: 'no-cors'
      },
      cache,
    });
    const disable = computed(() => authPhone.value.length < 10);

    function hideErrorBanner(){
      showErrorMessage.value = false;
    }

    const { mutate: sendAuth, data, onDone, onError } = useMutation(gql`
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
      const domain = import.meta.env.MODE === 'production'
        ? 'https://lk.druzba-nn.ru/users'
        : 'http://localhost:8000/users';
      const referrerLink = document.referrer || domain;
      showGreeting.value = true;
      setCookie('dr_access_token', result.data.login.token);
      // localStorage.setItem('dr_access_token', result.data.login.token);
      setTimeout(() => {
        window.location.replace(referrerLink);
      }, 1000)
    })

    onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors)
        showErrorMessage.value = true;
        graphQLErrors.map(({ message, locations, path }) => {
            if (message === 'Incorect Password') {
              errorTextMessage.value = 'Введен некорректный пароль';
            }
            if (message === "Cannot read properties of null (reading 'bcryptpassword')") {
              errorTextMessage.value = 'Введен некорректный номер телефона';
            }
          }
        )

      if (networkError) console.log(`[Network error]: ${networkError}`)
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
  padding: 10px;

  @media screen and (min-width: 768px) {
    padding: 20px;
  }

  &__header {
    width: 100%;
    font-size: 18px;
    font-weight: 400;
    line-height: 24px;
    margin-top: 0;
    // @media screen and (min-width: 768px) {
    //   padding: 20px;
    // }
  }

  &__wrapper {
    width: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    @media screen and (min-width: 768px) {
      width: 420px;
    }
  }

  &__form-wrapper {
    width: 100%;
  }

  &__input {
    margin-bottom: 38px;
    @media screen and (min-width: 768px) {
      margin-bottom: 24px;
    }
  }

  &__warning {
    min-height: 60px;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    border-radius: 12px;
    border: 2px solid red;
  }

  &__warning-text {
    color: #b84040;
    margin-bottom: 0;
  }

  &__button {
    line-height: 1.5;
    font-size: 18px;
    width: 100%;
    padding: 12px 6px;
    border-radius: 12px;
    border: 2px solid #307526;
    background: #307526;
    color: #fff;
    cursor: pointer;
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
