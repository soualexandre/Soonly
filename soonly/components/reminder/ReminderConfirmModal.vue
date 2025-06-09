<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const props = defineProps<{
    show: boolean;
    mediaTitle: string;
}>();

const emit = defineEmits<{
    (e: 'confirm'): void;
    (e: 'cancel'): void;
}>();

function onConfirm() {
    emit('confirm');
}

function onCancel() {
    emit('cancel');
}
</script>

<template>
    <transition name="fade">
        <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-slate-900 rounded-xl p-6 max-w-sm w-full text-center shadow-lg">
                <svg class="mx-auto mb-4 w-12 h-12 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>
                <h2 class="text-white text-lg font-semibold mb-2">Confirmar lembrete</h2>
                <p class="text-gray-300 mb-6">Deseja realmente registrar o lembrete para <strong>{{ mediaTitle
                }}</strong>?</p>
                <div class="flex justify-center gap-4">
                    <button @click="onCancel"
                        class="px-4 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition">
                        Cancelar
                    </button>
                    <button @click="onConfirm"
                        class="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition">
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
