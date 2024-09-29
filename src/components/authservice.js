let users = [
  { email: 'user@example.com', password: 'password123', name:'ama' },
  { email: 'admin@example.com', password: 'admin123', name:'ampo' }
];

const authService = {
  login: (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      localStorage.setItem('user', JSON.stringify({ email: user.email, name:user.name }));
      return Promise.resolve({ email: user.email, name:user.name });
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
  },

  signUp: (email, password, name) => {
    if (users.some(u => u.email === email)) {
      return Promise.reject('User already exists');
    }
    users.push({ email, password, name });
    localStorage.setItem('user', JSON.stringify({ email, name }));
    return Promise.resolve({ email, name });
  }
};

export default authService;