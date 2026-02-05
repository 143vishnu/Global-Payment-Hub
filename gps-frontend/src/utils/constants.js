// User roles
export const ROLES = {
  ADMIN: 'ADMIN',
  OPS_USER: 'OPS_USER',
  BUSINESS_USER: 'BUSINESS_USER',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  REJECTED: 'REJECTED',
};

// Batch job statuses
export const BATCH_STATUS = {
  QUEUED: 'QUEUED',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
};

// Regions
export const REGIONS = [
  'NORTH_AMERICA',
  'EUROPE',
  'ASIA_PACIFIC',
  'LATIN_AMERICA',
  'MIDDLE_EAST',
  'AFRICA',
];

// Payment types
export const PAYMENT_TYPES = [
  'WIRE',
  'ACH',
  'SEPA',
  'SWIFT',
  'DOMESTIC',
  'INTERNATIONAL',
];

// Date range presets
export const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  LAST_7_DAYS: 'last7days',
  LAST_30_DAYS: 'last30days',
  THIS_MONTH: 'thisMonth',
  LAST_MONTH: 'lastMonth',
  CUSTOM: 'custom',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  SIZE_OPTIONS: [10, 20, 50, 100],
};

// Auto-refresh intervals (in milliseconds)
export const REFRESH_INTERVALS = {
  DASHBOARD: 30000, // 30 seconds
  BATCH_STATUS: 5000, // 5 seconds
  PAYMENT_SEARCH: 60000, // 60 seconds
};

// File upload limits
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ACCEPTED_TYPES: ['.csv', '.txt', '.xlsx'],
};

// API endpoints (for reference)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  PAYMENTS: {
    SUMMARY: '/payments/summary',
    SEARCH: '/payments',
    DETAILS: '/payments/:id',
    FAILED: '/payments/failed',
    RETRY: '/payments/:id/retry',
    CANCEL: '/payments/:id/cancel',
    REPAIR: '/payments/:id/repair',
  },
  BATCH: {
    UPLOAD: '/batch/upload',
    JOBS: '/batch/jobs',
    STATUS: '/batch/jobs/:id/status',
  },
  REPORTS: {
    DAILY: '/reports/daily',
    AUDIT: '/reports/audit',
  },
  ADMIN: {
    CONFIG: '/admin/config',
    RULES: '/admin/regional-rules',
    THRESHOLDS: '/admin/thresholds',
  },
};
