<template>
  <div class="min-h-screen flex flex-col bg-background">
    <header class="w-full border-b bg-card">
      <div class="max-w-[1440px] mx-auto px-6 md:px-12 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
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
        <div class="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 class="text-3xl md:text-4xl font-bold mb-2">My Tickets</h2>
            <p class="text-muted-foreground">Manage all your support tickets</p>
          </div>
          <Button @click="openCreateDialog">
            <Plus class="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        <div v-if="ticketsStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card v-for="i in 6" :key="i" class="p-6">
            <div class="h-32 bg-muted/50 rounded animate-pulse" />
          </Card>
        </div>

        <div v-else-if="ticketsStore.tickets.length === 0" class="text-center py-16">
          <Ticket class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2">No tickets yet</h3>
          <p class="text-muted-foreground mb-6">Create your first ticket to get started</p>
          <Button @click="openCreateDialog">
            <Plus class="w-4 h-4 mr-2" />
            Create Ticket
          </Button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="ticket in ticketsStore.tickets"
            :key="ticket.id"
            :class="cn(
              'p-6 shadow-md hover-elevate border-l-4',
              getStatusColor(ticket.status)
            )"
          >
            <div class="flex justify-between items-start mb-3">
              <h3 class="font-bold text-lg">{{ ticket.title }}</h3>
              <Badge :class="getStatusBadgeColor(ticket.status)">
                {{ formatStatus(ticket.status) }}
              </Badge>
            </div>
            <p class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ ticket.description || 'No description' }}</p>
            <div class="flex items-center justify-between">
              <span v-if="ticket.priority" class="text-xs text-muted-foreground">
                Priority: {{ ticket.priority }}
              </span>
              <div class="flex gap-2">
                <Button size="sm" variant="outline" @click="openEditDialog(ticket)">
                  <Pencil class="w-3 h-3" />
                </Button>
                <Button size="sm" variant="destructive" @click="openDeleteDialog(ticket)">
                  <Trash2 class="w-3 h-3" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>

    <Footer />

    <!-- Create Ticket Dialog -->
    <Dialog v-model:open="showCreateDialog">
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Create New Ticket</h3>
      </div>
      <form @submit.prevent="handleCreate" class="space-y-4">
        <div class="space-y-2">
          <Label>Title</Label>
          <Input v-model="createForm.title" placeholder="Enter ticket title" />
        </div>
        <div class="space-y-2">
          <Label>Description</Label>
          <Textarea v-model="createForm.description" placeholder="Enter ticket description" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Status</Label>
            <Select v-model="createForm.status">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>Priority</Label>
            <Select v-model="createForm.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
        </div>
        <div class="flex gap-2 justify-end">
          <Button type="button" variant="outline" @click="showCreateDialog = false">
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Dialog>

    <!-- Edit Ticket Dialog -->
    <Dialog v-model:open="showEditDialog">
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Edit Ticket</h3>
      </div>
      <form @submit.prevent="handleEdit" class="space-y-4">
        <div class="space-y-2">
          <Label>Title</Label>
          <Input v-model="editForm.title" placeholder="Enter ticket title" />
        </div>
        <div class="space-y-2">
          <Label>Description</Label>
          <Textarea v-model="editForm.description" placeholder="Enter ticket description" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label>Status</Label>
            <Select v-model="editForm.status">
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <div class="space-y-2">
            <Label>Priority</Label>
            <Select v-model="editForm.priority">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </div>
        </div>
        <div class="flex gap-2 justify-end">
          <Button type="button" variant="outline" @click="showEditDialog = false">
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Dialog>

    <!-- Delete Confirmation Dialog -->
    <Dialog v-model:open="showDeleteDialog">
      <div class="mb-4">
        <h3 class="text-lg font-bold mb-2">Delete Ticket</h3>
        <p class="text-muted-foreground">Are you sure you want to delete this ticket? This action cannot be undone.</p>
      </div>
      <div class="flex gap-2 justify-end">
        <Button variant="outline" @click="showDeleteDialog = false">
          Cancel
        </Button>
        <Button variant="destructive" @click="handleDelete">
          Delete
        </Button>
      </div>
    </Dialog>

    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useTicketsStore } from '@/stores/tickets';
