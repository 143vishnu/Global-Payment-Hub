import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Warning,
  Error as ErrorIcon,
  Schedule,
} from '@mui/icons-material';

const generateSLAData = (timeframe) => {
  const baseConfidence = 87.5;
  const variance = Math.random() * 10 - 5;
  
  return {
    overall: {
      confidenceScore: Math.max(0, Math.min(100, baseConfidence + variance)),
      predictedSLAMet: true,
      riskLevel: baseConfidence + variance > 85 ? 'low' : baseConfidence + variance > 70 ? 'medium' : 'high',
      trend: variance > 0 ? 'improving' : 'declining',
    },
    metrics: [
      {
        name: 'Processing Time SLA',
        target: '< 2 seconds',
        currentAvg: 1.45,
        predicted: 1.52,
        confidence: 92,
        onTrack: true,
      },
      {
        name: 'Success Rate SLA',
        target: '> 99%',
        currentAvg: 99.2,
        predicted: 99.1,
        confidence: 88,
        onTrack: true,
      },
      {
        name: 'Settlement Time SLA',
        target: '< 24 hours',
        currentAvg: 18.5,
        predicted: 19.2,
        confidence: 85,
        onTrack: true,
      },
      {
        name: 'Exception Resolution SLA',
        target: '< 4 hours',
        currentAvg: 3.8,
        predicted: 4.2,
        confidence: 72,
        onTrack: false,
      },
    ],
    historicalPerformance: [
      { day: 'Mon', met: true, score: 94 },
      { day: 'Tue', met: true, score: 91 },
      { day: 'Wed', met: true, score: 88 },
      { day: 'Thu', met: false, score: 68 },
      { day: 'Fri', met: true, score: 89 },
      { day: 'Sat', met: true, score: 95 },
      { day: 'Sun', met: true, score: 92 },
    ],
    riskFactors: [
      {
        factor: 'High payment volume expected (15% above average)',
        impact: 'medium',
        probability: 78,
      },
      {
        factor: 'Scheduled maintenance window (EU gateway)',
        impact: 'high',
        probability: 100,
      },
      {
        factor: 'Month-end processing surge anticipated',
        impact: 'medium',
        probability: 85,
      },
      {
        factor: 'Partner bank API latency trending up',
        impact: 'low',
        probability: 62,
      },
    ],
    mitigationActions: [
      {
        action: 'Pre-allocate additional processing capacity',
        status: 'recommended',
        impact: '+12% confidence',
      },
      {
        action: 'Route EU traffic through backup gateway',
        status: 'in-progress',
        impact: '+8% confidence',
      },
      {
        action: 'Enable batch processing optimization',
        status: 'recommended',
        impact: '+5% confidence',
      },
    ],
  };
};

