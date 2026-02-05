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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  LinearProgress,
} from '@mui/material';
import {
  Assessment,
  Warning,
  CheckCircle,
  TrendingUp,
  Public,
  People,
  AttachMoney,
  Close,
  Calculate,
} from '@mui/icons-material';

const calculateBlastRadius = (changeType, region, paymentVolume) => {
  const baseImpact = {
    routing: { payments: 25000, regions: 3, users: 15000, revenue: 125000 },
    limit: { payments: 8000, regions: 1, users: 5000, revenue: 40000 },
    timeout: { payments: 18000, regions: 2, users: 12000, revenue: 85000 },
    validation: { payments: 35000, regions: 4, users: 22000, revenue: 175000 },
  };

  const regionMultiplier = {
    global: 5,
    us: 2.5,
    europe: 2,
    apac: 1.8,
    latam: 1.2,
  };

  const base = baseImpact[changeType.toLowerCase()] || baseImpact.routing;
  const multiplier = regionMultiplier[region.toLowerCase()] || 1;

  return {
    affectedPayments: Math.floor(base.payments * multiplier),
    affectedRegions: Math.min(base.regions, 5),
    affectedUsers: Math.floor(base.users * multiplier),
    potentialRevenueLoss: Math.floor(base.revenue * multiplier),
    riskScore: Math.min(Math.floor((multiplier * 20) + (base.payments / 1000)), 100),
  };
};

