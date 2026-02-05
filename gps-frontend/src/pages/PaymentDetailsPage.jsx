import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Tabs,
  Tab,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { usePayment } from '../context/PaymentContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatusChip from '../components/common/StatusChip';
import { formatCurrency, formatDateTime } from '../utils/helpers';
import paymentService from '../services/paymentService';

const PaymentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedPayment, loading, error, getPaymentDetails } = usePayment();
  const [currentTab, setCurrentTab] = useState(0);
  const [history, setHistory] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);

  const fetchPaymentData = useCallback(async () => {
    try {
      await getPaymentDetails(id);
      const [historyData, auditData] = await Promise.all([
        paymentService.getPaymentHistory(id),
        paymentService.getAuditTrail(id),
      ]);
      setHistory(historyData);
      setAuditTrail(auditData);
    } catch (err) {
      console.error('Failed to fetch payment data:', err);
    }
  }, [id, getPaymentDetails]);

  useEffect(() => {
    if (id) {
      fetchPaymentData();
    }
  }, [id, fetchPaymentData]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading && !selectedPayment) {
    return <LoadingSpinner message="Loading payment details..." />;
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <ErrorMessage error={error} />
        <Button
          variant="outlined"
          startIcon={<BackIcon />}
          onClick={() => navigate('/payments')}
        >
          Back to Search
        </Button>
      </Container>
    );
  }

  if (!selectedPayment) {
    return null;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton onClick={() => navigate('/payments')}>
            <BackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Payment Details
          </Typography>
        </Box>
        <IconButton onClick={fetchPaymentData} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>

      <Grid container spacing={3}>
        {/* Main Payment Info */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Payment Information</Typography>
                <StatusChip status={selectedPayment.status} />
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Payment ID
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedPayment.paymentId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Payment Type
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.paymentType}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Region
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayment.region?.replace('_', ' ')}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(selectedPayment.createdDate)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="caption" color="text.secondary">
                    Last Updated
                  </Typography>
                  <Typography variant="body1">
                    {formatDateTime(selectedPayment.updatedDate)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabs for additional details */}
        <Grid item xs={12}>
          <Card>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab label="Lifecycle History" />
              <Tab label="Validation Errors" />
              <Tab label="Audit Trail" />
            </Tabs>
            <CardContent>
              {currentTab === 0 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Lifecycle Status History
                  </Typography>
                  {history.length === 0 ? (
                    <Typography color="text.secondary">No history available</Typography>
                  ) : (
                    history.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.status} - {formatDateTime(item.timestamp)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.message}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
              {currentTab === 1 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Validation Errors
                  </Typography>
                  {!selectedPayment.validationErrors || selectedPayment.validationErrors.length === 0 ? (
                    <Typography color="text.secondary">No validation errors</Typography>
                  ) : (
                    selectedPayment.validationErrors.map((error, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body2" color="error">
                          {error.field}: {error.message}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
              {currentTab === 2 && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Audit Trail
                  </Typography>
                  {auditTrail.length === 0 ? (
                    <Typography color="text.secondary">No audit trail available</Typography>
                  ) : (
                    auditTrail.map((item, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {item.action} by {item.user} - {formatDateTime(item.timestamp)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.details}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentDetailsPage;
