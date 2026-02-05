import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Divider,
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
} from '@mui/material';
import {
  Preview,
  Warning,
  PlayArrow,
  Close,
  TrendingUp,
  Flag,
} from '@mui/icons-material';

const generateImpactAnalysis = (ruleType, ruleValue) => {
  return {
    riskLevel: Math.random() > 0.6 ? 'High' : Math.random() > 0.3 ? 'Medium' : 'Low',
    affectedPayments: Math.floor(Math.random() * 50000) + 5000,
    affectedRegions: ['North America', 'Europe', 'APAC'].slice(0, Math.floor(Math.random() * 3) + 1),
    estimatedImpact: {
      volumeChange: Math.floor(Math.random() * 40) - 20,
      costChange: Math.floor(Math.random() * 20000) - 10000,
      latencyChange: (Math.random() * 2 - 1).toFixed(2),
      failureRateChange: (Math.random() * 4 - 2).toFixed(1),
    },
    potentialIssues: [
      {
        severity: 'High',
        issue: 'May cause routing conflicts with existing EUR→GBP rules',
        probability: '75%',
      },
      {
        severity: 'Medium',
        issue: 'Could exceed partner bank daily limit thresholds',
        probability: '45%',
      },
      {
        severity: 'Low',
        issue: 'Minor latency increase during peak hours',
        probability: '20%',
      },
    ],
    affectedServices: [
      { name: 'SWIFT Gateway', impact: 'High', paymentsAffected: 12500 },
      { name: 'ACH Processor', impact: 'Medium', paymentsAffected: 8200 },
      { name: 'Wire Transfer Service', impact: 'Low', paymentsAffected: 3400 },
    ],
    historicalComparison: {
      similarChanges: 3,
      avgSuccessRate: 67,
      avgRollbackRate: 33,
    },
  };
};

