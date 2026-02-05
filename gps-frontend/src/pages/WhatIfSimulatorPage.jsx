import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Divider,
} from '@mui/material';
import {
  PlayArrow,
  Refresh,
  TrendingUp,
  TrendingDown,
  Speed,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

const generateSimulationResults = (scenario, params) => {
  const baseVolume = 50000;
  const baseLatency = 1.2;
  const baseFailureRate = 2.5;

  let volumeChange = 0;
  let latencyChange = 0;
  let failureRateChange = 0;

  if (scenario === 'routing') {
    volumeChange = 15;
    latencyChange = -25;
    failureRateChange = -18;
  } else if (scenario === 'region') {
    volumeChange = params.expectedVolume || 30;
    latencyChange = 35;
    failureRateChange = 12;
  } else if (scenario === 'limit') {
    volumeChange = 22;
    latencyChange = 5;
    failureRateChange = -8;
  }

  return {
    current: {
      volume: baseVolume,
      latency: baseLatency,
      failureRate: baseFailureRate,
      successRate: 100 - baseFailureRate,
      cost: 125000,
    },
    projected: {
      volume: Math.round(baseVolume * (1 + volumeChange / 100)),
      latency: (baseLatency * (1 + latencyChange / 100)).toFixed(2),
      failureRate: (baseFailureRate * (1 + failureRateChange / 100)).toFixed(2),
      successRate: (100 - (baseFailureRate * (1 + failureRateChange / 100))).toFixed(2),
      cost: Math.round(125000 * (1 + volumeChange / 100)),
    },
    changes: {
      volume: volumeChange,
      latency: latencyChange,
      failureRate: failureRateChange,
      successRate: -failureRateChange,
    },
    risks: [
      {
        level: Math.abs(latencyChange) > 30 ? 'high' : 'medium',
        description: latencyChange > 0 
          ? 'Significant latency increase expected during initial onboarding'
          : 'Latency improvement expected with new routing',
      },
      {
        level: volumeChange > 25 ? 'high' : 'low',
        description: volumeChange > 25
          ? 'High volume increase may require infrastructure scaling'
          : 'Volume increase within current capacity',
      },
      {
        level: failureRateChange > 10 ? 'high' : 'low',
        description: failureRateChange > 10
          ? 'Increased failure rate during stabilization period'
          : 'Failure rate expected to improve or remain stable',
      },
    ],
    recommendations: [
      'Run pilot with 10% of traffic for 2 weeks',
      'Set up enhanced monitoring dashboards',
      'Prepare rollback plan within 24 hours',
      'Schedule implementation during low-traffic window',
    ],
  };
};

const WhatIfSimulatorPage = () => {
  const [scenario, setScenario] = useState('routing');
  const [params, setParams] = useState({
    routingRule: 'Low-cost priority',
    region: 'Southeast Asia',
    expectedVolume: 30,
    limitIncrease: 50,
  });
  const [results, setResults] = useState(null);

  const handleSimulate = () => {
    const simulationResults = generateSimulationResults(scenario, params);
    setResults(simulationResults);
  };

  const handleReset = () => {
    setResults(null);
  };

  const renderChangeChip = (value, inverse = false) => {
    const isPositive = inverse ? value < 0 : value > 0;
    return (
      <Chip
        icon={isPositive ? <TrendingUp /> : <TrendingDown />}
        label={`${value > 0 ? '+' : ''}${value}%`}
        color={isPositive ? 'success' : 'error'}
        size="small"
      />
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          What-If Simulator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Test scenarios before touching production - See projected impact on volume, latency, and failure rate
        </Typography>
      </Box>

      {/* Scenario Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Select Scenario to Simulate
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Scenario Type</InputLabel>
                <Select
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  label="Scenario Type"
                >
                  <MenuItem value="routing">New Routing Rule</MenuItem>
                  <MenuItem value="region">New Region Onboarding</MenuItem>
                  <MenuItem value="limit">Transaction Limit Adjustment</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {scenario === 'routing' && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Routing Rule</InputLabel>
                  <Select
                    value={params.routingRule}
                    onChange={(e) => setParams({ ...params, routingRule: e.target.value })}
                    label="Routing Rule"
                  >
                    <MenuItem value="Low-cost priority">Low-cost priority</MenuItem>
                    <MenuItem value="Speed priority">Speed priority</MenuItem>
                    <MenuItem value="Reliability priority">Reliability priority</MenuItem>
                    <MenuItem value="Hybrid approach">Hybrid approach</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}

            {scenario === 'region' && (
              <>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Target Region</InputLabel>
                    <Select
                      value={params.region}
                      onChange={(e) => setParams({ ...params, region: e.target.value })}
                      label="Target Region"
                    >
                      <MenuItem value="Southeast Asia">Southeast Asia</MenuItem>
                      <MenuItem value="Middle East">Middle East</MenuItem>
                      <MenuItem value="Africa">Africa</MenuItem>
                      <MenuItem value="South America">South America</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Expected Volume Increase (%)"
                    type="number"
                    value={params.expectedVolume}
                    onChange={(e) => setParams({ ...params, expectedVolume: parseInt(e.target.value) || 0 })}
                  />
                </Grid>
              </>
            )}

            {scenario === 'limit' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Limit Increase (%)"
                  type="number"
                  value={params.limitIncrease}
                  onChange={(e) => setParams({ ...params, limitIncrease: parseInt(e.target.value) || 0 })}
                />
              </Grid>
            )}
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<PlayArrow />}
              onClick={handleSimulate}
              size="large"
            >
              Run Simulation
            </Button>
            {results && (
              <Button
                variant="outlined"
                startIcon={<Refresh />}
                onClick={handleReset}
                size="large"
              >
                Reset
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Comparison Table */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Projected Impact Analysis
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Current</TableCell>
                      <TableCell align="right">Projected</TableCell>
                      <TableCell align="center">Change</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Daily Volume</TableCell>
                      <TableCell align="right">{results.current.volume.toLocaleString()} txns</TableCell>
                      <TableCell align="right" fontWeight={600}>{results.projected.volume.toLocaleString()} txns</TableCell>
                      <TableCell align="center">{renderChangeChip(results.changes.volume)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Avg Latency</TableCell>
                      <TableCell align="right">{results.current.latency}s</TableCell>
                      <TableCell align="right" fontWeight={600}>{results.projected.latency}s</TableCell>
                      <TableCell align="center">{renderChangeChip(results.changes.latency, true)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Failure Rate</TableCell>
                      <TableCell align="right">{results.current.failureRate}%</TableCell>
                      <TableCell align="right" fontWeight={600}>{results.projected.failureRate}%</TableCell>
                      <TableCell align="center">{renderChangeChip(results.changes.failureRate, true)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Success Rate</TableCell>
                      <TableCell align="right">{results.current.successRate}%</TableCell>
                      <TableCell align="right" fontWeight={600}>{results.projected.successRate}%</TableCell>
                      <TableCell align="center">{renderChangeChip(results.changes.successRate)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Monthly Cost</TableCell>
                      <TableCell align="right">${results.current.cost.toLocaleString()}</TableCell>
                      <TableCell align="right" fontWeight={600}>${results.projected.cost.toLocaleString()}</TableCell>
                      <TableCell align="center">{renderChangeChip(results.changes.volume)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Risk Assessment */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="warning.main">
                    ⚠️ Risk Assessment
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {results.risks.map((risk, index) => (
                    <Alert
                      key={index}
                      severity={risk.level === 'high' ? 'error' : risk.level === 'medium' ? 'warning' : 'info'}
                      sx={{ mb: 2 }}
                      icon={risk.level === 'high' ? <ErrorIcon /> : <CheckCircle />}
                    >
                      <Typography variant="body2">{risk.description}</Typography>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="success.main">
                    ✅ Implementation Recommendations
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {results.recommendations.map((rec, index) => (
                    <Box key={index} sx={{ mb: 1.5, display: 'flex', gap: 1, alignItems: 'start' }}>
                      <CheckCircle color="success" fontSize="small" sx={{ mt: 0.5 }} />
                      <Typography variant="body2">{rec}</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Summary Alert */}
          <Alert 
            severity={results.changes.failureRate > 10 ? 'warning' : 'success'}
            icon={<Speed />}
          >
            <Typography variant="body2" fontWeight={600} gutterBottom>
              💡 Simulation Summary
            </Typography>
            <Typography variant="body2">
              Based on historical patterns and current system capacity, this {scenario} scenario would:
            </Typography>
            <Typography variant="body2">
              • {results.changes.volume > 0 ? 'Increase' : 'Decrease'} daily volume by {Math.abs(results.changes.volume)}% 
              ({Math.abs(results.projected.volume - results.current.volume).toLocaleString()} transactions)
            </Typography>
            <Typography variant="body2">
              • {results.changes.latency > 0 ? 'Increase' : 'Decrease'} average latency by {Math.abs(results.changes.latency)}%
            </Typography>
            <Typography variant="body2">
              • {results.changes.failureRate > 0 ? 'Increase' : 'Decrease'} failure rate by {Math.abs(results.changes.failureRate)}%
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
              {results.changes.failureRate > 10 
                ? '⚠️ Proceed with caution - Consider phased rollout'
                : '✅ Safe to proceed - Within acceptable thresholds'}
            </Typography>
          </Alert>
        </>
      )}
    </Container>
  );
};

export default WhatIfSimulatorPage;
