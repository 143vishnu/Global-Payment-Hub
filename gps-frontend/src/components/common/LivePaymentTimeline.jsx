import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Replay,
  PhoneAndroid,
  Cloud,
  AccountTree,
  AccountBalance,
  CheckCircle,
  Error,
  Schedule,
} from '@mui/icons-material';

const TIMELINE_STEPS = [
  {
    label: 'Channel Input',
    icon: <PhoneAndroid />,
    description: 'Mobile App',
    avgLatency: 45,
  },
  {
    label: 'Isolation Layer',
    icon: <Cloud />,
    description: 'LDM Transformation',
    avgLatency: 120,
  },
  {
    label: 'Graphite Core',
    icon: <AccountTree />,
    description: 'Payment Engine Processing',
    avgLatency: 350,
  },
  {
    label: 'Clearing/Routing',
    icon: <AccountBalance />,
    description: 'ACH Network',
    avgLatency: 890,
  },
];

const LivePaymentTimeline = ({ paymentId, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [stepStatus, setStepStatus] = useState(TIMELINE_STEPS.map(() => 'pending'));
  const [stepLatencies, setStepLatencies] = useState([]);
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < TIMELINE_STEPS.length - 1) {
          const newLatency = TIMELINE_STEPS[prev].avgLatency + Math.floor(Math.random() * 50) - 25;
          setStepLatencies(prevLatencies => [...prevLatencies, newLatency]);
          setTotalTime(prevTotal => prevTotal + newLatency);
          
          // Randomly set status
          const statuses = ['success', 'success', 'success', 'warning'];
          setStepStatus(prevStatus => {
            const newStatus = [...prevStatus];
            newStatus[prev] = statuses[Math.floor(Math.random() * statuses.length)];
            return newStatus;
          });
          
          return prev + 1;
        } else {
          setIsPlaying(false);
          setStepStatus(prevStatus => {
            const newStatus = [...prevStatus];
            newStatus[prev] = 'success';
            return newStatus;
          });
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    setActiveStep(0);
    setStepStatus(TIMELINE_STEPS.map(() => 'pending'));
    setStepLatencies([]);
    setTotalTime(0);
    setIsPlaying(true);
  };

  const getStatusIcon = (status, index) => {
    if (index > activeStep) return <Schedule sx={{ color: 'action.disabled' }} />;
    if (status === 'success') return <CheckCircle sx={{ color: 'success.main' }} />;
    if (status === 'warning') return <Schedule sx={{ color: 'warning.main' }} />;
    if (status === 'error') return <Error sx={{ color: 'error.main' }} />;
    return <Schedule sx={{ color: 'action.disabled' }} />;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Live Payment Timeline
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Payment ID: {paymentId || 'PAY-12345'}
            </Typography>
          </Box>
          <Box>
            <Tooltip title={isPlaying ? "Pause" : "Play"}>
              <IconButton onClick={handlePlayPause} color="primary">
                {isPlaying ? <Pause /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Replay">
              <IconButton onClick={handleReplay} color="primary">
                <Replay />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Total Time */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Total Processing Time
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary">
            {totalTime}ms
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(activeStep / TIMELINE_STEPS.length) * 100} 
            sx={{ mt: 1 }}
          />
        </Box>

        {/* Animated Timeline */}
        <Stepper activeStep={activeStep} orientation="vertical">
          {TIMELINE_STEPS.map((step, index) => (
            <Step key={step.label} completed={index < activeStep}>
              <StepLabel
                StepIconComponent={() => getStatusIcon(stepStatus[index], index)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {step.label}
                  </Typography>
                  {index <= activeStep && stepLatencies[index] && (
                    <Chip 
                      label={`${stepLatencies[index]}ms`}
                      size="small"
                      color={getStatusColor(stepStatus[index])}
                    />
                  )}
                  {index === activeStep && isPlaying && (
                    <Chip label="Processing..." size="small" color="primary" />
                  )}
                </Box>
              </StepLabel>
              <StepContent>
                <Box sx={{ py: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {step.icon}
                    <Typography variant="body2" color="text.secondary">
                      {step.description}
                    </Typography>
                  </Box>
                  
                  {index <= activeStep && (
                    <>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Timestamp: {new Date().toLocaleTimeString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Status: {stepStatus[index] === 'success' ? 'Completed Successfully' : 'Processing'}
                      </Typography>
                      
                      {stepStatus[index] === 'warning' && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: 'warning.light', borderRadius: 1 }}>
                          <Typography variant="caption" color="warning.dark">
                            ⚠️ Slightly slower than average ({step.avgLatency}ms avg)
                          </Typography>
                        </Box>
                      )}
                      
                      {stepStatus[index] === 'success' && index < activeStep && (
                        <LinearProgress 
                          variant="determinate" 
                          value={100} 
                          color="success"
                          sx={{ mt: 1 }}
                        />
                      )}
                      
                      {index === activeStep && isPlaying && (
                        <LinearProgress sx={{ mt: 1 }} />
                      )}
                    </>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>

        {/* Completion Message */}
        {activeStep === TIMELINE_STEPS.length && !isPlaying && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'success.light', borderRadius: 1, textAlign: 'center' }}>
            <CheckCircle sx={{ fontSize: 48, color: 'success.dark', mb: 1 }} />
            <Typography variant="h6" color="success.dark">
              Payment Completed Successfully
            </Typography>
            <Typography variant="body2" color="success.dark">
              Total time: {totalTime}ms
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LivePaymentTimeline;
