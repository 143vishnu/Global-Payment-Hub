import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import paymentService from '../services/paymentService';

describe('Payment Service', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
  });

  it('fetches payment summary successfully', async () => {
    const mockData = {
      totalPayments: 1000,
      successCount: 950,
      failedCount: 50,
      totalAmount: 1000000,
    };

    mock.onGet('/payments/summary').reply(200, mockData);

    const result = await paymentService.getSummary();
    expect(result).toEqual(mockData);
  });

  it('searches payments with filters', async () => {
    const mockPayments = {
      content: [
        { id: 1, paymentId: 'PAY001', amount: 100 },
        { id: 2, paymentId: 'PAY002', amount: 200 },
      ],
      totalElements: 2,
    };

    mock.onGet(/\/payments\?/).reply(200, mockPayments);

    const filters = { status: 'SUCCESS', region: 'NORTH_AMERICA' };
    const result = await paymentService.searchPayments(filters);
    
    expect(result.content).toHaveLength(2);
    expect(result.totalElements).toBe(2);
  });

  it('gets payment by ID', async () => {
    const mockPayment = {
      id: 1,
      paymentId: 'PAY001',
      amount: 100,
      status: 'SUCCESS',
    };

    mock.onGet('/payments/1').reply(200, mockPayment);

    const result = await paymentService.getPaymentById(1);
    expect(result.paymentId).toBe('PAY001');
  });

  it('handles errors gracefully', async () => {
    mock.onGet('/payments/summary').reply(500, { message: 'Server error' });

    await expect(paymentService.getSummary()).rejects.toThrow();
  });
});
