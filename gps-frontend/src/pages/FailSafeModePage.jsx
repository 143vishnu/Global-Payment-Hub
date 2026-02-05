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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
} from '@mui/material';
import {
  Lock,
  LockOpen,
  Warning,
  CheckCircle,
  Shield,
  Block,
  Close,
} from '@mui/icons-material';

const generateFailSafeStatus = () => {
  return {
    enabled: false,
    lastActivated: '2024-01-28 15:42:18',
    activationCount: 3,
    currentMode: 'Normal',
    safestRoute: {
      gateway: 'Primary SWIFT',
      successRate: 99.2,
      avgLatency: 1.8,
      regions: ['US', 'Europe', 'APAC'],
    },
    blockedOperations: [],
  };
};

const generateBlockedOperations = () => {
  return [
    {
      id: 1,
      timestamp: '2024-02-03 14:23:15',
      operation: 'Config Change',
      description: 'Attempted to modify EUR→GBP routing rules',
      user: 'admin@gps.com',
      reason: 'Fail-safe mode active - high-risk configuration changes blocked',
      riskLevel: 'High',
    },
    {
      id: 2,
      timestamp: '2024-02-03 14:18:42',
      operation: 'Rule Deployment',
      description: 'Attempted to deploy new validation rule',
      user: 'ops@gps.com',
      reason: 'Fail-safe mode active - only emergency operations allowed',
      riskLevel: 'Medium',
    },
  ];
};

const activationHistory = [
  {
    id: 1,
    timestamp: '2024-01-28 15:42:18',
    trigger: 'Manual Activation',
    triggeredBy: 'admin@gps.com',
    reason: 'High failure rate detected in APAC region',
    duration: '2h 35m',
    operationsBlocked: 5,
    status: 'Completed',
  },
  {
    id: 2,
    timestamp: '2024-01-15 22:15:30',
    trigger: 'Auto Activation',
    triggeredBy: 'System',
    reason: 'Circuit breaker tripped - gateway timeout spike',
    duration: '1h 12m',
    operationsBlocked: 3,
    status: 'Completed',
  },
  {
    id: 3,
    timestamp: '2023-12-28 03:45:12',
    trigger: 'Manual Activation',
    triggeredBy: 'ops@gps.com',
    reason: 'Emergency rollback during incident',
    duration: '45m',
    operationsBlocked: 8,
    status: 'Completed',
  },
];

