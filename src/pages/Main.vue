<template>
    <div class="q-pa-md">
        <!-- <h1 class="text-h3">This is a Main route-page</h1>
        <div class="q-pa-md q-gutter-sm">
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
                    @click="checkPhone"/>
            </div>
        </div> -->
    </div>
</template>

<script>
// import { ref, computed, reactive, onMounted } from 'vue';
// import gql from 'graphql-tag';
// import { useQuery } from "@vue/apollo-composable";
// import { useRouter } from "vue-router";
// import { useRoute } from "vue-router";

// export default {
//   setup () {
//     const router = useRouter();
//     const route = useRoute();
//     const userData = reactive({
//         name: '',
//         surname: '',
//         patronymic: '',
//         isAdmin: false,
//         area: '',
//         phone: '',
//         password: '',
//         role: '',
//         note: ''
//     });
//     const authPhone = ref('');
//     const USERS = gql`
//         query findOneByPhone($phone: Int!) {
//             user(phone: $phone) {
//                 id
//                 name
//                 surname
//                 patronymic
//                 area
//                 phone
//                 isAdmin
//                 password
//                 role
//                 note
//             }
//         }
//     `;
//     const { result, loading, error, refetch } = useQuery(USERS, () => ({
//         phone: authPhone.value,
//     }));
//     const user = computed(() => result ?? []);

//     async function checkPhone() {
//         const refetchQuery = await refetch();
//         if(refetchQuery.data.user) {
//             userData.id = refetchQuery.data.user.id;
//             userData.name = refetchQuery.data.user.name;
//             userData.surname = refetchQuery.data.user.surname;
//             userData.patronymic = refetchQuery.data.user.patronymic;
//             userData.area = refetchQuery.data.user.area;
//             userData.phone = refetchQuery.data.user.phone;
//             userData.isAdmin = refetchQuery.data.user.isAdmin;
//             userData.password = refetchQuery.data.user.password;
//             userData.role = refetchQuery.data.user.role;
//             userData.note = refetchQuery.data.user.note;
//         }
//     }

//     // onMounted(async () => {
//     //     const refetchQuery = await refetch();
//     //     if(refetchQuery.data.user) {
//     //         userData.id = refetchQuery.data.user.id;
//     //         userData.name = refetchQuery.data.user.name;
//     //         userData.surname = refetchQuery.data.user.surname;
//     //         userData.patronymic = refetchQuery.data.user.patronymic;
//     //         userData.area = refetchQuery.data.user.area;
//     //         userData.phone = refetchQuery.data.user.phone;
//     //         userData.isAdmin = refetchQuery.data.user.isAdmin;
//     //         userData.password = refetchQuery.data.user.password;
//     //         userData.role = refetchQuery.data.user.role;
//     //         userData.note = refetchQuery.data.user.note;
//     //     }
//     // });

//         return {
//             userData,
//             result,
//             loading,
//             refetch,
//             router,
//             route,
//             user,
//             authPhone,
//             checkPhone,
//         }
//     },
// }
</script>
