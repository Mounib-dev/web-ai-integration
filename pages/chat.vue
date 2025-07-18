<template>
  <div
    class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4"
  >
    <div class="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-8">
      <aside class="w-full md:w-1/3 mb-8 md:mb-0">
        <div class="sticky top-8 space-y-5">
          <div
            class="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-2xl px-6 py-4 shadow-lg mb-3"
          >
            <Icon icon="mdi:robot-excited" class="text-2xl" />
            <span class="text-xl font-bold tracking-wide"
              >Stats IA Session</span
            >
          </div>

          <div class="grid grid-cols-1 gap-4">
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-blue-500"
            >
              <Icon icon="mdi:forum" class="text-blue-500 text-2xl" />
              <div class="flex flex-col">
                <span class="font-semibold text-blue-700 dark:text-blue-400"
                  >Messages</span
                >
                <span>
                  <span
                    class="inline-block rounded px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-xs text-blue-800 dark:text-blue-300 font-semibold mr-2"
                  >
                    Total : {{ totalMsgs }}
                  </span>
                  <span
                    class="inline-block rounded px-2 py-0.5 bg-green-100 dark:bg-green-900 text-xs text-green-700 dark:text-green-300 font-semibold mr-2"
                  >
                    Vous : {{ userMsgs }}
                  </span>
                  <span
                    class="inline-block rounded px-2 py-0.5 bg-purple-100 dark:bg-purple-900 text-xs text-purple-700 dark:text-purple-300 font-semibold"
                  >
                    Bot : {{ botMsgs }}
                  </span>
                </span>
              </div>
            </div>

            <!-- Tokens (réponse) -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-violet-500"
            >
              <Icon icon="mdi:counter" class="text-violet-500 text-2xl" />
              <div>
                <div class="font-semibold text-violet-700 dark:text-violet-400">
                  Tokens (dernière réponse)
                </div>
                <span
                  class="text-lg font-bold text-violet-600 dark:text-violet-200"
                  >{{ lastTokens }}</span
                >
              </div>
            </div>

            <!-- Tokens cumulés -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-fuchsia-500"
            >
              <Icon
                icon="mdi:counter-multiple"
                class="text-fuchsia-500 text-2xl"
              />
              <div>
                <div
                  class="font-semibold text-fuchsia-700 dark:text-fuchsia-400"
                >
                  Tokens cumulés
                </div>
                <span
                  class="text-lg font-bold text-fuchsia-600 dark:text-fuchsia-200"
                  >{{ totalTokens }}</span
                >
              </div>
            </div>

            <!-- Coût -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-emerald-500"
            >
              <Icon icon="mdi:currency-eur" class="text-emerald-500 text-2xl" />
              <div>
                <div
                  class="font-semibold text-emerald-700 dark:text-emerald-400"
                >
                  Coût estimé
                </div>
                <span
                  class="text-lg font-bold text-emerald-600 dark:text-emerald-200"
                  >{{ costFormatted }}</span
                >
                <span class="text-xs ml-2 text-gray-400"
                  >({{ euroRate }} €/USD)</span
                >
              </div>
            </div>

            <!-- Temps moyen/réponse -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-orange-500"
            >
              <Icon icon="mdi:timer-outline" class="text-orange-500 text-2xl" />
              <div>
                <div class="font-semibold text-orange-700 dark:text-orange-400">
                  Temps moyen/réponse
                </div>
                <span
                  class="text-lg font-bold text-orange-600 dark:text-orange-200"
                  >{{ avgResponseTime }} s</span
                >
              </div>
            </div>

            <!-- Longueur moyenne bot -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-pink-500"
            >
              <Icon
                icon="mdi:format-text-variant"
                class="text-pink-500 text-2xl"
              />
              <div>
                <div class="font-semibold text-pink-700 dark:text-pink-400">
                  Longueur bot (moyenne)
                </div>
                <span class="text-lg font-bold text-pink-600 dark:text-pink-200"
                  >{{ avgBotLen }} tokens</span
                >
              </div>
            </div>

            <!-- Mot-clé récent -->
            <div
              class="flex items-center gap-3 bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-md border-l-8 border-teal-500"
            >
              <Icon
                icon="mdi:tag-text-outline"
                class="text-teal-500 text-2xl"
              />
              <div>
                <div class="font-semibold text-teal-700 dark:text-teal-400">
                  Mot-clé récent
                </div>
                <span
                  class="text-base font-bold italic text-teal-600 dark:text-teal-200"
                  >{{ lastKeyword }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </aside>

      <!-- Chatbot principal -->
      <section class="flex-1 flex flex-col">
        <div
          class="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 flex flex-col h-[80vh]"
        >
          <h2 class="text-2xl font-bold mb-6">💬 Chatbot IA</h2>
          <!-- Sélecteur de modèle -->
          <div class="flex items-center gap-4 mb-6">
            <span class="font-semibold text-gray-700 dark:text-gray-300"
              >Modèle :</span
            >
            <select
              v-model="selectedModel"
              class="bg-gray-200 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4-turbo">GPT-4 Turbo</option>
            </select>
          </div>

          <div class="flex-1 overflow-y-auto mb-4 space-y-2 pr-1">
            <div
              v-for="(msg, idx) in messages"
              :key="idx"
              :class="msg.role === 'user' ? 'text-right' : 'text-left'"
            >
              <div :class="messageClass(msg.role)">
                <span v-if="msg.role === 'user'" class="font-semibold"
                  >Moi :</span
                >
                <span v-else class="font-semibold">Bot :</span>
                <span class="ml-1">{{ msg.content }}</span>
              </div>
            </div>
            <div
              v-if="isLoading"
              class="text-xs text-zinc-500 dark:text-zinc-400"
            >
              Un moment je réfléchis...
            </div>
          </div>
          <form @submit.prevent="sendMessage" class="flex gap-2 mt-auto">
            <input
              v-model="input"
              :disabled="isLoading"
              class="flex-1 rounded-lg border dark:bg-zinc-900 dark:text-white px-3 py-2 outline-none focus:ring focus:ring-blue-500"
              placeholder="Pose ta question ou demande un conseil financier..."
            />
            <button
              type="submit"
              :disabled="!input || isLoading"
              class="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:bg-zinc-400"
            >
              Envoyer
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import { Icon } from "@iconify/vue";

const selectedModel = ref("gpt-3.5-turbo");

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  responseTime?: number;
  tokenCount?: number;
}

