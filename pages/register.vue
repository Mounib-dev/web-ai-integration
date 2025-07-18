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
        Inscription
      </h2>

      <!-- Formulaire d'inscription -->
      <form @submit.prevent="handleSubmit">
        <!-- Prénom -->
        <div class="mb-4">
          <label for="firstName" class="block text-gray-700 dark:text-white"
            >Prénom</label
          >
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            class="w-full p-2 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': errors.firstName }"
            required
            placeholder="Votre prénom"
          />
          <p v-if="errors.firstName" class="text-red-500 text-sm">
            {{ errors.firstName }}
          </p>
        </div>

        <!-- Nom -->
        <div class="mb-4">
          <label for="lastName" class="block text-gray-700 dark:text-white"
            >Nom</label
          >
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            class="w-full p-2 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': errors.lastName }"
            required
            placeholder="Votre nom"
          />
          <p v-if="errors.lastName" class="text-red-500 text-sm">
            {{ errors.lastName }}
          </p>
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-gray-700 dark:text-white"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="w-full p-2 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white"
            :class="{ 'border-red-500': errors.email }"
            required
            placeholder="Votre email"
          />
          <p v-if="errors.email" class="text-red-500 text-sm">
            {{ errors.email }}
          </p>
        </div>

        <!-- Mot de passe -->
        <div class="mb-4 relative">
          <label for="password" class="block text-gray-700 dark:text-white"
            >Mot de passe</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            id="password"
            v-model="password"
            class="w-full p-2 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white pr-10"
            :class="{ 'border-red-500': errors.password }"
            required
            placeholder="Votre mot de passe"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute mt-4 right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-white"
          >
            <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
          </button>
          <p v-if="errors.password" class="text-red-500 text-sm">
            {{ errors.password }}
          </p>
        </div>

        <!-- Confirmation du mot de passe -->
        <div class="mb-4 relative">
          <label
            for="confirmPassword"
            class="block text-gray-700 dark:text-white"
            >Confirmer le mot de passe</label
          >
          <input
            :type="showPassword ? 'text' : 'password'"
            id="confirmPassword"
            v-model="confirmPassword"
            class="w-full p-2 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white pr-10"
            :class="{ 'border-red-500': errors.confirmPassword }"
            required
            placeholder="Confirmer votre mot de passe"
          />
          <button
            type="button"
            @click="togglePassword"
            class="absolute mt-4 right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-white"
          >
            <Icon :name="showPassword ? 'mdi:eye-off' : 'mdi:eye'" />
          </button>
          <p v-if="errors.confirmPassword" class="text-red-500 text-sm">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Bouton d'inscription -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          S'inscrire
        </button>
      </form>

      <!-- Lien vers la page de connexion -->
      <p class="mt-4 text-center text-gray-600 dark:text-gray-300">
        Déjà inscrit ?
        <NuxtLink
          to="/login"
          class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Se connecter
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const showPassword = ref(false);
const errors = ref({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const validateForm = () => {
  errors.value = {
    firstName: firstName.value ? "" : "Le prénom est requis.",
    lastName: lastName.value ? "" : "Le nom est requis.",
    email: validateEmail(email.value),
    password: validatePassword(password.value),
    confirmPassword:
      password.value === confirmPassword.value
        ? ""
        : "Les mots de passe ne correspondent pas.",
  };
};

const validateEmail = (email) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email) ? "" : "Veuillez entrer un email valide.";
};

const validatePassword = (password) => {
  return password.length >= 6
    ? ""
    : "Le mot de passe doit contenir au moins 6 caractères.";
};

const handleSubmit = async () => {
  validateForm();
  if (!Object.values(errors.value).some((error) => error !== "")) {
    try {
      const response = await $fetch("/api/register", {
        method: "POST",
        body: {
          firstName: firstName.value,
          lastName: lastName.value,
          email: email.value,
          password: password.value,
          confirmPassword: confirmPassword.value,
        },
      });

      console.log(response.message);
    } catch (error) {
      console.error(error.message || "Erreur lors de l'inscription");
    }
  }
};
</script>

<style scoped>
/* Ajouter des styles spécifiques ici si nécessaire */
</style>
