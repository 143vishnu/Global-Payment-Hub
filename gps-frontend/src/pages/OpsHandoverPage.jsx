import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import {
  Error,
  Refresh,
  Warning,
  Schedule,
  Download,
  Print,
  TrendingDown,
  TrendingUp,
} from '@mui/icons-material';

const generateHandoverData = () => ({
  shiftInfo: {
    outgoing: 'John Smith (Day Shift)',
    incoming: 'Sarah Johnson (Night Shift)',
    handoverTime: new Date().toLocaleString(),
  },
  summary: {
    openFailures: 12,
    pendingRetries: 8,
    slaBreaches: 3,
    criticalIssues: 2,
    totalProcessed: 45230,
    successRate: 98.2,
  },
  criticalIssues: [
    {
      id: 'ISS-001',
      severity: 'critical',
      title: 'High-value payment stuck in routing',
      paymentId: 'PAY-HV-12345',
      amount: '$250,000',
      region: 'NA',
      age: '2 hours',
      assignedTo: 'Needs assignment',
    },
    {
      id: 'ISS-002',
      severity: 'critical',
      title: 'Downstream system timeout pattern',
      affected: '15 payments',
      region: 'EU',
      age: '1 hour',
      assignedTo: 'System Team',
    },
  ],
  pendingActions: [
    {
      id: 'ACT-001',
      action: 'Manual approval needed',
      count: 5,
      category: 'High-value approvals',
      sla: '2 hours remaining',
    },
    {
      id: 'ACT-002',
      action: 'Retry scheduled',
      count: 8,
      category: 'Network timeouts',
      sla: 'Next retry in 15 min',
    },
    {
      id: 'ACT-003',
      action: 'Investigation required',
      count: 3,
      category: 'Duplicate detection',
      sla: '4 hours remaining',
    },
  ],
  slaBreaches: [
    {
      id: 'PAY-12340',
      type: 'Processing Time',
      exceeded: '45 minutes over SLA',
      status: 'In Progress',
    },
    {
      id: 'PAY-12341',
      type: 'Resolution Time',
      exceeded: '2 hours over SLA',
      status: 'Escalated',
    },
    {
      id: 'PAY-12342',
      type: 'Approval Time',
      exceeded: '30 minutes over SLA',
      status: 'Pending',
    },
  ],
  trends: [
    { metric: 'Success Rate', current: 98.2, previous: 97.8, trend: 'up' },
    { metric: 'Avg Processing Time', current: '1.2s', previous: '1.5s', trend: 'up' },
    { metric: 'Failed Payments', current: 45, previous: 62, trend: 'up' },
    { metric: 'SLA Compliance', current: 99.3, previous: 98.9, trend: 'up' },
  ],
});

const OpsHandoverPage = () => {
  const [handoverData] = useState(generateHandoverData());

  const handleExport = () => {
    const data = JSON.stringify(handoverData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift-handover-${new Date().toISOString()}.json`;
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Ops Shift Handover Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Auto-generated summary for seamless shift transitions
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Print />}
            onClick={handlePrint}
            sx={{ mr: 1 }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Shift Info */}
      <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Outgoing Shift</Typography>
              <Typography variant="h6">{handoverData.shiftInfo.outgoing}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Incoming Shift</Typography>
              <Typography variant="h6">{handoverData.shiftInfo.incoming}</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>Handover Time</Typography>
              <Typography variant="h6">{handoverData.shiftInfo.handoverTime}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Error sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{handoverData.summary.openFailures}</Typography>
              <Typography variant="body2" color="text.secondary">Open Failures</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Refresh sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{handoverData.summary.pendingRetries}</Typography>
              <Typography variant="body2" color="text.secondary">Pending Retries</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{handoverData.summary.slaBreaches}</Typography>
              <Typography variant="body2" color="text.secondary">SLA Breaches</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Warning sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">{handoverData.summary.criticalIssues}</Typography>
              <Typography variant="body2" color="text.secondary">Critical Issues</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Critical Issues */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom color="error">
            🚨 Critical Issues Requiring Immediate Attention
          </Typography>
          <List>
            {handoverData.criticalIssues.map((issue, index) => (
              <React.Fragment key={issue.id}>
                {index > 0 && <Divider />}
                <ListItem>
                  <ListItemIcon>
                    <Error color="error" />
                  </ListItemIcon>
                  <ListItemText
                    primary={issue.title}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        {issue.paymentId && (
                          <Chip label={issue.paymentId} size="small" sx={{ mr: 1 }} />
                        )}
                        {issue.amount && (
                          <Chip label={issue.amount} size="small" color="error" sx={{ mr: 1 }} />
                        )}
                        {issue.affected && (
                          <Chip label={issue.affected} size="small" sx={{ mr: 1 }} />
                        )}
                        <Chip label={issue.region} size="small" variant="outlined" sx={{ mr: 1 }} />
                        <Chip label={`Age: ${issue.age}`} size="small" variant="outlined" sx={{ mr: 1 }} />
                        <Chip label={`Assigned: ${issue.assignedTo}`} size="small" color="primary" />
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Pending Actions */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pending Actions
              </Typography>
              <List>
                {handoverData.pendingActions.map((action) => (
                  <ListItem key={action.id}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1">{action.action}</Typography>
                          <Chip label={action.count} size="small" color="warning" />
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="caption" display="block">{action.category}</Typography>
                          <Typography variant="caption" color="error.main" fontWeight={600}>
                            {action.sla}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* SLA Breaches */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="error">
                SLA Breaches
              </Typography>
              <List>
                {handoverData.slaBreaches.map((breach) => (
                  <ListItem key={breach.id}>
                    <ListItemIcon>
                      <Schedule color="error" />
                    </ListItemIcon>
                    <ListItemText
                      primary={breach.id}
                      secondary={
                        <Box>
                          <Typography variant="caption" display="block">
                            {breach.type}: {breach.exceeded}
                          </Typography>
                          <Chip 
                            label={breach.status}
                            size="small"
                            color={breach.status === 'Escalated' ? 'error' : 'warning'}
                            sx={{ mt: 0.5 }}
                          />
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trends */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shift Performance Trends
          </Typography>
          <Grid container spacing={2}>
            {handoverData.trends.map((trend) => (
              <Grid item xs={12} sm={6} md={3} key={trend.metric}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {trend.metric}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {typeof trend.current === 'number' ? trend.current : trend.current}
                    </Typography>
                    {trend.trend === 'up' ? (
                      <TrendingUp sx={{ color: 'success.main' }} />
                    ) : (
                      <TrendingDown sx={{ color: 'error.main' }} />
                    )}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Previous: {trend.previous}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Handover Notes */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          📝 Handover Notes
        </Typography>
        <Typography variant="body2">
          • All critical high-value payments have been escalated to senior analyst
        </Typography>
        <Typography variant="body2">
          • Network timeout pattern being monitored - System team engaged
        </Typography>
        <Typography variant="body2">
          • Batch processing completed successfully at 11:30 PM
        </Typography>
      </Alert>
    </Container>
  );
};

export default OpsHandoverPage;
