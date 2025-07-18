import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import type { CoreMessage } from "ai";

export default defineEventHandler(async (event) => {
  setResponseHeaders(event, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const body = await readBody<{
    messages: CoreMessage[];
    model?: string;
  }>(event);

  // Sécurise le modèle (par défaut si rien de fourni)
  const allowedModels = ["gpt-3.5-turbo", "gpt-4o", "gpt-4-turbo"];
  const modelName = allowedModels.includes(body.model ?? "")
    ? (body.model as string)
    : "gpt-3.5-turbo";

  const result = await streamText({
    model: openai(modelName as "gpt-3.5-turbo" | "gpt-4o" | "gpt-4-turbo"),
    messages: [
      {
        role: "system",
        content:
          "Tu es un assistant IA francophone utile, bienveillant et synthétique.",
      },
      ...(body.messages ?? []),
    ],
  });

  for await (const chunk of result.textStream) {
    event.node.res.write?.(`data: ${JSON.stringify({ text: chunk })}\n\n`);
  }

  if (result.usage) {
    event.node.res.write?.(
      `data: ${JSON.stringify({ usage: result.usage })}\n\n`
    );
  }

  event.node.res.end();
});