const SLAConfidencePage = () => {
  const [timeframe, setTimeframe] = useState('today');
  const [data, setData] = useState(generateSLAData('today'));
  const [autoRefresh] = useState(true);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setData(generateSLAData(timeframe));
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, timeframe]);

  const getConfidenceColor = (score) => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getRiskIcon = (level) => {
    if (level === 'low') return <CheckCircle color="success" />;
    if (level === 'medium') return <Warning color="warning" />;
    return <ErrorIcon color="error" />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            SLA Confidence Index
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Predict probability of meeting daily SLAs using historical + real-time data
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Timeframe</InputLabel>
          <Select 
            value={timeframe} 
            onChange={(e) => setTimeframe(e.target.value)}
            label="Timeframe"
          >
            <MenuItem value="today">Today</MenuItem>
            <MenuItem value="tomorrow">Tomorrow</MenuItem>
            <MenuItem value="week">This Week</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overall Confidence Score */}
      <Card sx={{ mb: 3, bgcolor: getConfidenceColor(data.overall.confidenceScore) + '.main', color: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Box>
              <Typography variant="h2" fontWeight="bold">
                {data.overall.confidenceScore.toFixed(1)}%
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                SLA Confidence Score
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
                <Chip 
                  label={data.overall.predictedSLAMet ? 'On Track' : 'At Risk'}
                  sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                />
                <Chip 
                  label={`${data.overall.riskLevel.toUpperCase()} RISK`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {data.overall.trend === 'improving' ? <TrendingUp /> : <TrendingDown />}
                  <Typography variant="body2">{data.overall.trend}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Based on current trends, historical patterns, and identified risk factors
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* SLA Metrics Breakdown */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Individual SLA Metrics
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Metric</TableCell>
                  <TableCell>Target</TableCell>
                  <TableCell align="right">Current</TableCell>
                  <TableCell align="right">Predicted</TableCell>
                  <TableCell align="center">Confidence</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.metrics.map((metric) => (
                  <TableRow key={metric.name}>
                    <TableCell>{metric.name}</TableCell>
                    <TableCell>{metric.target}</TableCell>
                    <TableCell align="right">
                      {typeof metric.currentAvg === 'number' && metric.currentAvg < 10
                        ? `${metric.currentAvg}s`
                        : metric.currentAvg < 100
                        ? `${metric.currentAvg}h`
                        : `${metric.currentAvg}%`}
                    </TableCell>
                    <TableCell align="right" fontWeight={600}>
                      {typeof metric.predicted === 'number' && metric.predicted < 10
                        ? `${metric.predicted}s`
                        : metric.predicted < 100
                        ? `${metric.predicted}h`
                        : `${metric.predicted}%`}
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center' }}>
                        <LinearProgress
                          variant="determinate"
                          value={metric.confidence}
                          color={getConfidenceColor(metric.confidence)}
                          sx={{ width: 60, height: 6, borderRadius: 3 }}
                        />
                        <Typography variant="caption">{metric.confidence}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {metric.onTrack ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Warning color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Historical Performance */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                7-Day Historical Performance
              </Typography>
              {data.historicalPerformance.map((day) => (
                <Box key={day.day} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography variant="body2">{day.day}</Typography>
                      {day.met ? (
                        <CheckCircle color="success" fontSize="small" />
                      ) : (
                        <ErrorIcon color="error" fontSize="small" />
                      )}
                    </Box>
                    <Typography variant="body2" fontWeight={600}>
                      {day.score}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={day.score}
                    color={getConfidenceColor(day.score)}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Risk Factors */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="warning.main">
                ⚠️ Identified Risk Factors
              </Typography>
              {data.riskFactors.map((risk, index) => (
                <Alert
                  key={index}
                  severity={risk.impact === 'high' ? 'error' : risk.impact === 'medium' ? 'warning' : 'info'}
                  sx={{ mb: 2 }}
                  icon={getRiskIcon(risk.impact)}
                >
                  <Typography variant="body2" gutterBottom>
                    {risk.factor}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip label={`${risk.impact.toUpperCase()} impact`} size="small" />
                    <Chip label={`${risk.probability}% probability`} size="small" />
                  </Box>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Mitigation Actions */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="success.main">
            ✅ Recommended Mitigation Actions
          </Typography>
          {data.mitigationActions.map((action, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                mb: 2,
                bgcolor: 'grey.50',
                borderRadius: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {action.action}
                </Typography>
                <Chip
                  label={action.status.toUpperCase()}
                  size="small"
                  color={action.status === 'in-progress' ? 'primary' : 'default'}
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Chip
                label={action.impact}
                color="success"
                icon={<TrendingUp />}
              />
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Alert severity="info" sx={{ mt: 3 }} icon={<Schedule />}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          🤖 AI-Powered Prediction
        </Typography>
        <Typography variant="body2">
          • Current confidence score: {data.overall.confidenceScore.toFixed(1)}% (
          {data.overall.riskLevel === 'low' ? 'Low risk' : data.overall.riskLevel === 'medium' ? 'Medium risk' : 'High risk'})
        </Typography>
        <Typography variant="body2">
          • With recommended mitigations, confidence could improve to {(data.overall.confidenceScore + 25).toFixed(1)}%
        </Typography>
        <Typography variant="body2">
          • Most critical metric at risk: Exception Resolution SLA (72% confidence)
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: 600 }}>
          {data.overall.confidenceScore >= 85
            ? '✅ Safe to proceed - SLA targets likely to be met'
            : data.overall.confidenceScore >= 70
            ? '⚠️ Caution - Implement recommended mitigations'
            : '🚨 High risk - Immediate action required'}
        </Typography>
      </Alert>
    </Container>
  );
};

export default SLAConfidencePage;
