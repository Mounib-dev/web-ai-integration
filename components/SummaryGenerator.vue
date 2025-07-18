<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4"
  >
    <div class="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
      <!-- Sidebar métriques -->
      <aside class="w-full md:w-1/3 mb-8 md:mb-0">
        <div class="sticky top-8 space-y-5">
          <div
            class="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl px-6 py-4 shadow-lg mb-2"
          >
            <Icon icon="mdi:chart-timeline-variant" class="text-2xl" />
            <span class="text-xl font-bold tracking-wide">Métriques IA</span>
          </div>
          <div class="grid grid-cols-1 gap-4">
            <!-- Temps de réponse moyen -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-blue-500"
            >
              <Icon icon="mdi:timer-outline" class="text-blue-500 text-2xl" />
              <div>
                <div class="font-semibold text-blue-700 dark:text-blue-400">
                  Temps de réponse moyen
                </div>
                <span class="text-lg font-bold text-blue-600 dark:text-blue-200"
                  >{{ avgResponseTime }} s</span
                >
              </div>
            </div>
            <!-- Mots-clés -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-emerald-500"
            >
              <Icon
                icon="mdi:tag-multiple-outline"
                class="text-emerald-500 text-2xl"
              />
              <div>
                <div
                  class="font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  Mots-clés
                </div>
                <span
                  class="text-base font-bold italic text-emerald-600 dark:text-emerald-200"
                  >{{ keywordsDisplay }}</span
                >
              </div>
            </div>
            <!-- Caractères initial -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-pink-500"
            >
              <Icon icon="mdi:form-textbox" class="text-pink-500 text-2xl" />
              <div>
                <div class="font-semibold text-pink-700 dark:text-pink-400">
                  Caractères initiaux
                </div>
                <span
                  class="text-lg font-bold text-pink-600 dark:text-pink-200"
                  >{{ initialCharCount }}</span
                >
              </div>
            </div>
            <!-- Caractères après traitement -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-violet-500"
            >
              <Icon
                icon="mdi:form-textbox-password"
                class="text-violet-500 text-2xl"
              />
              <div>
                <div class="font-semibold text-violet-700 dark:text-violet-400">
                  Caractères résultat
                </div>
                <span
                  class="text-lg font-bold text-violet-600 dark:text-violet-200"
                  >{{ resultCharCount }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Partie centrale formulaire résumé/reformulation -->
      <section class="flex-1 flex flex-col">
        <h2 class="text-2xl font-bold mb-6">Résumé ou reformulation</h2>

        <!-- Bloc résultat/spinner -->
        <transition name="fade-slide">
          <div v-if="loading || displayResult" class="mb-8">
            <div
              class="rounded-2xl bg-white dark:bg-zinc-800 shadow-lg p-6 border border-blue-100 dark:border-zinc-700 flex flex-col gap-2 items-center justify-center"
            >
              <!-- Spinner  -->
              <div
                v-if="loading"
                class="flex flex-col items-center justify-center py-6"
              >
                <div
                  class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"
                ></div>
                <span
                  class="text-blue-600 dark:text-blue-300 text-base flex items-center gap-2"
                >
                  <Icon name="mdi:clock-outline" /> Veuillez patienter,
                  traitement en cours...
                </span>
              </div>

              <div v-else class="w-full">
                <div class="flex items-center gap-2 mb-2">
                  <Icon
                    v-if="mode === 'resume'"
                    name="mdi:format-list-bulleted-type"
                    class="text-blue-500"
                    size="26"
                  />
                  <Icon
                    v-else
                    name="mdi:autorenew"
                    class="text-blue-500"
                    size="26"
                  />
                  <span class="font-semibold text-lg">
                    {{
                      mode === "resume" ? "Résumé généré" : "Texte reformulé"
                    }}
                  </span>
                </div>
                <p class="whitespace-pre-line text-base leading-relaxed">
                  {{ displayResult }}
                </p>
                <button
                  class="self-end mt-2 text-xs px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                  @click="clearResult"
                >
                  Effacer le résultat
                </button>
              </div>
            </div>
          </div>
        </transition>

        <!-- Choix du mode -->
        <div class="flex items-center gap-4 mb-6">
          <label class="flex items-center cursor-pointer">
            <input v-model="mode" type="radio" value="resume" class="hidden" />
            <span
              :class="[
                'px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 transition-colors',
                mode === 'resume'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow'
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
                'px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 transition-colors',
                mode === 'reformulate'
                  ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
              ]"
              >Reformuler</span
            >
          </label>
        </div>

        <!-- Options pour résumé -->
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
                  'px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 transition-colors',
                  summaryType === 'short'
                    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow'
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
                  'px-4 py-2 rounded-r-lg border border-gray-300 dark:border-gray-600 transition-colors',
                  summaryType === 'detailed'
                    ? 'bg-blue-600 text-white dark:bg-blue-500 dark:text-white shadow'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
                ]"
                >Détaillé</span
              >
            </label>
          </div>
        </div>

        <!-- Zone de texte-->
        <div class="mb-2 relative">
          <textarea
            v-model="textToSummarize"
            :maxlength="maxLength"
            :disabled="loading"
            placeholder="Collez ou tapez votre texte ici..."
            rows="8"
            class="w-full p-4 mt-2 border rounded-lg bg-gray-200 dark:bg-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition"
            @keydown.enter="autoSubmit"
          />
          <button
            v-if="textToSummarize.length > 0 && !loading"
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

        <div class="flex gap-4 mt-4 items-center">
          <button
            class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:bg-gray-400 disabled:dark:bg-gray-700 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
            :disabled="!canSubmit || loading"
            @click="handleClick"
          >
            <span>
              {{ mode === "resume" ? "Résumer" : "Reformuler" }}
            </span>
            <Icon
              v-if="loading"
              name="mdi:loading"
              class="animate-spin"
              size="24"
            />
          </button>
          <span
            v-if="loading"
            class="ml-2 flex items-center gap-1 text-blue-600 dark:text-blue-300 text-sm"
          >
            <Icon name="mdi:clock-outline" /> Veuillez patienter, traitement en
            cours...
          </span>
        </div>

        <div v-if="error" class="text-red-500 mt-6 text-center">
          {{ error }}
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SummaryLevel } from "~/composables/useSummaryGenerator";
import { ref, computed, watch } from "vue";
import { Icon } from "@iconify/vue";

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

