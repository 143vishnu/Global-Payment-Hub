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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Build,
  Warning,
  CheckCircle,
  AccessTime,
  Close,
  Visibility,
  Flag,
} from '@mui/icons-material';

const generateOperationalDebt = () => {
  return [
    {
      id: 1,
      type: 'Temporary Fix',
      description: 'Hardcoded retry count for APAC gateway timeout',
      location: 'PaymentRouter.java:245',
      createdAt: '2024-01-15 10:30:00',
      createdBy: 'ops@gps.com',
      expectedDuration: '7 days',
      actualAge: '19 days',
      severity: 'High',
      impact: 'Blocks code refactoring, increases technical debt',
      status: 'Overdue',
      relatedIncident: 'INC-2024-0143',
    },
    {
      id: 2,
      type: 'Manual Override',
      description: 'Manual approval required for EUR→GBP > €50k',
      location: 'ValidationService.java:182',
      createdAt: '2024-01-28 14:20:00',
      createdBy: 'admin@gps.com',
      expectedDuration: '14 days',
      actualAge: '6 days',
      severity: 'Medium',
      impact: 'Slows down payment processing, requires manual intervention',
      status: 'Active',
      relatedIncident: 'INC-2024-0178',
    },
    {
      id: 3,
      type: 'Workaround',
      description: 'Bypass validation for legacy US customers',
      location: 'CustomerValidator.java:98',
      createdAt: '2023-12-10 09:15:00',
      createdBy: 'ops@gps.com',
      expectedDuration: '30 days',
      actualAge: '55 days',
      severity: 'Critical',
      impact: 'Security risk, compliance violation',
      status: 'Overdue',
      relatedIncident: 'INC-2023-0956',
    },
    {
      id: 4,
      type: 'Feature Flag',
      description: 'Disable new routing algorithm for LATAM',
      location: 'FeatureFlags.json:45',
      createdAt: '2024-02-01 16:45:00',
      createdBy: 'admin@gps.com',
      expectedDuration: '3 days',
      actualAge: '2 days',
      severity: 'Low',
      impact: 'Prevents full rollout of improved routing',
      status: 'Active',
      relatedIncident: 'INC-2024-0201',
    },
  ];
};

