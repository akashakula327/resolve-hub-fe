import { Chip } from '@mui/material';
import { AccessTime, HourglassEmpty, CheckCircle } from '@mui/icons-material';

export const StatusBadge = ({ status }) => {
  const configs = {
    pending: {
      label: 'Pending',
      color: 'warning',
      icon: <AccessTime fontSize="small" />,
    },
    'in-progress': {
      label: 'In Progress',
      color: 'primary',
      icon: <HourglassEmpty fontSize="small" />,
    },
    resolved: {
      label: 'Resolved',
      color: 'success',
      icon: <CheckCircle fontSize="small" />,
    },
  };

  const config = configs[status];

  return (
    <Chip
      icon={config.icon}
      label={config.label}
      color={config.color}
      variant="outlined"
      size="small"
    />
  );
};

