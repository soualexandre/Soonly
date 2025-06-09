<script setup lang="ts">
import { io, type Socket } from "socket.io-client";
import { useToast } from "vue-toastification";
import { onMounted, onUnmounted } from "vue";
import { useAuthStore } from "~/stores/auth";

const toast = useToast();
const authStore = useAuthStore();
const config = useRuntimeConfig();
const socket = ref<Socket | null>(null);

onMounted(() => {
  if (!authStore.isAuthenticated) return;

  socket.value = io(config.public.socketBaseUrl, {
    auth: {
      token: authStore.token
    },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
  });

  socket.value.on("connect", () => {
    console.log("Conectado ao serviço de notificações");
  });

  socket.value.on("connect_error", (err) => {
    console.error("Erro na conexão:", err.message);
  });

  socket.value.on("notification", (data: any) => {
    toast.info(data.message, {
      timeout: 5000,
      closeOnClick: true,
      pauseOnFocusLoss: true,
      icon: "🎬",
      onClick: () => handleNotificationClick(data)
    });
  });
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.disconnect();
  }
});

function handleNotificationClick(notification: any) {
  navigateTo(`/movie/${notification.movieId}`);
}
</script>

<template>
  <div v-show="false"></div>
</template>