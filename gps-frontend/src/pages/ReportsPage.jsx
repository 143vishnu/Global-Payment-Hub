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
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import reportService from '../services/reportService';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatCurrency, formatDateTime, downloadFile } from '../utils/helpers';
import { REGIONS, PAYMENT_TYPES } from '../utils/constants';

const ReportsPage = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    region: '',
    paymentType: '',
  });

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setReportData([]);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerateReport = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let data;
      if (currentTab === 0) {
        // Daily Report
        data = await reportService.getDailyReport(
          filters.startDate,
          filters.endDate,
          { region: filters.region, paymentType: filters.paymentType }
        );
      } else {
        // Audit Report
        data = await reportService.getAuditReport(
          filters.startDate,
          filters.endDate,
          { region: filters.region }
        );
      }
      setReportData(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCSV = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const reportType = currentTab === 0 ? 'daily' : 'audit';
      const blob = await reportService.downloadCSV(
        reportType,
        filters.startDate,
        filters.endDate,
        { region: filters.region, paymentType: filters.paymentType }
      );
      downloadFile(blob, `${reportType}-report-${filters.startDate}-to-${filters.endDate}.csv`);
    } catch (err) {
      console.error('Download CSV error:', err);
      setError(err.message || 'Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (!filters.startDate || !filters.endDate) {
      setError('Please select both start and end dates');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const reportType = currentTab === 0 ? 'daily' : 'audit';
      const blob = await reportService.downloadExcel(
        reportType,
        filters.startDate,
        filters.endDate,
        { region: filters.region, paymentType: filters.paymentType }
      );
      downloadFile(blob, `${reportType}-report-${filters.startDate}-to-${filters.endDate}.xlsx`);
    } catch (err) {
      console.error('Download Excel error:', err);
      setError(err.message || 'Failed to download report');
    } finally {
      setLoading(false);
    }
  };

  const dailyReportColumns = [
    { id: 'date', label: 'Date', minWidth: 120, format: (value) => formatDateTime(value) },
    { id: 'totalPayments', label: 'Total Payments', minWidth: 120 },
    { id: 'successCount', label: 'Successful', minWidth: 100 },
    { id: 'failedCount', label: 'Failed', minWidth: 100 },
    { id: 'totalAmount', label: 'Total Amount', minWidth: 150, format: (value) => formatCurrency(value) },
    { id: 'region', label: 'Region', minWidth: 120 },
  ];

  const auditReportColumns = [
    { id: 'timestamp', label: 'Timestamp', minWidth: 180, format: (value) => formatDateTime(value) },
    { id: 'user', label: 'User', minWidth: 150 },
    { id: 'action', label: 'Action', minWidth: 150 },
    { id: 'paymentId', label: 'Payment ID', minWidth: 150 },
    { id: 'details', label: 'Details', minWidth: 250 },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Reports & Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Generate and download payment reports
        </Typography>
      </Box>

      {error && <ErrorMessage error={error} onClose={() => setError(null)} />}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab label="Daily Report" />
                <Tab label="Audit Report" />
              </Tabs>

              <Box sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={filters.startDate}
                      onChange={handleFilterChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <TextField
                      fullWidth
                      label="End Date"
                      name="endDate"
                      type="date"
                      value={filters.endDate}
                      onChange={handleFilterChange}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      select
                      label="Region"
                      name="region"
                      value={filters.region}
                      onChange={handleFilterChange}
                    >
                      <MenuItem value="">All</MenuItem>
                      {REGIONS.map((region) => (
                        <MenuItem key={region} value={region}>
                          {region.replace('_', ' ')}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {currentTab === 0 && (
                    <Grid item xs={12} sm={6} md={2}>
                      <TextField
                        fullWidth
                        select
                        label="Payment Type"
                        name="paymentType"
                        value={filters.paymentType}
                        onChange={handleFilterChange}
                      >
                        <MenuItem value="">All</MenuItem>
                        {PAYMENT_TYPES.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} md={2}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={handleGenerateReport}
                      disabled={loading}
                      sx={{ height: '56px' }}
                    >
                      Generate
                    </Button>
                  </Grid>
                </Grid>

                <Box display="flex" gap={2} mt={2}>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadCSV}
                    disabled={loading}
                  >
                    Download CSV
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownloadExcel}
                    disabled={loading}
                  >
                    Download Excel
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {loading ? (
            <LoadingSpinner message="Generating report..." />
          ) : reportData.length > 0 ? (
            <DataTable
              columns={currentTab === 0 ? dailyReportColumns : auditReportColumns}
              data={reportData}
              emptyMessage="No data available for the selected filters"
            />
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ReportsPage;
