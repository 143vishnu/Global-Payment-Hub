import React, { createContext, useState, useContext, useMemo, useEffect } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#1e3a8a' : '#60a5fa',
            light: mode === 'light' ? '#3b82f6' : '#93c5fd',
            dark: mode === 'light' ? '#1e40af' : '#2563eb',
            contrastText: '#ffffff',
          },
          secondary: {
            main: mode === 'light' ? '#0d9488' : '#5eead4',
            light: mode === 'light' ? '#14b8a6' : '#99f6e4',
            dark: mode === 'light' ? '#0f766e' : '#2dd4bf',
            contrastText: '#ffffff',
          },
          success: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
          },
          error: {
            main: '#ef4444',
            light: '#f87171',
            dark: '#dc2626',
          },
          warning: {
            main: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
          },
          info: {
            main: '#3b82f6',
            light: '#60a5fa',
            dark: '#2563eb',
          },
          background: {
            default: mode === 'light' ? '#f8fafc' : '#0f172a',
            paper: mode === 'light' ? '#ffffff' : '#1e293b',
          },
          text: {
            primary: mode === 'light' ? '#0f172a' : '#f1f5f9',
            secondary: mode === 'light' ? '#475569' : '#94a3b8',
          },
          divider: mode === 'light' ? '#e2e8f0' : '#334155',
        },
        typography: {
          fontFamily: '"Inter", "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.2,
          },
          h2: {
            fontWeight: 700,
            fontSize: '2rem',
            letterSpacing: '-0.02em',
            lineHeight: 1.3,
          },
          h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.3,
          },
          h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
            letterSpacing: '-0.01em',
            lineHeight: 1.4,
          },
          h5: {
            fontWeight: 600,
            fontSize: '1.25rem',
            lineHeight: 1.5,
          },
          h6: {
            fontWeight: 600,
            fontSize: '1.125rem',
            lineHeight: 1.5,
          },
          subtitle1: {
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: 1.6,
          },
          subtitle2: {
            fontWeight: 500,
            fontSize: '0.875rem',
            lineHeight: 1.6,
          },
          body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
          },
          body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
          },
          button: {
            fontWeight: 600,
            fontSize: '0.9375rem',
            letterSpacing: '0.02em',
          },
          caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
          },
          overline: {
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            lineHeight: 2,
            textTransform: 'uppercase',
          },
        },
        shape: {
          borderRadius: 6,
        },
        shadows: mode === 'light' ? [
          'none',
          '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        ] : [
          'none',
          '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
          '0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.24)',
          '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.24)',
          '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
          '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.16)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        ],
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 6,
                padding: '8px 16px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                },
              },
              contained: {
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                },
              },
              outlined: {
                borderWidth: '1.5px',
                '&:hover': {
                  borderWidth: '1.5px',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light' 
                  ? '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)' 
                  : '0 4px 6px rgba(0, 0, 0, 0.3)',
                borderRadius: 8,
                border: mode === 'light' ? '1px solid #e2e8f0' : '1px solid #334155',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
              elevation1: {
                boxShadow: mode === 'light'
                  ? '0 1px 3px rgba(0, 0, 0, 0.08)'
                  : '0 2px 4px rgba(0, 0, 0, 0.3)',
              },
            },
          },
          MuiTableCell: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light' ? '#e2e8f0' : '#334155',
                padding: '14px 16px',
              },
              head: {
                fontWeight: 600,
                backgroundColor: mode === 'light' ? '#f8fafc' : '#1e293b',
                color: mode === 'light' ? '#475569' : '#cbd5e1',
                fontSize: '0.8125rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                fontSize: '0.8125rem',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: mode === 'light' ? '#cbd5e1' : '#475569',
                  },
                },
              },
            },
          },
          MuiAppBar: {
            styleOverrides: {
              root: {
                boxShadow: mode === 'light'
                  ? '0 1px 3px rgba(0, 0, 0, 0.08)'
                  : '0 2px 4px rgba(0, 0, 0, 0.3)',
              },
            },
          },
        },
      }),
    [mode]
  );

  const value = {
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
