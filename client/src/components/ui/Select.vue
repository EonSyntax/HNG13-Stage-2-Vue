<template>
  <select
    :class="cn(
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      props.class
    )"
    :value="modelValue"
    @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
  >
    <slot />
  </select>
</template>

<script setup lang="ts">
import { cn } from '@/utils/cn';

const props = withDefaults(defineProps<{
  modelValue?: string;
  class?: string;
}>(), {
  modelValue: '',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>
