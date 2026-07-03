// Lightweight client-side auth for demo purposes.
// NOTE: passwords are stored in localStorage in plain text — this is a demo
// only and must not be used to protect real accounts.

const USERS_KEY = 'crypto-tracker:users';
const SESSION_KEY = 'crypto-tracker:user';

const seedUsers = [
  { email: 'user@example.com', password: 'password123', name: 'Ama' },
  { email: 'admin@example.com', password: 'admin123', name: 'Ampo' },
];

const loadUsers = () => {
  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      /* fall through to seed */
    }
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
  return [...seedUsers];
};

const saveUsers = (users) => localStorage.setItem(USERS_KEY, JSON.stringify(users));

const authService = {
  login: (email, password) => {
    const users = loadUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (!user) {
      return Promise.reject(new Error('Invalid email or password'));
    }
    const session = { email: user.email, name: user.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return Promise.resolve(session);
  },

  signUp: (email, password, name) => {
    const users = loadUsers();
    const normalized = email.trim().toLowerCase();
    if (users.some((u) => u.email.toLowerCase() === normalized)) {
      return Promise.reject(new Error('An account with this email already exists'));
    }
    const newUser = { email: email.trim(), password, name: name.trim() };
    users.push(newUser);
    saveUsers(users);
    const session = { email: newUser.email, name: newUser.name };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return Promise.resolve(session);
  },

  logout: () => localStorage.removeItem(SESSION_KEY),

  getCurrentUser: () => {
    const user = localStorage.getItem(SESSION_KEY);
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  },

  isAuthenticated: () => !!localStorage.getItem(SESSION_KEY),
};

export default authService;
