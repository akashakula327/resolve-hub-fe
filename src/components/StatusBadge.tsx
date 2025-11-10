import { Badge } from '@/components/ui/badge';
import { ComplaintStatus } from '@/contexts/ComplaintContext';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const configs = {
    pending: {
      label: 'Pending',
      className: 'bg-warning/10 text-warning border-warning/20',
      icon: Clock,
    },
    'in-progress': {
      label: 'In Progress',
      className: 'bg-primary/10 text-primary border-primary/20',
      icon: Loader2,
    },
    resolved: {
      label: 'Resolved',
      className: 'bg-success/10 text-success border-success/20',
      icon: CheckCircle2,
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={config.className}>
      <Icon className="mr-1 h-3 w-3" />
      {config.label}
    </Badge>
  );
};
