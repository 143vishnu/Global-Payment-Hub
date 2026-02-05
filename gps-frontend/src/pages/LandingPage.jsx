import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Link,
  Fade,
  useScrollTrigger,
  Chip,
} from '@mui/material';
import {
  AccountBalance,
  Security,
  Speed,
  Language,
  Shield,
  Lock,
  VerifiedUser,
  Assessment,
  Sync,
  CloudQueue,
  Storage,
  Timeline,
  AccountTree,
  CreditCard,
  Payment,
  MonetizationOn,
} from '@mui/icons-material';

// Sticky navbar on scroll
function ElevationScroll({ children }) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleExploreCTAClick = () => {
    const capabilitiesSection = document.getElementById('capabilities');
    if (capabilitiesSection) {
      capabilitiesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f5f5' }}>
      {/* Navigation Bar */}
      <ElevationScroll>
        <AppBar
          position="sticky"
          sx={{
            bgcolor: '#0f172a',
            color: 'white',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AccountBalance sx={{ fontSize: 32, color: '#14b8a6' }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  fontSize: '1.125rem',
                }}
              >
                GPH | Global Payments Hub
              </Typography>
            </Box>

            {/* Navigation Menu */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4, alignItems: 'center' }}>
              <Link
                onClick={() => scrollToSection('home')}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#90caf9' },
                  transition: 'color 0.3s',
                }}
              >
                Home
              </Link>
              <Link
                onClick={() => scrollToSection('platform')}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#90caf9' },
                  transition: 'color 0.3s',
                }}
              >
                Platform
              </Link>
              <Link
                onClick={() => scrollToSection('capabilities')}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#90caf9' },
                  transition: 'color 0.3s',
                }}
              >
                Capabilities
              </Link>
              <Link
                onClick={() => scrollToSection('security')}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#90caf9' },
                  transition: 'color 0.3s',
                }}
              >
                Security
              </Link>
              <Link
                onClick={() => scrollToSection('contact')}
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: '#90caf9' },
                  transition: 'color 0.3s',
                }}
              >
                Contact
              </Link>

              {/* Login Button */}
              <Button
                variant="contained"
                onClick={handleLoginClick}
                sx={{
                  bgcolor: '#1e3a8a',
                  color: 'white',
                  fontWeight: 600,
                  px: 3.5,
                  py: 1.25,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  boxShadow: '0 2px 8px rgba(30, 58, 138, 0.3)',
                  '&:hover': {
                    bgcolor: '#1e40af',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 16px rgba(30, 58, 138, 0.4)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                Login
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
      </ElevationScroll>

      {/* Hero Section */}
      <Box
        id="home"
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0d9488 100%)',
          color: 'white',
          py: { xs: 10, md: 16 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            filter: 'blur(80px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'rgba(25, 118, 210, 0.1)',
            filter: 'blur(100px)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Fade in timeout={1000}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  letterSpacing: '-0.5px',
                }}
              >
                Global Payments. One Unified Platform.
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 5,
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontWeight: 400,
                  maxWidth: 700,
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                }}
              >
                Standardizing payment processing across regions, channels, and currencies.
              </Typography>

              {/* CTA Buttons */}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLoginClick}
                  sx={{
                    bgcolor: 'white',
                    color: '#0A1A2F',
                    fontWeight: 600,
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                    '&:hover': {
                      bgcolor: '#f5f5f5',
                      transform: 'translateY(-3px)',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Login to Platform
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleExploreCTAClick}
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    borderWidth: 2,
                    '&:hover': {
                      borderWidth: 2,
                      borderColor: 'white',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-3px)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Explore Capabilities
                </Button>
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      {/* Platform Overview Section */}
      <Box id="platform" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#0A1A2F',
            }}
          >
            Platform Overview
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 8,
              color: '#666',
              fontWeight: 400,
            }}
          >
            Enterprise-grade payment infrastructure designed for global scale
          </Typography>

          <Grid container spacing={4}>
            {/* Card 1 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Storage sx={{ fontSize: 40, color: '#1976d2' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0A1A2F' }}>
                    Unified Payment Engine
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                    Single core (Graphite) for all regions. Consistent processing logic across all
                    channels and geographies.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: '#f3e5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <AccountTree sx={{ fontSize: 40, color: '#7b1fa2' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0A1A2F' }}>
                    Isolation Layer
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                    Channel-agnostic transformation (LDM). Seamless integration with existing
                    banking channels.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3 */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  height: '100%',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  borderRadius: 3,
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      bgcolor: '#e8f5e9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <Speed sx={{ fontSize: 40, color: '#388e3c' }} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#0A1A2F' }}>
                    Extensible & Scalable
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#666', lineHeight: 1.7 }}>
                    Regional customization without core changes. Built for high-volume,
                    mission-critical operations.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Key Capabilities Section */}
      <Box id="capabilities" sx={{ py: 10, bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#0A1A2F',
            }}
          >
            Key Capabilities
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 8,
              color: '#666',
              fontWeight: 400,
            }}
          >
            Comprehensive payment processing features for modern banking
          </Typography>

          <Grid container spacing={3}>
            {[
              { icon: <Speed />, title: 'Real-time Payment Processing', color: '#1976d2' },
              { icon: <Sync />, title: 'Kafka & IBM MQ Integration', color: '#7b1fa2' },
              { icon: <CreditCard />, title: 'Batch & High-Value Payments', color: '#388e3c' },
              { icon: <Assessment />, title: 'Exception Handling & Retries', color: '#f57c00' },
              { icon: <Timeline />, title: 'Audit Trail & Compliance', color: '#d32f2f' },
              { icon: <Language />, title: 'Multi-Region & Multi-Currency', color: '#0288d1' },
              { icon: <CloudQueue />, title: 'Cloud-Native Architecture', color: '#5e35b1' },
              { icon: <Payment />, title: 'ACH, Wire & SWIFT Support', color: '#00796b' },
              { icon: <MonetizationOn />, title: 'Fee Calculation Engine', color: '#c62828' },
            ].map((capability, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    p: 3,
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 6px 24px rgba(0, 0, 0, 0.12)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: 2,
                      bgcolor: `${capability.color}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {React.cloneElement(capability.icon, {
                      sx: { fontSize: 28, color: capability.color },
                    })}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600, color: '#0A1A2F' }}>
                    {capability.title}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Security & Compliance Section */}
      <Box id="security" sx={{ py: 10, bgcolor: 'white' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Shield sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 2,
                color: '#0A1A2F',
              }}
            >
              Security & Compliance
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                fontWeight: 400,
              }}
            >
              Bank-grade security standards you can trust
            </Typography>
          </Box>

          <Grid container spacing={4} justifyContent="center">
            {[
              {
                icon: <VerifiedUser />,
                title: 'PCI-DSS Compliant',
                description: 'Full compliance with Payment Card Industry Data Security Standards',
              },
              {
                icon: <Lock />,
                title: 'End-to-End Encryption',
                description: 'Advanced encryption for all data in transit and at rest',
              },
              {
                icon: <Security />,
                title: 'Role-Based Access Control',
                description: 'Granular permissions and multi-factor authentication',
              },
              {
                icon: <Timeline />,
                title: 'Full Audit Logging',
                description: 'Comprehensive activity tracking and compliance reporting',
              },
            ].map((item, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      bgcolor: '#e3f2fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    {React.cloneElement(item.icon, { sx: { fontSize: 50, color: '#1976d2' } })}
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0A1A2F' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                    {item.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mt: 6, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Chip
                label="SOC 2 Type II"
                sx={{ px: 2, py: 3, fontSize: '0.95rem', fontWeight: 600 }}
              />
              <Chip
                label="ISO 27001"
                sx={{ px: 2, py: 3, fontSize: '0.95rem', fontWeight: 600 }}
              />
              <Chip
                label="GDPR Compliant"
                sx={{ px: 2, py: 3, fontSize: '0.95rem', fontWeight: 600 }}
              />
              <Chip
                label="FINRA Approved"
                sx={{ px: 2, py: 3, fontSize: '0.95rem', fontWeight: 600 }}
              />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Architecture Snapshot Section */}
      <Box sx={{ py: 10, bgcolor: '#f9fafb' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            sx={{
              fontWeight: 700,
              mb: 2,
              color: '#0A1A2F',
            }}
          >
            Architecture Snapshot
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              mb: 6,
              color: '#666',
              fontWeight: 400,
            }}
          >
            Designed for high throughput and zero-downtime processing
          </Typography>

          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 3,
              p: 5,
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
            }}
          >
            {/* Architecture Diagram */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              {/* Channels */}
              <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
                <Box
                  sx={{
                    bgcolor: '#e3f2fd',
                    borderRadius: 2,
                    p: 3,
                    border: '2px solid #1976d2',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0A1A2F' }}>
                    Channels
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    Mobile, Web, API
                  </Typography>
                </Box>
              </Box>

              {/* Arrow */}
              <Typography variant="h4" sx={{ color: '#1976d2', display: { xs: 'none', md: 'block' } }}>
                →
              </Typography>

              {/* Isolation Layer */}
              <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
                <Box
                  sx={{
                    bgcolor: '#f3e5f5',
                    borderRadius: 2,
                    p: 3,
                    border: '2px solid #7b1fa2',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0A1A2F' }}>
                    Isolation Layer
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    LDM Transform
                  </Typography>
                </Box>
              </Box>

              {/* Arrow */}
              <Typography variant="h4" sx={{ color: '#1976d2', display: { xs: 'none', md: 'block' } }}>
                →
              </Typography>

              {/* Graphite Core */}
              <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
                <Box
                  sx={{
                    bgcolor: '#e8f5e9',
                    borderRadius: 2,
                    p: 3,
                    border: '2px solid #388e3c',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0A1A2F' }}>
                    Graphite Core
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    Payment Engine
                  </Typography>
                </Box>
              </Box>

              {/* Arrow */}
              <Typography variant="h4" sx={{ color: '#1976d2', display: { xs: 'none', md: 'block' } }}>
                →
              </Typography>

              {/* Clearing/Routing */}
              <Box sx={{ textAlign: 'center', flex: 1, minWidth: 150 }}>
                <Box
                  sx={{
                    bgcolor: '#fff3e0',
                    borderRadius: 2,
                    p: 3,
                    border: '2px solid #f57c00',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#0A1A2F' }}>
                    Clearing/Routing
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                    ACH, SWIFT, Wire
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #0A1A2F 0%, #1F3A8A 100%)',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 3,
            }}
          >
            Ready to Process Payments at Global Scale?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              mb: 5,
              color: 'rgba(255, 255, 255, 0.85)',
              fontWeight: 400,
            }}
          >
            Join the enterprise platform trusted by financial institutions worldwide
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleLoginClick}
            sx={{
              bgcolor: 'white',
              color: '#0A1A2F',
              fontWeight: 600,
              px: 6,
              py: 2.5,
              fontSize: '1.2rem',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              '&:hover': {
                bgcolor: '#f5f5f5',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)',
              },
              transition: 'all 0.3s',
            }}
          >
            Access GPS Platform
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box
        id="contact"
        sx={{
          bgcolor: '#0A1A2F',
          color: 'white',
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6}>
            {/* Company Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AccountBalance sx={{ fontSize: 32, color: '#14b8a6' }} />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Global Payment Hub
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, lineHeight: 1.8 }}>
                Enterprise payment infrastructure designed for global scale. Processing millions of transactions across 150+ countries with bank-grade security and compliance.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Chip 
                  label="PCI DSS Compliant" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(20, 184, 166, 0.2)', color: '#14b8a6', fontWeight: 600 }} 
                />
                <Chip 
                  label="ISO 27001" 
                  size="small" 
                  sx={{ bgcolor: 'rgba(20, 184, 166, 0.2)', color: '#14b8a6', fontWeight: 600 }} 
                />
              </Box>
            </Grid>

            {/* Quick Links */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Platform
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Link
                  onClick={() => scrollToSection('capabilities')}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Capabilities
                </Link>
                <Link
                  onClick={() => scrollToSection('security')}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Security
                </Link>
                <Link
                  onClick={handleLoginClick}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Dashboard
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  API Docs
                </Link>
              </Box>
            </Grid>

            {/* Resources */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Resources
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Documentation
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Integration Guide
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Release Notes
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Status Page
                </Link>
              </Box>
            </Grid>

            {/* Support */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Support
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Help Center
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Contact Us
                </Link>
                <Link
                  href="#"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    textDecoration: 'none',
                    '&:hover': { color: 'white' },
                    transition: 'color 0.3s',
                  }}
                >
                  Community
                </Link>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.85rem',
                  }}
                >
                  24/7 Support
                </Typography>
              </Box>
            </Grid>

            {/* Contact */}
            <Grid item xs={12} sm={6} md={2}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Contact
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  support@gph.com
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                  }}
                >
                  +1 (555) 123-4567
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.9rem',
                    lineHeight: 1.6,
                  }}
                >
                  123 Financial District<br/>
                  New York, NY 10004
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Bottom Footer */}
          <Box
            sx={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              mt: 6,
              pt: 4,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              © 2026 Global Payment Hub. All rights reserved.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: 'white' },
                  transition: 'color 0.3s',
                }}
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: 'white' },
                  transition: 'color 0.3s',
                }}
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: 'white' },
                  transition: 'color 0.3s',
                }}
              >
                Cookie Policy
              </Link>
              <Link
                href="#"
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  '&:hover': { color: 'white' },
                  transition: 'color 0.3s',
                }}
              >
                Compliance
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
