import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Button,
  Divider,
  List,
  Alert,
  Paper,
} from '@mui/material';
import {
  Assignment,
  Refresh,
  CheckCircle,
} from '@mui/icons-material';

const generateOpsUsers = () => [
  {
    id: 'OPS-001',
    name: 'Sarah Johnson',
    avatar: 'SJ',
    status: 'online',
    currentLoad: 12,
    maxCapacity: 15,
    workloadPercentage: 80,
    activePayments: [
      { id: 'PAY-12345', priority: 'high', type: 'High-value approval' },
      { id: 'PAY-12346', priority: 'medium', type: 'Retry investigation' },
      { id: 'PAY-12347', priority: 'high', type: 'SLA breach resolution' },
    ],
    skillScore: 95,
    avgResolutionTime: '8 min',
    successRate: 98.5,
  },
  {
    id: 'OPS-002',
    name: 'Michael Chen',
    avatar: 'MC',
    status: 'online',
    currentLoad: 15,
    maxCapacity: 15,
    workloadPercentage: 100,
    activePayments: [
      { id: 'PAY-12348', priority: 'high', type: 'Fraud investigation' },
      { id: 'PAY-12349', priority: 'high', type: 'High-value approval' },
      { id: 'PAY-12350', priority: 'medium', type: 'Network timeout' },
    ],
    skillScore: 92,
    avgResolutionTime: '10 min',
    successRate: 97.2,
  },
  {
    id: 'OPS-003',
    name: 'Emily Rodriguez',
    avatar: 'ER',
    status: 'online',
    currentLoad: 6,
    maxCapacity: 15,
    workloadPercentage: 40,
    activePayments: [
      { id: 'PAY-12351', priority: 'low', type: 'Routine check' },
      { id: 'PAY-12352', priority: 'medium', type: 'Validation error' },
    ],
    skillScore: 88,
    avgResolutionTime: '12 min',
    successRate: 96.8,
  },
  {
    id: 'OPS-004',
    name: 'David Kim',
    avatar: 'DK',
    status: 'break',
    currentLoad: 0,
    maxCapacity: 15,
    workloadPercentage: 0,
    activePayments: [],
    skillScore: 90,
    avgResolutionTime: '9 min',
    successRate: 98.1,
  },
  {
    id: 'OPS-005',
    name: 'Lisa Patel',
    avatar: 'LP',
    status: 'online',
    currentLoad: 9,
    maxCapacity: 15,
    workloadPercentage: 60,
    activePayments: [
      { id: 'PAY-12353', priority: 'medium', type: 'Account verification' },
      { id: 'PAY-12354', priority: 'low', type: 'Documentation' },
    ],
    skillScore: 94,
    avgResolutionTime: '7 min',
    successRate: 99.1,
  },
];

const generateQueuedPayments = () => [
  {
    id: 'PAY-12355',
    priority: 'high',
    type: 'High-value approval',
    amount: '$250,000',
    waitTime: '15 min',
    suggestedAssignee: 'Emily Rodriguez',
    reason: 'Lowest current workload (40%), High skill score (88)',
  },
  {
    id: 'PAY-12356',
    priority: 'high',
    type: 'SLA breach - urgent',
    amount: '$85,000',
    waitTime: '45 min',
    suggestedAssignee: 'Lisa Patel',
    reason: 'Best success rate (99.1%), Available capacity (60%)',
  },
  {
    id: 'PAY-12357',
    priority: 'medium',
    type: 'Network timeout retry',
    amount: '$12,500',
    waitTime: '8 min',
    suggestedAssignee: 'Emily Rodriguez',
    reason: 'Lowest workload, similar payment expertise',
  },
  {
    id: 'PAY-12358',
    priority: 'high',
    type: 'Fraud investigation',
    amount: '$500,000',
    waitTime: '2 min',
    suggestedAssignee: 'Sarah Johnson',
    reason: 'Highest skill score (95), fraud specialist',
  },
];

