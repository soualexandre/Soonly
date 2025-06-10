  <script setup lang="ts">
  import { computed } from 'vue'

  type Variant = 'primary' | 'secondary' | 'ghost'

  const props = defineProps({
    icon: String,
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string): boolean => {
        return ['primary', 'secondary', 'ghost'].includes(value)
      }
    },
    loading: {
      type: Boolean,
      default: false,
    }
  })

  const variant = computed<Variant>(() => {
    if (props.variant === 'primary' || props.variant === 'secondary' || props.variant === 'ghost') {
      return props.variant
    }
    return 'primary'
  })

  const variantClasses: Record<Variant, string> = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/30',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm hover:backdrop-blur-md',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-300 hover:text-white'
  }
</script>

  <template>
    <button :class="[
      'flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105',
      'focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:scale-105',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      variantClasses[variant]
    ]" aria-live="polite">
      <template v-if="props.loading">
        <svg class="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z">
          </path>
        </svg>
      </template>
      <Icon v-else-if="icon" :name="icon" class="text-xl" />
      <span>
        <slot />
      </span>
    </button>
  </template>