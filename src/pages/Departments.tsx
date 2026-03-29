import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Activity, Brain, Heart, Bone, Eye, Baby } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, React.ReactNode> = {
  'Cardiology': <Heart className="w-8 h-8" />,
  'Neurology': <Brain className="w-8 h-8" />,
  'Orthopedics': <Bone className="w-8 h-8" />,
  'Pediatrics': <Baby className="w-8 h-8" />,
  'Ophthalmology': <Eye className="w-8 h-8" />,
  'General': <Activity className="w-8 h-8" />
};

export const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'departments'));
        const depsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Department));
        setDepartments(depsData);
      } catch (error) {
        console.error("Error fetching departments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();

    const handleSeed = () => fetchDepartments();
    window.addEventListener('data-seeded', handleSeed);
    return () => window.removeEventListener('data-seeded', handleSeed);
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Our Specialities</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Comprehensive medical services tailored to your needs.</p>
        </div>
        
        {departments.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No departments found. Admins can add them from the dashboard.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  {iconMap[dept.name] || <Activity className="w-8 h-8" />}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{dept.name}</h3>
                <p className="text-gray-600 leading-relaxed">{dept.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
