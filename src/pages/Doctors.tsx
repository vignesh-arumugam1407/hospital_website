import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Link } from 'react-router-dom';
import { User as UserIcon, CalendarPlus } from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  specialty: string;
  experience: number;
  photoURL: string;
  about: string;
}

export const Doctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'doctors'));
        const docsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Doctor));
        setDoctors(docsData);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDoctors();

    const handleSeed = () => fetchDoctors();
    window.addEventListener('data-seeded', handleSeed);
    return () => window.removeEventListener('data-seeded', handleSeed);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Specialists</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Meet our team of experienced and dedicated medical professionals.</p>
        </div>
        
        {doctors.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No doctors found. Admins can add them from the dashboard.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doc) => (
              <div key={doc.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-emerald-100 flex items-center justify-center">
                  {doc.photoURL ? (
                    <img src={doc.photoURL} alt={doc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-24 h-24 text-emerald-300" />
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                  <p className="text-emerald-600 font-medium mb-4">{doc.specialty}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500 mb-6">
                    <span>{doc.experience} Years Experience</span>
                  </div>
                  <p className="text-gray-600 line-clamp-3 mb-6">{doc.about}</p>
                  <div className="flex gap-2">
                    <Link 
                      to={`/doctors/${doc.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      View Profile
                    </Link>
                    <Link 
                      to={`/book?doctor=${doc.id}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      <CalendarPlus className="w-5 h-5" />
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