import { useToast } from '@/composables/useToast';
import type { Ticket, InsertTicket } from '@shared/schema';
import { Ticket as TicketIcon, LogOut, Plus, Pencil, Trash2 } from 'lucide-vue-next';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Label from '@/components/ui/Label.vue';
import Textarea from '@/components/ui/Textarea.vue';
import Select from '@/components/ui/Select.vue';
import Badge from '@/components/ui/Badge.vue';
import Dialog from '@/components/ui/Dialog.vue';
import Toast from '@/components/ui/Toast.vue';
import Footer from '@/components/layout/Footer.vue';
import { cn } from '@/utils/cn';

const router = useRouter();
const authStore = useAuthStore();
const ticketsStore = useTicketsStore();
const { toast } = useToast();

const showCreateDialog = ref(false);
const showEditDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedTicket = ref<Ticket | null>(null);

const createForm = reactive({
  title: '',
  description: '',
  status: 'open' as 'open' | 'in_progress' | 'closed',
  priority: 'medium' as 'low' | 'medium' | 'high',
});

const editForm = reactive({
  title: '',
  description: '',
  status: 'open' as 'open' | 'in_progress' | 'closed',
  priority: 'medium' as 'low' | 'medium' | 'high',
});

function openCreateDialog() {
  createForm.title = '';
  createForm.description = '';
  createForm.status = 'open';
  createForm.priority = 'medium';
  showCreateDialog.value = true;
}

function openEditDialog(ticket: Ticket) {
  selectedTicket.value = ticket;
  editForm.title = ticket.title;
  editForm.description = ticket.description || '';
  editForm.status = ticket.status;
  editForm.priority = ticket.priority || 'medium';
  showEditDialog.value = true;
}

function openDeleteDialog(ticket: Ticket) {
  selectedTicket.value = ticket;
  showDeleteDialog.value = true;
}

async function handleCreate() {
  if (!authStore.user) return;

  try {
    const data: InsertTicket = {
      title: createForm.title,
      description: createForm.description,
      status: createForm.status,
      priority: createForm.priority,
      userId: authStore.user.id,
    };
    await ticketsStore.createTicket(data);
    toast({
      title: 'Success',
      description: 'Ticket created successfully',
    });
    showCreateDialog.value = false;
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to create ticket',
      variant: 'destructive',
    });
  }
}

async function handleEdit() {
  if (!selectedTicket.value) return;

  try {
    await ticketsStore.updateTicket(selectedTicket.value.id, {
      title: editForm.title,
      description: editForm.description,
      status: editForm.status,
      priority: editForm.priority,
      userId: authStore.user!.id,
    });
    toast({
      title: 'Success',
      description: 'Ticket updated successfully',
    });
    showEditDialog.value = false;
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to update ticket',
      variant: 'destructive',
    });
  }
}

async function handleDelete() {
  if (!selectedTicket.value) return;

  try {
    await ticketsStore.deleteTicket(selectedTicket.value.id);
    toast({
      title: 'Success',
      description: 'Ticket deleted successfully',
    });
    showDeleteDialog.value = false;
  } catch (error: any) {
    toast({
      title: 'Error',
      description: error.message || 'Failed to delete ticket',
      variant: 'destructive',
    });
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/auth/login');
}

function getStatusColor(status: string) {
  switch (status) {
    case 'open':
      return 'border-l-green-500';
    case 'in_progress':
      return 'border-l-amber-500';
    case 'closed':
      return 'border-l-gray-500';
    default:
      return '';
  }
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-700 border-green-500';
    case 'in_progress':
      return 'bg-amber-100 text-amber-700 border-amber-500';
    case 'closed':
      return 'bg-gray-100 text-gray-700 border-gray-500';
    default:
      return '';
  }
}

function formatStatus(status: string) {
  switch (status) {
    case 'in_progress':
      return 'In Progress';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

onMounted(() => {
  ticketsStore.loadTickets();
});
</script>