const OpsLoadBalancerPage = () => {
  const [opsUsers, setOpsUsers] = useState(generateOpsUsers());
  const [queuedPayments, setQueuedPayments] = useState(generateQueuedPayments());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Simulate real-time updates
        setOpsUsers(prev => prev.map(user => ({
          ...user,
          currentLoad: user.status === 'online' ? Math.max(0, user.currentLoad + (Math.random() > 0.5 ? 1 : -1)) : 0,
          workloadPercentage: user.status === 'online' ? Math.min(100, Math.max(0, (user.currentLoad / user.maxCapacity) * 100)) : 0,
        })));
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const handleAssignPayment = (paymentId, assigneeName) => {
    setQueuedPayments(prev => prev.filter(p => p.id !== paymentId));
    setOpsUsers(prev => prev.map(user => 
      user.name === assigneeName 
        ? { ...user, currentLoad: user.currentLoad + 1, workloadPercentage: ((user.currentLoad + 1) / user.maxCapacity) * 100 }
        : user
    ));
  };

  const totalCapacity = opsUsers.reduce((sum, user) => sum + user.maxCapacity, 0);
  const totalLoad = opsUsers.reduce((sum, user) => sum + user.currentLoad, 0);
  const utilizationRate = (totalLoad / totalCapacity) * 100;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Live Ops Load Balancer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Real-time workload distribution with AI-powered assignment suggestions
          </Typography>
        </Box>
        <Button
          variant={autoRefresh ? 'contained' : 'outlined'}
          startIcon={<Refresh />}
          onClick={() => setAutoRefresh(!autoRefresh)}
        >
          {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
        </Button>
      </Box>

      {/* Overall Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {opsUsers.filter(u => u.status === 'online').length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Operators
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {queuedPayments.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Queued Payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {totalLoad}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Assignments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography 
                variant="h4" 
                fontWeight="bold" 
                color={utilizationRate > 80 ? 'error.main' : utilizationRate > 60 ? 'warning.main' : 'success.main'}
              >
                {utilizationRate.toFixed(0)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Team Utilization
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Utilization Alert */}
      {utilizationRate > 80 && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            ⚠️ High Team Utilization Detected
          </Typography>
          <Typography variant="body2">
            Team is operating at {utilizationRate.toFixed(0)}% capacity. Consider bringing additional operators online or deferring low-priority tasks.
          </Typography>
        </Alert>
      )}

      {/* Ops Users Grid */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Operator Workload
      </Typography>
      <Grid container spacing={3}>
        {opsUsers.map((user) => (
          <Grid item xs={12} md={6} key={user.id}>
            <Card 
              sx={{ 
                border: user.status === 'online' ? '2px solid' : '1px solid',
                borderColor: user.status === 'online' 
                  ? (user.workloadPercentage > 80 ? 'error.main' : user.workloadPercentage > 60 ? 'warning.main' : 'success.main')
                  : 'grey.300'
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
                    {user.avatar}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{user.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={user.status.toUpperCase()}
                        size="small"
                        color={user.status === 'online' ? 'success' : 'default'}
                      />
                      <Chip 
                        label={`Skill: ${user.skillScore}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" fontWeight="bold">
                      {user.currentLoad}/{user.maxCapacity}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.workloadPercentage.toFixed(0)}% load
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">Workload</Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {user.workloadPercentage.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={user.workloadPercentage}
                    color={
                      user.workloadPercentage > 80 ? 'error' : 
                      user.workloadPercentage > 60 ? 'warning' : 
                      'success'
                    }
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Avg Time</Typography>
                    <Typography variant="body2" fontWeight={600}>{user.avgResolutionTime}</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Success Rate</Typography>
                    <Typography variant="body2" fontWeight={600}>{user.successRate}%</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="caption" color="text.secondary">Active</Typography>
                    <Typography variant="body2" fontWeight={600}>{user.activePayments.length}</Typography>
                  </Grid>
                </Grid>

                {user.activePayments.length > 0 && (
                  <>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" color="text.secondary" gutterBottom>
                      Current Assignments
                    </Typography>
                    {user.activePayments.slice(0, 3).map((payment) => (
                      <Box key={payment.id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Chip 
                          label={payment.id}
                          size="small"
                          variant="outlined"
                        />
                        <Chip 
                          label={payment.priority}
                          size="small"
                          color={payment.priority === 'high' ? 'error' : payment.priority === 'medium' ? 'warning' : 'default'}
                        />
                        <Typography variant="caption" noWrap>
                          {payment.type}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Queued Payments with AI Suggestions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            🎯 AI-Powered Assignment Queue
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            System automatically suggests optimal operator based on workload, skill, and payment type
          </Typography>
          <Divider sx={{ my: 2 }} />

          {queuedPayments.length === 0 ? (
            <Alert severity="success" icon={<CheckCircle />}>
              <Typography variant="body2">
                ✅ All payments have been assigned. Queue is empty!
              </Typography>
            </Alert>
          ) : (
            <List>
              {queuedPayments.map((payment) => (
                <Paper key={payment.id} sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Box>
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Chip 
                            label={payment.id}
                            size="small"
                            color="primary"
                          />
                          <Chip 
                            label={payment.priority.toUpperCase()}
                            size="small"
                            color={payment.priority === 'high' ? 'error' : 'warning'}
                          />
                        </Box>
                        <Typography variant="body2" fontWeight={600}>
                          {payment.type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Amount: {payment.amount} • Wait: {payment.waitTime}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={5}>
                      <Alert 
                        severity="info" 
                        icon={<Assignment />}
                        sx={{ py: 0 }}
                      >
                        <Typography variant="caption" fontWeight={600}>
                          Suggested: {payment.suggestedAssignee}
                        </Typography>
                        <Typography variant="caption" display="block">
                          {payment.reason}
                        </Typography>
                      </Alert>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        onClick={() => handleAssignPayment(payment.id, payment.suggestedAssignee)}
                      >
                        Auto-Assign
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          🤖 Load Balancer Insights
        </Typography>
        <Typography variant="body2">
          • Michael Chen is at 100% capacity - consider redistributing his workload
        </Typography>
        <Typography variant="body2">
          • Emily Rodriguez has the most available capacity (40%) - ideal for new high-priority assignments
        </Typography>
        <Typography variant="body2">
          • Team performance is {utilizationRate > 80 ? 'high' : 'optimal'} - {utilizationRate.toFixed(0)}% utilization rate
        </Typography>
      </Alert>
    </Container>
  );
};

export default OpsLoadBalancerPage;
