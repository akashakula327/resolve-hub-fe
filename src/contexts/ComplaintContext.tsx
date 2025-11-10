import React, { createContext, useContext, useState, useEffect } from 'react';

export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
export type ComplaintType = 'water' | 'electricity' | 'roads' | 'sanitation' | 'other';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  type: ComplaintType;
  location: string;
  status: ComplaintStatus;
  citizenId: string;
  citizenName: string;
  officerId?: string;
  officerName?: string;
  statusRemarks?: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Officer {
  id: string;
  name: string;
  email: string;
  assignedComplaints: number;
}

interface ComplaintContextType {
  complaints: Complaint[];
  officers: Officer[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus, remarks?: string) => void;
  deleteComplaint: (id: string) => void;
  assignOfficer: (complaintId: string, officerId: string) => void;
  addOfficer: (officer: Omit<Officer, 'id' | 'assignedComplaints'>) => void;
  removeOfficer: (id: string) => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

const initialComplaints: Complaint[] = [
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

const initialOfficers: Officer[] = [
  { id: '2', name: 'Officer Smith', email: 'officer@cms.gov', assignedComplaints: 1 },
  { id: '4', name: 'Officer Johnson', email: 'johnson@cms.gov', assignedComplaints: 0 },
];

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const stored = localStorage.getItem('cms_complaints');
    return stored ? JSON.parse(stored) : initialComplaints;
  });

  const [officers, setOfficers] = useState<Officer[]>(() => {
    const stored = localStorage.getItem('cms_officers');
    return stored ? JSON.parse(stored) : initialOfficers;
  });

  useEffect(() => {
    localStorage.setItem('cms_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('cms_officers', JSON.stringify(officers));
  }, [officers]);

  const addComplaint = (complaint: Omit<Complaint, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const newComplaint: Complaint = {
      ...complaint,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComplaints(prev => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, remarks?: string) => {
    setComplaints(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, status, statusRemarks: remarks, updatedAt: new Date() }
          : c
      )
    );
  };

  const deleteComplaint = (id: string) => {
    setComplaints(prev => prev.filter(c => c.id !== id));
  };

  const assignOfficer = (complaintId: string, officerId: string) => {
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

  const addOfficer = (officer: Omit<Officer, 'id' | 'assignedComplaints'>) => {
    const newOfficer: Officer = {
      ...officer,
      id: Date.now().toString(),
      assignedComplaints: 0,
    };
    setOfficers(prev => [...prev, newOfficer]);
  };

  const removeOfficer = (id: string) => {
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
