export type SummaryLevel = "short" | "detailed";
export const useSummaryGenerator = () => {
  const summary = ref<string | null>("");
  const reformulatedText = ref<string | null>("");
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Fonction pour générer le résumé avec un niveau de détail
  const generateSummary = async (
    text: string,
    level: SummaryLevel | undefined
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Envoi de la requête au serveur pour générer le résumé
      const response = await $fetch("/api/generate-summary", {
        method: "POST",
        body: { text, level },
      });
      return { statusCode: 201, summary: response.summary };
    } catch (err) {
      error.value = "Une erreur est survenue lors de la génération du résumé.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const reformulate = async (text: string) => {
    loading.value = true;
    error.value = null;

    try {
      // Envoi de la requête au serveur pour générer le résumé
      const response = await $fetch("/api/reformulate", {
        method: "POST",
        body: { text },
      });
      return { statusCode: 201, reformulatedText: response.reformulatedText };
    } catch (err) {
      error.value = "Une erreur est survenue lors de la reformulation.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  return {
    summary,
    loading,
    error,
    generateSummary,
    reformulate,
    reformulatedText,
  };
};
