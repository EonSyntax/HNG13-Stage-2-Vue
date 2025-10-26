import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Ticket, InsertTicket } from '@shared/schema';
import { storage } from '../utils/storage';
import { useAuthStore } from './auth';

export const useTicketsStore = defineStore('tickets', () => {
  const tickets = ref<Ticket[]>([]);
  const loading = ref(false);

  async function loadTickets() {
    const authStore = useAuthStore();
    if (!authStore.user) return;

    loading.value = true;
    try {
      tickets.value = storage.getTickets(authStore.user.id);
    } finally {
      loading.value = false;
    }
  }

  async function createTicket(data: InsertTicket) {
    const authStore = useAuthStore();
    if (!authStore.user) throw new Error('Not authenticated');

    const newTicket: Ticket = {
      ...data,
      id: crypto.randomUUID(),
      userId: authStore.user.id,
      createdAt: new Date().toISOString(),
    };

    storage.saveTicket(newTicket);
    await loadTickets();
  }

  async function updateTicket(id: string, data: Partial<InsertTicket>) {
    const authStore = useAuthStore();
    if (!authStore.user) throw new Error('Not authenticated');

    const ticket = tickets.value.find(t => t.id === id);
    if (!ticket) throw new Error('Ticket not found');

    const updatedTicket: Ticket = {
      ...ticket,
      ...data,
    };

    storage.updateTicket(id, updatedTicket);
    await loadTickets();
  }

  async function deleteTicket(id: string) {
    storage.deleteTicket(id);
    await loadTickets();
  }

  return {
    tickets,
    loading,
    loadTickets,
    createTicket,
    updateTicket,
    deleteTicket,
  };
});
