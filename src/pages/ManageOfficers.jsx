import { useState } from 'react';
import { useComplaints } from '../contexts/ComplaintContext';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  Box,
  Grid,
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
  DialogContentText,
  Snackbar,
} from '@mui/material';
import { PersonAdd, Delete, Email, Description } from '@mui/icons-material';

const ManageOfficers = () => {
  const { officers, addOfficer, removeOfficer } = useComplaints();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, officerId: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddOfficer = () => {
    if (!name || !email) {
      setSnackbar({ open: true, message: 'Please fill in all fields', severity: 'error' });
      return;
    }

    addOfficer({ name, email });
    setSnackbar({ open: true, message: 'Officer added successfully', severity: 'success' });
    setIsAddDialogOpen(false);
    setName('');
    setEmail('');
  };

  const handleRemoveOfficer = (id) => {
    removeOfficer(id);
    setSnackbar({ open: true, message: 'Officer removed successfully', severity: 'success' });
    setDeleteDialog({ open: false, officerId: null });
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Manage Officers
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Add or remove officers from the system
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setIsAddDialogOpen(true)}
          >
            Add Officer
          </Button>
        </Box>

        <Grid container spacing={3}>
          {officers.map(officer => (
            <Grid item xs={12} sm={6} md={4} key={officer.id}>
              <Card>
                <CardHeader
                  title={officer.name}
                />
                <CardContent>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {officer.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Description sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {officer.assignedComplaints} assigned complaints
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    size="small"
                    startIcon={<Delete />}
                    onClick={() => setDeleteDialog({ open: true, officerId: officer.id })}
                  >
                    Remove Officer
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {officers.length === 0 && (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No officers added yet
              </Typography>
            </CardContent>
          </Card>
        )}
      </Box>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Officer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 1 }}>
            <TextField
              label="Full Name"
              placeholder="Enter officer's name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              placeholder="Enter officer's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddOfficer}>
            Add Officer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, officerId: null })}>
        <DialogTitle>Remove Officer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this officer? Any assigned complaints will become unassigned.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, officerId: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => handleRemoveOfficer(deleteDialog.officerId)}>
            Remove
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

export default ManageOfficers;

