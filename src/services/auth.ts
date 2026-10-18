import { UserAccount } from '../types';

const AUTH_USER_KEY = 'zakaty_auth_user_v1';

export function getCurrentUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserAccount | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(AUTH_USER_KEY);
  } else {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  }
}

export function registerUser(email: string, name: string): UserAccount {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = cleanEmail === 'abderrazak.abdessamia5@gmail.com' || cleanEmail.startsWith('admin@');
  const user: UserAccount = {
    id: `usr_${Date.now()}`,
    email: cleanEmail,
    name: name.trim() || 'ZakaTy Member',
    role: isAdmin ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(user);
  return user;
}

export function loginUser(email: string): UserAccount {
  const cleanEmail = email.trim().toLowerCase();
  const isAdmin = cleanEmail === 'abderrazak.abdessamia5@gmail.com' || cleanEmail.startsWith('admin@');
  const user: UserAccount = {
    id: `usr_${Date.now()}`,
    email: cleanEmail,
    name: cleanEmail.split('@')[0],
    role: isAdmin ? 'admin' : 'user',
    createdAt: new Date().toISOString(),
  };
  setCurrentUser(user);
  return user;
}

export function logoutUser(): void {
  setCurrentUser(null);
}
