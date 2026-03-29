import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';

export const BookAppointment = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedDoctorId = searchParams.get('doctor');
  const preselectedDate = searchParams.get('date') || '';
  const preselectedTime = searchParams.get('time') || '';

  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    departmentId: '',
    doctorId: preselectedDoctorId || '',
    date: preselectedDate,
    time: preselectedTime,
    phoneNumber: '',
    notes: ''
  });

  useEffect(() => {
    if (preselectedDoctorId && doctors.length > 0) {
      const selectedDoc = doctors.find(d => d.id === preselectedDoctorId);
      if (selectedDoc && selectedDoc.departmentId) {
        setFormData(prev => ({ ...prev, departmentId: selectedDoc.departmentId }));
      }
    }
  }, [preselectedDoctorId, doctors]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsSnap, depsSnap] = await Promise.all([
          getDocs(collection(db, 'doctors')),
          getDocs(collection(db, 'departments'))
        ]);
        
        setDoctors(docsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setDepartments(depsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setSubmitting(true);
    try {
      const slotId = `${formData.doctorId}_${formData.date}_${formData.time}`;
      const slotRef = doc(db, 'booked_slots', slotId);
      const slotSnap = await getDoc(slotRef);
      
      if (slotSnap.exists()) {
        alert("This time slot is already booked. Please select another time.");
        setSubmitting(false);
        return;
      }

      await setDoc(slotRef, {
        doctorId: formData.doctorId,
        date: formData.date,
        time: formData.time
      });

      const selectedDoc = doctors.find(d => d.id === formData.doctorId);
      const selectedDept = departments.find(d => d.id === selectedDoc?.departmentId);
      
      await addDoc(collection(db, 'appointments'), {
        patientId: user.uid,
        patientName: profile.name,
        phoneNumber: formData.phoneNumber,
        doctorId: formData.doctorId,
        doctorName: selectedDoc?.name || 'Unknown',
        departmentName: selectedDept?.name || 'General',
        date: formData.date,
        time: formData.time,
        status: 'pending',
        notes: formData.notes,
        createdAt: new Date().toISOString()
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Book an Appointment</h2>
          <p className="mt-2 text-gray-600">Schedule your visit with our specialists.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service / Department</label>
              <select 
                required
                value={formData.departmentId}
                onChange={(e) => setFormData({...formData, departmentId: e.target.value, doctorId: ''})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
              >
                <option value="">Select a service...</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
              <select 
                required
                value={formData.doctorId}
                onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                disabled={!formData.departmentId && !preselectedDoctorId}
              >
                <option value="">Choose a doctor...</option>
                {doctors
                  .filter(doc => !formData.departmentId || doc.departmentId === formData.departmentId)
                  .map(doc => (
                  <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone Number</label>
            <input 
              type="tel" 
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
              placeholder="+91 90871 20926"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input 
                type="date" 
                required
                min={format(new Date(), 'yyyy-MM-dd')}
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
              <input 
                type="time" 
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
            <textarea 
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Briefly describe your symptoms or reason for visit..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {submitting ? 'Booking...' : 'Confirm Appointment'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center">
          <p className="text-gray-600 mb-4 font-medium">Prefer to book directly with our staff?</p>
          <a 
            href="https://wa.me/919087120926?text=Hello,%20I%20would%20like%20to%20book%20an%20appointment%20at%20your%20hospital." 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#128C7E] transition-colors w-full"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            Book via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};
