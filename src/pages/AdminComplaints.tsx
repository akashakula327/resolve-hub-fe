import { useState } from 'react';
import { useComplaints, ComplaintStatus, Complaint } from '@/contexts/ComplaintContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Trash2, Filter, Search, UserCog } from 'lucide-react';

const AdminComplaints = () => {
  const { complaints, officers, deleteComplaint, updateComplaintStatus, assignOfficer } = useComplaints();
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComplaints = complaints.filter(c => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch = 
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.citizenName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleDelete = (id: string) => {
    deleteComplaint(id);
    toast.success('Complaint deleted successfully');
  };

  const handleAssignOfficer = (complaintId: string, officerId: string) => {
    assignOfficer(complaintId, officerId);
    toast.success('Officer assigned successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">All Complaints</h2>
          <p className="text-muted-foreground mt-1">View, manage, and track all submitted complaints</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title, location, or citizen..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ComplaintStatus | 'all')}>
                <SelectTrigger className="w-full md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {filteredComplaints.map(complaint => (
            <Card key={complaint.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-lg">{complaint.title}</h3>
                    <p className="text-sm text-muted-foreground">{complaint.location}</p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>

                <p className="text-sm mb-4">{complaint.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Citizen</p>
                    <p className="font-medium">{complaint.citizenName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{complaint.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Officer</p>
                    <p className="font-medium">{complaint.officerName || 'Unassigned'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Created</p>
                    <p className="font-medium">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select 
                    defaultValue={complaint.status}
                    onValueChange={(value) => updateComplaintStatus(complaint.id, value as ComplaintStatus)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select onValueChange={(value) => handleAssignOfficer(complaint.id, value)}>
                    <SelectTrigger className="w-48">
                      <UserCog className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Assign Officer" />
                    </SelectTrigger>
                    <SelectContent>
                      {officers.map(officer => (
                        <SelectItem key={officer.id} value={officer.id}>
                          {officer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this complaint? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(complaint.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredComplaints.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No complaints found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminComplaints;
