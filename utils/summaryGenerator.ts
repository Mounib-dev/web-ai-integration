import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function generateSummary(
  text: string,
  level?: "short" | "detailed"
): Promise<string> {
  let systemPrompt = "";
  if (level === "short") {
    systemPrompt =
      "Fournissez un résumé concis du texte suivant, en mentionnant uniquement les informations essentielles.";
  } else if (level === "detailed") {
    systemPrompt =
      "Fournissez un résumé détaillé du texte suivant, en incluant tous les points importants et en conservant le contexte.";
  }

  const prompt = `${systemPrompt}\n\n${text}`;

  // Utilisation de l'API pour générer le résumé
  const response = await generateText({
    model: openai("gpt-4"),
    prompt: prompt,
  });

  return response.text;
}
