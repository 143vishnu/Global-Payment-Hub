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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
  Tab,
  Tabs,
} from '@mui/material';
import {
  Science,
  Visibility,
  Compare,
  PlayArrow,
  Close,
} from '@mui/icons-material';

const generateShadowRuns = () => {
  return [
    {
      id: 1,
      ruleName: 'EUR→GBP SEPA Priority',
      ruleType: 'Routing',
      status: 'Running',
      progress: 65,
      duration: '2h 15m',
      paymentsProcessed: 12450,
      totalPayments: 19000,
      comparison: {
        successRateDiff: -2.3,
        latencyDiff: 0.4,
        costDiff: -180,
      },
      insights: [
        { type: 'warning', message: 'Success rate decreased by 2.3%' },
        { type: 'info', message: 'Latency increased by 0.4s on average' },
        { type: 'success', message: 'Cost reduced by $180' },
      ],
    },
    {
      id: 2,
      ruleName: 'APAC Timeout Extension',
      ruleType: 'Timeout',
      status: 'Completed',
      progress: 100,
      duration: '4h 30m',
      paymentsProcessed: 8500,
      totalPayments: 8500,
      comparison: {
        successRateDiff: 5.8,
        latencyDiff: 1.2,
        costDiff: 0,
      },
      insights: [
        { type: 'success', message: 'Success rate improved by 5.8%' },
        { type: 'warning', message: 'Latency increased by 1.2s' },
        { type: 'info', message: 'No cost impact' },
      ],
    },
    {
      id: 3,
      ruleName: 'US Limit Increase Test',
      ruleType: 'Validation',
      status: 'Scheduled',
      progress: 0,
      duration: '0h 0m',
      paymentsProcessed: 0,
      totalPayments: 15000,
      comparison: null,
      insights: [],
    },
  ];
};

const generateComparisonMetrics = (shadowRun) => {
  return {
    current: {
      successRate: 94.2,
      avgLatency: 2.8,
      totalCost: 4500,
      failureRate: 5.8,
    },
    shadow: {
      successRate: 94.2 + (shadowRun.comparison?.successRateDiff || 0),
      avgLatency: 2.8 + (shadowRun.comparison?.latencyDiff || 0),
      totalCost: 4500 + (shadowRun.comparison?.costDiff || 0),
      failureRate: 5.8 - (shadowRun.comparison?.successRateDiff || 0),
    },
  };
};

