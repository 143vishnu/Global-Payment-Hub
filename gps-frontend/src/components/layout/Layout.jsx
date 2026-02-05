import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  CloudUpload as UploadIcon,
  Error as ErrorIcon,
  Assessment as ReportIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  AccountBalance as BankIcon,
  Calculate as CalculateIcon,
  BookmarkBorder as TemplateIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  MonitorHeart as HealthIcon,
  Autorenew as RetryIcon,
  Timeline as TimelineIcon,
  SwapHoriz as HandoverIcon,
  Fingerprint as FingerprintIcon,
  BugReport as RootCauseIcon,
  Balance as LoadBalancerIcon,
  TrendingDown as LeakageIcon,
  Psychology as SimulatorIcon,
  Speed as BottleneckIcon,
  VerifiedUser as SLAIcon,
  Flag as CorridorIcon,
  SentimentSatisfied as ExperienceIcon,
  Gavel as RegulatoryIcon,
  CalendarToday as SeasonalityIcon,
  Preview as ImpactIcon,
  History as VersionIcon,
  AccessTime as TimeBoundIcon,
  Science as ShadowIcon,
  Assessment as BlastIcon,
  Security as FailSafeIcon,
  CompareArrows as DriftIcon,
  Build as DebtIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import NotificationPanel from '../common/NotificationPanel';
import { ROLES } from '../../utils/constants';

