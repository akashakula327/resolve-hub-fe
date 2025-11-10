import { DashboardLayout } from '@/components/DashboardLayout';
import { useComplaints } from '@/contexts/ComplaintContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, FileText } from 'lucide-react';

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
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Manage Citizens</h2>
          <p className="text-muted-foreground mt-1">View registered citizens and their complaint history</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle>Total Citizens: {citizens.length}</CardTitle>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {citizens.map(citizen => (
            <Card key={citizen.id}>
              <CardHeader>
                <CardTitle className="text-lg">{citizen.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Complaints submitted
                  </div>
                  <Badge variant="secondary">{citizen.complaintCount}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {citizens.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No citizens registered yet</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageCitizens;
