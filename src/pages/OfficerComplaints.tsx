import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints, ComplaintStatus, Complaint } from '@/contexts/ComplaintContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { FileText, MapPin, Calendar } from 'lucide-react';

const OfficerComplaints = () => {
  const { user } = useAuth();
  const { complaints, updateComplaintStatus } = useComplaints();
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('pending');
  const [remarks, setRemarks] = useState('');

  const myComplaints = complaints.filter(c => c.officerId === user?.id);

  const handleUpdateStatus = () => {
    if (!selectedComplaint) return;

    updateComplaintStatus(selectedComplaint.id, newStatus, remarks);
    toast.success('Complaint status updated successfully!');
    setSelectedComplaint(null);
    setRemarks('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">My Assigned Complaints</h2>
          <p className="text-muted-foreground mt-1">
            Manage and update the status of complaints assigned to you
          </p>
        </div>

        <div className="grid gap-4">
          {myComplaints.map(complaint => (
            <Card key={complaint.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle>{complaint.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <MapPin className="h-3 w-3" />
                      {complaint.location}
                    </CardDescription>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{complaint.description}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Citizen</p>
                    <p className="font-medium">{complaint.citizenName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{complaint.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date(complaint.updatedAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {complaint.statusRemarks && (
                  <div className="bg-accent p-3 rounded-lg">
                    <p className="text-sm font-medium mb-1">Status Remarks:</p>
                    <p className="text-sm text-muted-foreground">{complaint.statusRemarks}</p>
                  </div>
                )}

                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setSelectedComplaint(complaint);
                      setNewStatus(complaint.status);
                      setRemarks(complaint.statusRemarks || '');
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Update Status
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Update Complaint Status</DialogTitle>
                      <DialogDescription>
                        Change the status and add remarks for this complaint
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ComplaintStatus)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Remarks</Label>
                        <Textarea
                          placeholder="Add notes about the current status..."
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button onClick={handleUpdateStatus} className="w-full">
                        Update Status
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}

          {myComplaints.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No complaints assigned to you yet</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OfficerComplaints;
