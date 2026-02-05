import apiClient from './apiClient';

// Mock data for when backend is not available
const MOCK_SUMMARY = {
  totalCount: 450,
  totalAmount: 1350000,
  successCount: 380,
  failedCount: 35,
  pendingCount: 35,
  regionalDistribution: [
    { region: 'NA', count: 150, amount: 450000 },
    { region: 'EU', count: 120, amount: 360000 },
    { region: 'APAC', count: 100, amount: 300000 },
    { region: 'LATAM', count: 80, amount: 240000 },
  ],
  trend: [
    { date: '01/25', count: 120, amount: 360000 },
    { date: '01/26', count: 135, amount: 405000 },
    { date: '01/27', count: 125, amount: 375000 },
    { date: '01/28', count: 145, amount: 435000 },
    { date: '01/29', count: 155, amount: 465000 },
    { date: '01/30', count: 160, amount: 480000 },
    { date: '01/31', count: 150, amount: 450000 },
  ]
};

// Mock failed payments data
const generateMockFailedPayments = () => {
  const errorMessages = [
    'Insufficient funds in source account',
    'Invalid beneficiary account number',
    'Connection timeout to payment gateway',
    'Duplicate transaction detected',
    'Currency conversion rate unavailable',
    'Beneficiary bank unreachable',
    'Invalid routing number',
    'Transaction exceeds daily limit',
    'Account frozen by compliance team',
    'Network error during processing',
  ];

  const statuses = ['FAILED', 'ERROR', 'REJECTED'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD'];
  
  const failedPayments = [];
  for (let i = 1; i <= 25; i++) {
    failedPayments.push({
      id: 1000 + i,
      paymentId: `PAY-${String(1000 + i).padStart(6, '0')}`,
      amount: (Math.random() * 50000 + 1000).toFixed(2),
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      errorMessage: errorMessages[Math.floor(Math.random() * errorMessages.length)],
      failedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      sender: `sender${i}@example.com`,
      beneficiary: `beneficiary${i}@example.com`,
      retryCount: Math.floor(Math.random() * 3),
    });
  }
  return failedPayments;
};

// Mock search payments data
const generateMockSearchPayments = (filters = {}) => {
  const statuses = ['SUCCESS', 'PENDING', 'FAILED', 'PROCESSING', 'COMPLETED'];
  const regions = ['NORTH_AMERICA', 'EUROPE', 'ASIA_PACIFIC', 'LATIN_AMERICA', 'MIDDLE_EAST'];
  const paymentTypes = ['WIRE', 'ACH', 'SEPA', 'SWIFT', 'INSTANT'];
  const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY'];
  
  const payments = [];
  for (let i = 1; i <= 50; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const paymentType = paymentTypes[Math.floor(Math.random() * paymentTypes.length)];
    const currency = currencies[Math.floor(Math.random() * currencies.length)];
    const amount = (Math.random() * 100000 + 1000).toFixed(2);
    const createdDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const payment = {
      id: 2000 + i,
      paymentId: `PAY-${String(2000 + i).padStart(6, '0')}`,
      amount: parseFloat(amount),
      currency: currency,
      status: status,
      region: region,
      paymentType: paymentType,
      sender: `sender${i}@example.com`,
      beneficiary: `beneficiary${i}@example.com`,
      createdDate: createdDate,
      updatedDate: createdDate,
      description: `Payment transaction ${i}`,
    };
    
    // Apply filters if provided
    let includePayment = true;
    
    if (filters.paymentId && !payment.paymentId.toLowerCase().includes(filters.paymentId.toLowerCase())) {
      includePayment = false;
    }
    if (filters.status && payment.status !== filters.status) {
      includePayment = false;
    }
    if (filters.region && payment.region !== filters.region) {
      includePayment = false;
    }
    if (filters.paymentType && payment.paymentType !== filters.paymentType) {
      includePayment = false;
    }
    if (filters.minAmount && payment.amount < parseFloat(filters.minAmount)) {
      includePayment = false;
    }
    if (filters.maxAmount && payment.amount > parseFloat(filters.maxAmount)) {
      includePayment = false;
    }
    if (filters.startDate && new Date(payment.createdDate) < new Date(filters.startDate)) {
      includePayment = false;
    }
    if (filters.endDate && new Date(payment.createdDate) > new Date(filters.endDate)) {
      includePayment = false;
    }
    
    if (includePayment) {
      payments.push(payment);
    }
  }
  
  return payments;
};

const paymentService = {
  // Get payment summary for dashboard
  getSummary: async () => {
    try {
      const response = await apiClient.get('/payments/summary');
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return MOCK_SUMMARY;
    }
  },

  // Search payments with filters
  searchPayments: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
          params.append(key, filters[key]);
        }
      });

      const response = await apiClient.get(`/payments?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock search payments data');
      const allPayments = generateMockSearchPayments(filters);
      const page = parseInt(filters.page) || 0;
      const size = parseInt(filters.size) || 20;
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedData = allPayments.slice(startIndex, endIndex);
      
      return {
        content: paginatedData,
        totalElements: allPayments.length,
        totalPages: Math.ceil(allPayments.length / size),
        number: page,
        size: size,
      };
    }
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    try {
      const response = await apiClient.get(`/payments/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock data');
      return null;
    }
  },

  // Get failed payments
  getFailedPayments: async (page = 0, size = 20) => {
    try {
      const response = await apiClient.get('/payments/failed', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock failed payments data');
      const allFailedPayments = generateMockFailedPayments();
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedData = allFailedPayments.slice(startIndex, endIndex);
      
      return {
        content: paginatedData,
        totalElements: allFailedPayments.length,
        totalPages: Math.ceil(allFailedPayments.length / size),
        number: page,
        size: size,
      };
    }
  },

  // Retry payment
  retryPayment: async (paymentId) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/retry`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating retry');
      return { success: true, message: 'Payment retry initiated (mock)' };
    }
  },

  // Cancel payment
  cancelPayment: async (paymentId) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/cancel`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating cancel');
      return { success: true, message: 'Payment cancelled (mock)' };
    }
  },

  // Repair payment
  repairPayment: async (paymentId, repairData) => {
    try {
      const response = await apiClient.post(`/payments/${paymentId}/repair`, repairData);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating repair');
      return { success: true, message: 'Payment repaired (mock)' };
    }
  },

  // Get payment lifecycle history
  getPaymentHistory: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}/history`);
    return response.data;
  },

  // Get payment audit trail
  getAuditTrail: async (paymentId) => {
    const response = await apiClient.get(`/payments/${paymentId}/audit`);
    return response.data;
  },
};

export default paymentService;
