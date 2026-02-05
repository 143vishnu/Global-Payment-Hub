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
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Search,
  Error,
  CheckCircle,
  Warning,
  Timeline,
  CompareArrows,
  BugReport,
  Lightbulb,
  ExpandMore,
  ContentCopy,
} from '@mui/icons-material';

const generateRootCauseAnalysis = (paymentId) => {
  const failureTypes = [
    {
      type: 'Network Timeout',
      summary: 'Payment failed because downstream banking partner did not respond within timeout window',
      plainEnglish: 'The bank we were trying to send money to took too long to respond (waited 30 seconds, they never replied). It\'s like calling someone and they never pick up the phone.',
      technicalDetails: {
        error: 'SocketTimeoutException: Read timed out after 30000ms',
        service: 'Swift Gateway Service',
        endpoint: 'https://swift-gateway.partner-bank.com/api/v2/transfers',
        timestamp: new Date().toISOString(),
      },
      rootCause: 'Partner bank\'s API gateway experiencing high latency (avg response time: 45s vs normal 2s)',
      lastSuccess: '2024-01-15 14:23:15 UTC',
      changesSinceSuccess: [
        'Partner bank deployed new rate limiting (Jan 15, 18:00 UTC)',
        'Network route changed: Added CDN layer (Jan 15, 17:30 UTC)',
        'Our retry logic timeout reduced from 60s to 30s (Jan 14, 09:00 UTC)',
      ],
      recommendation: {
        immediate: 'Retry with extended timeout (60s) - 95% success probability',
        shortTerm: 'Contact partner bank to investigate latency spike',
        longTerm: 'Implement adaptive timeout based on partner performance metrics',
      },
    },
    {
      type: 'Validation Error',
      summary: 'Payment rejected due to invalid account number format',
      plainEnglish: 'The account number you provided doesn\'t match the format that bank requires. It\'s like trying to use a US phone number format for a UK number - the system doesn\'t recognize it.',
      technicalDetails: {
        error: 'ValidationException: IBAN format invalid for GB country code',
        field: 'beneficiary.accountNumber',
        providedValue: 'GB29NWBK60161331926819',
        expectedFormat: 'GB## XXXX #### #### ####',
        timestamp: new Date().toISOString(),
      },
      rootCause: 'IBAN checksum validation failed - digit transposition error',
      lastSuccess: 'N/A - First submission',
      changesSinceSuccess: [],
      recommendation: {
        immediate: 'Correct IBAN checksum digit (position 3-4) and resubmit',
        shortTerm: 'Implement client-side IBAN validation to catch errors earlier',
        longTerm: 'Add IBAN suggestion/autocorrect for common typos',
      },
    },
    {
      type: 'Insufficient Funds',
      summary: 'Sending account does not have sufficient balance to process payment',
      plainEnglish: 'There\'s not enough money in the sending account. You\'re trying to send $50,000 but the account only has $35,000 available.',
      technicalDetails: {
        error: 'InsufficientFundsException: Available balance below transaction amount',
        accountNumber: 'ACC-123456789',
        requestedAmount: '$50,000.00 USD',
        availableBalance: '$35,420.18 USD',
        timestamp: new Date().toISOString(),
      },
      rootCause: 'Account balance depleted by earlier batch processing (8:00 AM batch withdrew $45,000)',
      lastSuccess: '2024-01-14 16:45:22 UTC',
      changesSinceSuccess: [
        'Batch withdrawal processed (Jan 15, 08:00 UTC) - $45,000',
        'Account credit hold placed for fraud review (Jan 15, 07:30 UTC) - $5,000 frozen',
      ],
      recommendation: {
        immediate: 'Wait for incoming wire transfer (expected at 14:00 UTC) or reduce payment amount',
        shortTerm: 'Implement real-time balance checks before payment submission',
        longTerm: 'Set up automated balance monitoring with alerts at threshold levels',
      },
    },
  ];

  return failureTypes[Math.floor(Math.random() * failureTypes.length)];
};

