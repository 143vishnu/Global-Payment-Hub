import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Replay as RetryIcon,
  Cancel as CancelIcon,
  Build as RepairIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatusChip from '../components/common/StatusChip';
import { useAuth } from '../context/AuthContext';
import paymentService from '../services/paymentService';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import { ROLES } from '../utils/constants';

const ExceptionPage = () => {
  const { hasAnyRole } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [repairDialogOpen, setRepairDialogOpen] = useState(false);
  const [repairData, setRepairData] = useState({});
  const [actionLoading, setActionLoading] = useState(false);

  const canTakeAction = hasAnyRole([ROLES.ADMIN, ROLES.OPS_USER]);

  const fetchFailedPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await paymentService.getFailedPayments(page, rowsPerPage);
      setPayments(result.content || result);
      setTotalCount(result.totalElements || result.length || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch failed payments');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchFailedPayments();
  }, [fetchFailedPayments]);

  const handleRetry = async (payment) => {
    if (!canTakeAction) return;
    
    setActionLoading(true);
    try {
      const result = await paymentService.retryPayment(payment.id);
      if (result) {
        fetchFailedPayments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retry payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (payment) => {
    if (!canTakeAction) return;
    
    if (!window.confirm('Are you sure you want to cancel this payment?')) {
      return;
    }

    setActionLoading(true);
    try {
      const result = await paymentService.cancelPayment(payment.id);
      if (result) {
        fetchFailedPayments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel payment');
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenRepair = (payment) => {
    if (!canTakeAction) return;
    setSelectedPayment(payment);
    setRepairData({});
    setRepairDialogOpen(true);
  };

  const handleCloseRepair = () => {
    setRepairDialogOpen(false);
    setSelectedPayment(null);
    setRepairData({});
  };

  const handleRepairSubmit = async () => {
    if (!selectedPayment) return;

    setActionLoading(true);
    try {
      const result = await paymentService.repairPayment(selectedPayment.id, repairData);
      if (result) {
        handleCloseRepair();
        fetchFailedPayments();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to repair payment');
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      id: 'paymentId',
      label: 'Payment ID',
      minWidth: 150,
    },
    {
      id: 'amount',
      label: 'Amount',
      minWidth: 120,
      format: (value, row) => formatCurrency(value, row.currency),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 120,
      format: (value) => <StatusChip status={value} />,
    },
    {
      id: 'errorMessage',
      label: 'Error',
      minWidth: 250,
      format: (value) => (
        <Typography variant="body2" color="error" noWrap title={value}>
          {value || '-'}
        </Typography>
      ),
    },
    {
      id: 'failedDate',
      label: 'Failed Date',
      minWidth: 180,
      format: (value) => formatDateTime(value),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 180,
      sortable: false,
      format: (value, row) => (
        <Box display="flex" gap={1}>
          <IconButton
            size="small"
            onClick={() => handleRetry(row)}
            disabled={!canTakeAction || actionLoading}
            title="Retry Payment"
            color="primary"
          >
            <RetryIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleOpenRepair(row)}
            disabled={!canTakeAction || actionLoading}
            title="Repair Payment"
            color="info"
          >
            <RepairIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleCancel(row)}
            disabled={!canTakeAction || actionLoading}
            title="Cancel Payment"
            color="error"
          >
            <CancelIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={4}
        sx={{
          pb: 3,
          borderBottom: '2px solid',
          borderColor: 'divider',
        }}
      >
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.75rem', sm: '2rem' },
              color: 'text.primary',
              letterSpacing: '-0.02em',
              mb: 0.5,
            }}
          >
            Exception Handling
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: '0.95rem',
            }}
          >
            Manage failed and problematic payments
          </Typography>
        </Box>
        <IconButton 
          onClick={fetchFailedPayments} 
          sx={{
            bgcolor: 'background.paper',
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            '&:hover': {
              bgcolor: 'primary.main',
              color: 'white',
              borderColor: 'primary.main',
              boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)',
            },
          }}
        >
          <RefreshIcon />
        </IconButton>
      </Box>

      {!canTakeAction && (
        <Box mb={3}>
          <Chip
            label="You have read-only access to this page"
            color="warning"
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              py: 2.5,
              px: 1,
            }}
          />
        </Box>
      )}

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      {loading && !payments.length ? (
        <LoadingSpinner message="Loading failed payments..." />
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          loading={loading}
          emptyMessage="No failed payments found"
        />
      )}

      {/* Repair Dialog */}
      <Dialog open={repairDialogOpen} onClose={handleCloseRepair} maxWidth="sm" fullWidth>
        <DialogTitle>Repair Payment</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" paragraph>
            Payment ID: {selectedPayment?.paymentId}
          </Typography>
          <TextField
            fullWidth
            label="Correction Notes"
            name="notes"
            multiline
            rows={4}
            value={repairData.notes || ''}
            onChange={(e) => setRepairData({ ...repairData, notes: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Corrected Amount (optional)"
            name="amount"
            type="number"
            value={repairData.amount || ''}
            onChange={(e) => setRepairData({ ...repairData, amount: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRepair} disabled={actionLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleRepairSubmit} 
            variant="contained" 
            disabled={actionLoading || !repairData.notes}
          >
            {actionLoading ? 'Repairing...' : 'Repair'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ExceptionPage;
