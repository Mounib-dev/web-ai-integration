import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET as string;

export default defineEventHandler(async (event) => {
  if (
    event.node.req.url?.startsWith("/api/generate-summary") ||
    event.node.req.url?.startsWith("/api/reformulate")
  ) {
    const token = getCookie(event, "authToken");
    if (!token) {
      throw createError({
        statusCode: 401,
        message: "Unauthorized.",
      });
    }

    try {
      const decoded = jwt.verify(token, secretKey);
      event.context.user = decoded;
    } catch (error) {
      console.error(error);
      throw createError({
        statusCode: 401,
        message: "Unauthorized.",
      });
    }
  }
});
