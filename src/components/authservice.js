const fakeUsers = [
  { email: 'user@example.com', password: 'password123' },
  { email: 'admin@example.com', password: 'admin123' }
];

const authService = {
  login: (email, password) => {
    const user = fakeUsers.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify({ email: user.email }));
      return Promise.resolve({ email: user.email });
    }
    return Promise.reject('Invalid email or password');
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('user');
  }
};

export default authService;