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
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CompareArrows,
  Warning,
  Sync,
  CheckCircle,
  Public,
  Visibility,
  Close,
  Refresh,
} from '@mui/icons-material';

const generateConfigDrift = () => {
  return [
    {
      id: 1,
      configKey: 'routing.eurGbp.primary',
      expectedValue: 'SEPA',
      actualValue: 'SWIFT',
      region: 'Europe',
      severity: 'High',
      detectedAt: '2024-02-03 10:15:22',
      lastSynced: '2024-02-01 08:00:00',
      changeSource: 'Manual Override',
      authorized: false,
    },
    {
      id: 2,
      configKey: 'limits.daily.us',
      expectedValue: '75000',
      actualValue: '85000',
      region: 'US',
      severity: 'Medium',
      detectedAt: '2024-02-03 09:45:18',
      lastSynced: '2024-02-02 12:30:00',
      changeSource: 'Direct Database Edit',
      authorized: false,
    },
    {
      id: 3,
      configKey: 'timeout.api.global',
      expectedValue: '30',
      actualValue: '45',
      region: 'Global',
      severity: 'Low',
      detectedAt: '2024-02-02 16:20:45',
      lastSynced: '2024-01-31 10:00:00',
      changeSource: 'Unknown',
      authorized: false,
    },
  ];
};

const generateRegionalDrift = () => {
  return [
    {
      region: 'US',
      driftCount: 1,
      lastCheck: '2024-02-03 14:00:00',
      status: 'Drifted',
      syncAccuracy: 98.5,
    },
    {
      region: 'Europe',
      driftCount: 1,
      lastCheck: '2024-02-03 14:00:00',
      status: 'Drifted',
      syncAccuracy: 97.2,
    },
    {
      region: 'APAC',
      driftCount: 0,
      lastCheck: '2024-02-03 14:00:00',
      status: 'In Sync',
      syncAccuracy: 100,
    },
    {
      region: 'LATAM',
      driftCount: 0,
      lastCheck: '2024-02-03 14:00:00',
      status: 'In Sync',
      syncAccuracy: 100,
    },
  ];
};

