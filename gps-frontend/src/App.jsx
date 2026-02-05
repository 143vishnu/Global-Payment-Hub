import React from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PaymentProvider } from './context/PaymentContext';
import { BatchProvider } from './context/BatchContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <PaymentProvider>
          <BatchProvider>
            <AppRoutes />
          </BatchProvider>
        </PaymentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
