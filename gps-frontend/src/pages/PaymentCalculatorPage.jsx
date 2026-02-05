import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  Calculate,
  SwapHoriz,
  TrendingUp,
} from '@mui/icons-material';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$', rate: 1.0 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: 0.92 },
  { code: 'GBP', name: 'British Pound', symbol: '£', rate: 0.79 },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', rate: 149.50 },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', rate: 7.24 },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', rate: 83.12 },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', rate: 1.52 },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', rate: 1.35 },
];

const FEE_TYPES = {
  ACH: { name: 'ACH', percentage: 0.5, flatFee: 0.25 },
  WIRE: { name: 'Wire Transfer', percentage: 0, flatFee: 25.0 },
  SWIFT: { name: 'SWIFT', percentage: 0.1, flatFee: 45.0 },
  CARD: { name: 'Card Payment', percentage: 2.9, flatFee: 0.30 },
};

const PaymentCalculatorPage = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [paymentType, setPaymentType] = useState('ACH');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [fees, setFees] = useState(null);

  const handleCalculate = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      return;
    }

    const baseAmount = parseFloat(amount);
    const fromRate = CURRENCIES.find(c => c.code === fromCurrency)?.rate || 1;
    const toRate = CURRENCIES.find(c => c.code === toCurrency)?.rate || 1;
    
    // Convert to USD first, then to target currency
    const amountInUSD = baseAmount / fromRate;
    const converted = amountInUSD * toRate;
    
    // Calculate fees
    const feeConfig = FEE_TYPES[paymentType];
    const percentageFee = (converted * feeConfig.percentage) / 100;
    const totalFee = percentageFee + feeConfig.flatFee;
    const totalAmount = converted + totalFee;

    setConvertedAmount(converted);
    setFees({
      percentageFee,
      flatFee: feeConfig.flatFee,
      totalFee,
      totalAmount,
    });
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
    setFees(null);
  };

  const formatCurrency = (value, currencyCode) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    return `${currency?.symbol || ''}${value.toFixed(2)} ${currencyCode}`;
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Calculate />
          Payment Calculator & Currency Converter
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calculate payment fees and convert currencies for international transactions
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Calculator Input Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Transaction Details
              </Typography>
              
              <Box sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: CURRENCIES.find(c => c.code === fromCurrency)?.symbol,
                  }}
                />

                <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      select
                      label="From Currency"
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                    >
                      {CURRENCIES.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={2} sx={{ textAlign: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={handleSwapCurrencies}
                      sx={{ minWidth: 'auto', p: 1 }}
                    >
                      <SwapHoriz />
                    </Button>
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      fullWidth
                      select
                      label="To Currency"
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                    >
                      {CURRENCIES.map((currency) => (
                        <MenuItem key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  select
                  label="Payment Type"
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  sx={{ mb: 3 }}
                >
                  {Object.entries(FEE_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.name}
                    </MenuItem>
                  ))}
                </TextField>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCalculate}
                  startIcon={<Calculate />}
                >
                  Calculate
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Exchange Rate Info */}
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp fontSize="small" />
                Current Exchange Rates
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                All rates relative to USD (Base: 1.00)
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {CURRENCIES.slice(1).map((currency) => (
                  <Chip
                    key={currency.code}
                    label={`${currency.code}: ${currency.rate.toFixed(2)}`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Results Section */}
        <Grid item xs={12} md={6}>
          {convertedAmount !== null && fees !== null ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Calculation Results
                </Typography>
                
                <Box sx={{ mt: 3 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Original Amount
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(parseFloat(amount), fromCurrency)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Converted Amount
                    </Typography>
                    <Typography variant="h5">
                      {formatCurrency(convertedAmount, toCurrency)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                    Fee Breakdown
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Percentage Fee ({FEE_TYPES[paymentType].percentage}%)
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(fees.percentageFee, toCurrency)}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Flat Fee
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(fees.flatFee, toCurrency)}
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="body1" fontWeight={600}>
                        Total Fee
                      </Typography>
                      <Typography variant="body1" fontWeight={600} color="warning.main">
                        {formatCurrency(fees.totalFee, toCurrency)}
                      </Typography>
                    </Box>
                  </Box>

                  <Alert severity="info" sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Total Amount to be Transferred
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(fees.totalAmount, toCurrency)}
                    </Typography>
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <Calculate sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Enter amount and click Calculate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Results will appear here
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentCalculatorPage;
