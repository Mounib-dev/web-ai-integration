<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4"
  >
    <div class="max-w-screen-lg mx-auto">
      <h2 class="text-2xl font-bold mb-6">Résumé ou reformulation</h2>

      <!-- Switch mode (résumer/reformuler) -->
      <div class="flex items-center gap-4 mb-6">
        <label class="flex items-center cursor-pointer">
          <input v-model="mode" type="radio" value="resume" class="hidden" />
          <span
            :class="[
              'px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600',
              mode === 'resume'
                ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            ]"
            >Résumer</span
          >
        </label>
        <label class="flex items-center cursor-pointer">
          <input
            v-model="mode"
            type="radio"
            value="reformulate"
            class="hidden"
          />
          <span
            :class="[
              'px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600',
              mode === 'reformulate'
                ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
            ]"
            >Reformuler</span
          >
        </label>
      </div>

      <!-- Options si "résumer" -->
      <div v-if="mode === 'resume'" class="mb-4">
        <label class="block mb-2 font-medium">Type :</label>
        <div class="flex gap-4">
          <label class="flex items-center cursor-pointer">
            <input
              v-model="summaryType"
              type="radio"
              value="short"
              class="hidden"
            />
            <span
              :class="[
                'px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600',
                summaryType === 'short'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              ]"
              >Court</span
            >
          </label>
          <label class="flex items-center cursor-pointer">
            <input
              v-model="summaryType"
              type="radio"
              value="detailed"
              class="hidden"
            />
            <span
              :class="[
                'px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600',
                summaryType === 'detailed'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              ]"
              >Détaillé</span
            >
          </label>
        </div>
      </div>

      <!-- Zone de texte et bouton effacer -->
      <div class="mb-2 relative">
        <textarea
          v-model="textToSummarize"
          :maxlength="maxLength"
          placeholder="Collez ou tapez votre texte ici..."
          rows="8"
          class="w-full p-4 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        />
        <button
          v-if="textToSummarize.length > 0"
          type="button"
          class="absolute top-4 right-4 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition"
          @click="clearText"
        >
          <Icon name="mdi:close-circle-outline" size="28" />
        </button>
        <div class="flex justify-between text-sm mt-1">
          <span
            :class="
              charCount > maxLength
                ? 'text-red-500'
                : 'text-gray-500 dark:text-gray-400'
            "
          >
            {{ charCount }} / {{ maxLength }} caractères
          </span>
          <span v-if="charCount > maxLength" class="text-red-500">
            Limite atteinte !
          </span>
        </div>
      </div>

      <!-- Bouton de soumission -->
      <div class="flex gap-4 mt-4">
        <button
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 disabled:dark:bg-gray-700 disabled:cursor-not-allowed"
          :disabled="!canSubmit"
          @click="handleClick"
        >
          {{ mode === "resume" ? "Résumer" : "Reformuler" }}
        </button>
      </div>

      <!-- Affichage du loader/résultat/erreur comme avant -->
      <div v-if="loading" class="flex justify-center mt-4">
        <div
          class="w-16 h-16 border-4 border-t-4 border-blue-600 border-solid rounded-full animate-spin"
        ></div>
      </div>
      <div v-if="error" class="text-red-500 mt-4">{{ error }}</div>
      <div v-if="summary?.length" class="mt-6">
        <h3 class="text-lg font-semibold">Résumé généré:</h3>
        <p class="mt-2">{{ summary }}</p>
      </div>
      <div v-else-if="reformulatedText" class="mt-6">
        <h3 class="text-lg font-semibold">Texte reformulé:</h3>
        <p class="mt-2">{{ reformulatedText }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryLevel } from "~/composables/useSummaryGenerator";

const textToSummarize = ref("");
const summaryGenerator = useSummaryGenerator();
const {
  summary,
  loading,
  error,
  generateSummary,
  reformulate,
  reformulatedText,
} = summaryGenerator;

const router = useRouter();
const authStore = useAuthStore();

const mode = ref<"resume" | "reformulate">("resume");
const summaryType = ref<SummaryLevel>("short");
const maxLength = 5000;
const charCount = computed(() => textToSummarize.value.length);

const canSubmit = computed(() => {
  if (charCount.value === 0 || charCount.value > maxLength) return false;
  if (mode.value === "resume" && !summaryType.value) return false;
  return true;
});

const handleClick = async () => {
  if (!canSubmit.value) return;
  if (mode.value === "resume") {
    await handleResponse(textToSummarize.value, summaryType.value);
  } else {
    await handleResponse(textToSummarize.value);
  }
};

const handleResponse = async (
  textToSummarize: string,
  summaryLevel?: SummaryLevel | undefined
) => {
  let response;
  if (summaryLevel) {
    response = await generateSummary(textToSummarize, summaryLevel);
    if (response?.statusCode === 201) {
      summary.value = response.summary;
    }
  } else {
    response = await reformulate(textToSummarize);
    if (response?.statusCode === 201) {
      reformulatedText.value = response.reformulatedText;
    }
  }
  if (response?.statusCode === 401) {
    authStore.logout();
    router.push("/login");
  }
};

const clearText = () => {
  textToSummarize.value = "";
};
</script>

<style scoped>
textarea {
  transition: background-color 0.3s, color 0.3s;
}
button {
  transition: background-color 0.2s, transform 0.2s;
}
button:hover {
  transform: scale(1.05);
}
</style>
