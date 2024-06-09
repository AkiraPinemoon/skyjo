// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },

  runtimeConfig: {
    mongoUrl: "mongodb://admin:admin@localhost:27017",
  },

  nitro: {
    experimental: {
      websocket: true,
    },
  },

  modules: ["@nuxt/ui"],
});