import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@shared/schema';
import { storage } from '../utils/storage';
import bcrypt from 'bcryptjs';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  function loadSession() {
    const session = storage.getSession();
    if (session) {
      user.value = session.user;
      token.value = session.token;
    }
  }

  async function signup(username: string, password: string) {
    const existingUsers = storage.getUsers();
    if (existingUsers.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser: User = {
      id: crypto.randomUUID(),
      username,
      password: hashedPassword,
    };

    storage.saveUser(newUser);
    const sessionToken = crypto.randomUUID();
    storage.saveSession({ user: newUser, token: sessionToken });

    user.value = newUser;
    token.value = sessionToken;
  }

  async function login(username: string, password: string) {
    const users = storage.getUsers();
    const foundUser = users.find(u => u.username === username);

    if (!foundUser) {
      throw new Error('Invalid username or password');
    }

    const isValid = await bcrypt.compare(password, foundUser.password);
    if (!isValid) {
      throw new Error('Invalid username or password');
    }

    const sessionToken = crypto.randomUUID();
    storage.saveSession({ user: foundUser, token: sessionToken });

    user.value = foundUser;
    token.value = sessionToken;
  }

  function logout() {
    storage.clearSession();
    user.value = null;
    token.value = null;
  }

  loadSession();

  return {
    user,
    token,
    isAuthenticated,
    signup,
    login,
    logout,
  };
});
