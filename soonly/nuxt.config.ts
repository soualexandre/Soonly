export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    ['@pinia/nuxt', {
      autoImports: [
        'defineStore',
        ['defineStore', 'definePiniaStore'],
        'storeToRefs'
      ]
    }],
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
  ],

  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', file: 'en.json', name: 'English' },
      { code: 'pt-BR', iso: 'pt-BR', file: 'pt-BR.json', name: 'Português' }
    ],
    lazy: true,
    langDir: 'locales/',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en'
    }
  },

  tailwindcss: {
    configPath: '~/tailwind.config.ts'
  },

  typescript: {
    strict: true,
    typeCheck: true,
    tsConfig: {
      compilerOptions: {
        strictNullChecks: true,
        noImplicitAny: true
      }
    }
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    componentIslands: true
  },

  runtimeConfig: {
    public: {
      socketBaseUrl: process.env.SOCKET_BASE_URL || "http://localhost:3053"
    }
  },

  plugins: ['~/plugins/toast.ts']
})