const BlastRadiusPage = () => {
  const [changeType, setChangeType] = useState('');
  const [region, setRegion] = useState('');
  const [paymentVolume, setPaymentVolume] = useState(50);
  const [analysis, setAnalysis] = useState(null);
  const [estimateDialog, setEstimateDialog] = useState(false);

  const handleCalculate = () => {
    const result = calculateBlastRadius(changeType, region, paymentVolume);
    setAnalysis(result);
    setEstimateDialog(true);
  };

  const getRiskLevel = (score) => {
    if (score >= 75) return { level: 'Critical', color: 'error' };
    if (score >= 50) return { level: 'High', color: 'warning' };
    if (score >= 25) return { level: 'Medium', color: 'info' };
    return { level: 'Low', color: 'success' };
  };

  const historicalChanges = [
    {
      id: 1,
      timestamp: '2024-02-03 10:15:22',
      changeType: 'Routing Rule',
      region: 'Global',
      estimatedImpact: 125000,
      actualImpact: 118500,
      accuracy: 95,
      riskScore: 85,
    },
    {
      id: 2,
      timestamp: '2024-02-02 14:30:45',
      changeType: 'Limit Change',
      region: 'US',
      estimatedImpact: 20000,
      actualImpact: 22100,
      accuracy: 91,
      riskScore: 42,
    },
    {
      id: 3,
      timestamp: '2024-02-01 09:12:18',
      changeType: 'Timeout Config',
      region: 'Europe',
      estimatedImpact: 36000,
      actualImpact: 34200,
      accuracy: 95,
      riskScore: 58,
    },
    {
      id: 4,
      timestamp: '2024-01-31 16:45:33',
      changeType: 'Validation Rule',
      region: 'APAC',
      estimatedImpact: 63000,
      actualImpact: 68500,
      accuracy: 92,
      riskScore: 72,
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Blast Radius Estimator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calculate worst-case impact before deploying changes
        </Typography>
      </Box>

      {/* Calculator Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Impact Calculator
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Change Type</InputLabel>
                <Select
                  value={changeType}
                  label="Change Type"
                  onChange={(e) => setChangeType(e.target.value)}
                >
                  <MenuItem value="Routing">Routing Rule</MenuItem>
                  <MenuItem value="Limit">Transaction Limit</MenuItem>
                  <MenuItem value="Timeout">Timeout Configuration</MenuItem>
                  <MenuItem value="Validation">Validation Rule</MenuItem>
                  <MenuItem value="Retry">Retry Policy</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={region}
                  label="Region"
                  onChange={(e) => setRegion(e.target.value)}
                >
                  <MenuItem value="Global">Global</MenuItem>
                  <MenuItem value="US">US</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="APAC">APAC</MenuItem>
                  <MenuItem value="LATAM">LATAM</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Expected Payment Volume Increase (%)
                </Typography>
                <Slider
                  value={paymentVolume}
                  onChange={(e, value) => setPaymentVolume(value)}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' },
                  ]}
                  valueLabelDisplay="on"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Calculate />}
                onClick={handleCalculate}
                disabled={!changeType || !region}
              >
                Calculate Blast Radius
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Avg Estimation Accuracy
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                93%
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Changes Analyzed (30d)
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {historicalChanges.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                High Risk Changes
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {historicalChanges.filter(c => c.riskScore >= 70).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Prevented Incidents
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                2
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Historical Analysis */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Historical Impact Analysis
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Change Type</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell align="right">Estimated Impact</TableCell>
                  <TableCell align="right">Actual Impact</TableCell>
                  <TableCell>Accuracy</TableCell>
                  <TableCell>Risk Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {historicalChanges.map((change) => {
                  const risk = getRiskLevel(change.riskScore);
                  return (
                    <TableRow key={change.id}>
                      <TableCell>
                        <Typography variant="body2">{change.timestamp}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{change.changeType}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={change.region} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2">
                          {change.estimatedImpact.toLocaleString()} payments
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">
                          {change.actualImpact.toLocaleString()} payments
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 60 }}>
                            <LinearProgress variant="determinate" value={change.accuracy} color="success" />
                          </Box>
                          <Typography variant="body2">{change.accuracy}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${change.riskScore} - ${risk.level}`}
                          color={risk.color}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Estimation Dialog */}
      <Dialog open={estimateDialog} onClose={() => setEstimateDialog(false)} maxWidth="md" fullWidth>
        {analysis && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assessment color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Blast Radius Estimation</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Worst-case impact analysis
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              {/* Risk Score */}
              <Card sx={{ mb: 3, bgcolor: getRiskLevel(analysis.riskScore).color + '.light' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Overall Risk Score
                      </Typography>
                      <Typography variant="h3" fontWeight="bold">
                        {analysis.riskScore}/100
                      </Typography>
                      <Chip
                        label={getRiskLevel(analysis.riskScore).level}
                        color={getRiskLevel(analysis.riskScore).color}
                        sx={{ mt: 1 }}
                      />
                    </Box>
                    <Box sx={{ width: 100, height: 100 }}>
                      <Warning sx={{ fontSize: 100, opacity: 0.3 }} />
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Impact Alert */}
              <Alert
                severity={
                  analysis.riskScore >= 75 ? 'error' :
                  analysis.riskScore >= 50 ? 'warning' :
                  'info'
                }
                sx={{ mb: 3 }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {analysis.riskScore >= 75
                    ? 'Critical Risk: This change could have severe impact on operations'
                    : analysis.riskScore >= 50
                    ? 'High Risk: Proceed with caution and have rollback plan ready'
                    : 'Moderate Risk: Change appears manageable with standard precautions'}
                </Typography>
              </Alert>

              {/* Impact Metrics */}
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TrendingUp color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Affected Payments
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {analysis.affectedPayments.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Public color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Affected Regions
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {analysis.affectedRegions}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'grey.50' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <People color="primary" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Affected Users
                          </Typography>
                          <Typography variant="h5" fontWeight="bold">
                            {analysis.affectedUsers.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card sx={{ bgcolor: 'error.lighter' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <AttachMoney color="error" sx={{ fontSize: 40 }} />
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Potential Revenue Loss
                          </Typography>
                          <Typography variant="h5" fontWeight="bold" color="error.main">
                            ${analysis.potentialRevenueLoss.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Mitigation Recommendations */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Recommended Mitigations
                </Typography>
                <Alert severity="info" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    • Deploy during low-traffic window (2:00 AM - 4:00 AM UTC)
                  </Typography>
                </Alert>
                <Alert severity="info" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    • Enable enhanced monitoring for 24 hours post-deployment
                  </Typography>
                </Alert>
                <Alert severity="info" sx={{ mb: 1 }}>
                  <Typography variant="body2">
                    • Have rollback plan ready with estimated RTO of 2 minutes
                  </Typography>
                </Alert>
                {analysis.riskScore >= 70 && (
                  <Alert severity="warning">
                    <Typography variant="body2">
                      • Consider shadow mode testing before production deployment
                    </Typography>
                  </Alert>
                )}
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setEstimateDialog(false)} startIcon={<Close />}>
                Close
              </Button>
              <Button variant="outlined" color="inherit">
                Export Report
              </Button>
              {analysis.riskScore < 70 && (
                <Button variant="contained" color="success" startIcon={<CheckCircle />}>
                  Approve Change
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default BlastRadiusPage;
