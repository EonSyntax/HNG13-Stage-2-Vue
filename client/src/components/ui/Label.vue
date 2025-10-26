<template>
  <label
    :class="cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      props.class
    )"
  >
    <slot />
  </label>
</template>

<script setup lang="ts">
import { cn } from '@/utils/cn';

const props = withDefaults(defineProps<{
  class?: string;
}>(), {});
</script>
