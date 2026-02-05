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
  LinearProgress,
  Alert,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  TrendingDown,
  Warning,
  ErrorOutline,
} from '@mui/icons-material';

const generateLeakageData = (period) => {
  const baseMultiplier = period === 'today' ? 1 : period === 'week' ? 7 : 30;
  
  return {
    totalLeakage: 2450000 * baseMultiplier,
    categories: [
      {
        category: 'Limit Rejections',
        count: 1250 * baseMultiplier,
        amount: 1200000 * baseMultiplier,
        percentage: 49,
        trend: 'up',
        topReasons: [
          { reason: 'Daily transaction limit exceeded', count: 450 * baseMultiplier, amount: 450000 * baseMultiplier },
          { reason: 'Single transaction limit breach', count: 380 * baseMultiplier, amount: 380000 * baseMultiplier },
          { reason: 'Monthly volume cap reached', count: 280 * baseMultiplier, amount: 240000 * baseMultiplier },
          { reason: 'Cross-border limit restriction', count: 140 * baseMultiplier, amount: 130000 * baseMultiplier },
        ],
        recommendation: 'Review and increase transaction limits for high-value clients',
      },
      {
        category: 'Routing Inefficiencies',
        count: 890 * baseMultiplier,
        amount: 780000 * baseMultiplier,
        percentage: 32,
        trend: 'stable',
        topReasons: [
          { reason: 'Sub-optimal corridor selection', count: 350 * baseMultiplier, amount: 320000 * baseMultiplier },
          { reason: 'Fallback routing delays', count: 290 * baseMultiplier, amount: 260000 * baseMultiplier },
          { reason: 'Network downtime rerouting', count: 180 * baseMultiplier, amount: 150000 * baseMultiplier },
          { reason: 'Peak hour congestion', count: 70 * baseMultiplier, amount: 50000 * baseMultiplier },
        ],
        recommendation: 'Implement intelligent routing with real-time network health',
      },
      {
        category: 'Validation Failures',
        count: 560 * baseMultiplier,
        amount: 320000 * baseMultiplier,
        percentage: 13,
        trend: 'down',
        topReasons: [
          { reason: 'Invalid account format', count: 220 * baseMultiplier, amount: 140000 * baseMultiplier },
          { reason: 'Missing beneficiary details', count: 180 * baseMultiplier, amount: 100000 * baseMultiplier },
          { reason: 'Currency mismatch', count: 100 * baseMultiplier, amount: 50000 * baseMultiplier },
          { reason: 'Reference data incomplete', count: 60 * baseMultiplier, amount: 30000 * baseMultiplier },
        ],
        recommendation: 'Enhanced client-side validation and data quality checks',
      },
      {
        category: 'System Timeouts',
        count: 340 * baseMultiplier,
        amount: 150000 * baseMultiplier,
        percentage: 6,
        trend: 'up',
        topReasons: [
          { reason: 'Downstream partner timeout', count: 180 * baseMultiplier, amount: 80000 * baseMultiplier },
          { reason: 'Database connection timeout', count: 90 * baseMultiplier, amount: 40000 * baseMultiplier },
          { reason: 'API gateway timeout', count: 50 * baseMultiplier, amount: 20000 * baseMultiplier },
          { reason: 'Network latency spike', count: 20 * baseMultiplier, amount: 10000 * baseMultiplier },
        ],
        recommendation: 'Increase timeout thresholds and implement retry logic',
      },
    ],
    regionalBreakdown: [
      { region: 'North America', leakage: 980000 * baseMultiplier, percentage: 40 },
      { region: 'Europe', leakage: 735000 * baseMultiplier, percentage: 30 },
      { region: 'APAC', leakage: 490000 * baseMultiplier, percentage: 20 },
      { region: 'LATAM', leakage: 147000 * baseMultiplier, percentage: 6 },
      { region: 'MEA', leakage: 98000 * baseMultiplier, percentage: 4 },
    ],
    channelBreakdown: [
      { channel: 'SWIFT', leakage: 1225000 * baseMultiplier, percentage: 50 },
      { channel: 'ACH', leakage: 490000 * baseMultiplier, percentage: 20 },
      { channel: 'Wire', leakage: 490000 * baseMultiplier, percentage: 20 },
      { channel: 'Card', leakage: 245000 * baseMultiplier, percentage: 10 },
    ],
  };
};