const messages = ref<ChatMessage[]>([
  {
    role: "assistant",
    content: "Bonjour ! Pose moi la question que tu veux !",
  },
]);
const input = ref("");
const isLoading = ref(false);
const lastTokens = ref(0);
const totalTokens = ref(0);
const lastResponseTime = ref(0);
const responseTimes = ref<number[]>([]);
const botLengths = ref<number[]>([]);

const euroRate = 0.93;

const totalMsgs = computed(() => messages.value.length);
const userMsgs = computed(
  () => messages.value.filter((m) => m.role === "user").length
);
const botMsgs = computed(
  () => messages.value.filter((m) => m.role === "assistant").length
);
const modelPrices: Record<string, number> = {
  "gpt-3.5-turbo": 0.0005,
  "gpt-4o": 0.0005,
  "gpt-4-turbo": 0.01,
};
const costPer1KTokensUSD = computed(
  () => modelPrices[selectedModel.value] || 0.0005
);

const costFormatted = computed(() =>
  (
    (totalTokens.value * costPer1KTokensUSD.value * euroRate) /
    1000
  ).toLocaleString("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 5,
  })
);

const avgResponseTime = computed(() =>
  responseTimes.value.length
    ? (
        responseTimes.value.reduce((a, b) => a + b, 0) /
        responseTimes.value.length /
        1000
      ).toFixed(2)
    : "--"
);
const avgBotLen = computed(() =>
  botLengths.value.length
    ? Math.round(
        botLengths.value.reduce((a, b) => a + b, 0) / botLengths.value.length
      )
    : "--"
);
const lastKeyword = computed(() => {
  const lastUser = [...messages.value].reverse().find((m) => m.role === "user");
  if (!lastUser) return "--";
  const words = lastUser.content.match(/\w+/g);
  if (!words || words.length === 0) return "--";
  return words.sort((a, b) => b.length - a.length)[0];
});

function messageClass(role: string) {
  return role === "user"
    ? "inline-block bg-blue-500 text-white rounded-lg px-4 py-2 mb-1"
    : "inline-block bg-zinc-100 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg px-4 py-2 mb-1";
}

async function sendMessage() {
  if (!input.value.trim()) return;
  messages.value.push({ role: "user", content: input.value });
  isLoading.value = true;
  const aiMsg: ChatMessage = { role: "assistant", content: "" };
  messages.value.push(aiMsg);
  const newMessages = messages.value.map((m) => ({
    role: m.role,
    content: m.content,
  }));
  const start = performance.now();
  input.value = "";

  const res = await fetch("/api/chat", {
    method: "POST",
    body: JSON.stringify({ messages: newMessages, model: selectedModel.value }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.body) {
    isLoading.value = false;
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let localTokens = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let lines = buffer.split("\n\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (line.startsWith("data:")) {
        try {
          const payload = JSON.parse(line.replace("data: ", "").trim());
          if (payload.text) {
            aiMsg.content += payload.text;
            localTokens += countTokens(payload.text);
            await nextTick();
          }
          if (payload.usage) {
            lastTokens.value = payload.usage.completionTokens ?? localTokens;
            totalTokens.value += payload.usage.completionTokens ?? localTokens;
            botLengths.value.push(
              payload.usage.completionTokens ?? localTokens
            );
          }
        } catch {}
      }
    }
  }
  lastTokens.value = localTokens;
  totalTokens.value += localTokens;
  botLengths.value.push(localTokens);
  const end = performance.now();
  lastResponseTime.value = end - start;
  responseTimes.value.push(lastResponseTime.value);
  isLoading.value = false;
}

function countTokens(str: string): number {
  return str.trim().split(/\s+/).length;
}
</script>