const OperationalDebtPage = () => {
  const [debts, setDebts] = useState(generateOperationalDebt());
  const [selectedDebt, setSelectedDebt] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [resolveDialog, setResolveDialog] = useState(false);

  const handleViewDetails = (debt) => {
    setSelectedDebt(debt);
    setDetailsDialog(true);
  };

  const handleResolve = (debt) => {
    setSelectedDebt(debt);
    setResolveDialog(true);
  };

  const confirmResolve = () => {
    setDebts(debts.filter(d => d.id !== selectedDebt.id));
    setResolveDialog(false);
  };

  const getSeverityColor = (severity) => {
    if (severity === 'Critical') return 'error';
    if (severity === 'High') return 'error';
    if (severity === 'Medium') return 'warning';
    return 'info';
  };

  const getStatusColor = (status) => {
    if (status === 'Overdue') return 'error';
    if (status === 'Active') return 'warning';
    return 'success';
  };

  const calculateProgress = (debt) => {
    const expectedDays = parseInt(debt.expectedDuration);
    const actualDays = parseInt(debt.actualAge);
    return Math.min((actualDays / expectedDays) * 100, 100);
  };

  const isOverdue = (debt) => {
    const expectedDays = parseInt(debt.expectedDuration);
    const actualDays = parseInt(debt.actualAge);
    return actualDays > expectedDays;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Operational Debt Tracker
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track temporary fixes and manual overrides that stayed too long
        </Typography>
      </Box>

      {/* Alert Banner */}
      {debts.filter(d => d.status === 'Overdue').length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<Warning />}>
          <Typography variant="body2" fontWeight={600}>
            {debts.filter(d => d.status === 'Overdue').length} overdue operational debt item(s)
          </Typography>
          <Typography variant="caption">
            These temporary fixes have exceeded their expected duration and require immediate attention
          </Typography>
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Debt Items
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {debts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Overdue Items
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {debts.filter(d => d.status === 'Overdue').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Critical Severity
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {debts.filter(d => d.severity === 'Critical').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Avg Age
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                20d
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Debt Breakdown by Type */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'error.lighter' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Temporary Fixes
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {debts.filter(d => d.type === 'Temporary Fix').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'warning.lighter' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Manual Overrides
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {debts.filter(d => d.type === 'Manual Override').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'info.lighter' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Workarounds
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {debts.filter(d => d.type === 'Workaround').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: 'success.lighter' }}>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Feature Flags
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {debts.filter(d => d.type === 'Feature Flag').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Debt Items Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Operational Debt Items
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Age / Expected</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {debts.map((debt) => {
                  const progress = calculateProgress(debt);
                  const overdue = isOverdue(debt);
                  return (
                    <TableRow
                      key={debt.id}
                      sx={{
                        bgcolor: overdue ? 'error.lighter' :
                                 progress > 80 ? 'warning.lighter' :
                                 'inherit',
                      }}
                    >
                      <TableCell>
                        <Chip
                          label={debt.type}
                          size="small"
                          color={
                            debt.type === 'Temporary Fix' ? 'error' :
                            debt.type === 'Manual Override' ? 'warning' :
                            debt.type === 'Workaround' ? 'info' :
                            'success'
                          }
                          icon={<Build />}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {debt.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Created by {debt.createdBy}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" fontSize="0.85rem">
                          {debt.location}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ width: 120 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" fontWeight="bold" color={overdue ? 'error.main' : 'text.primary'}>
                              {debt.actualAge}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              / {debt.expectedDuration}
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(progress, 100)}
                            color={overdue ? 'error' : progress > 80 ? 'warning' : 'success'}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debt.severity}
                          color={getSeverityColor(debt.severity)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={debt.status}
                          color={getStatusColor(debt.status)}
                          size="small"
                          icon={overdue ? <Warning /> : <AccessTime />}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => handleViewDetails(debt)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Mark as resolved">
                          <IconButton size="small" color="success" onClick={() => handleResolve(debt)}>
                            <CheckCircle />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="md" fullWidth>
        {selectedDebt && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Build color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Operational Debt Details</Typography>
                  <Chip
                    label={selectedDebt.severity}
                    color={getSeverityColor(selectedDebt.severity)}
                    size="small"
                  />
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Alert severity={isOverdue(selectedDebt) ? 'error' : 'warning'}>
                    <Typography variant="body2" fontWeight={600}>
                      {isOverdue(selectedDebt)
                        ? `This item is ${parseInt(selectedDebt.actualAge) - parseInt(selectedDebt.expectedDuration)} days overdue`
                        : `This item will expire in ${parseInt(selectedDebt.expectedDuration) - parseInt(selectedDebt.actualAge)} days`}
                    </Typography>
                  </Alert>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Type
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedDebt.type}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {selectedDebt.description}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {selectedDebt.location}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Created At
                  </Typography>
                  <Typography variant="body2">{selectedDebt.createdAt}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Created By
                  </Typography>
                  <Typography variant="body2">{selectedDebt.createdBy}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Expected Duration
                  </Typography>
                  <Typography variant="body2">{selectedDebt.expectedDuration}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Actual Age
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color={isOverdue(selectedDebt) ? 'error.main' : 'text.primary'}>
                    {selectedDebt.actualAge}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Impact
                  </Typography>
                  <Card sx={{ bgcolor: 'warning.lighter' }}>
                    <CardContent>
                      <Typography variant="body2">
                        {selectedDebt.impact}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Related Incident
                  </Typography>
                  <Chip label={selectedDebt.relatedIncident} icon={<Flag />} />
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailsDialog(false)} startIcon={<Close />}>
                Close
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => {
                  setDetailsDialog(false);
                  handleResolve(selectedDebt);
                }}
              >
                Mark as Resolved
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Resolve Confirmation Dialog */}
      <Dialog open={resolveDialog} onClose={() => setResolveDialog(false)} maxWidth="sm" fullWidth>
        {selectedDebt && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CheckCircle color="success" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Mark as Resolved</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  Confirm that this operational debt has been resolved
                </Typography>
                <Typography variant="caption">
                  This will remove the item from active tracking
                </Typography>
              </Alert>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Item:
                </Typography>
                <Card sx={{ bgcolor: 'grey.50' }}>
                  <CardContent>
                    <Typography variant="body2" fontWeight="bold">
                      {selectedDebt.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {selectedDebt.location}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setResolveDialog(false)} startIcon={<Close />}>
                Cancel
              </Button>
              <Button variant="contained" color="success" startIcon={<CheckCircle />} onClick={confirmResolve}>
                Confirm Resolution
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OperationalDebtPage;
