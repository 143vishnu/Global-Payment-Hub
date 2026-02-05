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
  LinearProgress,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Warning,
  Flag,
  TrendingUp,
  Security,
  Gavel,
  MoneyOff,
} from '@mui/icons-material';

const generateRiskData = () => {
  return {
    overallRiskLevel: 'Medium',
    highRiskCountries: [
      {
        country: 'Country A',
        riskScore: 85,
        volume: 1250,
        volumeChange: 145,
        flags: ['Sudden volume spike', 'New routing pattern', 'Unusual transaction times'],
        complianceIssues: ['AML screening required', 'Sanctions list check'],
        recommendation: 'Increase monitoring frequency, require manual approval for >$50k',
      },
      {
        country: 'Country B',
        riskScore: 72,
        volume: 890,
        volumeChange: 78,
        flags: ['High-value transactions increasing', 'Multiple sender IDs'],
        complianceIssues: ['KYC documentation outdated'],
        recommendation: 'Update KYC records, implement velocity checks',
      },
      {
        country: 'Country C',
        riskScore: 68,
        volume: 2340,
        volumeChange: -45,
        flags: ['Unusual decline in volume'],
        complianceIssues: ['Regulatory changes pending'],
        recommendation: 'Monitor for regulatory updates, prepare for new requirements',
      },
      {
        country: 'Country D',
        riskScore: 55,
        volume: 450,
        volumeChange: 230,
        flags: ['New correspondent bank', 'Volume spike +230%'],
        complianceIssues: ['Correspondent bank due diligence needed'],
        recommendation: 'Complete enhanced due diligence on new banking relationship',
      },
    ],
    volumeSpikes: [
      {
        region: 'Middle East',
        spike: '+340%',
        reason: 'New large corporate client onboarded',
        riskLevel: 'High',
        action: 'Enhanced monitoring for 90 days',
      },
      {
        region: 'Eastern Europe',
        spike: '+180%',
        reason: 'Seasonal remittance pattern',
        riskLevel: 'Low',
        action: 'Normal monitoring',
      },
      {
        region: 'Southeast Asia',
        spike: '+95%',
        reason: 'Unknown - requires investigation',
        riskLevel: 'Critical',
        action: 'Immediate review required',
      },
    ],
    complianceAlerts: [
      {
        type: 'Sanctions Screening',
        count: 12,
        severity: 'Critical',
        description: '12 payments flagged for potential sanctions violations',
        status: 'Under Review',
      },
      {
        type: 'AML Threshold',
        count: 45,
        severity: 'High',
        description: 'Accounts exceeding monthly AML reporting threshold',
        status: 'Reporting Required',
      },
      {
        type: 'KYC Expiry',
        count: 128,
        severity: 'Medium',
        description: 'Customer KYC documents expiring within 30 days',
        status: 'Refresh Needed',
      },
      {
        type: 'Unusual Pattern',
        count: 8,
        severity: 'High',
        description: 'Transactions with unusual patterns detected by ML model',
        status: 'Investigation Required',
      },
    ],
  };
};