const ShadowModePage = () => {
  const [shadowRuns, setShadowRuns] = useState(generateShadowRuns());
  const [selectedRun, setSelectedRun] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const [newRun, setNewRun] = useState({
    ruleName: '',
    ruleType: '',
    ruleConfig: '',
    duration: '',
  });

  const handleViewDetails = (run) => {
    setSelectedRun(run);
    setDetailsDialog(true);
  };

  const handleCreateRun = () => {
    const run = {
      ...newRun,
      id: shadowRuns.length + 1,
      status: 'Scheduled',
      progress: 0,
      paymentsProcessed: 0,
      totalPayments: Math.floor(Math.random() * 20000) + 5000,
      comparison: null,
      insights: [],
    };
    setShadowRuns([...shadowRuns, run]);
    setCreateDialog(false);
    setNewRun({ ruleName: '', ruleType: '', ruleConfig: '', duration: '' });
  };

  const getStatusColor = (status) => {
    if (status === 'Running') return 'info';
    if (status === 'Completed') return 'success';
    if (status === 'Scheduled') return 'default';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Shadow Mode for New Rules
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Test rules silently without production impact
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Science />}
          onClick={() => setCreateDialog(true)}
        >
          New Shadow Run
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Active Shadow Runs
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {shadowRuns.filter(r => r.status === 'Running').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Completed (30d)
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {shadowRuns.filter(r => r.status === 'Completed').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Scheduled
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {shadowRuns.filter(r => r.status === 'Scheduled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Avg Success Rate Δ
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                +1.8%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Running Shadow Runs Alert */}
      {shadowRuns.filter(r => r.status === 'Running').length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }} icon={<Science />}>
          <Typography variant="body2" fontWeight={600}>
            {shadowRuns.filter(r => r.status === 'Running').length} shadow run(s) currently active
          </Typography>
          <Typography variant="caption">
            Rules are being tested silently against production traffic with no impact
          </Typography>
        </Alert>
      )}

      {/* Shadow Runs Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shadow Runs
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Progress</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Payments</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shadowRuns.map((run) => (
                  <TableRow
                    key={run.id}
                    sx={{
                      bgcolor: run.status === 'Running' ? 'info.lighter' : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {run.ruleName}
                      </Typography>
                      {run.status === 'Running' && (
                        <Chip
                          label="Live"
                          size="small"
                          color="info"
                          sx={{ mt: 0.5 }}
                          icon={<Science />}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={run.ruleType} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={run.status}
                        color={getStatusColor(run.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ width: 150 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption">{run.progress}%</Typography>
                          <Typography variant="caption">
                            {run.paymentsProcessed.toLocaleString()}/{run.totalPayments.toLocaleString()}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={run.progress}
                          color={run.status === 'Running' ? 'info' : 'success'}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{run.duration}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="bold">
                        {run.paymentsProcessed.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewDetails(run)}
                        disabled={run.status === 'Scheduled'}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        {selectedRun && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Science color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">{selectedRun.ruleName}</Typography>
                  <Chip label={selectedRun.status} color={getStatusColor(selectedRun.status)} size="small" />
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 3 }}>
                <Tab label="Comparison" />
                <Tab label="Insights" />
              </Tabs>

              {/* Comparison Tab */}
              {tabValue === 0 && selectedRun.comparison && (
                <Box>
                  <Alert severity="info" sx={{ mb: 3 }}>
                    <Typography variant="body2">
                      Comparing shadow rule output with current production rule
                    </Typography>
                  </Alert>

                  <Grid container spacing={2}>
                    {(() => {
                      const metrics = generateComparisonMetrics(selectedRun);
                      return (
                        <>
                          {/* Success Rate */}
                          <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: 'grey.50' }}>
                              <CardContent>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                  Success Rate
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Box>
                                    <Typography variant="caption" display="block">Current</Typography>
                                    <Typography variant="h6">{metrics.current.successRate}%</Typography>
                                  </Box>
                                  <Compare />
                                  <Box>
                                    <Typography variant="caption" display="block">Shadow</Typography>
                                    <Typography variant="h6" color={selectedRun.comparison.successRateDiff > 0 ? 'success.main' : 'error.main'}>
                                      {metrics.shadow.successRate}%
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={`${selectedRun.comparison.successRateDiff > 0 ? '+' : ''}${selectedRun.comparison.successRateDiff}%`}
                                  size="small"
                                  color={selectedRun.comparison.successRateDiff > 0 ? 'success' : 'error'}
                                />
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Latency */}
                          <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: 'grey.50' }}>
                              <CardContent>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                  Average Latency
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Box>
                                    <Typography variant="caption" display="block">Current</Typography>
                                    <Typography variant="h6">{metrics.current.avgLatency}s</Typography>
                                  </Box>
                                  <Compare />
                                  <Box>
                                    <Typography variant="caption" display="block">Shadow</Typography>
                                    <Typography variant="h6" color={selectedRun.comparison.latencyDiff < 0 ? 'success.main' : 'warning.main'}>
                                      {metrics.shadow.avgLatency}s
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={`${selectedRun.comparison.latencyDiff > 0 ? '+' : ''}${selectedRun.comparison.latencyDiff}s`}
                                  size="small"
                                  color={selectedRun.comparison.latencyDiff < 0 ? 'success' : 'warning'}
                                />
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Cost */}
                          <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: 'grey.50' }}>
                              <CardContent>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                  Total Cost
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Box>
                                    <Typography variant="caption" display="block">Current</Typography>
                                    <Typography variant="h6">${metrics.current.totalCost}</Typography>
                                  </Box>
                                  <Compare />
                                  <Box>
                                    <Typography variant="caption" display="block">Shadow</Typography>
                                    <Typography variant="h6" color={selectedRun.comparison.costDiff < 0 ? 'success.main' : 'error.main'}>
                                      ${metrics.shadow.totalCost}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={`${selectedRun.comparison.costDiff > 0 ? '+' : ''}$${selectedRun.comparison.costDiff}`}
                                  size="small"
                                  color={selectedRun.comparison.costDiff < 0 ? 'success' : 'error'}
                                />
                              </CardContent>
                            </Card>
                          </Grid>

                          {/* Failure Rate */}
                          <Grid item xs={12} md={6}>
                            <Card sx={{ bgcolor: 'grey.50' }}>
                              <CardContent>
                                <Typography variant="caption" color="text.secondary" gutterBottom>
                                  Failure Rate
                                </Typography>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                  <Box>
                                    <Typography variant="caption" display="block">Current</Typography>
                                    <Typography variant="h6">{metrics.current.failureRate}%</Typography>
                                  </Box>
                                  <Compare />
                                  <Box>
                                    <Typography variant="caption" display="block">Shadow</Typography>
                                    <Typography variant="h6" color={metrics.shadow.failureRate < metrics.current.failureRate ? 'success.main' : 'error.main'}>
                                      {metrics.shadow.failureRate}%
                                    </Typography>
                                  </Box>
                                </Box>
                                <Chip
                                  label={`${selectedRun.comparison.successRateDiff > 0 ? '-' : '+'}${Math.abs(selectedRun.comparison.successRateDiff)}%`}
                                  size="small"
                                  color={selectedRun.comparison.successRateDiff > 0 ? 'success' : 'error'}
                                />
                              </CardContent>
                            </Card>
                          </Grid>
                        </>
                      );
                    })()}
                  </Grid>
                </Box>
              )}

              {/* Insights Tab */}
              {tabValue === 1 && (
                <Box>
                  {selectedRun.insights.length > 0 ? (
                    selectedRun.insights.map((insight, index) => (
                      <Alert key={index} severity={insight.type} sx={{ mb: 2 }}>
                        <Typography variant="body2">{insight.message}</Typography>
                      </Alert>
                    ))
                  ) : (
                    <Alert severity="info">
                      <Typography variant="body2">No insights available yet. Shadow run is still in progress.</Typography>
                    </Alert>
                  )}

                  {selectedRun.status === 'Completed' && (
                    <Card sx={{ mt: 3, bgcolor: 'success.lighter' }}>
                      <CardContent>
                        <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                          Recommendation
                        </Typography>
                        <Typography variant="body2">
                          {selectedRun.comparison.successRateDiff > 0
                            ? '✅ Shadow rule shows improvement. Consider promoting to production.'
                            : '⚠️ Shadow rule shows degradation. Review before production deployment.'}
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              )}
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailsDialog(false)} startIcon={<Close />}>
                Close
              </Button>
              {selectedRun.status === 'Completed' && selectedRun.comparison.successRateDiff > 0 && (
                <Button variant="contained" color="success" startIcon={<PlayArrow />}>
                  Promote to Production
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create Shadow Run Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Science color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">New Shadow Run</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Shadow mode runs your new rule silently against production traffic without affecting actual outcomes
            </Typography>
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Name"
                value={newRun.ruleName}
                onChange={(e) => setNewRun({ ...newRun, ruleName: e.target.value })}
                placeholder="e.g., SEPA Priority Test"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={newRun.ruleType}
                  label="Rule Type"
                  onChange={(e) => setNewRun({ ...newRun, ruleType: e.target.value })}
                >
                  <MenuItem value="Routing">Routing</MenuItem>
                  <MenuItem value="Validation">Validation</MenuItem>
                  <MenuItem value="Timeout">Timeout</MenuItem>
                  <MenuItem value="Retry">Retry Policy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Configuration"
                value={newRun.ruleConfig}
                onChange={(e) => setNewRun({ ...newRun, ruleConfig: e.target.value })}
                placeholder="e.g., Route EUR→GBP via SEPA first"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Duration (hours)"
                type="number"
                value={newRun.duration}
                onChange={(e) => setNewRun({ ...newRun, duration: e.target.value })}
                placeholder="e.g., 4"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleCreateRun}
            disabled={!newRun.ruleName || !newRun.ruleType || !newRun.ruleConfig || !newRun.duration}
          >
            Start Shadow Run
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ShadowModePage;
