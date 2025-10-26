<template>
  <div class="min-h-screen flex items-center justify-center bg-background px-6 py-12 relative overflow-hidden">
    <!-- background blur elements -->
    <div class="absolute top-20 right-20 w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-20 left-20 w-[250px] h-[250px] bg-accent/20 rounded-full blur-3xl"></div>

    <Card class="w-full max-w-md shadow-xl p-6 relative z-10">
      <div class="text-center space-y-1 mb-6">
        <div class="flex justify-center mb-4">
          <div class="w-12 h-12 bg-primary text-primary-foreground rounded-lg flex items-center justify-center">
            <Ticket className="w-6 h-6" />
          </div>
        </div>
        <h1 class="text-2xl font-bold">Create an account</h1>
        <p class="text-muted-foreground">Get started with EonTickets today</p>
      </div>

      <form @submit.prevent="onSubmit" class="space-y-4">
        <div>
          <Label>Username</Label>
          <Input
            v-model="form.username"
            placeholder="Choose a username"
            class="h-12"
            data-testid="input-username"
            :class="{ 'border-destructive': errors.username }"
          />
          <p v-if="errors.username" class="text-destructive text-sm mt-1">{{ errors.username }}</p>
        </div>

        <div>
          <Label>Password</Label>
          <Input
            v-model="form.password"
            type="password"
            placeholder="Create a password"
            class="h-12"
            :class="{ 'border-destructive': errors.password }"
          />
          <p v-if="errors.password" class="text-destructive text-sm mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <Label>Confirm Password</Label>
          <Input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Confirm your password"
            class="h-12"
            :class="{ 'border-destructive': errors.confirmPassword }"
          />
          <p v-if="errors.confirmPassword" class="text-destructive text-sm mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <Button
          type="submit"
          class="w-full h-12"
          :disabled="loading"
        >
          {{ loading ? "Creating account..." : "Sign Up" }}
        </Button>
      </form>

      <div class="mt-6 text-center text-sm">
        <span class="text-muted-foreground">Already have an account? </span>
        <router-link
          to="/auth/login"
          class="text-primary font-medium hover:underline"
        >
          Login
        </router-link>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { z } from 'zod'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import { Ticket } from "lucide-vue-next";

// --- Zod Schema Validation (like React zodResolver) ---
const signupSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

// --- State ---
const router = useRouter()
const authStore = useAuthStore()
const { toast } = useToast()

const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const errors = ref<{ [key: string]: string }>({})
const loading = ref(false)

// --- Submit Handler ---
async function onSubmit() {
  errors.value = {}
  const parsed = signupSchema.safeParse(form.value)

  if (!parsed.success) {
    parsed.error.errors.forEach((e) => {
      if (e.path[0]) errors.value[e.path[0].toString()] = e.message
    })
    return
  }

  loading.value = true
  try {
    await authStore.signup(form.value.username, form.value.password)
    toast({
      title: 'Account created',
      description: `Welcome to EonTickets, ${form.value.username}!`,
    })
    router.push('/dashboard')
  } catch (err: any) {
    toast({
      variant: 'destructive',
      title: 'Signup failed',
      description: err.message || 'An error occurred. Please try again.',
    })
  } finally {
    loading.value = false
  }
}
</script>
