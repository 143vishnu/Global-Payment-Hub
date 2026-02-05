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
  Restore,
  CheckCircle,
  Close,
  Compare,
  Download,
  Visibility,
} from '@mui/icons-material';

const generateVersionHistory = () => {
  return [
    {
      version: 'v2.5.3',
      timestamp: '2024-02-03 14:45:22',
      author: 'admin@gps.com',
      changes: 'Updated EUR→GBP routing to prefer SEPA over SWIFT',
      status: 'Active',
      affectedRules: 3,
      rollbackCount: 0,
    },
    {
      version: 'v2.5.2',
      timestamp: '2024-02-02 09:12:45',
      author: 'ops@gps.com',
      changes: 'Increased daily transaction limit for US region',
      status: 'Superseded',
      affectedRules: 1,
      rollbackCount: 0,
    },
    {
      version: 'v2.5.1',
      timestamp: '2024-02-01 18:30:15',
      author: 'admin@gps.com',
      changes: 'Added retry policy for timeout errors',
      status: 'Superseded',
      affectedRules: 2,
      rollbackCount: 1,
    },
    {
      version: 'v2.5.0',
      timestamp: '2024-01-31 11:20:33',
      author: 'admin@gps.com',
      changes: 'Emergency rollback - reverted routing changes',
      status: 'Superseded',
      affectedRules: 5,
      rollbackCount: 0,
    },
    {
      version: 'v2.4.9',
      timestamp: '2024-01-31 10:05:12',
      author: 'ops@gps.com',
      changes: 'Modified validation rules for APAC region',
      status: 'Rolled Back',
      affectedRules: 4,
      rollbackCount: 1,
    },
    {
      version: 'v2.4.8',
      timestamp: '2024-01-30 16:45:00',
      author: 'admin@gps.com',
      changes: 'Updated timeout configurations globally',
      status: 'Superseded',
      affectedRules: 8,
      rollbackCount: 0,
    },
  ];
};

const generateConfigDiff = (fromVersion, toVersion) => {
  return {
    added: [
      { key: 'routing.eurGbp.primary', value: 'SEPA', type: 'string' },
      { key: 'retry.timeout.maxAttempts', value: '3', type: 'number' },
    ],
    modified: [
      {
        key: 'limits.daily.us',
        oldValue: '50000',
        newValue: '75000',
        type: 'number',
      },
      {
        key: 'validation.apac.enabled',
        oldValue: 'true',
        newValue: 'false',
        type: 'boolean',
      },
    ],
    removed: [
      { key: 'routing.legacy.swiftFallback', value: 'true', type: 'boolean' },
    ],
  };
};

