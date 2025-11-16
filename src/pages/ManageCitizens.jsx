import { DashboardLayout } from '@/components/DashboardLayout';
import { useComplaints } from '@/contexts/ComplaintContext';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
} from '@mui/material';
import { People, Description } from '@mui/icons-material';

const ManageCitizens = () => {
  const { complaints } = useComplaints();

  // Get unique citizens from complaints
  const citizens = Array.from(
    new Map(
      complaints.map(c => [
        c.citizenId,
        {
          id: c.citizenId,
          name: c.citizenName,
          complaintCount: complaints.filter(comp => comp.citizenId === c.citizenId).length,
        },
      ])
    ).values()
  );

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Manage Citizens
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View registered citizens and their complaint history
          </Typography>
        </Box>

        <Card>
          <CardHeader
            avatar={<People />}
            title={`Total Citizens: ${citizens.length}`}
          />
        </Card>

        <Grid container spacing={3}>
          {citizens.map(citizen => (
            <Grid item xs={12} sm={6} md={4} key={citizen.id}>
              <Card>
                <CardHeader title={citizen.name} />
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        Complaints submitted
                      </Typography>
                    </Box>
                    <Chip label={citizen.complaintCount} color="primary" size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {citizens.length === 0 && (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No citizens registered yet
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>
    </DashboardLayout>
  );
};

export default ManageCitizens;

