import React from 'react';
import { Chip } from '@mui/material';
import { getStatusColor } from '../../utils/helpers';

const StatusChip = ({ status, size = 'small' }) => {
  const color = getStatusColor(status);
  
  return (
    <Chip
      label={status}
      color={color}
      size={size}
      sx={{
        fontWeight: 600,
        fontSize: '0.75rem',
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        height: size === 'small' ? 24 : 28,
        borderRadius: 1.5,
      }}
    />
  );
};

export default StatusChip;
