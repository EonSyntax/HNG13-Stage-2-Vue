import { ref } from 'vue';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  function toast(options: Omit<Toast, 'id'>) {
    const id = crypto.randomUUID();
    const newToast = { ...options, id };
    toasts.value.push(newToast);

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, 3000);
  }

  function dismiss(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }

  return {
    toasts,
    toast,
    dismiss,
  };
}
