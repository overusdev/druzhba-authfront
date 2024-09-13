<template>
  <div class="auth">
    <div class="auth__wrapper">
      <h3 class="text-h4">Пожалуйста, авторизуйтесь</h3>
      <div class="auth__form-wrapper">
        <pre>{{ userData }}</pre>
        <q-input
          v-model="authPhone"
          mask="##########"
          :dense="dense"
          label="Номер телефона администратора без префикса"
          class="auth__input"
          />
          <q-btn
            color="secondary"
            label="Войти"
            @click="checkPhone"/>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, reactive, onMounted } from 'vue';
import gql from 'graphql-tag';
import { useQuery, useLazyQuery } from "@vue/apollo-composable";
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
    const competedPhone = ref('');
    const dense = ref(false);
    const cache = new InMemoryCache();
    const httpLink = new HttpLink({
      uri: 'http://localhost:3001/graphql',
    });
    const gqlClient = new ApolloClient({
      link: httpLink,
      cache,
    });

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
          console.log(graphql);
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
          }
          resolve(graphql.result.value || []);
        });
        graphql.onError(() => {
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
            checkPhone,
            competedPhone,
            httpLink,
            gqlClient,
            cache,
        }
    },
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
