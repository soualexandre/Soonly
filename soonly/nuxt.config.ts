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
      { code: 'en', iso: 'en-US', file: 'en.json' },
      { code: 'pt-BR', iso: 'pt-BR', file: 'pt-BR.json' }
    ],
    lazy: true,
    langDir:'locales/',
    defaultLocale: 'pt-BR',
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
  }
})
