import { createContext, useContext, useState, useEffect } from 'react';

const ComplaintContext = createContext(undefined);

const initialComplaints = [
  {
    id: '1',
    title: 'Water Supply Issue',
    description: 'No water supply in the area for the past 2 days',
    type: 'water',
    location: 'Main Street, Block A',
    status: 'in-progress',
    citizenId: '3',
    citizenName: 'John Doe',
    officerId: '2',
    officerName: 'Officer Smith',
    statusRemarks: 'Team dispatched to check the main pipeline',
    createdAt: new Date('2025-01-08'),
    updatedAt: new Date('2025-01-09'),
  },
  {
    id: '2',
    title: 'Street Light Not Working',
    description: 'Multiple street lights on Oak Avenue are not functioning',
    type: 'electricity',
    location: 'Oak Avenue, Block B',
    status: 'pending',
    citizenId: '3',
    citizenName: 'John Doe',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
  },
];

const initialOfficers = [
  { id: '2', name: 'Officer Smith', email: 'officer@cms.gov', assignedComplaints: 1 },
  { id: '4', name: 'Officer Johnson', email: 'johnson@cms.gov', assignedComplaints: 0 },
];

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState(() => {
    const stored = localStorage.getItem('cms_complaints');
    return stored ? JSON.parse(stored).map(c => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
    })) : initialComplaints;
  });

  const [officers, setOfficers] = useState(() => {
    const stored = localStorage.getItem('cms_officers');
    return stored ? JSON.parse(stored) : initialOfficers;
  });

  useEffect(() => {
    localStorage.setItem('cms_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('cms_officers', JSON.stringify(officers));
  }, [officers]);

  const addComplaint = (complaint) => {
    const newComplaint = {
      ...complaint,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id, status, remarks) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status, statusRemarks: remarks, updatedAt: new Date() }
          : c
      )
    );
  };

  const deleteComplaint = (id) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const assignOfficer = (complaintId, officerId) => {
    const officer = officers.find(o => o.id === officerId);
    if (!officer) return;

    setComplaints(prev =>
      prev.map(c =>
        c.id === complaintId
          ? { ...c, officerId, officerName: officer.name, updatedAt: new Date() }
          : c
      )
    );

    setOfficers(prev =>
      prev.map(o =>
        o.id === officerId
          ? { ...o, assignedComplaints: o.assignedComplaints + 1 }
          : o
      )
    );
  };

  const addOfficer = (officer) => {
    const newOfficer = {
      ...officer,
      id: Date.now().toString(),
      assignedComplaints: 0,
    };
    setOfficers(prev => [...prev, newOfficer]);
  };

  const removeOfficer = (id) => {
    setOfficers(prev => prev.filter(o => o.id !== id));
    setComplaints(prev =>
      prev.map(c =>
        c.officerId === id
          ? { ...c, officerId: undefined, officerName: undefined, updatedAt: new Date() }
          : c
      )
    );
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        officers,
        addComplaint,
        updateComplaintStatus,
        deleteComplaint,
        assignOfficer,
        addOfficer,
        removeOfficer,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return context;
};