const RevenueLeakagePage = () => {
  const [period, setPeriod] = useState('month');
  const [data] = useState(generateLeakageData(period));

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Revenue Leakage Detection
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Identify revenue loss from rejected payments and routing inefficiencies
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} onChange={handlePeriodChange} label="Period">
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Total Leakage Card */}
      <Card sx={{ mb: 3, bgcolor: 'error.main', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingDown sx={{ fontSize: 60 }} />
            <Box>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Total Revenue Leakage
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                ${data.totalLeakage.toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Lost due to rejected and failed payments
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {data.categories.map((cat) => (
          <Grid item xs={12} md={6} key={cat.category}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {cat.category}
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="error">
                      ${cat.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {cat.count.toLocaleString()} transactions
                    </Typography>
                  </Box>
                  <Chip
                    label={`${cat.percentage}%`}
                    color="error"
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption">% of Total Leakage</Typography>
                    <Typography variant="caption" fontWeight={600}>
                      {cat.percentage}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={cat.percentage}
                    color="error"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="caption" color="text.secondary" gutterBottom>
                  Top Reasons
                </Typography>
                {cat.topReasons.slice(0, 3).map((reason, index) => (
                  <Box key={index} sx={{ mt: 1 }}>
                    <Typography variant="body2" fontSize="0.8rem">
                      {reason.reason}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {reason.count.toLocaleString()} txns
                      </Typography>
                      <Typography variant="caption" fontWeight={600} color="error.main">
                        ${reason.amount.toLocaleString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}

                <Alert severity="info" sx={{ mt: 2 }} icon={<ErrorOutline />}>
                  <Typography variant="caption" fontWeight={600}>
                    💡 {cat.recommendation}
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Regional Breakdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Revenue Leakage by Region
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Region</TableCell>
                  <TableCell align="right">Leakage Amount</TableCell>
                  <TableCell align="right">% of Total</TableCell>
                  <TableCell>Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.regionalBreakdown.map((region) => (
                  <TableRow key={region.region}>
                    <TableCell>{region.region}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'error.main' }}>
                      ${region.leakage.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{region.percentage}%</TableCell>
                    <TableCell>
                      <LinearProgress
                        variant="determinate"
                        value={region.percentage}
                        color="error"
                        sx={{ width: 100, height: 6, borderRadius: 3 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Channel Breakdown */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Revenue Leakage by Channel
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Channel</TableCell>
                  <TableCell align="right">Leakage Amount</TableCell>
                  <TableCell align="right">% of Total</TableCell>
                  <TableCell>Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.channelBreakdown.map((channel) => (
                  <TableRow key={channel.channel}>
                    <TableCell>
                      <Chip label={channel.channel} size="small" />
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, color: 'error.main' }}>
                      ${channel.leakage.toLocaleString()}
                    </TableCell>
                    <TableCell align="right">{channel.percentage}%</TableCell>
                    <TableCell>
                      <LinearProgress
                        variant="determinate"
                        value={channel.percentage}
                        color="error"
                        sx={{ width: 100, height: 6, borderRadius: 3 }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Alert severity="warning" sx={{ mt: 3 }} icon={<Warning />}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          💰 Revenue Recovery Opportunities
        </Typography>
        <Typography variant="body2">
          • Adjusting transaction limits could recover ~$1.2M/month (49% of total leakage)
        </Typography>
        <Typography variant="body2">
          • Implementing intelligent routing could save ~$780K/month (32% of total leakage)
        </Typography>
        <Typography variant="body2">
          • Enhanced validation could prevent ~$320K/month in losses (13% of total leakage)
        </Typography>
      </Alert>
    </Container>
  );
};

export default RevenueLeakagePage;
