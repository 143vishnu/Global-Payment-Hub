import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FileCopy as CopyIcon,
  BookmarkBorder,
} from '@mui/icons-material';
import { PAYMENT_TYPES, REGIONS } from '../utils/constants';

const INITIAL_TEMPLATES = [
  {
    id: 1,
    name: 'Monthly Vendor Payment',
    description: 'Standard monthly payment to vendors',
    paymentType: 'ACH',
    region: 'NA',
    amount: '5000.00',
    currency: 'USD',
    frequency: 'Monthly',
  },
  {
    id: 2,
    name: 'International Wire Transfer',
    description: 'High-value wire transfer for international partners',
    paymentType: 'WIRE',
    region: 'EU',
    amount: '50000.00',
    currency: 'EUR',
    frequency: 'As Needed',
  },
  {
    id: 3,
    name: 'Payroll Processing',
    description: 'Bi-weekly employee payroll batch',
    paymentType: 'ACH',
    region: 'NA',
    amount: '150000.00',
    currency: 'USD',
    frequency: 'Bi-weekly',
  },
];

const PaymentTemplatesPage = () => {
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    paymentType: '',
    region: '',
    amount: '',
    currency: 'USD',
    frequency: '',
  });

  const handleOpenDialog = (template = null) => {
    if (template) {
      setEditingTemplate(template);
      setFormData(template);
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        description: '',
        paymentType: '',
        region: '',
        amount: '',
        currency: 'USD',
        frequency: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTemplate(null);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(prev =>
        prev.map(t => (t.id === editingTemplate.id ? { ...formData, id: t.id } : t))
      );
    } else {
      // Add new template
      const newTemplate = {
        ...formData,
        id: templates.length > 0 ? Math.max(...templates.map(t => t.id)) + 1 : 1,
      };
      setTemplates(prev => [...prev, newTemplate]);
    }
    handleCloseDialog();
  };

  const handleDeleteTemplate = (id) => {
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const handleUseTemplate = (template) => {
    // In a real app, this would navigate to payment creation with pre-filled data
    alert(`Using template: ${template.name}\n\nThis would navigate to the payment creation page with pre-filled data.`);
  };

  const handleDuplicateTemplate = (template) => {
    const newTemplate = {
      ...template,
      id: Math.max(...templates.map(t => t.id)) + 1,
      name: `${template.name} (Copy)`,
    };
    setTemplates(prev => [...prev, newTemplate]);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BookmarkBorder />
            Payment Templates
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage reusable payment templates for faster processing
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          New Template
        </Button>
      </Box>

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} lg={4} key={template.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {template.name}
                  </Typography>
                  <Box>
                    <IconButton size="small" onClick={() => handleOpenDialog(template)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteTemplate(template.id)} color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {template.description}
                </Typography>

                <Box sx={{ mb: 2 }}>
                  <Chip label={template.paymentType} size="small" color="primary" sx={{ mr: 1, mb: 1 }} />
                  <Chip label={template.region} size="small" variant="outlined" sx={{ mr: 1, mb: 1 }} />
                  <Chip label={template.frequency} size="small" variant="outlined" sx={{ mb: 1 }} />
                </Box>

                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  {template.currency} {parseFloat(template.amount).toLocaleString()}
                </Typography>
              </CardContent>

              <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  startIcon={<CopyIcon />}
                  onClick={() => handleDuplicateTemplate(template)}
                >
                  Duplicate
                </Button>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleUseTemplate(template)}
                >
                  Use Template
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}

        {templates.length === 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <BookmarkBorder sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No Templates Yet
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Create your first payment template to streamline recurring payments
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenDialog()}
                >
                  Create Template
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Template Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTemplate ? 'Edit Template' : 'Create New Template'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Template Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />

            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Payment Type"
                  name="paymentType"
                  value={formData.paymentType}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(PAYMENT_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  select
                  label="Region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                >
                  {Object.entries(REGIONS).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  select
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  <MenuItem value="USD">USD</MenuItem>
                  <MenuItem value="EUR">EUR</MenuItem>
                  <MenuItem value="GBP">GBP</MenuItem>
                  <MenuItem value="JPY">JPY</MenuItem>
                </TextField>
              </Grid>
            </Grid>

            <TextField
              fullWidth
              select
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              sx={{ mt: 2 }}
              required
            >
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Bi-weekly">Bi-weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Quarterly">Quarterly</MenuItem>
              <MenuItem value="As Needed">As Needed</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveTemplate}
            disabled={!formData.name || !formData.paymentType || !formData.region || !formData.amount || !formData.frequency}
          >
            {editingTemplate ? 'Update' : 'Create'} Template
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentTemplatesPage;
