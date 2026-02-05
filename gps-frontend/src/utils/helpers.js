// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '-';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Format date and time
export const formatDateTime = (date) => {
  if (!date) return '-';
  
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// Format number with commas
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '-';
  return new Intl.NumberFormat('en-US').format(num);
};

// Get status color
export const getStatusColor = (status) => {
  const statusColors = {
    SUCCESS: 'success',
    PENDING: 'warning',
    FAILED: 'error',
    PROCESSING: 'info',
    CANCELLED: 'default',
    COMPLETED: 'success',
    REJECTED: 'error',
  };
  
  return statusColors[status?.toUpperCase()] || 'default';
};

// Get status chip variant
export const getStatusVariant = (status) => {
  const successStates = ['SUCCESS', 'COMPLETED'];
  const errorStates = ['FAILED', 'REJECTED', 'CANCELLED'];
  
  if (successStates.includes(status?.toUpperCase())) return 'filled';
  if (errorStates.includes(status?.toUpperCase())) return 'filled';
  return 'outlined';
};

// Truncate text
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Download file
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate amount
export const isValidAmount = (amount) => {
  return !isNaN(amount) && parseFloat(amount) > 0;
};

// Parse error message from API response
export const parseErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Get role display name
export const getRoleDisplayName = (role) => {
  const roleNames = {
    OPS_USER: 'Operations User',
    ADMIN: 'Administrator',
    BUSINESS_USER: 'Business User',
  };
  return roleNames[role] || role;
};

// Check if user can access feature
export const canAccessFeature = (userRole, requiredRoles) => {
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
};
