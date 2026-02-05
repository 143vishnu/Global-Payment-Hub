import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Speed,
  Warning,
} from '@mui/icons-material';

const generateBottleneckData = (timeRange) => {
  return {
    summary: {
      avgProcessingTime: 1.2,
      bottleneckCount: 12,
      affectedPayments: 15420,
      efficiencyScore: 78,
    },
    regions: [
      {
        name: 'North America',
        avgLatency: 850,
        bottleneckSeverity: 'low',
        trend: 'stable',
        percentile95: 1200,
        throughput: 12500,
        issues: [
          { component: 'Validation Layer', latency: 120, severity: 'low' },
          { component: 'Routing Engine', latency: 230, severity: 'low' },
          { component: 'SWIFT Gateway', latency: 350, severity: 'medium' },
        ],
      },
      {
        name: 'Europe',
        avgLatency: 1850,
        bottleneckSeverity: 'high',
        trend: 'degrading',
        percentile95: 3200,
        throughput: 8900,
        issues: [
          { component: 'Database Connection Pool', latency: 680, severity: 'high' },
          { component: 'SEPA Integration', latency: 520, severity: 'high' },
          { component: 'Fraud Check Service', latency: 380, severity: 'medium' },
        ],
      },
      {
        name: 'APAC',
        avgLatency: 2150,
        bottleneckSeverity: 'critical',
        trend: 'degrading',
        percentile95: 4500,
        throughput: 6200,
        issues: [
          { component: 'Network Latency', latency: 920, severity: 'critical' },
          { component: 'Partner Bank API', latency: 780, severity: 'critical' },
          { component: 'Currency Conversion', latency: 290, severity: 'medium' },
        ],
      },
      {
        name: 'LATAM',
        avgLatency: 1450,
        bottleneckSeverity: 'medium',
        trend: 'improving',
        percentile95: 2100,
        throughput: 4300,
        issues: [
          { component: 'Compliance Checks', latency: 480, severity: 'medium' },
          { component: 'Regional Gateway', latency: 390, severity: 'medium' },
          { component: 'Beneficiary Validation', latency: 310, severity: 'low' },
        ],
      },
      {
        name: 'MEA',
        avgLatency: 1120,
        bottleneckSeverity: 'low',
        trend: 'stable',
        percentile95: 1680,
        throughput: 3100,
        issues: [
          { component: 'Sanctions Screening', latency: 340, severity: 'low' },
          { component: 'KYC Validation', latency: 280, severity: 'low' },
          { component: 'Document Processing', latency: 220, severity: 'low' },
        ],
      },
    ],
    channels: [
      {
        name: 'SWIFT',
        avgLatency: 1580,
        bottleneckSeverity: 'high',
        volume: 18500,
        trend: 'degrading',
        mainBottleneck: 'Partner Network Latency',
      },
      {
        name: 'ACH',
        avgLatency: 720,
        bottleneckSeverity: 'low',
        volume: 32000,
        trend: 'stable',
        mainBottleneck: 'Batch Processing Window',
      },
      {
        name: 'Wire',
        avgLatency: 980,
        bottleneckSeverity: 'medium',
        volume: 12300,
        trend: 'improving',
        mainBottleneck: 'Manual Approval Queue',
      },
      {
        name: 'Card',
        avgLatency: 450,
        bottleneckSeverity: 'low',
        volume: 45200,
        trend: 'stable',
        mainBottleneck: 'Tokenization Service',
      },
      {
        name: 'SEPA',
        avgLatency: 1850,
        bottleneckSeverity: 'critical',
        volume: 8900,
        trend: 'degrading',
        mainBottleneck: 'Database Connection Pool',
      },
    ],
    timeline: [
      { hour: '00:00', avgLatency: 850 },
      { hour: '03:00', avgLatency: 720 },
      { hour: '06:00', avgLatency: 1100 },
      { hour: '09:00', avgLatency: 1850 },
      { hour: '12:00', avgLatency: 2200 },
      { hour: '15:00', avgLatency: 1980 },
      { hour: '18:00', avgLatency: 1520 },
      { hour: '21:00', avgLatency: 1180 },
    ],
  };
};

