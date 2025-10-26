import type { User, Ticket } from '@shared/schema';

const USERS_KEY = 'ticketapp_users';
const SESSION_KEY = 'ticketapp_session';
const TICKETS_KEY = 'ticketapp_tickets';

interface Session {
  user: User;
  token: string;
}

export const storage = {
  getUsers(): User[] {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser(user: User) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getSession(): Session | null {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  saveSession(session: Session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  },

  clearSession() {
    localStorage.removeItem(SESSION_KEY);
  },

  getTickets(userId: string): Ticket[] {
    const data = localStorage.getItem(TICKETS_KEY);
    const allTickets: Ticket[] = data ? JSON.parse(data) : [];
    return allTickets.filter(t => t.userId === userId);
  },

  saveTicket(ticket: Ticket) {
    const data = localStorage.getItem(TICKETS_KEY);
    const tickets: Ticket[] = data ? JSON.parse(data) : [];
    tickets.push(ticket);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
  },

  updateTicket(id: string, updatedTicket: Ticket) {
    const data = localStorage.getItem(TICKETS_KEY);
    const tickets: Ticket[] = data ? JSON.parse(data) : [];
    const index = tickets.findIndex(t => t.id === id);
    if (index !== -1) {
      tickets[index] = updatedTicket;
      localStorage.setItem(TICKETS_KEY, JSON.stringify(tickets));
    }
  },

  deleteTicket(id: string) {
    const data = localStorage.getItem(TICKETS_KEY);
    const tickets: Ticket[] = data ? JSON.parse(data) : [];
    const filtered = tickets.filter(t => t.id !== id);
    localStorage.setItem(TICKETS_KEY, JSON.stringify(filtered));
  },
};
