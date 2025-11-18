import { createContext, useContext, useState, useEffect } from "react";

const ComplaintContext = createContext(undefined);

export const ComplaintProvider = ({ children }) => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("cms_token");

  // ✅ Fetch user's complaints
  const fetchComplaints = async () => {
    try {
      const res = await fetch("http://localhost:3000/complaints/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      // 🔥 Correct backend format handling
      if (Array.isArray(data)) {
        setComplaints(data);
      } else if (Array.isArray(data.complaints)) {
        setComplaints(data.complaints);
      } else {
        setComplaints([]);
      }

    } catch (err) {
      console.error("Error fetching complaints:", err);
      setComplaints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // ✅ Add complaint (API)
  const addComplaint = async (complaintData) => {
    console.log(complaintData);
    try {
      const res = await fetch("http://localhost:3000/complaints/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(complaintData),
      });

      const data = await res.json();

      if (res.ok) {
        fetchComplaints(); // Refresh list
        return { success: true, data };
      }

      return { success: false, error: data.message };
    } catch (err) {
      return { success: false, error: "Network error" };
    }
  };

  const updateComplaintStatus = async (id, status, remarks) => {
    try {
      const res = await fetch(`http://localhost:3000/complaints/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, remarks }),
      });

      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error("Status update error:", err);
    }
  };

  const deleteComplaint = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/complaints/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const assignOfficer = async (complaintId, officerId) => {
    try {
      const res = await fetch("http://localhost:3000/complaints/assign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ complaintId, officerId }),
      });

      if (res.ok) fetchComplaints();
    } catch (err) {
      console.error("Assign officer error:", err);
    }
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        loading,
        addComplaint,
        updateComplaintStatus,
        deleteComplaint,
        assignOfficer,
        fetchComplaints,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context)
    throw new Error("useComplaints must be used within a ComplaintProvider");
  return context;
};