const PaymentBottleneckPage = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [data, setData] = useState(generateBottleneckData('24h'));
  const [selectedRegion, setSelectedRegion] = useState('all');

  useEffect(() => {
    setData(generateBottleneckData(timeRange));
  }, [timeRange]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getTrendIcon = (trend) => {
    if (trend === 'degrading') return <TrendingDown color="error" />;
    if (trend === 'improving') return <TrendingUp color="success" />;
    return <Speed color="action" />;
  };

  const filteredRegions = selectedRegion === 'all' 
    ? data.regions 
    : data.regions.filter(r => r.name === selectedRegion);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Payment Flow Bottleneck Map
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Identify regions and channels slowing down payment processing
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Region</InputLabel>
            <Select 
              value={selectedRegion} 
              onChange={(e) => setSelectedRegion(e.target.value)}
              label="Region"
            >
              <MenuItem value="all">All Regions</MenuItem>
              {data.regions.map(r => (
                <MenuItem key={r.name} value={r.name}>{r.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {data.summary.avgProcessingTime}s
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Processing Time
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="error">
                {data.summary.bottleneckCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Bottlenecks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {data.summary.affectedPayments.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Affected Payments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {data.summary.efficiencyScore}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Efficiency Score
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regional Bottleneck Analysis */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Regional Bottleneck Analysis
      </Typography>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {filteredRegions.map((region) => (
          <Grid item xs={12} key={region.name}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">{region.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1, alignItems: 'center' }}>
                      <Chip 
                        label={`${region.avgLatency}ms avg`}
                        size="small"
                        color={getSeverityColor(region.bottleneckSeverity)}
                      />
                      <Chip 
                        label={region.bottleneckSeverity.toUpperCase()}
                        size="small"
                        color={getSeverityColor(region.bottleneckSeverity)}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getTrendIcon(region.trend)}
                        <Typography variant="caption">{region.trend}</Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="text.secondary">95th Percentile</Typography>
                    <Typography variant="h6" fontWeight="bold">{region.percentile95}ms</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {region.throughput.toLocaleString()} txns/day
                    </Typography>
                  </Box>
                </Box>

                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Bottleneck Components
                </Typography>
                {region.issues.map((issue, index) => (
                  <Box key={index} sx={{ mt: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="body2">{issue.component}</Typography>
                        <Chip 
                          label={issue.severity}
                          size="small"
                          color={getSeverityColor(issue.severity)}
                        />
                      </Box>
                      <Typography variant="body2" fontWeight={600}>
                        {issue.latency}ms
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(issue.latency / region.percentile95) * 100}
                      color={getSeverityColor(issue.severity)}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Channel Bottleneck Analysis */}
      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Channel Bottleneck Analysis
      </Typography>
      <Grid container spacing={3}>
        {data.channels.map((channel) => (
          <Grid item xs={12} md={6} key={channel.name}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6">{channel.name}</Typography>
                    <Chip 
                      label={channel.bottleneckSeverity.toUpperCase()}
                      size="small"
                      color={getSeverityColor(channel.bottleneckSeverity)}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" fontWeight="bold" color={getSeverityColor(channel.bottleneckSeverity) + '.main'}>
                      {channel.avgLatency}ms
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {channel.volume.toLocaleString()} txns
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  {getTrendIcon(channel.trend)}
                  <Typography variant="caption">{channel.trend}</Typography>
                </Box>

                <Alert 
                  severity={channel.bottleneckSeverity === 'critical' ? 'error' : 'info'}
                  sx={{ mt: 2 }}
                >
                  <Typography variant="caption" fontWeight={600}>
                    Main Bottleneck: {channel.mainBottleneck}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Timeline Chart (Simplified) */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Latency Trend Over Time
          </Typography>
          <Box sx={{ mt: 2 }}>
            {data.timeline.map((point, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption">{point.hour}</Typography>
                  <Typography variant="caption" fontWeight={600}>{point.avgLatency}ms</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(point.avgLatency / 2500) * 100}
                  color={point.avgLatency > 2000 ? 'error' : point.avgLatency > 1500 ? 'warning' : 'success'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Infrastructure Investment Justification */}
      <Alert severity="warning" sx={{ mt: 3 }} icon={<Warning />}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          💰 Infrastructure Investment Recommendations
        </Typography>
        <Typography variant="body2">
          • <strong>APAC Region:</strong> Critical bottleneck (2150ms avg) - Network optimization could reduce latency by 40% (~$2.3M annual impact)
        </Typography>
        <Typography variant="body2">
          • <strong>Europe SEPA:</strong> Database connection pool exhaustion - Additional capacity needed (~$850K annual impact)
        </Typography>
        <Typography variant="body2">
          • <strong>SWIFT Channel:</strong> Partner network latency degrading - Alternative routing could save ~$1.5M annually
        </Typography>
      </Alert>
    </Container>
  );
};

export default PaymentBottleneckPage;
