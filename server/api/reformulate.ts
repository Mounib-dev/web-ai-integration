import { reformulate } from "~/utils/reformulate";

export default defineEventHandler(async (event) => {
  const { text } = await readBody(event);

  const reformulatedText = await reformulate(text);

  return { statusCode: 201, reformulatedText: reformulatedText };
});
