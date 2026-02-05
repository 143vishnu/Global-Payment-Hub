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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  AccessTime,
  Add,
  Delete,
  Edit,
  PlayArrow,
  Warning,
  CheckCircle,
  Close,
  AutoDelete,
} from '@mui/icons-material';

const generateTimeBoundRules = () => {
  return [
    {
      id: 1,
      name: 'Black Friday Limit Increase',
      ruleType: 'Transaction Limit',
      config: 'Daily limit: $100,000 → $250,000',
      region: 'US',
      startTime: '2024-02-24 00:00:00',
      endTime: '2024-02-25 23:59:59',
      duration: '48 hours',
      status: 'Scheduled',
      timeRemaining: '21 days 5 hours',
      autoExpire: true,
    },
    {
      id: 2,
      name: 'Month-End Processing Extension',
      ruleType: 'Timeout Configuration',
      config: 'API timeout: 30s → 60s',
      region: 'Global',
      startTime: '2024-02-28 20:00:00',
      endTime: '2024-03-01 04:00:00',
      duration: '8 hours',
      status: 'Scheduled',
      timeRemaining: '25 days 10 hours',
      autoExpire: true,
    },
    {
      id: 3,
      name: 'Emergency Routing Override',
      ruleType: 'Routing Rule',
      config: 'EUR→GBP via backup gateway',
      region: 'Europe',
      startTime: '2024-02-03 10:00:00',
      endTime: '2024-02-03 18:00:00',
      duration: '8 hours',
      status: 'Active',
      timeRemaining: '3 hours 45 min',
      autoExpire: true,
    },
    {
      id: 4,
      name: 'Holiday Retry Policy',
      ruleType: 'Retry Policy',
      config: 'Max retries: 3 → 5',
      region: 'APAC',
      startTime: '2024-02-01 00:00:00',
      endTime: '2024-02-05 23:59:59',
      duration: '5 days',
      status: 'Expired',
      timeRemaining: 'Expired 2 days ago',
      autoExpire: true,
    },
  ];
};

