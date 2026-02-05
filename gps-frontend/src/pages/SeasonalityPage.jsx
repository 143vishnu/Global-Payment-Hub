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
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  CalendarToday,
  TrendingUp,
  Event,
  ShowChart,
  Error,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const generateSeasonalityData = () => {
  return {
    monthlyPatterns: [
      { month: 'Jan', volume: 125000, failures: 2850, avgLatency: 1.2 },
      { month: 'Feb', volume: 118000, failures: 2680, avgLatency: 1.1 },
      { month: 'Mar', volume: 142000, failures: 3250, avgLatency: 1.4 },
      { month: 'Apr', volume: 135000, failures: 3100, avgLatency: 1.3 },
      { month: 'May', volume: 128000, failures: 2920, avgLatency: 1.2 },
      { month: 'Jun', volume: 145000, failures: 3350, avgLatency: 1.5 },
      { month: 'Jul', volume: 132000, failures: 3020, avgLatency: 1.3 },
      { month: 'Aug', volume: 129000, failures: 2950, avgLatency: 1.2 },
      { month: 'Sep', volume: 138000, failures: 3180, avgLatency: 1.4 },
      { month: 'Oct', volume: 151000, failures: 3520, avgLatency: 1.6 },
      { month: 'Nov', volume: 148000, failures: 3420, avgLatency: 1.5 },
      { month: 'Dec', volume: 165000, failures: 3950, avgLatency: 1.8 },
    ],
    events: [
      {
        name: 'Month-End (Jan 31)',
        type: 'Recurring',
        volumeImpact: '+45%',
        failureImpact: '+62%',
        latencyImpact: '+38%',
        description: 'Corporate batch payments surge at month-end',
        preparation: 'Scale infrastructure 2 days before, increase ops staffing',
      },
      {
        name: 'Quarter-End (Mar 31)',
        type: 'Recurring',
        volumeImpact: '+78%',
        failureImpact: '+95%',
        latencyImpact: '+65%',
        description: 'Largest spike - accounting close drives massive volume',
        preparation: 'Add 50% server capacity, 24/7 ops coverage, preemptive partner notification',
      },
      {
        name: 'Year-End (Dec 31)',
        type: 'Recurring',
        volumeImpact: '+125%',
        failureImpact: '+140%',
        latencyImpact: '+95%',
        description: 'Annual peak - bonuses, tax planning, corporate settlements',
        preparation: 'Double infrastructure, freeze all changes, war room staffing',
      },
      {
        name: 'Black Friday (Nov 24)',
        type: 'Annual',
        volumeImpact: '+220%',
        failureImpact: '+180%',
        latencyImpact: '+145%',
        description: 'E-commerce surge drives payment volume spike',
        preparation: 'Load test 1 week prior, triple server capacity, retail payment priority',
      },
      {
        name: 'Chinese New Year (Feb 10)',
        type: 'Annual',
        volumeImpact: '+85%',
        failureImpact: '+45%',
        latencyImpact: '+55%',
        description: 'APAC remittance surge, especially CHN → Global',
        preparation: 'Increase APAC routing capacity, extend partner SLAs',
      },
    ],
    marketEvents: [
      {
        event: 'Fed Rate Decision',
        date: 'Every 6 weeks',
        impact: 'Medium',
        description: 'Currency volatility increases wire transfer volume',
        historicalChange: '+15-25% volume',
      },
      {
        event: 'Earnings Season',
        date: 'Quarterly',
        impact: 'High',
        description: 'Corporate dividend payments spike',
        historicalChange: '+40-60% volume',
      },
      {
        event: 'Brexit Referendum Anniversary',
        date: 'June 23',
        impact: 'Low',
        description: 'Minor GBP currency volatility',
        historicalChange: '+5-10% EUR/GBP corridor',
      },
    ],
    forecast: {
      nextMonthVolume: 172000,
      nextMonthFailures: 4100,
      confidence: 88,
      upcomingEvents: ['Month-End (Jan 31)', 'Chinese New Year (Feb 10)'],
      recommendation: 'Prepare for 35% volume increase - Q1 patterns + CNY impact',
    },
  };
};

