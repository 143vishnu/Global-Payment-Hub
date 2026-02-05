import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  SentimentVeryDissatisfied,
  SentimentDissatisfied,
  SentimentNeutral,
  SentimentSatisfied,
  SentimentVerySatisfied,
  Schedule,
  Block,
  TrendingDown,
} from '@mui/icons-material';

const generateCXData = () => {
  return {
    overallScore: 72,
    regions: [
      {
        name: 'North America',
        score: 85,
        delays: 245,
        rejections: 89,
        avgDelayTime: '1.2 hours',
        topIssue: 'Minor timeout issues during peak hours',
      },
      {
        name: 'Europe',
        score: 78,
        delays: 420,
        rejections: 156,
        avgDelayTime: '2.1 hours',
        topIssue: 'SEPA routing delays on weekends',
      },
      {
        name: 'APAC',
        score: 65,
        delays: 890,
        rejections: 342,
        avgDelayTime: '3.8 hours',
        topIssue: 'High intermediary delays for cross-border payments',
      },
      {
        name: 'LATAM',
        score: 52,
        delays: 1250,
        rejections: 567,
        avgDelayTime: '5.2 hours',
        topIssue: 'Compliance validation causing significant delays',
      },
      {
        name: 'MEA',
        score: 48,
        delays: 1420,
        rejections: 678,
        avgDelayTime: '6.1 hours',
        topIssue: 'Limited banking infrastructure and high rejection rates',
      },
    ],
    painPoints: [
      {
        category: 'Delays',
        impact: 'High',
        affectedCustomers: 4225,
        avgImpact: '3.8 hours wait time',
        trend: 'increasing',
      },
      {
        category: 'Rejections',
        impact: 'Critical',
        affectedCustomers: 1832,
        avgImpact: 'Payment failed, manual resubmission required',
        trend: 'stable',
      },
      {
        category: 'Retries Needed',
        impact: 'Medium',
        affectedCustomers: 945,
        avgImpact: '2.3 retry attempts on average',
        trend: 'decreasing',
      },
      {
        category: 'Timeout Errors',
        impact: 'High',
        affectedCustomers: 678,
        avgImpact: 'Complete transaction restart needed',
        trend: 'increasing',
      },
    ],
  };
};

