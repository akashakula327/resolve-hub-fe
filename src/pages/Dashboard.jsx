import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintContext';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import { Description, AccessTime, HourglassEmpty, CheckCircle } from '@mui/icons-material';
import { StatusBadge } from '../components/StatusBadge';

const Dashboard = () => {
  const { user } = useAuth();
  const { complaints } = useComplaints();

  const userComplaints = user?.role === 'citizen'
    ? complaints.filter(c => c.citizenId === user.id)
    : user?.role === 'officer'
    ? complaints.filter(c => c.officerId === user.id)
    : complaints;

  const stats = {
    total: userComplaints.length,
    pending: userComplaints.filter(c => c.status === 'pending').length,
    inProgress: userComplaints.filter(c => c.status === 'in-progress').length,
    resolved: userComplaints.filter(c => c.status === 'resolved').length,
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          {icon}
        </Box>
        <Typography variant="h4" fontWeight={700}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user?.role === 'admin' && 'Manage all complaints and users from your dashboard'}
            {user?.role === 'officer' && 'View and update your assigned complaints'}
            {user?.role === 'citizen' && 'Track the status of your submitted complaints'}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Complaints"
              value={stats.total}
              icon={<Description sx={{ color: 'text.secondary' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={<AccessTime sx={{ color: 'warning.main' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="In Progress"
              value={stats.inProgress}
              icon={<HourglassEmpty sx={{ color: 'primary.main' }} />}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Resolved"
              value={stats.resolved}
              icon={<CheckCircle sx={{ color: 'success.main' }} />}
            />
          </Grid>
        </Grid>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Complaints
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              {userComplaints.slice(0, 5).map(complaint => (
                <Box
                  key={complaint.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    pb: 2,
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0, pb: 0 },
                  }}
                >
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      {complaint.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {complaint.location}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <StatusBadge status={complaint.status} />
                </Box>
              ))}
              {userComplaints.length === 0 && (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No complaints found
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default Dashboard;

