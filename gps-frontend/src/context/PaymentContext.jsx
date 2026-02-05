import React, { createContext, useState, useContext, useCallback } from 'react';
import paymentService from '../services/paymentService';

const PaymentContext = createContext(null);

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getSummary();
      setSummary(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPayments = useCallback(async (filters) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.searchPayments(filters);
      setPayments(data.content || data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search payments');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPaymentDetails = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await paymentService.getPaymentById(id);
      setSelectedPayment(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch payment details');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const retryPayment = useCallback(async (paymentId) => {
    try {
      const data = await paymentService.retryPayment(paymentId);
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to retry payment' 
      };
    }
  }, []);

  const cancelPayment = useCallback(async (paymentId) => {
    try {
      const data = await paymentService.cancelPayment(paymentId);
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to cancel payment' 
      };
    }
  }, []);

  const clearSelectedPayment = () => {
    setSelectedPayment(null);
  };

  const value = {
    payments,
    selectedPayment,
    summary,
    loading,
    error,
    fetchSummary,
    searchPayments,
    getPaymentDetails,
    retryPayment,
    cancelPayment,
    clearSelectedPayment,
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};

export default PaymentContext;