const ConfigVersioningPage = () => {
  const [versions, setVersions] = useState(generateVersionHistory());
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [rollbackDialog, setRollbackDialog] = useState(false);
  const [compareDialog, setCompareDialog] = useState(false);
  const [viewDialog, setViewDialog] = useState(false);
  const [diffData, setDiffData] = useState(null);

  const handleRollback = (version) => {
    setSelectedVersion(version);
    setRollbackDialog(true);
  };

  const confirmRollback = () => {
    // Perform rollback
    const updatedVersions = versions.map(v =>
      v.version === selectedVersion.version
        ? { ...v, status: 'Active' }
        : v.status === 'Active'
        ? { ...v, status: 'Superseded' }
        : v
    );
    setVersions(updatedVersions);
    setRollbackDialog(false);
  };

  const handleCompare = (version) => {
    const currentVersion = versions.find(v => v.status === 'Active');
    setDiffData(generateConfigDiff(version.version, currentVersion.version));
    setSelectedVersion(version);
    setCompareDialog(true);
  };

  const handleViewDetails = (version) => {
    setSelectedVersion(version);
    setViewDialog(true);
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return 'success';
    if (status === 'Rolled Back') return 'error';
    return 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Config Versioning & Rollback
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bank-grade configuration governance with instant rollback
        </Typography>
      </Box>

      {/* Current Active Version */}
      <Card sx={{ mb: 3, bgcolor: 'success.light', color: 'success.contrastText' }}>
        <CardContent>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <CheckCircle sx={{ fontSize: 50 }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Active Version: {versions[0].version}
              </Typography>
              <Typography variant="body1">
                {versions[0].changes}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Deployed by {versions[0].author} on {versions[0].timestamp}
              </Typography>
            </Grid>
            <Grid item>
              <Chip
                label={`${versions[0].affectedRules} Rules`}
                sx={{ bgcolor: 'success.dark', color: 'white' }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Total Versions
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {versions.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Rollbacks (30d)
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                2
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Avg Time to Rollback
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                45s
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Retention Period
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                90d
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Version History */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Version History
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Version</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Author</TableCell>
                  <TableCell>Changes</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versions.map((version, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      bgcolor: version.status === 'Active' ? 'success.lighter' : 'inherit',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={version.status === 'Active' ? 'bold' : 'normal'}>
                        {version.version}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {version.affectedRules} rules
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {version.timestamp}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {version.author}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {version.changes}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={version.status}
                        color={getStatusColor(version.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Compare with current">
                        <IconButton
                          size="small"
                          onClick={() => handleCompare(version)}
                          disabled={version.status === 'Active'}
                        >
                          <Compare />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="View details">
                        <IconButton size="small" onClick={() => handleViewDetails(version)}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Rollback to this version">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() => handleRollback(version)}
                          disabled={version.status === 'Active'}
                        >
                          <Restore />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Export configuration">
                        <IconButton size="small">
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Rollback Confirmation Dialog */}
      <Dialog open={rollbackDialog} onClose={() => setRollbackDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Restore color="warning" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Confirm Rollback</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              This action will rollback the configuration to a previous version
            </Typography>
            <Typography variant="caption">
              All changes made after this version will be superseded
            </Typography>
          </Alert>

          {selectedVersion && (
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Rolling back to:
              </Typography>
              <Card sx={{ bgcolor: 'grey.50', mb: 2 }}>
                <CardContent>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedVersion.version}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedVersion.changes}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {selectedVersion.timestamp} by {selectedVersion.author}
                  </Typography>
                </CardContent>
              </Card>

              <Typography variant="subtitle2" gutterBottom>
                Impact:
              </Typography>
              <Box sx={{ pl: 2 }}>
                <Typography variant="body2">
                  • {selectedVersion.affectedRules} configuration rules will be modified
                </Typography>
                <Typography variant="body2">
                  • Changes will take effect immediately
                </Typography>
                <Typography variant="body2">
                  • Current version will be marked as "Superseded"
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setRollbackDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="warning"
            startIcon={<Restore />}
            onClick={confirmRollback}
          >
            Rollback Now
          </Button>
        </DialogActions>
      </Dialog>

      {/* Compare Dialog */}
      <Dialog open={compareDialog} onClose={() => setCompareDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Compare color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Configuration Comparison</Typography>
              {selectedVersion && (
                <Typography variant="caption" color="text.secondary">
                  {selectedVersion.version} vs {versions[0].version}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {diffData && (
            <Box>
              {/* Added Configurations */}
              {diffData.added.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom color="success.main">
                    Added ({diffData.added.length})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {diffData.added.map((item, index) => (
                          <TableRow key={index} sx={{ bgcolor: 'success.lighter' }}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {item.key}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {item.value}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={item.type} size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Modified Configurations */}
              {diffData.modified.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom color="warning.main">
                    Modified ({diffData.modified.length})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Old Value</TableCell>
                          <TableCell>New Value</TableCell>
                          <TableCell>Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {diffData.modified.map((item, index) => (
                          <TableRow key={index} sx={{ bgcolor: 'warning.lighter' }}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {item.key}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography
                                variant="body2"
                                fontFamily="monospace"
                                sx={{ textDecoration: 'line-through', opacity: 0.7 }}
                              >
                                {item.oldValue}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace" fontWeight="bold">
                                {item.newValue}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={item.type} size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Removed Configurations */}
              {diffData.removed.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom color="error.main">
                    Removed ({diffData.removed.length})
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Key</TableCell>
                          <TableCell>Value</TableCell>
                          <TableCell>Type</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {diffData.removed.map((item, index) => (
                          <TableRow key={index} sx={{ bgcolor: 'error.lighter' }}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {item.key}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {item.value}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Chip label={item.type} size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCompareDialog(false)} startIcon={<Close />}>
            Close
          </Button>
          <Button variant="contained" startIcon={<Download />}>
            Export Diff
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Visibility color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6">Configuration Version Details</Typography>
              {selectedVersion && (
                <Typography variant="caption" color="text.secondary">
                  Version {selectedVersion.version}
                </Typography>
              )}
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent>
          {selectedVersion && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Version
                  </Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {selectedVersion.version}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>
                  <Box>
                    <Chip
                      label={selectedVersion.status}
                      color={getStatusColor(selectedVersion.status)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Timestamp
                  </Typography>
                  <Typography variant="body1">
                    {selectedVersion.timestamp}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Author
                  </Typography>
                  <Typography variant="body1">
                    {selectedVersion.author}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Affected Rules
                  </Typography>
                  <Typography variant="body1">
                    {selectedVersion.affectedRules}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Rollback Count
                  </Typography>
                  <Typography variant="body1">
                    {selectedVersion.rollbackCount}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" gutterBottom>
                Changes Made
              </Typography>
              <Card sx={{ bgcolor: 'grey.50', p: 2, mb: 2 }}>
                <Typography variant="body2">
                  {selectedVersion.changes}
                </Typography>
              </Card>

              <Typography variant="subtitle2" gutterBottom>
                Configuration Snapshot
              </Typography>
              <Box sx={{ bgcolor: 'grey.900', color: 'white', p: 2, borderRadius: 1, fontFamily: 'monospace', fontSize: '0.85rem' }}>
                <pre style={{ margin: 0, overflow: 'auto' }}>
{`{
  "routing": {
    "eurGbp": {
      "primary": "SEPA",
      "fallback": "SWIFT"
    }
  },
  "limits": {
    "daily": {
      "us": 75000,
      "eu": 50000
    }
  },
  "retry": {
    "timeout": {
      "maxAttempts": 3,
      "backoffMs": 1000
    }
  },
  "validation": {
    "apac": {
      "enabled": true,
      "strictMode": false
    }
  }
}`}
                </pre>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setViewDialog(false)} startIcon={<Close />}>
            Close
          </Button>
          <Button variant="outlined" startIcon={<Download />}>
            Export Config
          </Button>
          {selectedVersion && selectedVersion.status !== 'Active' && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<Restore />}
              onClick={() => {
                setViewDialog(false);
                handleRollback(selectedVersion);
              }}
            >
              Rollback to This
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConfigVersioningPage;
