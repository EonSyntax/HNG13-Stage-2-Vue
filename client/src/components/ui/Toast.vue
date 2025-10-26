<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="cn(
            'rounded-lg border p-4 shadow-lg',
            toast.variant === 'destructive'
              ? 'border-destructive bg-destructive text-destructive-foreground'
              : 'border bg-card text-card-foreground'
          )"
        >
          <div class="flex items-start gap-3">
            <div class="flex-1">
              <div class="font-semibold">{{ toast.title }}</div>
              <div v-if="toast.description" class="text-sm opacity-90">{{ toast.description }}</div>
            </div>
            <button
              @click="dismiss(toast.id)"
              class="text-sm opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast';
import { cn } from '@/utils/cn';

const { toasts, dismiss } = useToast();
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
