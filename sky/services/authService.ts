
import { PassengerDetails } from '../types.ts';

export interface User extends PassengerDetails {
  password: string;
  id: string;
  memberStatus: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  joinedDate: string;
}

const USERS_KEY = 'skyNet_database_users';
const SESSION_KEY = 'skyNet_database_session';

export const authService = {
  // Database Operations
  getUsers: (): User[] => {
    try {
      const users = localStorage.getItem(USERS_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  // Auth Operations
  register: (data: Omit<User, 'id' | 'memberStatus' | 'joinedDate'>): { success: boolean; message: string; user?: User } => {
    const users = authService.getUsers();
    
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser: User = {
      ...data,
      id: `SN-${Math.floor(1000 + Math.random() * 9000)}-${data.firstName.substring(0, 2).toUpperCase()}`,
      memberStatus: 'Standard',
      joinedDate: new Date().toISOString()
    };

    authService.saveUsers([...users, newUser]);
    authService.setSession(newUser);
    return { success: true, message: 'Registration successful!', user: newUser };
  },

  login: (email: string, password: string): { success: boolean; message: string; user?: User } => {
    const users = authService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    authService.setSession(user);
    return { success: true, message: 'Login successful!', user };
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  // Session Management
  setSession: (user: User) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  },

  getSession: (): User | null => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      return session ? JSON.parse(session) : null;
    } catch {
      return null;
    }
  }
};
