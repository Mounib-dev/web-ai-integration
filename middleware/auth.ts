export default defineNuxtRouteMiddleware((to) => {
  if (to.path === "/login" || to.path === "/register" || to.path === "/") {
    return;
  }

  if (import.meta.server) {
    const token = useCookie("authToken");
    if (!token.value) {
      return navigateTo("/login");
    }
  }
});
