import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Refresh,
  Schedule,
  Build,
  CheckCircle,
  Sync,
  TrendingUp,
} from '@mui/icons-material';

// Mock failed payments with AI recommendations
const generateFailedPayments = () => [
  {
    id: 'PAY-12345',
    amount: 5000.00,
    currency: 'USD',
    status: 'FAILED',
    errorCode: 'INSUFFICIENT_FUNDS',
    failureCount: 1,
    lastAttempt: new Date(Date.now() - 5 * 60000),
    recommendation: {
      action: 'WAIT',
      confidence: 92,
      reason: 'Downstream system (Bank XYZ) typically resolves funding issues within 30 minutes',
      suggestedWaitTime: '25 minutes',
      historicalSuccessRate: 87,
      icon: <Schedule />,
      color: 'warning',
    },
  },
  {
    id: 'PAY-12346',
    amount: 25000.00,
    currency: 'EUR',
    status: 'FAILED',
    errorCode: 'TIMEOUT',
    failureCount: 3,
    lastAttempt: new Date(Date.now() - 15 * 60000),
    recommendation: {
      action: 'RETRY_NOW',
      confidence: 95,
      reason: 'Network timeout detected. System shows green status. High probability of success',
      suggestedWaitTime: null,
      historicalSuccessRate: 94,
      icon: <Refresh />,
      color: 'success',
    },
  },
  {
    id: 'PAY-12347',
    amount: 100000.00,
    currency: 'GBP',
    status: 'FAILED',
    errorCode: 'INVALID_ROUTING',
    failureCount: 5,
    lastAttempt: new Date(Date.now() - 30 * 60000),
    recommendation: {
      action: 'MANUAL_REPAIR',
      confidence: 98,
      reason: 'Routing configuration mismatch. Requires manual verification of beneficiary bank details',
      suggestedWaitTime: null,
      historicalSuccessRate: 12,
      icon: <Build />,
      color: 'error',
    },
  },
  {
    id: 'PAY-12348',
    amount: 7500.00,
    currency: 'USD',
    status: 'FAILED',
    errorCode: 'DUPLICATE_CHECK',
    failureCount: 2,
    lastAttempt: new Date(Date.now() - 10 * 60000),
    recommendation: {
      action: 'RETRY_NOW',
      confidence: 89,
      reason: 'Duplicate reference resolved. Safe to retry',
      suggestedWaitTime: null,
      historicalSuccessRate: 91,
      icon: <Refresh />,
      color: 'success',
    },
  },
  {
    id: 'PAY-12349',
    amount: 15000.00,
    currency: 'JPY',
    status: 'FAILED',
    errorCode: 'SYSTEM_UNAVAILABLE',
    failureCount: 1,
    lastAttempt: new Date(Date.now() - 3 * 60000),
    recommendation: {
      action: 'WAIT',
      confidence: 85,
      reason: 'Clearing system maintenance detected. Expected completion in 15 minutes',
      suggestedWaitTime: '12 minutes',
      historicalSuccessRate: 95,
      icon: <Schedule />,
      color: 'warning',
    },
  },
];

const SmartRetryPage = () => {
  const [payments, setPayments] = useState(generateFailedPayments());
  const [processing, setProcessing] = useState(null);

  const handleRetry = async (paymentId, action) => {
    setProcessing(paymentId);
    
    // Simulate retry process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Remove from list (simulating success)
    setPayments(prev => prev.filter(p => p.id !== paymentId));
    setProcessing(null);
  };

  const getActionButton = (payment) => {
    const { action } = payment.recommendation;
    
    switch (action) {
      case 'RETRY_NOW':
        return (
          <Button
            variant="contained"
            color="success"
            startIcon={<Refresh />}
            onClick={() => handleRetry(payment.id, action)}
            disabled={processing === payment.id}
          >
            Retry Now
          </Button>
        );
      case 'WAIT':
        return (
          <Button
            variant="outlined"
            color="warning"
            startIcon={<Schedule />}
            disabled
          >
            Wait {payment.recommendation.suggestedWaitTime}
          </Button>
        );
      case 'MANUAL_REPAIR':
        return (
          <Button
            variant="contained"
            color="error"
            startIcon={<Build />}
            onClick={() => alert(`Opening manual repair for ${payment.id}`)}
          >
            Manual Fix
          </Button>
        );
      default:
        return null;
    }
  };

  const stats = {
    retryNow: payments.filter(p => p.recommendation.action === 'RETRY_NOW').length,
    waitRequired: payments.filter(p => p.recommendation.action === 'WAIT').length,
    manualFix: payments.filter(p => p.recommendation.action === 'MANUAL_REPAIR').length,
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Sync sx={{ fontSize: 32 }} />
          Smart Retry Recommendations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered retry suggestions based on historical failure patterns
        </Typography>
      </Box>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.dark', width: 56, height: 56 }}>
                  <Refresh sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.retryNow}</Typography>
                  <Typography variant="body2">Ready to Retry</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'warning.light', color: 'warning.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.dark', width: 56, height: 56 }}>
                  <Schedule sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.waitRequired}</Typography>
                  <Typography variant="body2">Wait Required</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.dark', width: 56, height: 56 }}>
                  <Build sx={{ fontSize: 32 }} />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">{stats.manualFix}</Typography>
                  <Typography variant="body2">Manual Fix Needed</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* AI Insights */}
      <Alert severity="info" icon={<TrendingUp />} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600}>
          AI Analysis: Blind retry reduction of 68% achieved this week
        </Typography>
        <Typography variant="body2">
          Smart recommendations have reduced unnecessary retry attempts and improved first-time fix rate
        </Typography>
      </Alert>

      {/* Failed Payments List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Failed Payments ({payments.length})
          </Typography>
          
          <List>
            {payments.map((payment, index) => (
              <React.Fragment key={payment.id}>
                {index > 0 && <Divider />}
                <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: `${payment.recommendation.color}.light` }}>
                      {payment.recommendation.icon}
                    </Avatar>
                  </ListItemAvatar>
                  
                  <ListItemText
                    primary={
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="h6" component="span">
                          {payment.id}
                        </Typography>
                        <Chip 
                          label={payment.errorCode}
                          size="small"
                          color="error"
                          sx={{ ml: 2 }}
                        />
                        <Chip 
                          label={`${payment.failureCount}x failed`}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {payment.currency} {payment.amount.toLocaleString()} • Last attempt: {new Date(payment.lastAttempt).toLocaleTimeString()}
                        </Typography>
                        
                        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 2 }}>
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            🤖 AI Recommendation: {payment.recommendation.action.replace(/_/g, ' ')}
                            <Chip 
                              label={`${payment.recommendation.confidence}% confidence`}
                              size="small"
                              color="primary"
                              sx={{ ml: 1, fontSize: '0.7rem' }}
                            />
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {payment.recommendation.reason}
                          </Typography>
                          
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Historical success rate for this scenario:
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={payment.recommendation.historicalSuccessRate}
                                sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                              />
                              <Typography variant="caption" fontWeight={600}>
                                {payment.recommendation.historicalSuccessRate}%
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        {getActionButton(payment)}
                        
                        {processing === payment.id && (
                          <Box sx={{ mt: 2 }}>
                            <LinearProgress />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                              Processing retry...
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
          
          {payments.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <CheckCircle sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No Failed Payments
              </Typography>
              <Typography variant="body2" color="text.secondary">
                All payments are processing successfully
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default SmartRetryPage;