const SeasonalityPage = () => {
  const [viewMode, setViewMode] = useState('volume');
  const [data] = useState(generateSeasonalityData());

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Seasonality & Event Impact Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Understand how time patterns and events impact payment volumes and failures
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>View Mode</InputLabel>
          <Select
            value={viewMode}
            label="View Mode"
            onChange={(e) => setViewMode(e.target.value)}
          >
            <MenuItem value="volume">Volume Trends</MenuItem>
            <MenuItem value="failures">Failure Patterns</MenuItem>
            <MenuItem value="latency">Latency Trends</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Forecast Alert */}
      <Alert severity="warning" sx={{ mb: 3 }} icon={<Event fontSize="large" />}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Next Month Forecast: {data.forecast.nextMonthVolume.toLocaleString()} payments
        </Typography>
        <Typography variant="body2">
          {data.forecast.recommendation} (Confidence: {data.forecast.confidence}%)
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Upcoming Events: {data.forecast.upcomingEvents.join(', ')}
        </Typography>
      </Alert>

      {/* Trend Chart */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📊 {viewMode === 'volume' ? 'Monthly Volume' : viewMode === 'failures' ? 'Failure' : 'Latency'} Trends
          </Typography>
          <Divider sx={{ my: 2 }} />

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.monthlyPatterns}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {viewMode === 'volume' && (
                <Line type="monotone" dataKey="volume" stroke="#8884d8" strokeWidth={2} name="Payment Volume" />
              )}
              {viewMode === 'failures' && (
                <Line type="monotone" dataKey="failures" stroke="#ff7300" strokeWidth={2} name="Failures" />
              )}
              {viewMode === 'latency' && (
                <Line type="monotone" dataKey="avgLatency" stroke="#82ca9d" strokeWidth={2} name="Avg Latency (s)" />
              )}
            </LineChart>
          </ResponsiveContainer>

          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              {viewMode === 'volume' && '📈 Peak months: March, June, October, December (+15-32% above baseline)'}
              {viewMode === 'failures' && '🔴 Failure rates spike during high-volume months (positive correlation)'}
              {viewMode === 'latency' && '⏱️ Latency degrades during volume surges - infrastructure scaling needed'}
            </Typography>
          </Alert>
        </CardContent>
      </Card>

      {/* Major Events Impact */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🎯 Major Events Impact Analysis
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            How holidays and fiscal events impact payment processing
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Volume Impact</TableCell>
                  <TableCell>Failure Impact</TableCell>
                  <TableCell>Latency Impact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.events.map((event, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarToday color="primary" fontSize="small" />
                        <Typography variant="body2" fontWeight={600}>
                          {event.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={event.type} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.volumeImpact}
                        size="small"
                        color={parseInt(event.volumeImpact) > 100 ? 'error' : parseInt(event.volumeImpact) > 50 ? 'warning' : 'success'}
                        icon={<TrendingUp />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.failureImpact}
                        size="small"
                        color="error"
                        icon={<Error />}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.latencyImpact}
                        size="small"
                        color="warning"
                        icon={<ShowChart />}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* Event Details */}
          <Grid container spacing={2}>
            {data.events.map((event, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                      {event.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {event.description}
                    </Typography>
                    <Alert severity="info" sx={{ mt: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        📋 Preparation Checklist:
                      </Typography>
                      <Typography variant="body2">
                        {event.preparation}
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Market Events */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📰 Market Event Impact Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Financial market events that influence payment volumes
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {data.marketEvents.map((event, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card sx={{ height: '100%', bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {event.event}
                      </Typography>
                      <Chip
                        label={event.impact}
                        size="small"
                        color={
                          event.impact === 'High' ? 'error' :
                          event.impact === 'Medium' ? 'warning' :
                          'success'
                        }
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <CalendarToday sx={{ fontSize: 14, mr: 0.5, verticalAlign: 'middle' }} />
                      {event.date}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                    <Box sx={{ p: 1, bgcolor: 'primary.light', borderRadius: 1 }}>
                      <Typography variant="caption" fontWeight={600} color="primary.contrastText">
                        Historical Impact: {event.historicalChange}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Planning Recommendations */}
      <Alert severity="success" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          📅 Planning & Forecasting Recommendations
        </Typography>
        <Typography variant="body2">
          • Q4 (Oct-Dec) requires 40% additional infrastructure capacity due to year-end surge
        </Typography>
        <Typography variant="body2">
          • Schedule all major system changes for low-volume months (Feb, May, Aug)
        </Typography>
        <Typography variant="body2">
          • Increase ops staffing 5 days before month-end, quarter-end, and year-end
        </Typography>
        <Typography variant="body2">
          • Set up automated alerts 2 weeks before major events (Black Friday, Chinese New Year)
        </Typography>
        <Typography variant="body2">
          • Review and update runbooks 1 month before peak seasons
        </Typography>
      </Alert>
    </Container>
  );
};

export default SeasonalityPage;