const displayResult = computed(() => {
  if (loading.value) return "";
  if (mode.value === "resume" && summary.value) return summary.value;
  if (mode.value === "reformulate" && reformulatedText.value)
    return reformulatedText.value;
  return "";
});

// METRIQUES
const responseTimes = ref<number[]>([]);
const avgResponseTime = computed(() =>
  responseTimes.value.length
    ? (
        responseTimes.value.reduce((a, b) => a + b, 0) /
        responseTimes.value.length /
        1000
      ).toFixed(2)
    : "--"
);
const keywords = ref<string[]>([]);
const keywordsDisplay = computed(() => keywords.value.join(", ") || "--");
const initialCharCount = ref(0);
const resultCharCount = ref(0);

// Clear result si changement de mode, ou texte/champ effacé
watch([mode, summaryType], () => {
  clearResult();
  clearText();
});

function clearResult() {
  summary.value = "";
  reformulatedText.value = "";
  error.value = null;
  resultCharCount.value = 0;
}

function clearText() {
  textToSummarize.value = "";
  clearResult();
}

function autoSubmit(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey && canSubmit.value && !loading.value) {
    e.preventDefault();
    handleClick();
  }
}

const handleClick = async () => {
  clearResult();
  if (!canSubmit.value) return;
  const start = performance.now();
  initialCharCount.value = textToSummarize.value.length;
  keywords.value = extractKeywords(textToSummarize.value);
  let response;
  if (mode.value === "resume") {
    response = await handleResponse(textToSummarize.value, summaryType.value);
    if (summary.value) resultCharCount.value = summary.value.length;
    else resultCharCount.value = 0;
  } else {
    response = await handleResponse(textToSummarize.value);
    if (reformulatedText.value)
      resultCharCount.value = reformulatedText.value.length;
    else resultCharCount.value = 0;
  }
  responseTimes.value.push(performance.now() - start);
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

// Extraction des mots-clés, version simple
function extractKeywords(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const freq: Record<string, number> = {};
  words.forEach((w) => (freq[w] = (freq[w] || 0) + 1));
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([w]) => w);
}
</script>

<style scoped>
/* Transitions douces pour le résultat */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
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
