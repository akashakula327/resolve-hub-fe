import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  MenuItem,
  Snackbar,
} from '@mui/material';
import { Send } from '@mui/icons-material';

const SubmitComplaint = () => {
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('other');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Mock file upload - in real app would upload to server
    const fileUrl = file ? URL.createObjectURL(file) : undefined;

    addComplaint({
      title,
      description,
      type,
      location,
      citizenId: user.id,
      citizenName: user.name,
      fileUrl,
    });

    setSnackbar({ open: true, message: 'Complaint submitted successfully!', severity: 'success' });
    navigate('/dashboard');
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4 }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Submit New Complaint
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Fill in the details to report an issue
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Complaint Title"
                placeholder="Brief description of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />

              <TextField
                select
                label="Complaint Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                fullWidth
              >
                <MenuItem value="water">Water Supply</MenuItem>
                <MenuItem value="electricity">Electricity</MenuItem>
                <MenuItem value="roads">Roads & Infrastructure</MenuItem>
                <MenuItem value="sanitation">Sanitation</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>

              <TextField
                label="Location"
                placeholder="Street name, area, or landmark"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                fullWidth
              />

              <TextField
                label="Description"
                placeholder="Provide detailed information about the issue"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                multiline
                rows={5}
                required
                fullWidth
              />

              <Box>
                <Button variant="outlined" component="label" sx={{ mb: 1 }}>
                  Attach File (Optional)
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </Button>
                <Typography variant="caption" color="text.secondary" display="block">
                  Upload an image or document (Max 5MB)
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  startIcon={<Send />}
                  sx={{ flex: 1 }}
                >
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </Button>
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </DashboardLayout>
  );
};

export default SubmitComplaint;

