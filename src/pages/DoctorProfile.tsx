import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User as UserIcon, CalendarPlus, ArrowLeft, Award, Building, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';

export const DoctorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [departmentName, setDepartmentName] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState<string>(format(addDays(new Date(), 1), 'yyyy-MM-dd'));
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const allSlots = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'doctors', id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const docData = docSnap.data();
          setDoctor({ id: docSnap.id, ...docData });
          
          if (docData.departmentId) {
            const deptRef = doc(db, 'departments', docData.departmentId);
            const deptSnap = await getDoc(deptRef);
            if (deptSnap.exists()) {
              setDepartmentName(deptSnap.data().name);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctor();
  }, [id]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!id || !selectedDate) return;
      setLoadingSlots(true);
      try {
        const q = query(
          collection(db, 'booked_slots'),
          where('doctorId', '==', id),
          where('date', '==', selectedDate)
        );
        const snap = await getDocs(q);
        const booked = snap.docs.map(d => d.data().time);
        setBookedTimes(booked);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchSlots();
  }, [id, selectedDate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Doctor not found</h2>
        <button onClick={() => navigate('/doctors')} className="text-emerald-600 hover:underline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate('/doctors')} className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-2 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </button>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-emerald-50 flex flex-col items-center justify-center p-8 border-r border-gray-100">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-white border-4 border-emerald-100 shadow-inner mb-6 flex items-center justify-center">
                {doctor.photoURL ? (
                  <img src={doctor.photoURL} alt={doctor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="w-24 h-24 text-emerald-300" />
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">{doctor.name}</h1>
              <p className="text-emerald-600 font-semibold text-center mb-6">{doctor.specialty}</p>
              
              <Link 
                to={`/book?doctor=${doctor.id}`}
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-md"
              >
                <CalendarPlus className="w-5 h-5" />
                Book Appointment
              </Link>
            </div>
            
            <div className="md:w-2/3 p-8 lg:p-12">
              <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Professional Profile</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Department</p>
                    <p className="text-gray-900 font-semibold">{departmentName || 'General'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Experience</p>
                    <p className="text-gray-900 font-semibold">{doctor.experience} Years</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">About</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {doctor.about || "No additional information provided."}
                </p>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-emerald-600" />
                  Available Appointment Slots
                </h3>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                  <input 
                    type="date" 
                    min={format(new Date(), 'yyyy-MM-dd')}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow"
                  />
                </div>

                {loadingSlots ? (
                  <div className="flex items-center gap-2 text-emerald-600">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                    <span className="text-sm font-medium">Checking availability...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {allSlots.map(time => {
                      const isBooked = bookedTimes.includes(time);
                      return isBooked ? (
                        <div key={time} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{time}</span>
                        </div>
                      ) : (
                        <Link 
                          key={time}
                          to={`/book?doctor=${id}&date=${selectedDate}&time=${time}`}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200 hover:border-emerald-600 cursor-pointer"
                        >
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{time}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
