<!-- eslint-disable vue/html-self-closing -->
<!-- eslint-disable vue/attributes-order -->
<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900"
  >
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96">
      <h2
        class="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white"
      >
        Connexion
      </h2>

      <!-- Formulaire de connexion -->
      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 dark:text-white"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-2 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
            required
            placeholder="Votre email"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-gray-700 dark:text-white"
            >Mot de passe</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="w-full p-2 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
            required
            placeholder="Votre mot de passe"
          />
        </div>

        <!-- Bouton de connexion -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Se connecter
        </button>
      </form>

      <!-- Lien vers la page d'inscription -->
      <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
        Pas encore inscrit ?
        <NuxtLink
          to="/register"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Créez un compte
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "#imports";

const authStore = useAuthStore();

const email = ref<string>("");
const password = ref<string>("");
const router = useRouter();

interface LoginResponse {
  message: string;
  statusCode: number;
}

const handleSubmit = async () => {
  try {
    const response = await $fetch<LoginResponse>("/api/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (response.statusCode === 201) {
      authStore.login();
      router.push("/");
    } else {
      console.error("Erreur de connexion");
    }
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
  }
};
</script>

<style scoped>
/* Ajouter des styles spécifiques ici si nécessaire */
</style>
