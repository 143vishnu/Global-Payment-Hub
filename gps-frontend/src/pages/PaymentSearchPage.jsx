import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import { usePayment } from '../context/PaymentContext';
import PaymentSearchFilters from '../components/payments/PaymentSearchFilters';
import DataTable from '../components/common/DataTable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import StatusChip from '../components/common/StatusChip';
import { formatCurrency, formatDateTime } from '../utils/helpers';

const PaymentSearchPage = () => {
  const navigate = useNavigate();
  const { payments, loading, error, searchPayments } = usePayment();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [orderBy, setOrderBy] = useState('createdDate');
  const [order, setOrder] = useState('desc');
  const [currentFilters, setCurrentFilters] = useState({});

  const handleSearch = useCallback(async (filters) => {
    setCurrentFilters(filters);
    setPage(0);
    try {
      const result = await searchPayments({
        ...filters,
        page: 0,
        size: rowsPerPage,
        sort: `${orderBy},${order}`,
      });
      setTotalCount(result.totalElements || result.length || 0);
    } catch (err) {
      console.error('Search failed:', err);
    }
  }, [searchPayments, rowsPerPage, orderBy, order]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    handleSearch({});
  }, []);

  const handleClear = () => {
    handleSearch({});
  };

  const handlePageChange = async (newPage) => {
    setPage(newPage);
    try {
      const result = await searchPayments({
        ...currentFilters,
        page: newPage,
        size: rowsPerPage,
        sort: `${orderBy},${order}`,
      });
      setTotalCount(result.totalElements || result.length || 0);
    } catch (err) {
      console.error('Page change failed:', err);
    }
  };

  const handleRowsPerPageChange = async (newSize) => {
    setRowsPerPage(newSize);
    setPage(0);
    try {
      const result = await searchPayments({
        ...currentFilters,
        page: 0,
        size: newSize,
        sort: `${orderBy},${order}`,
      });
      setTotalCount(result.totalElements || result.length || 0);
    } catch (err) {
      console.error('Page size change failed:', err);
    }
  };

  const handleSort = async (column, direction) => {
    setOrderBy(column);
    setOrder(direction);
    try {
      const result = await searchPayments({
        ...currentFilters,
        page,
        size: rowsPerPage,
        sort: `${column},${direction}`,
      });
      setTotalCount(result.totalElements || result.length || 0);
    } catch (err) {
      console.error('Sort failed:', err);
    }
  };

  const handleRowClick = (row) => {
    navigate(`/payments/${row.id}`);
  };

  const columns = [
    { 
      id: 'paymentId', 
      label: 'Payment ID', 
      minWidth: 150,
      format: (value) => value || '-',
    },
    { 
      id: 'amount', 
      label: 'Amount', 
      minWidth: 120,
      format: (value, row) => formatCurrency(value, row.currency),
    },
    { 
      id: 'status', 
      label: 'Status', 
      minWidth: 120,
      format: (value) => <StatusChip status={value} />,
    },
    { 
      id: 'region', 
      label: 'Region', 
      minWidth: 120,
      format: (value) => value?.replace('_', ' ') || '-',
    },
    { 
      id: 'paymentType', 
      label: 'Type', 
      minWidth: 100,
    },
    { 
      id: 'createdDate', 
      label: 'Created Date', 
      minWidth: 180,
      format: (value) => formatDateTime(value),
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.75rem', sm: '2rem' },
            color: 'text.primary',
            letterSpacing: '-0.02em',
            mb: 0.5,
          }}
        >
          Payment Search
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            fontSize: '0.95rem',
          }}
        >
          Search and filter payment transactions
        </Typography>
      </Box>

      <PaymentSearchFilters onSearch={handleSearch} onClear={handleClear} />

      {error && <ErrorMessage error={error} />}

      {loading && !payments.length ? (
        <LoadingSpinner message="Searching payments..." />
      ) : (
        <DataTable
          columns={columns}
          data={payments}
          page={page}
          rowsPerPage={rowsPerPage}
          totalCount={totalCount}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onSort={handleSort}
          orderBy={orderBy}
          order={order}
          onRowClick={handleRowClick}
          loading={loading}
          emptyMessage="No payments found. Try adjusting your search filters."
        />
      )}
    </Container>
  );
};

export default PaymentSearchPage;
