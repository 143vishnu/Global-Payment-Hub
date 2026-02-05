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
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Fingerprint,
  Search,
  Warning,
  CheckCircle,
  ContentCopy,
  TrendingUp,
  Report,
} from '@mui/icons-material';

const generatePaymentDNA = (paymentId) => {
  const dnaHash = `DNA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  
  return {
    paymentId,
    dnaFingerprint: dnaHash,
    channelPattern: {
      source: 'API',
      route: 'Channel-A → Isolation → Graphite → Swift Network',
      protocol: 'ISO 20022',
      confidence: 98.5,
    },
    amountBehavior: {
      value: Math.floor(Math.random() * 100000) + 1000,
      currency: 'USD',
      pattern: 'Regular business transaction',
      riskScore: Math.floor(Math.random() * 30) + 10,
      historicalRange: '$1,000 - $150,000',
    },
    regionRouting: {
      from: 'United States (NY)',
      to: 'United Kingdom (London)',
      intermediary: 'JP Morgan Chase (Swift BIC: CHASUS33)',
      expectedPath: 'US-NY → SWIFT → UK-LON',
      actualPath: 'US-NY → SWIFT → UK-LON',
      pathMatch: true,
    },
    temporalPattern: {
      submittedTime: '09:45:23 EST',
      dayOfWeek: 'Tuesday',
      typicalHours: '09:00 - 17:00 EST',
      batchWindow: 'Morning batch (09:00-12:00)',
      anomaly: false,
    },
    similarPayments: [
      {
        id: 'PAY-12340',
        similarity: 98.5,
        status: 'Success',
        processedTime: '1.2s',
      },
      {
        id: 'PAY-12335',
        similarity: 96.2,
        status: 'Success',
        processedTime: '1.1s',
      },
      {
        id: 'PAY-12330',
        similarity: 94.8,
        status: 'Success',
        processedTime: '1.3s',
      },
    ],
    anomalies: [],
  };
};

const generateAnomalousPayment = (paymentId) => {
  const normal = generatePaymentDNA(paymentId);
  
  return {
    ...normal,
    amountBehavior: {
      ...normal.amountBehavior,
      value: 950000,
      pattern: 'Unusually high amount',
      riskScore: 85,
    },
    temporalPattern: {
      ...normal.temporalPattern,
      submittedTime: '02:15:33 EST',
      anomaly: true,
    },
    anomalies: [
      {
        type: 'Amount Anomaly',
        severity: 'high',
        description: 'Payment amount is 6.3x higher than historical average for this route',
        recommendation: 'Manual review recommended',
      },
      {
        type: 'Time Anomaly',
        severity: 'medium',
        description: 'Submitted outside typical business hours (02:15 AM)',
        recommendation: 'Verify legitimacy with sender',
      },
      {
        type: 'Velocity Anomaly',
        severity: 'medium',
        description: '3 similar high-value payments in last 30 minutes',
        recommendation: 'Check for duplicate submission',
      },
    ],
  };
};

const PaymentDNAPage = () => {
  const [paymentId, setPaymentId] = useState('');
  const [dnaData, setDnaData] = useState(null);
  const [duplicates, setDuplicates] = useState([]);

  const handleAnalyze = () => {
    const isAnomalous = Math.random() > 0.7;
    const data = isAnomalous ? generateAnomalousPayment(paymentId) : generatePaymentDNA(paymentId);
    setDnaData(data);

    // Check for duplicates
    if (Math.random() > 0.8) {
      setDuplicates([
        {
          id: 'PAY-12338',
          dnaMatch: 99.8,
          submittedTime: '2 minutes ago',
          status: 'Pending',
          action: 'Possible duplicate',
        },
      ]);
    } else {
      setDuplicates([]);
    }
  };

  const handleCopyDNA = () => {
    if (dnaData) {
      navigator.clipboard.writeText(dnaData.dnaFingerprint);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Payment DNA Fingerprint Analyzer
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Unique genetic fingerprint for every payment - detect duplicates and spot anomalies
        </Typography>
      </Box>

      {/* Search Box */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
            <TextField
              fullWidth
              label="Enter Payment ID"
              placeholder="e.g., PAY-12345"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
            />
            <Button
              variant="contained"
              startIcon={<Search />}
              onClick={handleAnalyze}
              sx={{ minWidth: 150, height: 56 }}
              disabled={!paymentId}
            >
              Analyze DNA
            </Button>
          </Box>
        </CardContent>
      </Card>

      {dnaData && (
        <>
          {/* DNA Fingerprint Card */}
          <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Fingerprint sx={{ fontSize: 48 }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Payment DNA Fingerprint
                  </Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {dnaData.dnaFingerprint}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Payment ID: {dnaData.paymentId}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyDNA}
                  sx={{ color: 'white', borderColor: 'white' }}
                >
                  Copy
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Duplicate Detection Alert */}
          {duplicates.length > 0 && (
            <Alert severity="error" sx={{ mb: 3 }} icon={<Warning />}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                🚨 Potential Duplicate Detected!
              </Typography>
              {duplicates.map((dup) => (
                <Box key={dup.id} sx={{ mt: 1 }}>
                  <Typography variant="body2">
                    Payment <strong>{dup.id}</strong> has {dup.dnaMatch}% DNA match
                  </Typography>
                  <Typography variant="caption">
                    Submitted {dup.submittedTime} • Status: {dup.status} • {dup.action}
                  </Typography>
                </Box>
              ))}
            </Alert>
          )}

          {/* Anomaly Alerts */}
          {dnaData.anomalies.length > 0 && (
            <Alert severity="warning" sx={{ mb: 3 }} icon={<Report />}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                ⚠️ Anomalies Detected in Payment Pattern
              </Typography>
              {dnaData.anomalies.map((anomaly, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <Chip
                    label={anomaly.type}
                    size="small"
                    color={anomaly.severity === 'high' ? 'error' : 'warning'}
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="body2" component="span">
                    {anomaly.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ ml: 1 }}>
                    💡 {anomaly.recommendation}
                  </Typography>
                </Box>
              ))}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Channel Pattern */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    📡 Channel Pattern
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Source</Typography>
                    <Typography variant="body1" fontWeight={600}>{dnaData.channelPattern.source}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Routing Path</Typography>
                    <Typography variant="body2">{dnaData.channelPattern.route}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Protocol</Typography>
                    <Typography variant="body1">{dnaData.channelPattern.protocol}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Pattern Confidence</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={dnaData.channelPattern.confidence}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {dnaData.channelPattern.confidence}%
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Amount Behavior */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    💰 Amount Behavior
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Transaction Value</Typography>
                    <Typography variant="h5" fontWeight={600}>
                      ${dnaData.amountBehavior.value.toLocaleString()} {dnaData.amountBehavior.currency}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Pattern Classification</Typography>
                    <Typography variant="body1">{dnaData.amountBehavior.pattern}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Historical Range</Typography>
                    <Typography variant="body2">{dnaData.amountBehavior.historicalRange}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Risk Score</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      <LinearProgress
                        variant="determinate"
                        value={dnaData.amountBehavior.riskScore}
                        color={dnaData.amountBehavior.riskScore > 70 ? 'error' : dnaData.amountBehavior.riskScore > 40 ? 'warning' : 'success'}
                        sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                      />
                      <Typography variant="body2" fontWeight={600}>
                        {dnaData.amountBehavior.riskScore}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Region Routing Path */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    🌍 Region Routing Path
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">From</Typography>
                    <Typography variant="body1" fontWeight={600}>{dnaData.regionRouting.from}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">To</Typography>
                    <Typography variant="body1" fontWeight={600}>{dnaData.regionRouting.to}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Intermediary Bank</Typography>
                    <Typography variant="body2">{dnaData.regionRouting.intermediary}</Typography>
                  </Box>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">Expected Path</Typography>
                    <Typography variant="body2">{dnaData.regionRouting.expectedPath}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Actual Path</Typography>
                    <Typography variant="body2">{dnaData.regionRouting.actualPath}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {dnaData.regionRouting.pathMatch ? (
                      <>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body2" color="success.main" fontWeight={600}>
                          Path matches expected route
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Warning color="error" fontSize="small" />
                        <Typography variant="body2" color="error.main" fontWeight={600}>
                          Path deviation detected
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Temporal Pattern */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    ⏰ Temporal Pattern
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Submission Time</Typography>
                    <Typography variant="body1" fontWeight={600}>
                      {dnaData.temporalPattern.submittedTime}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Day of Week</Typography>
                    <Typography variant="body1">{dnaData.temporalPattern.dayOfWeek}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Typical Business Hours</Typography>
                    <Typography variant="body2">{dnaData.temporalPattern.typicalHours}</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">Batch Window</Typography>
                    <Typography variant="body2">{dnaData.temporalPattern.batchWindow}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {!dnaData.temporalPattern.anomaly ? (
                      <>
                        <CheckCircle color="success" fontSize="small" />
                        <Typography variant="body2" color="success.main" fontWeight={600}>
                          Normal timing pattern
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Warning color="error" fontSize="small" />
                        <Typography variant="body2" color="error.main" fontWeight={600}>
                          Unusual timing detected
                        </Typography>
                      </>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Similar Payments */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <TrendingUp color="primary" />
                <Typography variant="h6">
                  Similar Payments (DNA Match)
                </Typography>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Payment ID</TableCell>
                      <TableCell>DNA Similarity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Processing Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dnaData.similarPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell>{payment.id}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={payment.similarity}
                              sx={{ width: 100, height: 6, borderRadius: 3 }}
                            />
                            <Typography variant="body2">{payment.similarity}%</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={payment.status}
                            size="small"
                            color={payment.status === 'Success' ? 'success' : 'error'}
                          />
                        </TableCell>
                        <TableCell>{payment.processedTime}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              🤖 AI Insights
            </Typography>
            <Typography variant="body2">
              • This payment matches the typical DNA pattern for USD → GBP transfers via SWIFT
            </Typography>
            <Typography variant="body2">
              • 98.5% similarity with {dnaData.similarPayments.length} recent successful payments
            </Typography>
            <Typography variant="body2">
              • {dnaData.anomalies.length === 0 
                ? 'No anomalies detected - payment is following expected behavior'
                : `${dnaData.anomalies.length} anomalies detected - manual review recommended`}
            </Typography>
          </Alert>
        </>
      )}
    </Container>
  );
};

export default PaymentDNAPage;
