import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const DoctorDashboard = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchDoctorData = async () => {
      try {
        const docQuery = query(collection(db, 'doctors'), where('userId', '==', user.uid));
        const docSnap = await getDocs(docQuery);
        if (!docSnap.empty) {
          const dId = docSnap.docs[0].id;
          setDoctorId(dId);
          await fetchAppointments(dId);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching doctor data", error);
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [user]);

  const fetchAppointments = async (dId: string) => {
    try {
      const apptsQuery = query(
        collection(db, 'appointments'),
        where('doctorId', '==', dId),
        orderBy('createdAt', 'desc')
      );
      const apptsSnap = await getDocs(apptsQuery);
      setAppointments(apptsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Appointment marked as ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Doctor Panel - Welcome Dr. {profile?.name}</h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" />
            Your Patients' Appointments
          </h2>

          {!doctorId ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
              Your doctor profile hasn't been fully linked by the admin yet.
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
              No appointments scheduled yet.
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map(appt => (
                <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors bg-gray-50">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{appt.patientName}</h3>
                    <p className="text-sm text-gray-600">{appt.departmentName} - {appt.notes || "No notes provided"}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {format(new Date(appt.date), 'MMM dd, yyyy')}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {appt.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium capitalize
                      ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                        appt.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                        appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                        'bg-amber-100 text-amber-700'}`}>
                      {appt.status}
                    </span>
                    <div className="flex gap-2 mt-2">
                      {appt.status === 'pending' && (
                        <button onClick={() => updateStatus(appt.id, 'confirmed')} className="text-sm px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 font-medium">
                          Confirm
                        </button>
                      )}
                      {appt.status === 'confirmed' && (
                        <button onClick={() => updateStatus(appt.id, 'completed')} className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium">
                          Mark Completed
                        </button>
                      )}
                      {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                        <button onClick={() => updateStatus(appt.id, 'cancelled')} className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