const RegulatoryRiskPage = () => {
  const [timeRange, setTimeRange] = useState('month');
  const [riskData] = useState(generateRiskData());

  const getRiskColor = (score) => {
    if (score >= 70) return 'error';
    if (score >= 50) return 'warning';
    return 'success';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Regulatory Risk Radar
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor high-risk countries, volume spikes, and compliance issues
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

      {/* Overall Risk Alert */}
      <Alert
        severity={riskData.overallRiskLevel === 'High' ? 'error' : riskData.overallRiskLevel === 'Medium' ? 'warning' : 'success'}
        sx={{ mb: 3 }}
        icon={<Security fontSize="large" />}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Overall Regulatory Risk Level: {riskData.overallRiskLevel}
        </Typography>
        <Typography variant="body2">
          {riskData.complianceAlerts.filter(a => a.severity === 'Critical').length} critical compliance alerts requiring immediate attention
        </Typography>
      </Alert>

      {/* High-Risk Countries */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            🚨 High-Risk Countries Monitoring
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Countries flagged for increased regulatory risk
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Country</TableCell>
                  <TableCell>Risk Score</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="right">Change</TableCell>
                  <TableCell>Flags</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {riskData.highRiskCountries.map((country, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Flag color="error" />
                        <Typography variant="body2" fontWeight={600}>
                          {country.country}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ minWidth: 120 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" fontWeight="bold">
                            {country.riskScore}/100
                          </Typography>
                          <Chip
                            label={country.riskScore >= 70 ? 'High' : country.riskScore >= 50 ? 'Medium' : 'Low'}
                            size="small"
                            color={getRiskColor(country.riskScore)}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={country.riskScore}
                          color={getRiskColor(country.riskScore)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">
                        {country.volume.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={country.volumeChange > 0 ? `+${country.volumeChange}` : country.volumeChange}
                        size="small"
                        color={Math.abs(country.volumeChange) > 100 ? 'error' : 'default'}
                        icon={country.volumeChange > 0 ? <TrendingUp /> : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {country.flags.slice(0, 2).map((flag, idx) => (
                          <Chip key={idx} label={flag} size="small" color="warning" />
                        ))}
                        {country.flags.length > 2 && (
                          <Chip label={`+${country.flags.length - 2}`} size="small" variant="outlined" />
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 3 }} />

          {/* Country Details */}
          <Grid container spacing={2}>
            {riskData.highRiskCountries.map((country, index) => (
              <Grid item xs={12} key={index}>
                <Alert severity="error">
                  <Typography variant="body2" fontWeight={600} gutterBottom>
                    {country.country} - Risk Score: {country.riskScore}/100
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom>
                    Compliance Issues:
                  </Typography>
                  {country.complianceIssues.map((issue, idx) => (
                    <Typography key={idx} variant="caption" display="block">
                      • {issue}
                    </Typography>
                  ))}
                  <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 600 }}>
                    💡 Recommendation: {country.recommendation}
                  </Typography>
                </Alert>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Volume Spikes */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            📈 Volume Spike Alerts
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Unusual volume increases that may indicate compliance risks
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {riskData.volumeSpikes.map((spike, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    bgcolor: spike.riskLevel === 'Critical' ? 'error.light' : spike.riskLevel === 'High' ? 'warning.light' : 'success.light',
                    color: spike.riskLevel === 'Critical' ? 'error.contrastText' : spike.riskLevel === 'High' ? 'warning.contrastText' : 'success.contrastText',
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {spike.region}
                      </Typography>
                      <Chip
                        label={spike.riskLevel}
                        size="small"
                        color={spike.riskLevel === 'Critical' ? 'error' : spike.riskLevel === 'High' ? 'warning' : 'success'}
                      />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      {spike.spike}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
                      Reason: {spike.reason}
                    </Typography>
                    <Alert severity={spike.riskLevel === 'Critical' ? 'error' : 'info'} sx={{ mt: 2 }}>
                      <Typography variant="caption" fontWeight={600}>
                        {spike.action}
                      </Typography>
                    </Alert>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Compliance Alerts */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ⚖️ Compliance Alerts Dashboard
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {riskData.complianceAlerts.map((alert, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {alert.type === 'Sanctions Screening' && <Gavel color="error" />}
                        {alert.type === 'AML Threshold' && <MoneyOff color="warning" />}
                        {alert.type === 'KYC Expiry' && <Security color="info" />}
                        {alert.type === 'Unusual Pattern' && <Warning color="warning" />}
                        <Typography variant="h6" fontWeight="bold">
                          {alert.type}
                        </Typography>
                      </Box>
                      <Chip
                        label={alert.severity}
                        size="small"
                        color={
                          alert.severity === 'Critical' ? 'error' :
                          alert.severity === 'High' ? 'warning' :
                          'default'
                        }
                      />
                    </Box>

                    <Typography variant="h4" fontWeight="bold" color="error" gutterBottom>
                      {alert.count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {alert.description}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Chip label={alert.status} size="small" color="primary" />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Overall Recommendations */}
      <Alert severity="warning" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          🎯 Priority Actions
        </Typography>
        <Typography variant="body2">
          • Immediate: Review 12 sanctions-flagged payments (Critical severity)
        </Typography>
        <Typography variant="body2">
          • Immediate: Investigate Southeast Asia volume spike (+95%, unknown cause)
        </Typography>
        <Typography variant="body2">
          • This Week: Complete enhanced due diligence on Country D correspondent bank
        </Typography>
        <Typography variant="body2">
          • This Month: Refresh 128 expiring KYC documents
        </Typography>
        <Typography variant="body2">
          • Ongoing: Increase monitoring frequency for Country A (risk score: 85)
        </Typography>
      </Alert>
    </Container>
  );
};

export default RegulatoryRiskPage;