const ConfigDriftPage = () => {
  const [drifts, setDrifts] = useState(generateConfigDrift());
  const [regionalStatus] = useState(generateRegionalDrift());
  const [selectedDrift, setSelectedDrift] = useState(null);
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [syncDialog, setSyncDialog] = useState(false);

  const handleViewDetails = (drift) => {
    setSelectedDrift(drift);
    setDetailsDialog(true);
  };

  const handleSync = (drift) => {
    setSelectedDrift(drift);
    setSyncDialog(true);
  };

  const confirmSync = () => {
    setDrifts(drifts.filter(d => d.id !== selectedDrift.id));
    setSyncDialog(false);
  };

  const getSeverityColor = (severity) => {
    if (severity === 'High') return 'error';
    if (severity === 'Medium') return 'warning';
    return 'info';
  };

  const getStatusColor = (status) => {
    if (status === 'In Sync') return 'success';
    return 'warning';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Config Drift Detection
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Detect unauthorized changes and regional inconsistencies
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<Refresh />}>
          Scan Now
        </Button>
      </Box>

      {/* Alert Banner */}
      {drifts.length > 0 && (
        <Alert severity="warning" sx={{ mb: 3 }} icon={<Warning />}>
          <Typography variant="body2" fontWeight={600}>
            {drifts.length} configuration drift(s) detected
          </Typography>
          <Typography variant="caption">
            Unauthorized configuration changes found - immediate attention required
          </Typography>
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Drifts
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {drifts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                High Severity
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {drifts.filter(d => d.severity === 'High').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Unauthorized Changes
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {drifts.filter(d => !d.authorized).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Last Scan
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                5 min ago
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Regional Drift Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Regional Sync Status
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {regionalStatus.map((region, index) => (
              <Grid item xs={12} md={6} lg={3} key={index}>
                <Card sx={{ bgcolor: region.status === 'In Sync' ? 'success.lighter' : 'warning.lighter' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" fontWeight="bold">
                        {region.region}
                      </Typography>
                      {region.status === 'In Sync' ? (
                        <CheckCircle color="success" />
                      ) : (
                        <Warning color="warning" />
                      )}
                    </Box>
                    <Chip
                      label={region.status}
                      color={getStatusColor(region.status)}
                      size="small"
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Drifts: {region.driftCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sync Accuracy: {region.syncAccuracy}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Last check: {region.lastCheck}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Drift Details Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Detected Configuration Drifts
          </Typography>
          <Divider sx={{ my: 2 }} />

          {drifts.length === 0 ? (
            <Alert severity="success" icon={<CheckCircle />}>
              <Typography variant="body2">
                No configuration drifts detected. All regions are in sync.
              </Typography>
            </Alert>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Config Key</TableCell>
                    <TableCell>Expected Value</TableCell>
                    <TableCell>Actual Value</TableCell>
                    <TableCell>Region</TableCell>
                    <TableCell>Severity</TableCell>
                    <TableCell>Change Source</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drifts.map((drift) => (
                    <TableRow
                      key={drift.id}
                      sx={{
                        bgcolor: drift.severity === 'High' ? 'error.lighter' :
                                 drift.severity === 'Medium' ? 'warning.lighter' :
                                 'info.lighter',
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                          {drift.configKey}
                        </Typography>
                        {!drift.authorized && (
                          <Chip
                            label="Unauthorized"
                            color="error"
                            size="small"
                            sx={{ mt: 0.5 }}
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" color="success.main">
                          {drift.expectedValue}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontFamily="monospace" color="error.main" fontWeight="bold">
                          {drift.actualValue}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={drift.region} size="small" icon={<Public />} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={drift.severity}
                          color={getSeverityColor(drift.severity)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{drift.changeSource}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Detected: {drift.detectedAt}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton size="small" onClick={() => handleViewDetails(drift)}>
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sync to expected value">
                          <IconButton size="small" color="primary" onClick={() => handleSync(drift)}>
                            <Sync />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialog} onClose={() => setDetailsDialog(false)} maxWidth="sm" fullWidth>
        {selectedDrift && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CompareArrows color="primary" sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Drift Details</Typography>
                  <Chip
                    label={selectedDrift.severity}
                    color={getSeverityColor(selectedDrift.severity)}
                    size="small"
                  />
                </Box>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Configuration Key
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace" fontWeight="bold">
                    {selectedDrift.configKey}
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <Card sx={{ bgcolor: 'success.lighter' }}>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        Expected Value
                      </Typography>
                      <Typography variant="h6" fontFamily="monospace" color="success.main">
                        {selectedDrift.expectedValue}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6}>
                  <Card sx={{ bgcolor: 'error.lighter' }}>
                    <CardContent>
                      <Typography variant="caption" color="text.secondary">
                        Actual Value
                      </Typography>
                      <Typography variant="h6" fontFamily="monospace" color="error.main">
                        {selectedDrift.actualValue}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Region
                  </Typography>
                  <Typography variant="body1">{selectedDrift.region}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Change Source
                  </Typography>
                  <Typography variant="body1">{selectedDrift.changeSource}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Detected At
                  </Typography>
                  <Typography variant="body1">{selectedDrift.detectedAt}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Last Synced
                  </Typography>
                  <Typography variant="body1">{selectedDrift.lastSynced}</Typography>
                </Grid>

                <Grid item xs={12}>
                  {!selectedDrift.authorized && (
                    <Alert severity="error">
                      <Typography variant="body2" fontWeight={600}>
                        Unauthorized Change Detected
                      </Typography>
                      <Typography variant="caption">
                        This configuration was modified outside of the approved change process
                      </Typography>
                    </Alert>
                  )}
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setDetailsDialog(false)} startIcon={<Close />}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<Sync />}
                onClick={() => {
                  setDetailsDialog(false);
                  handleSync(selectedDrift);
                }}
              >
                Sync Now
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Sync Confirmation Dialog */}
      <Dialog open={syncDialog} onClose={() => setSyncDialog(false)} maxWidth="sm" fullWidth>
        {selectedDrift && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Sync color="primary" sx={{ fontSize: 40 }} />
                <Typography variant="h6">Sync Configuration</Typography>
              </Box>
            </DialogTitle>

            <DialogContent>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>
                  This will revert the configuration to the expected value
                </Typography>
                <Typography variant="caption">
                  The change will take effect immediately in the {selectedDrift.region} region
                </Typography>
              </Alert>

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Configuration:
                </Typography>
                <Typography variant="body2" fontFamily="monospace">
                  {selectedDrift.configKey}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Change:
                </Typography>
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontFamily="monospace" color="error.main" sx={{ textDecoration: 'line-through' }}>
                        {selectedDrift.actualValue}
                      </Typography>
                      <Typography variant="body2">→</Typography>
                      <Typography variant="body2" fontFamily="monospace" color="success.main" fontWeight="bold">
                        {selectedDrift.expectedValue}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
              <Button onClick={() => setSyncDialog(false)} startIcon={<Close />}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<Sync />} onClick={confirmSync}>
                Sync Configuration
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ConfigDriftPage;
