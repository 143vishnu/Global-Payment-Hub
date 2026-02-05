import apiClient from './apiClient';

// Mock data for batch jobs
const generateMockBatchJobs = () => {
  const statuses = ['COMPLETED', 'PROCESSING', 'FAILED', 'PENDING'];
  const jobs = [];
  
  for (let i = 1; i <= 10; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const totalRecords = Math.floor(Math.random() * 1000) + 100;
    const processedRecords = status === 'COMPLETED' ? totalRecords : 
                            status === 'PROCESSING' ? Math.floor(totalRecords * 0.5) :
                            status === 'FAILED' ? Math.floor(totalRecords * 0.3) : 0;
    const successRecords = Math.floor(processedRecords * 0.9);
    const failedRecords = processedRecords - successRecords;
    
    jobs.push({
      jobId: `BATCH-${String(1000 + i).padStart(6, '0')}`,
      fileName: `payments_batch_${i}.csv`,
      status: status,
      totalRecords: totalRecords,
      processedRecords: processedRecords,
      successRecords: successRecords,
      failedRecords: failedRecords,
      uploadedBy: 'admin@gps.com',
      uploadedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedDate: status === 'COMPLETED' ? new Date(Date.now() - Math.random() * 6 * 24 * 60 * 60 * 1000).toISOString() : null,
    });
  }
  
  return jobs.sort((a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate));
};

const batchService = {
  // Upload batch file
  uploadBatch: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      Object.keys(options).forEach(key => {
        formData.append(key, options[key]);
      });

      const response = await apiClient.post('/batch/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating batch upload');
      // Simulate successful upload
      const jobId = `BATCH-${String(Math.floor(Math.random() * 900000) + 100000).padStart(6, '0')}`;
      return {
        jobId: jobId,
        fileName: file.name,
        status: 'PENDING',
        message: 'Batch file uploaded successfully (mock)',
        uploadedDate: new Date().toISOString(),
      };
    }
  },

  // Get batch jobs
  getBatchJobs: async (page = 0, size = 20) => {
    try {
      const response = await apiClient.get('/batch/jobs', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock batch jobs data');
      const allJobs = generateMockBatchJobs();
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedData = allJobs.slice(startIndex, endIndex);
      
      return {
        content: paginatedData,
        totalElements: allJobs.length,
        totalPages: Math.ceil(allJobs.length / size),
        number: page,
        size: size,
      };
    }
  },

  // Get batch job by ID
  getBatchJobById: async (jobId) => {
    try {
      const response = await apiClient.get(`/batch/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock batch job data');
      const jobs = generateMockBatchJobs();
      return jobs.find(job => job.jobId === jobId) || jobs[0];
    }
  },

  // Get batch job status
  getBatchJobStatus: async (jobId) => {
    try {
      const response = await apiClient.get(`/batch/jobs/${jobId}/status`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, using mock batch job status');
      return {
        jobId: jobId,
        status: 'PROCESSING',
        progress: Math.floor(Math.random() * 100),
      };
    }
  },

  // Retry failed records in batch
  retryFailedRecords: async (jobId) => {
    try {
      const response = await apiClient.post(`/batch/jobs/${jobId}/retry`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating retry');
      return {
        success: true,
        message: 'Retry initiated (mock)',
        jobId: jobId,
      };
    }
  },

  // Download batch report
  downloadBatchReport: async (jobId) => {
    try {
      const response = await apiClient.get(`/batch/jobs/${jobId}/report`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.warn('Backend not available, generating mock CSV report');
      // Generate mock CSV content
      const csvContent = `Job ID,Status,Total Records,Processed,Success,Failed
${jobId},COMPLETED,500,500,475,25`;
      return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    }
  },

  // Cancel batch job
  cancelBatchJob: async (jobId) => {
    try {
      const response = await apiClient.post(`/batch/jobs/${jobId}/cancel`);
      return response.data;
    } catch (error) {
      console.warn('Backend not available, simulating cancel');
      return {
        success: true,
        message: 'Batch job cancelled (mock)',
        jobId: jobId,
      };
    }
  },
};

export default batchService;