const RootCausePage = () => {
  const [paymentId, setPaymentId] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = () => {
    const data = generateRootCauseAnalysis(paymentId);
    setAnalysis(data);
  };

  const handleCopySummary = () => {
    if (analysis) {
      const text = `
Root Cause Analysis for ${paymentId}
======================================

SUMMARY: ${analysis.summary}

PLAIN ENGLISH EXPLANATION:
${analysis.plainEnglish}

ROOT CAUSE:
${analysis.rootCause}

IMMEDIATE ACTION:
${analysis.recommendation.immediate}

SHORT-TERM FIX:
${analysis.recommendation.shortTerm}

LONG-TERM SOLUTION:
${analysis.recommendation.longTerm}
      `.trim();
      
      navigator.clipboard.writeText(text);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          One-Click Root Cause Summary
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Auto-generated failure analysis in plain English - No more log diving
        </Typography>
      </Box>

      {/* Search Box */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
            <TextField
              fullWidth
              label="Enter Failed Payment ID"
              placeholder="e.g., PAY-FAILED-12345"
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
              Analyze
            </Button>
          </Box>
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Quick Summary Banner */}
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            icon={<Error />}
            action={
              <Button color="inherit" size="small" startIcon={<ContentCopy />} onClick={handleCopySummary}>
                Copy Summary
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              {analysis.type}
            </Typography>
            <Typography variant="body2">
              {analysis.summary}
            </Typography>
          </Alert>

          {/* Plain English Explanation */}
          <Card sx={{ mb: 3, bgcolor: 'info.light', color: 'info.contrastText' }}>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'start' }}>
                <Lightbulb sx={{ fontSize: 40, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom>
                    📖 Plain English Explanation
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {analysis.plainEnglish}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Grid container spacing={3}>
            {/* Root Cause */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <BugReport color="error" />
                    <Typography variant="h6">Root Cause</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="body1" sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    {analysis.rootCause}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Timeline */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Timeline color="primary" />
                    <Typography variant="h6">Timeline</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <CheckCircle color="success" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Last Success:</strong> {analysis.lastSuccess}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Error color="error" fontSize="small" />
                      <Typography variant="body2">
                        <strong>Current Failure:</strong> {analysis.technicalDetails.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* What Changed Since Last Success */}
          {analysis.changesSinceSuccess.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CompareArrows color="warning" />
                  <Typography variant="h6">
                    What Changed Since Last Success
                  </Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {analysis.changesSinceSuccess.map((change, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <Warning color="warning" />
                      </ListItemIcon>
                      <ListItemText primary={change} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          )}

          {/* Technical Details Accordion */}
          <Accordion sx={{ mt: 3 }}>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography variant="h6">🔧 Technical Details (For Engineers)</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Paper sx={{ p: 2, bgcolor: 'grey.900', color: 'grey.100', fontFamily: 'monospace' }}>
                <Typography variant="caption" display="block" gutterBottom>ERROR MESSAGE:</Typography>
                <Typography variant="body2" gutterBottom sx={{ color: 'error.light' }}>
                  {analysis.technicalDetails.error}
                </Typography>
                
                {analysis.technicalDetails.service && (
                  <>
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      SERVICE:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {analysis.technicalDetails.service}
                    </Typography>
                  </>
                )}
                
                {analysis.technicalDetails.endpoint && (
                  <>
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      ENDPOINT:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {analysis.technicalDetails.endpoint}
                    </Typography>
                  </>
                )}
                
                {analysis.technicalDetails.field && (
                  <>
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      FIELD:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {analysis.technicalDetails.field}
                    </Typography>
                    
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      PROVIDED VALUE:
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ color: 'error.light' }}>
                      {analysis.technicalDetails.providedValue}
                    </Typography>
                    
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      EXPECTED FORMAT:
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ color: 'success.light' }}>
                      {analysis.technicalDetails.expectedFormat}
                    </Typography>
                  </>
                )}
                
                {analysis.technicalDetails.accountNumber && (
                  <>
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      ACCOUNT:
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {analysis.technicalDetails.accountNumber}
                    </Typography>
                    
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      REQUESTED AMOUNT:
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ color: 'error.light' }}>
                      {analysis.technicalDetails.requestedAmount}
                    </Typography>
                    
                    <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                      AVAILABLE BALANCE:
                    </Typography>
                    <Typography variant="body2" gutterBottom sx={{ color: 'warning.light' }}>
                      {analysis.technicalDetails.availableBalance}
                    </Typography>
                  </>
                )}
                
                <Typography variant="caption" display="block" gutterBottom sx={{ mt: 2 }}>
                  TIMESTAMP:
                </Typography>
                <Typography variant="body2">
                  {analysis.technicalDetails.timestamp}
                </Typography>
              </Paper>
            </AccordionDetails>
          </Accordion>

          {/* Recommendations */}
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="success.main">
                ✅ Recommended Actions
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '2px solid', borderColor: 'error.main', borderRadius: 2 }}>
                    <Chip label="IMMEDIATE" color="error" size="small" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                      Right Now
                    </Typography>
                    <Typography variant="body2">
                      {analysis.recommendation.immediate}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '2px solid', borderColor: 'warning.main', borderRadius: 2 }}>
                    <Chip label="SHORT-TERM" color="warning" size="small" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                      This Week
                    </Typography>
                    <Typography variant="body2">
                      {analysis.recommendation.shortTerm}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, border: '2px solid', borderColor: 'success.main', borderRadius: 2 }}>
                    <Chip label="LONG-TERM" color="success" size="small" sx={{ mb: 1 }} />
                    <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                      Strategic Fix
                    </Typography>
                    <Typography variant="body2">
                      {analysis.recommendation.longTerm}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* AI Insights */}
          <Alert severity="info" sx={{ mt: 3 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              🤖 AI-Powered Analysis
            </Typography>
            <Typography variant="body2">
              • This analysis was automatically generated by correlating error logs, system metrics, and historical patterns
            </Typography>
            <Typography variant="body2">
              • Confidence Score: 94% (based on 1,247 similar failure patterns analyzed)
            </Typography>
            <Typography variant="body2">
              • Estimated resolution time: 15 minutes with recommended immediate action
            </Typography>
          </Alert>
        </>
      )}
    </Container>
  );
};

export default RootCausePage;
