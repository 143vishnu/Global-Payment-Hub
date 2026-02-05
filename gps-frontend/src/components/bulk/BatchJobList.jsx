import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Replay as RetryIcon,
} from '@mui/icons-material';
import DataTable from '../common/DataTable';
import { useBatch } from '../../context/BatchContext';
import { formatDateTime, downloadFile } from '../../utils/helpers';
import { BATCH_STATUS } from '../../utils/constants';

const BatchJobList = ({ refreshTrigger }) => {
  const { batchJobs, loading, fetchBatchJobs, retryFailedRecords, downloadReport } = useBatch();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const loadJobs = useCallback(async () => {
    try {
      const result = await fetchBatchJobs(page, rowsPerPage);
      setTotalCount(result.totalElements || result.length || 0);
    } catch (err) {
      console.error('Failed to load batch jobs:', err);
    }
  }, [fetchBatchJobs, page, rowsPerPage]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs, refreshTrigger]);

  const handleRefresh = () => {
    loadJobs();
  };

  const handleRetry = async (jobId) => {
    const result = await retryFailedRecords(jobId);
    if (result.success) {
      loadJobs();
    }
  };

  const handleDownload = async (jobId, fileName) => {
    const result = await downloadReport(jobId);
    if (result.success) {
      downloadFile(result.blob, fileName || `batch-report-${jobId}.csv`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      [BATCH_STATUS.COMPLETED]: 'success',
      [BATCH_STATUS.PROCESSING]: 'info',
      [BATCH_STATUS.FAILED]: 'error',
      [BATCH_STATUS.CANCELLED]: 'default',
      [BATCH_STATUS.QUEUED]: 'warning',
    };
    return colors[status] || 'default';
  };

  const columns = [
    {
      id: 'jobId',
      label: 'Job ID',
      minWidth: 150,
    },
    {
      id: 'fileName',
      label: 'File Name',
      minWidth: 200,
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value) => (
        <Chip label={value} color={getStatusColor(value)} size="small" />
      ),
    },
    {
      id: 'totalRecords',
      label: 'Total',
      minWidth: 80,
      align: 'center',
    },
    {
      id: 'successCount',
      label: 'Success',
      minWidth: 80,
      align: 'center',
      format: (value) => (
        <Typography color="success.main" fontWeight="bold">
          {value || 0}
        </Typography>
      ),
    },
    {
      id: 'failedCount',
      label: 'Failed',
      minWidth: 80,
      align: 'center',
      format: (value) => (
        <Typography color="error.main" fontWeight="bold">
          {value || 0}
        </Typography>
      ),
    },
    {
      id: 'createdDate',
      label: 'Created',
      minWidth: 180,
      format: (value) => formatDateTime(value),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 150,
      sortable: false,
      format: (value, row) => (
        <Box display="flex" gap={1}>
          {row.status === BATCH_STATUS.COMPLETED && (
            <IconButton
              size="small"
              onClick={() => handleDownload(row.jobId, row.fileName)}
              title="Download Report"
            >
              <DownloadIcon fontSize="small" />
            </IconButton>
          )}
          {row.failedCount > 0 && row.status === BATCH_STATUS.COMPLETED && (
            <IconButton
              size="small"
              onClick={() => handleRetry(row.jobId)}
              title="Retry Failed Records"
            >
              <RetryIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Batch Jobs</Typography>
          <IconButton onClick={handleRefresh} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
        <DataTable
          columns={columns}
          data={batchJobs}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          loading={loading}
          emptyMessage="No batch jobs found"
        />
      </CardContent>
    </Card>
  );
};

export default BatchJobList;
