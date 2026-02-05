import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  Flag,
  LocalShipping,
  AttachMoney,
  Schedule,
  TrendingUp,
  CheckCircle,
  Warning,
} from '@mui/icons-material';

const generateCorridorData = () => {
  return [
    {
      corridor: 'US → EU',
      volume: 45230,
      avgAmount: 12500,
      totalValue: 565250000,
      successRate: 98.5,
      avgCost: 15,
      avgDelay: '1.2 hours',
      delayTrend: 'improving',
      popularChannels: ['SWIFT', 'SEPA'],
      recommendation: 'Switch to SEPA for payments <€10k to reduce costs by 40%',
      riskLevel: 'Low',
    },
    {
      corridor: 'IND → UK',
      volume: 28450,
      avgAmount: 8200,
      totalValue: 233290000,
      successRate: 96.2,
      avgCost: 22,
      avgDelay: '2.8 hours',
      delayTrend: 'stable',
      popularChannels: ['SWIFT', 'Correspondent Banking'],
      recommendation: 'Establish direct bank relationship to reduce intermediary fees',
      riskLevel: 'Medium',
    },
    {
      corridor: 'APAC → US',
      volume: 35120,
      avgAmount: 15800,
      totalValue: 554896000,
      successRate: 97.8,
      avgCost: 18,
      avgDelay: '3.2 hours',
      delayTrend: 'worsening',
      popularChannels: ['Wire Transfer', 'ACH'],
      recommendation: 'Use ACH for small amounts to cut costs by 60%',
      riskLevel: 'Low',
    },
    {
      corridor: 'EU → APAC',
      volume: 18920,
      avgAmount: 22000,
      totalValue: 416240000,
      successRate: 94.5,
      avgCost: 28,
      avgDelay: '4.5 hours',
      delayTrend: 'worsening',
      popularChannels: ['SWIFT', 'Correspondent Banking'],
      recommendation: 'High delay and costs - optimize routing through regional hubs',
      riskLevel: 'High',
    },
    {
      corridor: 'LATAM → US',
      volume: 12340,
      avgAmount: 6500,
      totalValue: 80210000,
      successRate: 92.1,
      avgCost: 25,
      avgDelay: '5.1 hours',
      delayTrend: 'stable',
      popularChannels: ['Wire Transfer'],
      recommendation: 'Low success rate - investigate compliance and validation issues',
      riskLevel: 'High',
    },
    {
      corridor: 'UK → US',
      volume: 32890,
      avgAmount: 18500,
      totalValue: 608465000,
      successRate: 99.1,
      avgCost: 12,
      avgDelay: '0.8 hours',
      delayTrend: 'improving',
      popularChannels: ['SWIFT', 'ACH'],
      recommendation: 'Best performing corridor - consider this as benchmark',
      riskLevel: 'Low',
    },
  ];
};

const PaymentCorridorPage = () => {
  const [corridors] = useState(generateCorridorData());
  const [sortBy, setSortBy] = useState('volume');

  const sortedCorridors = [...corridors].sort((a, b) => {
    if (sortBy === 'volume') return b.volume - a.volume;
    if (sortBy === 'successRate') return b.successRate - a.successRate;
    if (sortBy === 'cost') return a.avgCost - b.avgCost;
    if (sortBy === 'delay') return parseFloat(a.avgDelay) - parseFloat(b.avgDelay);
    return 0;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const totalVolume = corridors.reduce((sum, c) => sum + c.volume, 0);
  const totalValue = corridors.reduce((sum, c) => sum + c.totalValue, 0);
  const avgSuccessRate = corridors.reduce((sum, c) => sum + c.successRate, 0) / corridors.length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Payment Corridor Intelligence
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Analyze payment flows between regions to optimize costs and routing
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="volume">Volume (High to Low)</MenuItem>
            <MenuItem value="successRate">Success Rate (High to Low)</MenuItem>
            <MenuItem value="cost">Cost (Low to High)</MenuItem>
            <MenuItem value="delay">Delay (Low to High)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <LocalShipping sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {totalVolume.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Monthly Volume
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(totalValue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Transaction Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {avgSuccessRate.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Success Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Corridor Details Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🌍 Corridor Performance Analysis
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Corridor</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="right">Success Rate</TableCell>
                  <TableCell align="right">Avg Cost</TableCell>
                  <TableCell align="right">Avg Delay</TableCell>
                  <TableCell>Trend</TableCell>
                  <TableCell>Risk</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedCorridors.map((corridor, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Flag color="primary" />
                        <Typography variant="body2" fontWeight={600}>
                          {corridor.corridor}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {corridor.volume.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatCurrency(corridor.totalValue)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        {corridor.successRate >= 98 && <CheckCircle sx={{ fontSize: 16, color: 'success.main' }} />}
                        {corridor.successRate < 95 && <Warning sx={{ fontSize: 16, color: 'error.main' }} />}
                        <Typography variant="body2" fontWeight="bold">
                          {corridor.successRate}%
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        ${corridor.avgCost}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                        <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {corridor.avgDelay}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={corridor.delayTrend}
                        size="small"
                        color={
                          corridor.delayTrend === 'improving' ? 'success' :
                          corridor.delayTrend === 'worsening' ? 'error' :
                          'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={corridor.riskLevel}
                        size="small"
                        color={
                          corridor.riskLevel === 'Low' ? 'success' :
                          corridor.riskLevel === 'Medium' ? 'warning' :
                          'error'
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Corridor Details Cards */}
      <Grid container spacing={3}>
        {sortedCorridors.map((corridor, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    {corridor.corridor}
                  </Typography>
                  <Chip
                    label={corridor.riskLevel}
                    size="small"
                    color={
                      corridor.riskLevel === 'Low' ? 'success' :
                      corridor.riskLevel === 'Medium' ? 'warning' :
                      'error'
                    }
                  />
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Monthly Volume
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {corridor.volume.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Success Rate
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color={corridor.successRate >= 98 ? 'success.main' : corridor.successRate < 95 ? 'error.main' : 'text.primary'}>
                      {corridor.successRate}%
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Avg Cost/Txn
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      ${corridor.avgCost}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Avg Delay
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {corridor.avgDelay}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Popular Channels
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  {corridor.popularChannels.map((channel, idx) => (
                    <Chip key={idx} label={channel} size="small" variant="outlined" />
                  ))}
                </Box>

                <Alert severity={corridor.riskLevel === 'High' ? 'warning' : 'info'} sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight={600}>
                    💡 {corridor.recommendation}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PaymentCorridorPage;
