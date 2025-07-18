<!-- eslint-disable vue/attributes-order -->
<template>
  <div>
    <!-- Navbar -->
    <nav class="bg-white dark:bg-gray-800 shadow-md p-4">
      <div class="flex justify-between items-center max-w-screen-xl mx-auto">
        <div class="text-2xl font-bold text-gray-900 dark:text-white">
          <NuxtLink to="/"> BrieflyAI </NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
          <!-- Bouton pour changer le mode -->
          <button @click="toggleTheme" class="text-gray-600 dark:text-white">
            <Icon
              :name="
                colorMode.preference === 'dark'
                  ? 'mdi:weather-sunny'
                  : 'mdi:moon-waning-crescent'
              "
              size="30"
            />
          </button>

          <!-- Si l'utilisateur est connecté -->
          <div v-if="authStore.isAuthenticated">
            <NuxtLink to="/chat">
              <button
                class="text-gray-600 dark:text-white px-4 py-2 rounded-lg hover:text-gray-900 dark:hover:text-zinc-600"
              >
                Discuter
              </button>
            </NuxtLink>
            <NuxtLink to="/summarizer">
              <button
                class="text-gray-600 dark:text-white px-4 py-2 rounded-lg hover:text-gray-900 dark:hover:text-zinc-600"
              >
                Résumer
              </button>
            </NuxtLink>
            <button
              @click="handleLogout"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Déconnexion
            </button>
          </div>

          <!-- Si l'utilisateur n'est pas connecté, afficher "Connexion" -->
          <div v-else>
            <NuxtLink to="/login">
              <button
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Connexion
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Contenu de la page -->
    <NuxtPage />
  </div>
</template>

<script setup>
import { useAuthStore } from "./stores/auth";

const colorMode = useColorMode();
const authStore = useAuthStore();
const router = useRouter();

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === "dark" ? "light" : "dark";
};

const handleLogout = async () => {
  try {
    const response = await $fetch("/api/logout", {
      method: "DELETE",
    });

    if (response.statusCode === 204) {
      authStore.logout();
      router.push("/");
    } else {
      console.error("Erreur lors de la déconnexion");
    }
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};
</script>

<style scoped></style>