const FailSafeModePage = () => {
  const [failSafeStatus, setFailSafeStatus] = useState(generateFailSafeStatus());
  const [blockedOps] = useState(generateBlockedOperations());
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [deactivateDialog, setDeactivateDialog] = useState(false);

  const handleActivate = () => {
    setConfirmDialog(true);
  };

  const confirmActivation = () => {
    setFailSafeStatus({
      ...failSafeStatus,
      enabled: true,
      currentMode: 'Fail-Safe',
    });
    setConfirmDialog(false);
  };

  const handleDeactivate = () => {
    setDeactivateDialog(true);
  };

  const confirmDeactivation = () => {
    setFailSafeStatus({
      ...failSafeStatus,
      enabled: false,
      currentMode: 'Normal',
    });
    setDeactivateDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Fail-Safe Mode
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Emergency routing with automatic risk prevention
        </Typography>
      </Box>

      {/* Status Card */}
      <Card
        sx={{
          mb: 3,
          bgcolor: failSafeStatus.enabled ? 'warning.light' : 'success.light',
          color: failSafeStatus.enabled ? 'warning.contrastText' : 'success.contrastText',
        }}
      >
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              {failSafeStatus.enabled ? (
                <Lock sx={{ fontSize: 60 }} />
              ) : (
                <LockOpen sx={{ fontSize: 60 }} />
              )}
            </Grid>
            <Grid item xs>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Fail-Safe Mode: {failSafeStatus.currentMode}
              </Typography>
              <Typography variant="body1">
                {failSafeStatus.enabled
                  ? 'All risky configuration changes are blocked. Using safest routing only.'
                  : 'Normal operations - all configuration changes allowed'}
              </Typography>
            </Grid>
            <Grid item>
              {failSafeStatus.enabled ? (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<LockOpen />}
                  onClick={handleDeactivate}
                  sx={{ bgcolor: 'warning.dark' }}
                >
                  Deactivate
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  color="error"
                  startIcon={<Lock />}
                  onClick={handleActivate}
                >
                  Activate Fail-Safe
                </Button>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Active Blocked Operations Alert */}
      {failSafeStatus.enabled && blockedOps.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<Block />}>
          <Typography variant="body2" fontWeight={600}>
            {blockedOps.length} operation(s) blocked by fail-safe mode
          </Typography>
          <Typography variant="caption">
            High-risk changes are prevented until fail-safe mode is deactivated
          </Typography>
        </Alert>
      )}

      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Activations
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {failSafeStatus.activationCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Last Activated
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                15 days ago
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Avg Duration
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                1.5h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Operations Blocked
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {blockedOps.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Safest Route Configuration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Safest Route Configuration
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Alert severity="success" sx={{ mb: 3 }} icon={<Shield />}>
            <Typography variant="body2" fontWeight={600}>
              This is the safest routing configuration based on historical performance
            </Typography>
            <Typography variant="caption">
              Automatically activated when fail-safe mode is enabled
            </Typography>
          </Alert>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Primary Gateway
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {failSafeStatus.safestRoute.gateway}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Success Rate
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {failSafeStatus.safestRoute.successRate}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'grey.50' }}>
                <CardContent>
                  <Typography variant="caption" color="text.secondary">
                    Avg Latency
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {failSafeStatus.safestRoute.avgLatency}s
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Covered Regions
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {failSafeStatus.safestRoute.regions.map((region, index) => (
                  <Chip key={index} label={region} color="success" />
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Blocked Operations */}
      {blockedOps.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Blocked Operations
            </Typography>
            <Divider sx={{ my: 2 }} />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Operation</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>User</TableCell>
                    <TableCell>Risk Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {blockedOps.map((op) => (
                    <TableRow key={op.id} sx={{ bgcolor: 'warning.lighter' }}>
                      <TableCell>
                        <Typography variant="body2">{op.timestamp}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {op.operation}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{op.description}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {op.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{op.user}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={op.riskLevel}
                          color={op.riskLevel === 'High' ? 'error' : 'warning'}
                          size="small"
                          icon={<Warning />}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {/* Activation History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Activation History
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Trigger</TableCell>
                  <TableCell>Triggered By</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Operations Blocked</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activationHistory.map((activation) => (
                  <TableRow key={activation.id}>
                    <TableCell>
                      <Typography variant="body2">{activation.timestamp}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={activation.trigger}
                        size="small"
                        color={activation.trigger === 'Auto Activation' ? 'warning' : 'default'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{activation.triggeredBy}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{activation.reason}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{activation.duration}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {activation.operationsBlocked}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={activation.status} color="success" size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Activation Confirmation Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Warning color="error" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Activate Fail-Safe Mode</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              This will immediately activate emergency routing
            </Typography>
            <Typography variant="caption">
              All high-risk configuration changes will be blocked until deactivated
            </Typography>
          </Alert>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              What will happen:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" gutterBottom>
                ✓ Switch to safest routing configuration
              </Typography>
              <Typography variant="body2" gutterBottom>
                ✓ Block all risky configuration changes
              </Typography>
              <Typography variant="body2" gutterBottom>
                ✓ Enable enhanced monitoring
              </Typography>
              <Typography variant="body2" gutterBottom>
                ✓ Only allow emergency operations
              </Typography>
            </Box>
          </Box>

          <Card sx={{ bgcolor: 'success.lighter' }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Safest Route will be activated:
              </Typography>
              <Typography variant="body2">
                Gateway: {failSafeStatus.safestRoute.gateway}
              </Typography>
              <Typography variant="body2">
                Success Rate: {failSafeStatus.safestRoute.successRate}%
              </Typography>
            </CardContent>
          </Card>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setConfirmDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<Lock />}
            onClick={confirmActivation}
          >
            Activate Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={deactivateDialog} onClose={() => setDeactivateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle color="success" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Deactivate Fail-Safe Mode</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              This will return to normal operations
            </Typography>
            <Typography variant="caption">
              All configuration changes will be allowed again
            </Typography>
          </Alert>

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              What will happen:
            </Typography>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" gutterBottom>
                ✓ Return to normal routing configuration
              </Typography>
              <Typography variant="body2" gutterBottom>
                ✓ Unblock configuration changes
              </Typography>
              <Typography variant="body2" gutterBottom>
                ✓ Resume standard monitoring
              </Typography>
            </Box>
          </Box>

          {blockedOps.length > 0 && (
            <Alert severity="warning">
              <Typography variant="body2">
                {blockedOps.length} blocked operation(s) will need to be manually retried
              </Typography>
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeactivateDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={<LockOpen />}
            onClick={confirmDeactivation}
          >
            Deactivate Now
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default FailSafeModePage;
