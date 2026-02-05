import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
} from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';
import LivePaymentTimeline from '../components/common/LivePaymentTimeline';

const PaymentTimelinePage = () => {
  const [paymentId, setPaymentId] = useState('PAY-12345');
  const [showTimeline, setShowTimeline] = useState(false);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimelineIcon sx={{ fontSize: 32 }} />
          Live Payment Timeline (Playback Mode)
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visual troubleshooting - Watch payments flow through the system in real-time
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Start Payment Tracking
              </Typography>
              <TextField
                fullWidth
                label="Payment ID"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                fullWidth
                variant="contained"
                onClick={() => setShowTimeline(true)}
              >
                Track Payment
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          {showTimeline ? (
            <LivePaymentTimeline paymentId={paymentId} />
          ) : (
            <Card>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <TimelineIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  Enter a Payment ID to begin tracking
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default PaymentTimelinePage;
