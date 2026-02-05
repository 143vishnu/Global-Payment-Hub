import React, { createContext, useState, useContext, useCallback } from 'react';
import batchService from '../services/batchService';

const BatchContext = createContext(null);

export const BatchProvider = ({ children }) => {
  const [batchJobs, setBatchJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBatchJobs = useCallback(async (page = 0, size = 20) => {
    setLoading(true);
    setError(null);
    try {
      const data = await batchService.getBatchJobs(page, size);
      setBatchJobs(data.content || data);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch batch jobs');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadBatch = useCallback(async (file, options) => {
    setLoading(true);
    setError(null);
    try {
      const data = await batchService.uploadBatch(file, options);
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to upload batch file' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const getBatchJobStatus = useCallback(async (jobId) => {
    try {
      const data = await batchService.getBatchJobStatus(jobId);
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  const retryFailedRecords = useCallback(async (jobId) => {
    try {
      const data = await batchService.retryFailedRecords(jobId);
      return { success: true, data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to retry failed records' 
      };
    }
  }, []);

  const downloadReport = useCallback(async (jobId) => {
    try {
      const blob = await batchService.downloadBatchReport(jobId);
      return { success: true, blob };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Failed to download report' 
      };
    }
  }, []);

  const value = {
    batchJobs,
    selectedJob,
    loading,
    error,
    fetchBatchJobs,
    uploadBatch,
    getBatchJobStatus,
    retryFailedRecords,
    downloadReport,
    setSelectedJob,
  };

  return (
    <BatchContext.Provider value={value}>
      {children}
    </BatchContext.Provider>
  );
};

export const useBatch = () => {
  const context = useContext(BatchContext);
  if (!context) {
    throw new Error('useBatch must be used within a BatchProvider');
  }
  return context;
};

export default BatchContext;