const CustomerExperiencePage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [cxData] = useState(generateCXData());

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return <SentimentVerySatisfied sx={{ fontSize: 48 }} />;
    if (score >= 70) return <SentimentSatisfied sx={{ fontSize: 48 }} />;
    if (score >= 60) return <SentimentNeutral sx={{ fontSize: 48 }} />;
    if (score >= 50) return <SentimentDissatisfied sx={{ fontSize: 48 }} />;
    return <SentimentVeryDissatisfied sx={{ fontSize: 48 }} />;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Customer Experience Proxy Score
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Estimate customer satisfaction without direct feedback - based on delays and rejections
          </Typography>
        </Box>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">This Week</MenuItem>
            <MenuItem value="month">This Month</MenuItem>
            <MenuItem value="quarter">This Quarter</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Overall Score */}
      <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={3} sx={{ textAlign: 'center' }}>
              <Box sx={{ color: getScoreColor(cxData.overallScore) }}>
                {getScoreIcon(cxData.overallScore)}
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {cxData.overallScore}/100
              </Typography>
              <Typography variant="h6" gutterBottom>
                Overall Customer Experience Score
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Based on {cxData.painPoints.reduce((sum, p) => sum + p.affectedCustomers, 0).toLocaleString()} customer touchpoints this month
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Score Interpretation */}
      <Alert severity={cxData.overallScore >= 70 ? 'success' : cxData.overallScore >= 50 ? 'warning' : 'error'} sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          {cxData.overallScore >= 70 && '✅ Good Customer Experience'}
          {cxData.overallScore >= 50 && cxData.overallScore < 70 && '⚠️ Customer Experience Needs Improvement'}
          {cxData.overallScore < 50 && '🚨 Poor Customer Experience - Immediate Action Required'}
        </Typography>
        <Typography variant="body2">
          {cxData.overallScore >= 70 && 'Most customers are experiencing smooth payment processing with minimal delays'}
          {cxData.overallScore >= 50 && cxData.overallScore < 70 && 'Customers are experiencing moderate delays and some rejections that impact satisfaction'}
          {cxData.overallScore < 50 && 'Customers are facing significant pain points - high delays and rejections are severely impacting satisfaction'}
        </Typography>
      </Alert>

      {/* Regional Heatmap */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🗺️ Regional Customer Experience Heatmap
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {cxData.regions.map((region, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    bgcolor: region.score >= 80 ? 'success.light' : region.score >= 60 ? 'warning.light' : 'error.light',
                    color: region.score >= 80 ? 'success.contrastText' : region.score >= 60 ? 'warning.contrastText' : 'error.contrastText',
                  }}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Typography variant="h6" fontWeight="bold">
                          {region.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                          {getScoreIcon(region.score)}
                          <Typography variant="h4" fontWeight="bold">
                            {region.score}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              Delays
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Schedule sx={{ fontSize: 20 }} />
                              <Typography variant="h6" fontWeight="bold">
                                {region.delays}
                              </Typography>
                            </Box>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                              Avg: {region.avgDelayTime}
                            </Typography>
                          </Grid>

                          <Grid item xs={6} md={3}>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              Rejections
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Block sx={{ fontSize: 20 }} />
                              <Typography variant="h6" fontWeight="bold">
                                {region.rejections}
                              </Typography>
                            </Box>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              Top Issue
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {region.topIssue}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        Customer Satisfaction
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={region.score}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: 'rgba(255,255,255,0.3)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Pain Points */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            😰 Customer Pain Points Analysis
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {cxData.painPoints.map((pain, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {pain.category}
                      </Typography>
                      <Chip
                        label={pain.impact}
                        size="small"
                        color={
                          pain.impact === 'Critical' ? 'error' :
                          pain.impact === 'High' ? 'warning' :
                          'default'
                        }
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Affected Customers
                        </Typography>
                        <Typography variant="h6" fontWeight="bold">
                          {pain.affectedCustomers.toLocaleString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">
                          Trend
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          {pain.trend === 'increasing' && (
                            <>
                              <TrendingDown sx={{ color: 'error.main', fontSize: 20 }} />
                              <Typography variant="body2" color="error.main" fontWeight={600}>
                                Increasing
                              </Typography>
                            </>
                          )}
                          {pain.trend === 'decreasing' && (
                            <>
                              <TrendingDown sx={{ color: 'success.main', fontSize: 20, transform: 'rotate(180deg)' }} />
                              <Typography variant="body2" color="success.main" fontWeight={600}>
                                Decreasing
                              </Typography>
                            </>
                          )}
                          {pain.trend === 'stable' && (
                            <Typography variant="body2" color="text.secondary" fontWeight={600}>
                              Stable
                            </Typography>
                          )}
                        </Box>
                      </Grid>
                    </Grid>

                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="caption" fontWeight={600}>
                        Customer Impact
                      </Typography>
                      <Typography variant="body2">
                        {pain.avgImpact}
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          💡 Recommendations to Improve Customer Experience
        </Typography>
        <Typography variant="body2">
          • Focus on MEA and LATAM regions - lowest scores (48-52) require immediate attention
        </Typography>
        <Typography variant="body2">
          • Reduce APAC delays - 3.8 hour average wait time is above acceptable threshold
        </Typography>
        <Typography variant="body2">
          • Address rejection rates - 1,832 customers experiencing failed payments monthly
        </Typography>
        <Typography variant="body2">
          • Optimize timeout handling - complete transaction restarts hurt customer satisfaction
        </Typography>
      </Alert>
    </Container>
  );
};

export default CustomerExperiencePage;
