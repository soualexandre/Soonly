import Toast, { POSITION, type PluginOptions } from "vue-toastification";
import "vue-toastification/dist/index.css";
import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    hideProgressBar: false,
  };

  nuxtApp.vueApp.use(Toast, options);
});