const TimeBoundRulesPage = () => {
  const [rules, setRules] = useState(generateTimeBoundRules());
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);

  const [newRule, setNewRule] = useState({
    name: '',
    ruleType: '',
    config: '',
    region: '',
    startTime: '',
    endTime: '',
    autoExpire: true,
  });

  const handleCreateRule = () => {
    const duration = calculateDuration(newRule.startTime, newRule.endTime);
    const rule = {
      ...newRule,
      id: rules.length + 1,
      duration,
      status: 'Scheduled',
      timeRemaining: '...',
    };
    setRules([...rules, rule]);
    setCreateDialog(false);
    setNewRule({
      name: '',
      ruleType: '',
      config: '',
      region: '',
      startTime: '',
      endTime: '',
      autoExpire: true,
    });
  };

  const handleDeleteRule = () => {
    setRules(rules.filter(r => r.id !== selectedRule.id));
    setDeleteDialog(false);
  };

  const calculateDuration = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffHours = Math.abs(endDate - startDate) / 36e5;
    if (diffHours < 24) return `${Math.round(diffHours)} hours`;
    return `${Math.round(diffHours / 24)} days`;
  };

  const getStatusColor = (status) => {
    if (status === 'Active') return 'success';
    if (status === 'Scheduled') return 'info';
    if (status === 'Expired') return 'error';
    return 'default';
  };

  const getStatusIcon = (status) => {
    if (status === 'Active') return <PlayArrow />;
    if (status === 'Scheduled') return <AccessTime />;
    if (status === 'Expired') return <AutoDelete />;
    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Time-Bound Rules
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Self-expiring rules that prevent permanent risky configurations
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialog(true)}
        >
          Create Rule
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Active Rules
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {rules.filter(r => r.status === 'Active').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Scheduled Rules
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="info.main">
                {rules.filter(r => r.status === 'Scheduled').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Expired (30d)
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {rules.filter(r => r.status === 'Expired').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="caption" color="text.secondary">
                Auto-Expire Rate
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                100%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Active Rules Alert */}
      {rules.filter(r => r.status === 'Active').length > 0 && (
        <Alert severity="info" sx={{ mb: 3 }} icon={<AccessTime />}>
          <Typography variant="body2" fontWeight={600}>
            {rules.filter(r => r.status === 'Active').length} time-bound rule(s) currently active
          </Typography>
          <Typography variant="caption">
            These rules will automatically expire at their scheduled end time
          </Typography>
        </Alert>
      )}

      {/* Rules Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Time-Bound Rules
          </Typography>
          <Divider sx={{ my: 2 }} />

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Rule Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Configuration</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Time Remaining</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rules.map((rule) => (
                  <TableRow
                    key={rule.id}
                    sx={{
                      bgcolor:
                        rule.status === 'Active'
                          ? 'success.lighter'
                          : rule.status === 'Expired'
                          ? 'grey.100'
                          : 'inherit',
                      opacity: rule.status === 'Expired' ? 0.6 : 1,
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {rule.name}
                      </Typography>
                      {rule.autoExpire && (
                        <Chip
                          label="Auto-Expire"
                          size="small"
                          color="info"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{rule.ruleType}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" fontSize="0.85rem">
                        {rule.config}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={rule.region} size="small" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{rule.duration}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={
                          rule.status === 'Active'
                            ? 'success.main'
                            : rule.status === 'Expired'
                            ? 'error.main'
                            : 'info.main'
                        }
                      >
                        {rule.timeRemaining}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={rule.status}
                        color={getStatusColor(rule.status)}
                        icon={getStatusIcon(rule.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit rule">
                        <IconButton
                          size="small"
                          disabled={rule.status === 'Expired' || rule.status === 'Active'}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete rule">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setSelectedRule(rule);
                            setDeleteDialog(true);
                          }}
                          disabled={rule.status === 'Active'}
                        >
                          <Delete />
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

      {/* Expiration Timeline */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upcoming Expirations
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box>
            {rules
              .filter(r => r.status === 'Active' || r.status === 'Scheduled')
              .map((rule, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 2,
                    p: 2,
                    borderLeft: 4,
                    borderColor: rule.status === 'Active' ? 'success.main' : 'info.main',
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                  }}
                >
                  <AccessTime color={rule.status === 'Active' ? 'success' : 'info'} />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" fontWeight="bold">
                      {rule.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Expires: {rule.endTime}
                    </Typography>
                  </Box>
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {rule.timeRemaining}
                  </Typography>
                </Box>
              ))}
          </Box>
        </CardContent>
      </Card>

      {/* Create Rule Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Add color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Create Time-Bound Rule</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2">
              Time-bound rules automatically expire at the specified end time, preventing permanent risky configurations
            </Typography>
          </Alert>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Rule Name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                placeholder="e.g., Weekend Limit Increase"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Rule Type</InputLabel>
                <Select
                  value={newRule.ruleType}
                  label="Rule Type"
                  onChange={(e) => setNewRule({ ...newRule, ruleType: e.target.value })}
                >
                  <MenuItem value="Transaction Limit">Transaction Limit</MenuItem>
                  <MenuItem value="Routing Rule">Routing Rule</MenuItem>
                  <MenuItem value="Timeout Configuration">Timeout Configuration</MenuItem>
                  <MenuItem value="Retry Policy">Retry Policy</MenuItem>
                  <MenuItem value="Validation Rule">Validation Rule</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Configuration"
                value={newRule.config}
                onChange={(e) => setNewRule({ ...newRule, config: e.target.value })}
                placeholder="e.g., Daily limit: $50,000 → $100,000"
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Region</InputLabel>
                <Select
                  value={newRule.region}
                  label="Region"
                  onChange={(e) => setNewRule({ ...newRule, region: e.target.value })}
                >
                  <MenuItem value="Global">Global</MenuItem>
                  <MenuItem value="US">US</MenuItem>
                  <MenuItem value="Europe">Europe</MenuItem>
                  <MenuItem value="APAC">APAC</MenuItem>
                  <MenuItem value="LATAM">LATAM</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Start Time"
                value={newRule.startTime}
                onChange={(e) => setNewRule({ ...newRule, startTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="datetime-local"
                label="End Time"
                value={newRule.endTime}
                onChange={(e) => setNewRule({ ...newRule, endTime: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <Alert severity="success" icon={<CheckCircle />}>
                <Typography variant="body2">
                  Auto-expire is enabled - rule will be automatically removed at end time
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleCreateRule}
            disabled={
              !newRule.name ||
              !newRule.ruleType ||
              !newRule.config ||
              !newRule.region ||
              !newRule.startTime ||
              !newRule.endTime
            }
          >
            Create Rule
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Rule Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Warning color="error" sx={{ fontSize: 40 }} />
            <Typography variant="h6">Delete Rule</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <Typography variant="body2">
              Are you sure you want to delete this rule?
            </Typography>
          </Alert>

          {selectedRule && (
            <Card sx={{ bgcolor: 'grey.50' }}>
              <CardContent>
                <Typography variant="body2" fontWeight="bold">
                  {selectedRule.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {selectedRule.config}
                </Typography>
              </CardContent>
            </Card>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setDeleteDialog(false)} startIcon={<Close />}>
            Cancel
          </Button>
          <Button variant="contained" color="error" startIcon={<Delete />} onClick={handleDeleteRule}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TimeBoundRulesPage;
