<template>
  <div class="min-h-screen flex flex-col bg-background">
    <header class="w-full border-b bg-card">
      <div
        class="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center"
          >
            <TicketIcon class="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 class="text-xl font-bold">EonTickets</h1>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-sm text-muted-foreground hidden sm:inline">
            {{ authStore.user?.username }}
          </span>
          <Button variant="outline" size="sm" @click="handleLogout">
            <LogOut class="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 py-8 md:py-12">
        <div class="mb-8">
          <h2 class="text-3xl md:text-4xl font-bold mb-2">Dashboard</h2>
          <p class="text-muted-foreground">
            Overview of your ticket management system
          </p>
        </div>

        <div
          v-if="ticketsStore.loading"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <Card v-for="i in 4" :key="i" class="p-6">
            <div class="h-24 bg-muted/50 rounded animate-pulse" />
          </Card>
        </div>

        <div
          v-else
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card
            class="p-6 shadow-md hover-elevate"
            data-testid="card-stat-total"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium">Total Tickets</h3>
              <Ticket class="w-5 h-5 text-muted-foreground" />
            </div>
            <div class="text-4xl font-bold" data-testid="text-total-count">
              {{ stats.total }}
            </div>
            <p class="text-xs text-muted-foreground mt-1">All time tickets</p>
          </Card>

          <Card
            class="p-6 shadow-md hover-elevate"
            data-testid="card-stat-open"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium">Open Tickets</h3>
              <div
                class="w-5 h-5 bg-green-100 rounded flex items-center justify-center"
              >
                <div class="w-2 h-2 bg-green-600 rounded-full" />
              </div>
            </div>
            <div
              class="text-4xl font-bold text-green-600"
              data-testid="text-open-count"
            >
              {{ stats.open }}
            </div>
            <p class="text-xs text-muted-foreground mt-1">Awaiting action</p>
          </Card>

          <Card
            class="p-6 shadow-md hover-elevate"
            data-testid="card-stat-in-progress"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium">In Progress</h3>
              <Clock class="w-5 h-5 text-amber-600" />
            </div>
            <div
              class="text-4xl font-bold text-amber-600"
              data-testid="text-in-progress-count"
            >
              {{ stats.inProgress }}
            </div>
            <p class="text-xs text-muted-foreground mt-1">Being worked on</p>
          </Card>

          <Card
            class="p-6 shadow-md hover-elevate"
            data-testid="card-stat-closed"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-sm font-medium">Closed Tickets</h3>
              <CheckCircle2 class="w-5 h-5 text-gray-600" />
            </div>
            <div
              class="text-4xl font-bold text-gray-600"
              data-testid="text-closed-count"
            >
              {{ stats.closed }}
            </div>
            <p class="text-xs text-muted-foreground mt-1">Resolved tickets</p>
          </Card>
        </div>

        <div class="flex flex-col sm:flex-row gap-4">
          <router-link to="/tickets">
            <Button
              size="lg"
              class="w-full sm:w-auto"
              data-testid="button-manage-tickets"
            >
              <Ticket class="w-4 h-4 mr-2" />
              Manage Tickets
            </Button>
          </router-link>

          <router-link to="/tickets?action=create">
            <Button
              size="lg"
              variant="outline"
              class="w-full sm:w-auto"
              data-testid="button-create-ticket"
            >
              <Plus class="w-4 h-4 mr-2" />
              Create New Ticket
            </Button>
          </router-link>
        </div>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useTicketsStore } from "@/stores/tickets";
import {
  Ticket as TicketIcon,
  LogOut,
  Ticket,
  Dot,
  Clock,
  CheckCircle2,
  Plus,
} from "lucide-vue-next";
import Card from "@/components/ui/Card.vue";
import Button from "@/components/ui/Button.vue";
import Footer from "@/components/layout/Footer.vue";

const router = useRouter();
const authStore = useAuthStore();
const ticketsStore = useTicketsStore();

const stats = computed(() => ({
  total: ticketsStore.tickets.length,
  open: ticketsStore.tickets.filter((t) => t.status === "open").length,
  inProgress: ticketsStore.tickets.filter((t) => t.status === "in_progress")
    .length,
  closed: ticketsStore.tickets.filter((t) => t.status === "closed").length,
}));

function handleLogout() {
  authStore.logout();
  router.push("/auth/login");
}

onMounted(() => {
  ticketsStore.loadTickets();
});
</script>
