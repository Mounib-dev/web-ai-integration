export default defineEventHandler(async (event) => {
  deleteCookie(event, "authToken");

  return {
    statusCode: 204,
    message: "Déconnexion réussie.",
  };
});
