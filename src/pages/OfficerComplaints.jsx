import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { Description, LocationOn, CalendarToday } from '@mui/icons-material';
import { StatusBadge } from '@/components/StatusBadge';

const OfficerComplaints = () => {
  const { user } = useAuth();
  const { complaints, updateComplaintStatus } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [open, setOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('pending');
  const [remarks, setRemarks] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const myComplaints = complaints.filter(c => c.officerId === user?.id);

  const handleOpenDialog = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setRemarks(complaint.statusRemarks || '');
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedComplaint(null);
    setRemarks('');
  };

  const handleUpdateStatus = () => {
    if (!selectedComplaint) return;

    updateComplaintStatus(selectedComplaint.id, newStatus, remarks);
    setSnackbar({ open: true, message: 'Complaint status updated successfully!', severity: 'success' });
    handleCloseDialog();
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            My Assigned Complaints
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and update the status of complaints assigned to you
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {myComplaints.map(complaint => (
            <Card key={complaint.id}>
              <CardHeader
                title={complaint.title}
                subheader={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    <LocationOn sx={{ fontSize: 16 }} />
                    {complaint.location}
                  </Box>
                }
                action={<StatusBadge status={complaint.status} />}
              />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 3 }}>
                  {complaint.description}
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Citizen
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {complaint.citizenName}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Type
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                      {complaint.type}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Submitted
                    </Typography>
                    <Typography variant="body2" fontWeight={500} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 14 }} />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Last Updated
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {new Date(complaint.updatedAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>

                {complaint.statusRemarks && (
                  <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                      Status Remarks:
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {complaint.statusRemarks}
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="contained"
                  startIcon={<Description />}
                  onClick={() => handleOpenDialog(complaint)}
                >
                  Update Status
                </Button>
              </CardContent>
            </Card>
          ))}

          {myComplaints.length === 0 && (
            <Card>
              <CardContent sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No complaints assigned to you yet
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Complaint Status</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              select
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="resolved">Resolved</MenuItem>
            </TextField>
            <TextField
              label="Remarks"
              placeholder="Add notes about the current status..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </DashboardLayout>
  );
};

export default OfficerComplaints;

