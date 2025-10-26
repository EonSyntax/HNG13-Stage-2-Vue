<template>
  <div :class="cn('rounded-lg border bg-card text-card-foreground shadow-sm', props.class)">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/utils/cn';

const props = withDefaults(defineProps<{
  class?: string;
}>(), {});
</script>
