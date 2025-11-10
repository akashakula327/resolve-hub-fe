import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintContext';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { FileText, Clock, CheckCircle2, Loader2 } from 'lucide-react';

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Welcome back, {user?.name}!</h2>
          <p className="text-muted-foreground mt-1">
            {user?.role === 'admin' && 'Manage all complaints and users from your dashboard'}
            {user?.role === 'officer' && 'View and update your assigned complaints'}
            {user?.role === 'citizen' && 'Track the status of your submitted complaints'}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Loader2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userComplaints.slice(0, 5).map(complaint => (
                <div key={complaint.id} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="font-medium">{complaint.title}</p>
                    <p className="text-sm text-muted-foreground">{complaint.location}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={complaint.status} />
                </div>
              ))}
              {userComplaints.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No complaints found</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
