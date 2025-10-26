<template>
  <div class="min-h-screen flex flex-col bg-background">
    <main class="flex-1 flex items-center justify-center px-6 py-12">
      <Card class="w-full max-w-md p-8">
        <div class="mb-6 text-center">
          <h1 class="text-2xl font-bold mb-2">Welcome Back</h1>
          <p class="text-muted-foreground">Sign in to your account</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div class="space-y-2">
            <Label>Username</Label>
            <Input
              v-model="username"
              placeholder="Enter your username"
              :class="errors.username ? 'border-destructive' : ''"
            />
            <p v-if="errors.username" class="text-sm text-destructive">{{ errors.username }}</p>
          </div>

          <div class="space-y-2">
            <Label>Password</Label>
            <Input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              :class="errors.password ? 'border-destructive' : ''"
            />
            <p v-if="errors.password" class="text-sm text-destructive">{{ errors.password }}</p>
          </div>

          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </Button>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">Don't have an account? </span>
          <router-link to="/auth/signup" class="text-primary hover:underline">
            Sign up
          </router-link>
        </div>
      </Card>
    </main>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Footer from '@/components/layout/Footer.vue';

const router = useRouter();
const authStore = useAuthStore();
const { toast } = useToast();

const username = ref('');
const password = ref('');
const loading = ref(false);
const errors = ref<{ username?: string; password?: string }>({});

async function handleSubmit() {
  errors.value = {};

  if (!username.value) {
    errors.value.username = 'Username is required';
  }
  if (!password.value) {
    errors.value.password = 'Password is required';
  }

  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    await authStore.login(username.value, password.value);
    toast({
      title: 'Success',
      description: 'Logged in successfully',
    });
    router.push('/dashboard');
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to login',
      variant: 'destructive',
    });
  } finally {
    loading.value = false;
  }
}
</script>
