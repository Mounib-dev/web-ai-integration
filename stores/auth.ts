import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", () => {
  const isAuthenticated = ref(false);

  onMounted(() => {
    if (typeof window !== "undefined") {
      const storedAuth = localStorage.getItem("isAuthenticated");
      if (storedAuth) {
        isAuthenticated.value = storedAuth === "true";
      }
    }
  });

  const logout = () => {
    isAuthenticated.value = false;
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "false");
    }
  };

  const login = () => {
    isAuthenticated.value = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("isAuthenticated", "true");
    }
  };

  return {
    isAuthenticated,
    logout,
    login,
  };
});
