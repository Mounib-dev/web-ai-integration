// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "reka-ui/nuxt",
    "@nuxt/icon",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
  ],

  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "dark",
    storageKey: "nuxt-color-mode",
  },
});
