import { User } from '../types';

const USER_KEY = 'goplan_users';
const CURRENT_USER_KEY = 'goplan_current_user';

export const authService = {
  getUsers(): User[] {
    const data = localStorage.getItem(USER_KEY);
    if (!data) {
      // Seed a default user
      const defaultUser: User = { id: 'user-1', name: 'Admin Traveler', email: 'admin@goplan.com', password: 'password123' };
      localStorage.setItem(USER_KEY, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(data);
  },

  register(user: Omit<User, 'id'>): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const normalizedEmail = user.email.trim().toLowerCase();
    
    if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
      return { success: false, message: 'This email address is already registered. Please sign in or use another email.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name: user.name.trim(),
      email: normalizedEmail,
      password: user.password
    };

    users.push(newUser);
    localStorage.setItem(USER_KEY, JSON.stringify(users));
    
    // Auto log in after registration
    this.setCurrentUser(newUser);
    
    return { success: true, message: 'Account successfully registered and signed in!', user: newUser };
  },

  login(email: string, password: string): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === normalizedEmail && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password. Please check your credentials or register a new account.' };
    }

    this.setCurrentUser(user);
    return { success: true, message: 'Login successful!', user };
  },

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  setCurrentUser(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }
};
