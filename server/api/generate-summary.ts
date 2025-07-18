import { generateSummary } from "~/utils/summaryGenerator";

export default defineEventHandler(async (event) => {
  const { text, level } = await readBody(event);

  const summary = await generateSummary(text, level);

  return { statusCode: 201, summary: summary };
});
