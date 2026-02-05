import apiClient from './apiClient';

// Mock data generator for reports
const generateMockDailyReport = (startDate, endDate, filters = {}) => {
  const data = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    data.push({
      date: d.toISOString().split('T')[0],
      totalTransactions: Math.floor(Math.random() * 1000) + 500,
      totalAmount: (Math.random() * 1000000 + 500000).toFixed(2),
      successCount: Math.floor(Math.random() * 800) + 400,
      failedCount: Math.floor(Math.random() * 50) + 10,
      region: filters.region || 'NA',
      paymentType: filters.paymentType || 'ALL',
    });
  }
  return data;
};

const generateMockAuditReport = (startDate, endDate, filters = {}) => {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      id: `AUDIT-${1000 + i}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: ['admin', 'opsuser', 'businessuser'][Math.floor(Math.random() * 3)],
      action: ['Payment Created', 'Payment Updated', 'Payment Cancelled', 'User Login', 'Report Generated'][Math.floor(Math.random() * 5)],
      resource: `Payment-${Math.floor(Math.random() * 10000)}`,
      status: Math.random() > 0.1 ? 'SUCCESS' : 'FAILED',
      region: filters.region || ['NA', 'EU', 'APAC'][Math.floor(Math.random() * 3)],
    });
  }
  return data;
};

// Generate CSV content from data
const generateCSVContent = (data, reportType) => {
  if (!data || data.length === 0) return '';
  
  let headers, rows;
  
  if (reportType === 'daily') {
    headers = ['Date', 'Total Transactions', 'Total Amount', 'Success Count', 'Failed Count', 'Region', 'Payment Type'];
    rows = data.map(row => [
      row.date,
      row.totalTransactions,
      row.totalAmount,
      row.successCount,
      row.failedCount,
      row.region,
      row.paymentType
    ]);
  } else {
    headers = ['ID', 'Timestamp', 'User', 'Action', 'Resource', 'Status', 'Region'];
    rows = data.map(row => [
      row.id,
      row.timestamp,
      row.user,
      row.action,
      row.resource,
      row.status,
      row.region
    ]);
  }
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
};

// Create blob from CSV content
const createCSVBlob = (csvContent) => {
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
};

const reportService = {
  // Get daily report
  getDailyReport: async (startDate, endDate, filters = {}) => {
    try {
      const response = await apiClient.get('/reports/daily', {
        params: {
          startDate,
          endDate,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data for daily report');
      return generateMockDailyReport(startDate, endDate, filters);
    }
  },

  // Get audit report
  getAuditReport: async (startDate, endDate, filters = {}) => {
    try {
      const response = await apiClient.get('/reports/audit', {
        params: {
          startDate,
          endDate,
          ...filters,
        },
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data for audit report');
      return generateMockAuditReport(startDate, endDate, filters);
    }
  },

  // Download report as CSV
  downloadCSV: async (reportType, startDate, endDate, filters = {}) => {
    try {
      const response = await apiClient.get(`/reports/${reportType}/csv`, {
        params: {
          startDate,
          endDate,
          ...filters,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, generating mock CSV data');
      // Generate mock data and convert to CSV
      const mockData = reportType === 'daily' 
        ? generateMockDailyReport(startDate, endDate, filters)
        : generateMockAuditReport(startDate, endDate, filters);
      
      const csvContent = generateCSVContent(mockData, reportType);
      return createCSVBlob(csvContent);
    }
  },

  // Download report as Excel
  downloadExcel: async (reportType, startDate, endDate, filters = {}) => {
    try {
      const response = await apiClient.get(`/reports/${reportType}/excel`, {
        params: {
          startDate,
          endDate,
          ...filters,
        },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, generating mock CSV data (as Excel alternative)');
      // Generate mock data and convert to CSV (fallback for Excel)
      const mockData = reportType === 'daily' 
        ? generateMockDailyReport(startDate, endDate, filters)
        : generateMockAuditReport(startDate, endDate, filters);
      
      const csvContent = generateCSVContent(mockData, reportType);
      // Return CSV blob with Excel MIME type for compatibility
      return new Blob([csvContent], { type: 'application/vnd.ms-excel' });
    }
  },

  // Get regional statistics
  getRegionalStats: async (startDate, endDate) => {
    const response = await apiClient.get('/reports/regional-stats', {
      params: { startDate, endDate },
    });
    return response.data;
  },

  // Get payment type distribution
  getPaymentTypeDistribution: async (startDate, endDate) => {
    const response = await apiClient.get('/reports/payment-types', {
      params: { startDate, endDate },
    });
    return response.data;
  },
};

export default reportService;
