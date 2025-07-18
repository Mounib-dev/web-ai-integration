import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function reformulate(text: string): Promise<string> {
  const systemPrompt =
    "Reformule le texte ci-après en gardant sa cohérence et les idées exprimées avec fidélité. Ce texte doit être humanisé s'il ne l'est pas déjà.";

  const prompt = `${systemPrompt}\n\n${text}`;

  // Utilisation de l'API pour générer le résumé
  const response = await generateText({
    model: openai("gpt-4"),
    prompt: prompt,
  });

  return response.text;
}
