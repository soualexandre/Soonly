import type { ToastInterface } from 'vue-toastification';

declare module '#app' {
  interface NuxtApp {
    $toast: ToastInterface;
  }
}

export {};
