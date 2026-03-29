import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard = () => {
  const { user, profile } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const apptsQuery = query(
          collection(db, 'appointments'),
          where('patientId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const reportsQuery = query(
          collection(db, 'reports'),
          where('patientId', '==', user.uid),
          orderBy('date', 'desc')
        );

        const [apptsSnap, reportsSnap] = await Promise.all([
          getDocs(apptsQuery),
          getDocs(reportsQuery)
        ]);

        setAppointments(apptsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setReports(reportsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-emerald-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-center gap-6">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Profile" className="w-20 h-20 rounded-full border-4 border-white shadow-md" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-md">
              <span className="text-2xl font-bold text-emerald-600">{profile?.name.charAt(0)}</span>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.name}</h1>
            <p className="text-gray-600">Manage your appointments and medical records.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Appointments Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                  Your Appointments
                </h2>
              </div>
              
              {appointments.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                  No appointments scheduled yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map(appt => (
                    <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-emerald-200 transition-colors bg-gray-50">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">Dr. {appt.doctorName}</h3>
                        <p className="text-sm text-gray-600">{appt.departmentName}</p>
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
                          {getStatusIcon(appt.status)}
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reports Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-emerald-600" />
                  Medical Reports
                </h2>
              </div>
              
              {reports.length === 0 ? (
                <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl">
                  No reports available.
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map(report => (
                    <a key={report.id} href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="block p-4 rounded-xl border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors">
                      <h3 className="font-semibold text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-xs text-gray-500">{format(new Date(report.date), 'MMM dd, yyyy')}</p>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
