import React, { useState } from 'react';
import { Container, Typography, Box, Grid } from '@mui/material';
import BulkUpload from '../components/bulk/BulkUpload';
import BatchJobList from '../components/bulk/BatchJobList';

const BulkPaymentPage = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = (data) => {
    // Trigger refresh of batch job list
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Bulk Payment Processing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Upload batch files and monitor processing status
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <BulkUpload onUploadSuccess={handleUploadSuccess} />
        </Grid>
        <Grid item xs={12} md={8}>
          <BatchJobList refreshTrigger={refreshTrigger} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default BulkPaymentPage;
