import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

const ErrorMessage = ({ 
  error, 
  title = 'Error', 
  severity = 'error',
  onClose 
}) => {
  if (!error) return null;

  return (
    <Box mb={2}>
      <Alert 
        severity={severity} 
        onClose={onClose}
        sx={{
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: `${severity}.light`,
          '& .MuiAlert-icon': {
            fontSize: '1.5rem',
          },
          '& .MuiAlert-message': {
            fontSize: '0.9rem',
            fontWeight: 500,
          },
        }}
      >
        {title && (
          <AlertTitle sx={{ fontWeight: 600, fontSize: '1rem' }}>
            {title}
          </AlertTitle>
        )}
        {typeof error === 'string' ? error : error.message || 'An error occurred'}
      </Alert>
    </Box>
  );
};

export default ErrorMessage;
