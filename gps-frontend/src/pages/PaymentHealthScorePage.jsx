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
  Warning,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';

// Mock health score data generator
const generateHealthScores = () => {
  const regions = ['NA', 'EU', 'APAC', 'LATAM', 'MEA'];
  const channels = ['Mobile', 'Web', 'API', 'Branch'];
  
  return regions.map(region => ({
    region,
    overallScore: Math.floor(Math.random() * 30) + 70,
    metrics: {
      validationQuality: Math.floor(Math.random() * 20) + 80,
      routingSuccess: Math.floor(Math.random() * 15) + 85,
      slaBreach: Math.floor(Math.random() * 30) + 70,
      processingSpeed: Math.floor(Math.random() * 25) + 75,
    },
    channels: channels.map(channel => ({
      name: channel,
      score: Math.floor(Math.random() * 30) + 70,
      volume: Math.floor(Math.random() * 5000) + 1000,
    })),
    riskPayments: Math.floor(Math.random() * 50) + 10,
    trend: Math.random() > 0.5 ? 'up' : 'down',
  }));
};

const getScoreColor = (score) => {
  if (score >= 90) return 'success';
  if (score >= 75) return 'primary';
  if (score >= 60) return 'warning';
  return 'error';
};

const getScoreIcon = (score) => {
  if (score >= 90) return <CheckCircle sx={{ color: 'success.main' }} />;
  if (score >= 75) return <TrendingUp sx={{ color: 'primary.main' }} />;
  if (score >= 60) return <Warning sx={{ color: 'warning.main' }} />;
  return <ErrorIcon sx={{ color: 'error.main' }} />;
};

const PaymentHealthScorePage = () => {
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    setHealthData(generateHealthScores());
    // Simulate real-time updates
    const interval = setInterval(() => {
      setHealthData(generateHealthScores());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const displayData = selectedRegion === 'ALL' 
    ? healthData 
    : healthData.filter(d => d.region === selectedRegion);

  const globalScore = Math.floor(
    healthData.reduce((sum, d) => sum + d.overallScore, 0) / healthData.length
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {getScoreIcon(globalScore)}
          Payment Health Score Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-powered health monitoring across regions and channels
        </Typography>
      </Box>

      {/* Global Score */}
      <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={12} md={8}>
              <Typography variant="h6" gutterBottom>Global Payment Health</Typography>
              <Typography variant="h2" fontWeight="bold">{globalScore}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                Based on validation quality, routing success, SLA compliance, and processing speed
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Chip 
                  label={`${healthData.reduce((sum, d) => sum + d.riskPayments, 0)} High-Risk Payments`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 600, mb: 1 }}
                />
                <Typography variant="caption" display="block">Requires immediate attention</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Region Filter</InputLabel>
          <Select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            label="Region Filter"
          >
            <MenuItem value="ALL">All Regions</MenuItem>
            {healthData.map(d => (
              <MenuItem key={d.region} value={d.region}>{d.region}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Regional Heatmap */}
      <Grid container spacing={3}>
        {displayData.map((regionData) => (
          <Grid item xs={12} lg={6} key={regionData.region}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {regionData.region}
                    </Typography>
                    <Chip 
                      label={`Score: ${regionData.overallScore}`}
                      color={getScoreColor(regionData.overallScore)}
                      size="small"
                    />
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    {regionData.trend === 'up' ? (
                      <TrendingUp sx={{ color: 'success.main', fontSize: 32 }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main', fontSize: 32 }} />
                    )}
                    <Typography variant="caption" display="block" color="text.secondary">
                      {regionData.riskPayments} at risk
                    </Typography>
                  </Box>
                </Box>

                {/* Metrics Breakdown */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Health Metrics
                  </Typography>
                  
                  {Object.entries(regionData.metrics).map(([key, value]) => (
                    <Box key={key} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {value}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={value} 
                        color={getScoreColor(value)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Channel Performance */}
                <Box>
                  <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                    Channel Performance
                  </Typography>
                  <Grid container spacing={1}>
                    {regionData.channels.map((channel) => (
                      <Grid item xs={6} key={channel.name}>
                        <Card variant="outlined" sx={{ p: 1.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {channel.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="h6" fontWeight="bold">
                              {channel.score}
                            </Typography>
                            <Chip 
                              label={channel.volume.toLocaleString()}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.7rem' }}
                            />
                          </Box>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Priority Alert */}
      {healthData.some(d => d.overallScore < 70) && (
        <Alert severity="warning" sx={{ mt: 3 }}>
          <Typography variant="body2" fontWeight={600}>
            ⚠️ Priority Action Required
          </Typography>
          <Typography variant="body2">
            {healthData.filter(d => d.overallScore < 70).length} region(s) have health scores below 70. 
            Review high-risk payments immediately.
          </Typography>
        </Alert>
      )}
    </Container>
  );
};

export default PaymentHealthScorePage;
