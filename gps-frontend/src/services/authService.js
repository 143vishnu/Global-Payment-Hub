import apiClient from './apiClient';

// Mock users for testing without backend
const MOCK_USERS = {
  'admin': { password: 'admin123', role: 'ADMIN', name: 'Admin User' },
  'opsuser': { password: 'ops123', role: 'OPS_USER', name: 'Operations User' },
  'businessuser': { password: 'business123', role: 'BUSINESS_USER', name: 'Business User' },
};

const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      
      if (response.data.jwtToken) {
        localStorage.setItem('jwtToken', response.data.jwtToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // Fallback to mock authentication if backend is not available
      console.warn('Backend not available, using mock authentication');
      
      const mockUser = MOCK_USERS[username.toLowerCase()];
      if (mockUser && mockUser.password === password) {
        const mockToken = 'mock-jwt-token-' + Date.now();
        const userData = {
          username: username,
          role: mockUser.role,
          name: mockUser.name,
        };
        
        localStorage.setItem('jwtToken', mockToken);
        localStorage.setItem('refreshToken', 'mock-refresh-token');
        localStorage.setItem('user', JSON.stringify(userData));
        
        return {
          jwtToken: mockToken,
          refreshToken: 'mock-refresh-token',
          user: userData,
        };
      }
      
      throw new Error('Invalid credentials');
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('jwtToken');
  },

  // Get user role
  getUserRole: () => {
    const user = authService.getCurrentUser();
    return user?.role || null;
  },

  // Check if user has specific role
  hasRole: (role) => {
    const userRole = authService.getUserRole();
    return userRole === role;
  },

  // Check if user has any of the specified roles
  hasAnyRole: (roles) => {
    const userRole = authService.getUserRole();
    return roles.includes(userRole);
  },
};

export default authService;
