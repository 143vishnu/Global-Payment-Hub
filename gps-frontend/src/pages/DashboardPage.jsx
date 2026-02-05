import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Payment as PaymentIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Public as GlobalIcon,
} from '@mui/icons-material';
import { usePayment } from '../context/PaymentContext';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RegionalDistribution from '../components/dashboard/RegionalDistribution';
import PaymentStatusChart from '../components/dashboard/PaymentStatusChart';
import PaymentTrend from '../components/dashboard/PaymentTrend';
import { formatCurrency, formatNumber } from '../utils/helpers';

const DashboardPage = () => {
  const { summary, loading, error, fetchSummary } = usePayment();
  const [autoRefresh] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchSummary();
    }, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, fetchSummary]);

  const handleRefresh = () => {
    fetchSummary();
  };

  if (loading && !summary) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  // Mock data for charts (in production, this would come from the API)
  const statusData = [
    { name: 'Success', value: summary?.successCount || 0 },
    { name: 'Failed', value: summary?.failedCount || 0 },
    { name: 'Pending', value: summary?.pendingCount || 0 },
  ];

  const regionalData = summary?.regionalDistribution || [
    { region: 'NA', count: 150, amount: 45000 },
    { region: 'EU', count: 120, amount: 38000 },
    { region: 'APAC', count: 100, amount: 32000 },
    { region: 'LATAM', count: 80, amount: 25000 },
  ];

  const trendData = summary?.trend || [
    { date: '01/25', count: 120, amount: 36000 },
    { date: '01/26', count: 135, amount: 40500 },
    { date: '01/27', count: 125, amount: 37500 },
    { date: '01/28', count: 145, amount: 43500 },
    { date: '01/29', count: 155, amount: 46500 },
    { date: '01/30', count: 160, amount: 48000 },
    { date: '01/31', count: 150, amount: 45000 },
  ];

  return (
    <Box sx={{ 
      bgcolor: '#f8f9fa', 
      minHeight: '100vh', 
      pt: 4, 
      pb: 6 
    }}>
      <Container maxWidth="xl">
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={5}
          sx={{
            px: { xs: 2, sm: 3 },
          }}
        >
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.75rem', sm: '2rem', md: '2.25rem' },
                color: '#1a1a1a',
                letterSpacing: '-0.02em',
                mb: 0.5,
              }}
            >
              Payment Dashboard
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontSize: '0.95rem',
              }}
            >
              Real-time payment monitoring and analytics
            </Typography>
          </Box>
          <Tooltip title="Refresh data" placement="left">
            <IconButton 
              onClick={handleRefresh} 
              sx={{
                bgcolor: 'white',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                '&:hover': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  borderColor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {error && (
          <Box sx={{ px: { xs: 2, sm: 3 }, mb: 4 }}>
            <ErrorMessage error={error} />
          </Box>
        )}

        <Grid container spacing={3} sx={{ px: { xs: 2, sm: 3 } }}>
          {/* Stat Cards */}
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Payments"
              value={formatNumber(summary?.totalPayments || 0)}
              icon={<PaymentIcon sx={{ fontSize: 40 }} />}
              color="primary"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Successful"
              value={formatNumber(summary?.successCount || 0)}
              icon={<SuccessIcon sx={{ fontSize: 40 }} />}
              color="success"
              subtitle={`${((summary?.successCount / summary?.totalPayments) * 100 || 0).toFixed(1)}% success rate`}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Failed"
              value={formatNumber(summary?.failedCount || 0)}
              icon={<ErrorIcon sx={{ fontSize: 40 }} />}
              color="error"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatCard
              title="Total Amount"
              value={formatCurrency(summary?.totalAmount || 0)}
              icon={<GlobalIcon sx={{ fontSize: 40 }} />}
              color="info"
            />
          </Grid>

          {/* Charts Section */}
          <Grid item xs={12}>
            <Box sx={{ height: 24 }} />
          </Grid>

          <Grid item xs={12} lg={6}>
            <PaymentStatusChart data={statusData} />
          </Grid>
          <Grid item xs={12} lg={6}>
            <RegionalDistribution data={regionalData} />
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ height: 8 }} />
          </Grid>
          
          <Grid item xs={12}>
            <PaymentTrend data={trendData} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default DashboardPage;