const DRAWER_WIDTH = 240;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout, hasAnyRole } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/');
  };

  const menuItems = [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/dashboard',
      roles: [ROLES.OPS_USER, ROLES.ADMIN, ROLES.BUSINESS_USER],
    },
    {
      text: 'Payment Search',
      icon: <SearchIcon />,
      path: '/payments',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Bulk Payment',
      icon: <UploadIcon />,
      path: '/bulk',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Payment Calculator',
      icon: <CalculateIcon />,
      path: '/calculator',
      roles: [ROLES.OPS_USER, ROLES.ADMIN, ROLES.BUSINESS_USER],
    },
    {
      text: 'Payment Templates',
      icon: <TemplateIcon />,
      path: '/templates',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      divider: true,
      text: 'Control Tower',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Health Score',
      icon: <HealthIcon />,
      path: '/health-score',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Smart Retry',
      icon: <RetryIcon />,
      path: '/smart-retry',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Live Timeline',
      icon: <TimelineIcon />,
      path: '/timeline',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Shift Handover',
      icon: <HandoverIcon />,
      path: '/handover',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'DNA Analyzer',
      icon: <FingerprintIcon />,
      path: '/dna-analyzer',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Root Cause',
      icon: <RootCauseIcon />,
      path: '/root-cause',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Load Balancer',
      icon: <LoadBalancerIcon />,
      path: '/load-balancer',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      divider: true,
      roles: [ROLES.OPS_USER, ROLES.ADMIN, ROLES.BUSINESS_USER],
    },
    {
      divider: true,
      text: 'Business Intelligence',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'Revenue Leakage',
      icon: <LeakageIcon />,
      path: '/revenue-leakage',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'What-If Simulator',
      icon: <SimulatorIcon />,
      path: '/what-if-simulator',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'Bottleneck Map',
      icon: <BottleneckIcon />,
      path: '/bottleneck-map',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'SLA Confidence',
      icon: <SLAIcon />,
      path: '/sla-confidence',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'Payment Corridors',
      icon: <CorridorIcon />,
      path: '/payment-corridor',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'Customer Experience',
      icon: <ExperienceIcon />,
      path: '/customer-experience',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'Regulatory Risk',
      icon: <RegulatoryIcon />,
      path: '/regulatory-risk',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      text: 'Seasonality',
      icon: <SeasonalityIcon />,
      path: '/seasonality',
      roles: [ROLES.BUSINESS_USER, ROLES.ADMIN],
    },
    {
      divider: true,
      text: 'Admin & Governance',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Impact Preview',
      icon: <ImpactIcon />,
      path: '/rule-change-impact',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Config Versioning',
      icon: <VersionIcon />,
      path: '/config-versioning',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Time-Bound Rules',
      icon: <TimeBoundIcon />,
      path: '/time-bound-rules',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Shadow Mode',
      icon: <ShadowIcon />,
      path: '/shadow-mode',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Blast Radius',
      icon: <BlastIcon />,
      path: '/blast-radius',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Fail-Safe Mode',
      icon: <FailSafeIcon />,
      path: '/fail-safe-mode',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Config Drift',
      icon: <DriftIcon />,
      path: '/config-drift',
      roles: [ROLES.ADMIN],
    },
    {
      text: 'Operational Debt',
      icon: <DebtIcon />,
      path: '/operational-debt',
      roles: [ROLES.ADMIN],
    },
    {
      divider: true,
      roles: [ROLES.OPS_USER, ROLES.ADMIN, ROLES.BUSINESS_USER],
    },
    {
      text: 'Exceptions',
      icon: <ErrorIcon />,
      path: '/exceptions',
      roles: [ROLES.OPS_USER, ROLES.ADMIN],
    },
    {
      text: 'Reports',
      icon: <ReportIcon />,
      path: '/reports',
      roles: [ROLES.OPS_USER, ROLES.ADMIN, ROLES.BUSINESS_USER],
    },
    {
      text: 'Admin',
      icon: <SettingsIcon />,
      path: '/admin',
      roles: [ROLES.ADMIN],
    },
  ];

  const filteredMenuItems = menuItems.filter((item) => hasAnyRole(item.roles));

  return (
    <Box sx={{ display: 'flex' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: mode === 'light'
            ? 'linear-gradient(135deg, #1e3a8a 0%, #0d9488 100%)'
            : 'linear-gradient(135deg, #1e40af 0%, #0f766e 100%)',
          borderBottom: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <BankIcon sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: '0.02em',
              fontSize: { xs: '1rem', sm: '1.25rem' },
            }}
          >
            Global Payment Hub
          </Typography>
          
          {/* Dark Mode Toggle */}
          <IconButton 
            color="inherit" 
            onClick={toggleTheme} 
            sx={{ 
              mr: 1,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
          
          {/* Notifications */}
          <NotificationPanel />
          
          <Typography 
            variant="body2" 
            sx={{ 
              mr: 2, 
              ml: 2,
              display: { xs: 'none', sm: 'block' },
              fontWeight: 500,
            }}
          >
            {user?.username}
          </Typography>
          <IconButton 
            color="inherit" 
            onClick={handleProfileMenuOpen}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem disabled>
          <ListItemIcon>
            <AccountIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>{user?.role}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
          },
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
        <Box sx={{ overflow: 'auto', px: 1.5, py: 2 }}>
          <List sx={{ px: 0 }}>
            {filteredMenuItems.map((item, index) => (
              <React.Fragment key={item.text || `divider-${index}`}>
                {item.divider ? (
                  <Box sx={{ my: 2 }}>
                    {item.text && (
                      <ListItem sx={{ px: 1.5 }}>
                        <ListItemText 
                          primary={item.text}
                          primaryTypographyProps={{
                            variant: 'caption',
                            color: 'text.secondary',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            fontSize: '0.7rem',
                          }}
                        />
                      </ListItem>
                    )}
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ) : (
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      selected={location.pathname === item.path}
                      onClick={() => {
                        navigate(item.path);
                        if (isMobile) {
                          setDrawerOpen(false);
                        }
                      }}
                      sx={{
                        borderRadius: 1.5,
                        px: 2,
                        py: 1.25,
                        '&.Mui-selected': {
                          bgcolor: 'primary.main',
                          color: 'white',
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                          '&:hover': {
                            bgcolor: 'primary.dark',
                          },
                        },
                        '&:hover': {
                          bgcolor: mode === 'light' ? 'rgba(30, 58, 138, 0.08)' : 'rgba(96, 165, 250, 0.08)',
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: 500,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: drawerOpen ? 0 : `-${DRAWER_WIDTH}px` },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: { xs: 64, sm: 70 } }} />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
