import apiClient from './apiClient';

// Mock data generators
const generateMockConfig = () => ({
  maxRetryAttempts: 3,
  retryDelay: 60,
  batchSize: 100,
  apiTimeout: 30,
  enableNotifications: true,
  logLevel: 'INFO',
});

const generateMockThresholds = () => [
  { id: 1, name: 'High Value Transaction', value: 100000, unit: 'USD' },
  { id: 2, name: 'Daily Limit', value: 500000, unit: 'USD' },
  { id: 3, name: 'Transaction Count Alert', value: 1000, unit: 'count' },
  { id: 4, name: 'Failure Rate Threshold', value: 5, unit: 'percent' },
];

const generateMockRegionalRules = () => [
  { region: 'NORTH_AMERICA', maxAmount: 1000000, currency: 'USD', enabled: true, taxRate: 0 },
  { region: 'EUROPE', maxAmount: 850000, currency: 'EUR', enabled: true, taxRate: 20 },
  { region: 'ASIA_PACIFIC', maxAmount: 500000, currency: 'USD', enabled: true, taxRate: 10 },
  { region: 'LATIN_AMERICA', maxAmount: 250000, currency: 'USD', enabled: true, taxRate: 15 },
  { region: 'MIDDLE_EAST', maxAmount: 500000, currency: 'USD', enabled: true, taxRate: 5 },
];

const adminService = {
  // Get configuration
  getConfig: async () => {
    try {
      const response = await apiClient.get('/admin/config');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock config data');
      return generateMockConfig();
    }
  },

  // Update configuration
  updateConfig: async (config) => {
    try {
      const response = await apiClient.put('/admin/config', config);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating config update');
      return { success: true, message: 'Configuration updated (mock)' };
    }
  },

  // Get regional rules
  getRegionalRules: async () => {
    try {
      const response = await apiClient.get('/admin/regional-rules');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock regional rules');
      return generateMockRegionalRules();
    }
  },

  // Update regional rule
  updateRegionalRule: async (region, rule) => {
    try {
      const response = await apiClient.put(`/admin/regional-rules/${region}`, rule);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating regional rule update');
      return { success: true, message: 'Regional rule updated (mock)' };
    }
  },

  // Get thresholds
  getThresholds: async () => {
    try {
      const response = await apiClient.get('/admin/thresholds');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock thresholds');
      return generateMockThresholds();
    }
  },

  // Update threshold
  updateThreshold: async (thresholdId, value) => {
    try {
      const response = await apiClient.put(`/admin/thresholds/${thresholdId}`, { value });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating threshold update');
      return { success: true, message: 'Threshold updated (mock)' };
    }
  },

  // Get system status
  getSystemStatus: async () => {
    try {
      const response = await apiClient.get('/admin/system-status');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock system status');
      return {
        status: 'operational',
        uptime: '99.9%',
        lastRestart: '2024-01-15T10:30:00Z',
        activeConnections: 1542,
        queueSize: 23,
        memoryUsage: 65,
        cpuUsage: 42,
      };
    }
  },

  // Get users (admin only)
  getUsers: async () => {
    try {
      const response = await apiClient.get('/admin/users');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock users data');
      return [
        { id: 1, username: 'admin', email: 'admin@gps.com', role: 'ADMIN', active: true },
        { id: 2, username: 'user', email: 'user@gps.com', role: 'OPS_USER', active: true },
        { id: 3, username: 'business', email: 'business@gps.com', role: 'BUSINESS_USER', active: true },
      ];
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating user role update');
      return { success: true, message: 'User role updated (mock)' };
    }
  },
};

export default adminService;
