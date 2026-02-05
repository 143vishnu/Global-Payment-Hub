import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Box,
  MenuItem,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { REGIONS, PAYMENT_STATUS } from '../../utils/constants';

const PaymentSearchFilters = ({ onSearch, onClear }) => {
  const [filters, setFilters] = useState({
    paymentId: '',
    startDate: '',
    endDate: '',
    region: '',
    status: '',
    minAmount: '',
    maxAmount: '',
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    const clearedFilters = {
      paymentId: '',
      startDate: '',
      endDate: '',
      region: '',
      status: '',
      minAmount: '',
      maxAmount: '',
    };
    setFilters(clearedFilters);
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Card 
      sx={{ 
        mb: 3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Payment ID"
              name="paymentId"
              value={filters.paymentId}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Start Date"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleChange}
              size="small"
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
              onChange={handleChange}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Region"
              name="region"
              value={filters.region}
              onChange={handleChange}
              size="small"
            >
              <MenuItem value="">All Regions</MenuItem>
              {REGIONS.map((region) => (
                <MenuItem key={region} value={region}>
                  {region.replace('_', ' ')}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={filters.status}
              onChange={handleChange}
              size="small"
            >
              <MenuItem value="">All Statuses</MenuItem>
              {Object.values(PAYMENT_STATUS).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Min Amount"
              name="minAmount"
              type="number"
              value={filters.minAmount}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Max Amount"
              name="maxAmount"
              type="number"
              value={filters.maxAmount}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" gap={1.5}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SearchIcon />}
                onClick={handleSearch}
                sx={{
                  py: 1,
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(30, 58, 138, 0.2)',
                  '&:hover': {
                    boxShadow: '0 4px 8px rgba(30, 58, 138, 0.3)',
                  },
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                startIcon={<ClearIcon />}
                onClick={handleClear}
                sx={{
                  py: 1,
                  fontWeight: 600,
                  borderWidth: 1.5,
                  '&:hover': {
                    borderWidth: 1.5,
                  },
                }}
              >
                Clear
              </Button>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PaymentSearchFilters;