const RuleChangeImpactPage = () => {
  const [ruleType, setRuleType] = useState('');
  const [ruleValue, setRuleValue] = useState('');
  const [impact, setImpact] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleAnalyze = () => {
    const analysis = generateImpactAnalysis(ruleType, ruleValue);
    setImpact(analysis);
    setPreviewOpen(true);
  };

  const handleApplyChange = () => {
    setPreviewOpen(false);
    // Apply the change
  };

  const getRiskColor = (risk) => {
    if (risk === 'High') return 'error';
    if (risk === 'Medium') return 'warning';
    return 'success';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Rule Change Impact Preview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Preview the impact of configuration changes before deployment
        </Typography>
      </Box>

      {/* Rule Configuration */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Configure Rule Change
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={ruleType}
                  label="Rule Type"
                  onChange={(e) => setRuleType(e.target.value)}
                >
                  <MenuItem value="routing">Routing Rule</MenuItem>
                  <MenuItem value="limit">Transaction Limit</MenuItem>
                  <MenuItem value="validation">Validation Rule</MenuItem>
                  <MenuItem value="retry">Retry Policy</MenuItem>
                  <MenuItem value="timeout">Timeout Configuration</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rule Configuration"
                placeholder="e.g., Route EUR→GBP via SEPA instead of SWIFT"
                value={ruleValue}
                onChange={(e) => setRuleValue(e.target.value)}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Preview />}
                onClick={handleAnalyze}
                disabled={!ruleType || !ruleValue}
                size="large"
              >
                Preview Impact
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Impact Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {impact && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Warning color={getRiskColor(impact.riskLevel)} sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Impact Analysis
                  </Typography>
                  <Chip
                    label={`${impact.riskLevel} Risk`}
                    color={getRiskColor(impact.riskLevel)}
                    size="small"
                  />
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              {/* Risk Alert */}
              <Alert
                severity={impact.riskLevel === 'High' ? 'error' : impact.riskLevel === 'Medium' ? 'warning' : 'success'}
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {impact.affectedPayments.toLocaleString()} payments will be affected by this change
                </Typography>
              </Alert>

              {/* Affected Regions */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Affected Regions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {impact.affectedRegions.map((region, index) => (
                    <Chip key={index} icon={<Flag />} label={region} color="primary" />
                  ))}
                </Box>
              </Box>

              {/* Estimated Impact */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Estimated Impact
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Card sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Volume Change
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {impact.estimatedImpact.volumeChange > 0 ? (
                            <TrendingUp color="success" />
                          ) : (
                            <TrendingUp sx={{ transform: 'rotate(180deg)', color: 'error.main' }} />
                          )}
                          <Typography variant="h6" fontWeight="bold">
                            {impact.estimatedImpact.volumeChange > 0 ? '+' : ''}
                            {impact.estimatedImpact.volumeChange}%
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Cost Change
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color={impact.estimatedImpact.costChange > 0 ? 'error.main' : 'success.main'}>
                          {impact.estimatedImpact.costChange > 0 ? '+' : ''}
                          ${Math.abs(impact.estimatedImpact.costChange).toLocaleString()}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Latency Change
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {impact.estimatedImpact.latencyChange > 0 ? '+' : ''}
                          {impact.estimatedImpact.latencyChange}s
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={6}>
                    <Card sx={{ bgcolor: 'grey.50' }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary">
                          Failure Rate Change
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color={impact.estimatedImpact.failureRateChange > 0 ? 'error.main' : 'success.main'}>
                          {impact.estimatedImpact.failureRateChange > 0 ? '+' : ''}
                          {impact.estimatedImpact.failureRateChange}%
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>

              {/* Potential Issues */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Potential Issues
                </Typography>
                {impact.potentialIssues.map((issue, index) => (
                  <Alert key={index} severity={issue.severity.toLowerCase()} sx={{ mb: 1 }}>
                    <Typography variant="body2" fontWeight={600}>
                      {issue.issue}
                    </Typography>
                    <Typography variant="caption">
                      Probability: {issue.probability}
                    </Typography>
                  </Alert>
                ))}
              </Box>

              {/* Affected Services */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Affected Services
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Impact Level</TableCell>
                        <TableCell align="right">Payments Affected</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {impact.affectedServices.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>{service.name}</TableCell>
                          <TableCell>
                            <Chip
                              label={service.impact}
                              size="small"
                              color={
                                service.impact === 'High' ? 'error' :
                                service.impact === 'Medium' ? 'warning' :
                                'success'
                              }
                            />
                          </TableCell>
                          <TableCell align="right">
                            {service.paymentsAffected.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              {/* Historical Comparison */}
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Historical Comparison
                </Typography>
                <Card sx={{ bgcolor: 'info.light', color: 'info.contrastText' }}>
                  <CardContent>
                    <Typography variant="body2" gutterBottom>
                      Similar changes have been made {impact.historicalComparison.similarChanges} times before
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Success Rate
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {impact.historicalComparison.avgSuccessRate}%
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Rollback Rate
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {impact.historicalComparison.avgRollbackRate}%
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button
                onClick={() => setPreviewOpen(false)}
                startIcon={<Close />}
                color="inherit"
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyChange}
                variant="contained"
                startIcon={<PlayArrow />}
                color={impact.riskLevel === 'Low' ? 'success' : 'warning'}
              >
                Apply Change
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Recent Impact Analyses */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Impact Analyses
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Rule Type</TableCell>
                  <TableCell>Risk Level</TableCell>
                  <TableCell align="right">Affected Payments</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>2024-02-03 14:23:15</TableCell>
                  <TableCell>Routing Rule</TableCell>
                  <TableCell>
                    <Chip label="High" color="error" size="small" />
                  </TableCell>
                  <TableCell align="right">45,230</TableCell>
                  <TableCell>
                    <Chip label="Cancelled" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-03 10:15:42</TableCell>
                  <TableCell>Limit Change</TableCell>
                  <TableCell>
                    <Chip label="Low" color="success" size="small" />
                  </TableCell>
                  <TableCell align="right">8,500</TableCell>
                  <TableCell>
                    <Chip label="Applied" color="success" size="small" />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2024-02-02 16:45:28</TableCell>
                  <TableCell>Timeout Config</TableCell>
                  <TableCell>
                    <Chip label="Medium" color="warning" size="small" />
                  </TableCell>
                  <TableCell align="right">22,100</TableCell>
                  <TableCell>
                    <Chip label="Applied" color="success" size="small" />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RuleChangeImpactPage;
