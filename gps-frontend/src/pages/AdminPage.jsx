import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import adminService from '../services/adminService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const AdminPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [config, setConfig] = useState({});
  const [thresholds, setThresholds] = useState([]);
  const [regionalRules, setRegionalRules] = useState([]);
  const [editingThreshold, setEditingThreshold] = useState(null);
  const [editingRule, setEditingRule] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [configData, thresholdsData, rulesData] = await Promise.all([
        adminService.getConfig(),
        adminService.getThresholds(),
        adminService.getRegionalRules(),
      ]);
      setConfig(configData);
      setThresholds(thresholdsData);
      setRegionalRules(rulesData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (key, value) => {
    setConfig({
      ...config,
      [key]: value,
    });
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await adminService.updateConfig(config);
      setSuccess('Configuration updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleEditThreshold = (threshold) => {
    setEditingThreshold({ ...threshold });
  };

  const handleSaveThreshold = async () => {
    if (!editingThreshold) return;

    try {
      await adminService.updateThreshold(editingThreshold.id, editingThreshold.value);
      setSuccess('Threshold updated successfully');
      setEditingThreshold(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update threshold');
    }
  };

  const handleEditRule = (rule) => {
    setEditingRule({ ...rule });
  };

  const handleSaveRule = async () => {
    if (!editingRule) return;

    try {
      await adminService.updateRegionalRule(editingRule.region, editingRule);
      setSuccess('Regional rule updated successfully');
      setEditingRule(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update regional rule');
    }
  };

  if (loading && !config) {
    return <LoadingSpinner message="Loading configuration..." />;
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Admin Configuration
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage system configuration, thresholds, and regional rules
        </Typography>
      </Box>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Global Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Global Configuration
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Max Retry Attempts"
                    type="number"
                    value={config.maxRetryAttempts || 3}
                    onChange={(e) => handleConfigChange('maxRetryAttempts', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Retry Delay (seconds)"
                    type="number"
                    value={config.retryDelay || 60}
                    onChange={(e) => handleConfigChange('retryDelay', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Batch Size"
                    type="number"
                    value={config.batchSize || 100}
                    onChange={(e) => handleConfigChange('batchSize', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveConfig}
                    disabled={loading}
                  >
                    Save Configuration
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Thresholds */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Thresholds
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Value</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {thresholds.map((threshold) => (
                      <TableRow key={threshold.id}>
                        <TableCell>{threshold.name}</TableCell>
                        <TableCell>
                          {editingThreshold?.id === threshold.id ? (
                            <TextField
                              size="small"
                              type="number"
                              value={editingThreshold.value}
                              onChange={(e) =>
                                setEditingThreshold({
                                  ...editingThreshold,
                                  value: e.target.value,
                                })
                              }
                            />
                          ) : (
                            threshold.value
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {editingThreshold?.id === threshold.id ? (
                            <>
                              <IconButton size="small" onClick={handleSaveThreshold}>
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={() => setEditingThreshold(null)}
                              >
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton
                              size="small"
                              onClick={() => handleEditThreshold(threshold)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Regional Rules */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Regional Rules
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Region</TableCell>
                      <TableCell>Max Amount</TableCell>
                      <TableCell>Currency</TableCell>
                      <TableCell>Enabled</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {regionalRules.map((rule) => (
                      <TableRow key={rule.region}>
                        <TableCell>{rule.region.replace('_', ' ')}</TableCell>
                        <TableCell>
                          {editingRule?.region === rule.region ? (
                            <TextField
                              size="small"
                              type="number"
                              value={editingRule.maxAmount}
                              onChange={(e) =>
                                setEditingRule({
                                  ...editingRule,
                                  maxAmount: e.target.value,
                                })
                              }
                            />
                          ) : (
                            rule.maxAmount
                          )}
                        </TableCell>
                        <TableCell>{rule.currency}</TableCell>
                        <TableCell>{rule.enabled ? 'Yes' : 'No'}</TableCell>
                        <TableCell align="right">
                          {editingRule?.region === rule.region ? (
                            <>
                              <IconButton size="small" onClick={handleSaveRule}>
                                <CheckIcon fontSize="small" />
                              </IconButton>
                              <IconButton size="small" onClick={() => setEditingRule(null)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton size="small" onClick={() => handleEditRule(rule)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminPage;
