import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc, addDoc, onSnapshot, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Calendar, Stethoscope, Building, Trash2, CheckCircle, XCircle, Database } from 'lucide-react';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'doctors' | 'departments'>('appointments');
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snap) => {
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubDoctors = onSnapshot(collection(db, 'doctors'), (snap) => {
      setDoctors(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    const unsubDepartments = onSnapshot(collection(db, 'departments'), (snap) => {
      setDepartments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => {
      unsubAppointments();
      unsubDoctors();
      unsubDepartments();
    };
  }, []);

  const handleAllocateDoctor = async (apptId: string, newDoctorId: string) => {
    try {
      const appt = appointments.find(a => a.id === apptId);
      if (!appt || appt.doctorId === newDoctorId || !newDoctorId) return;

      const newDoctor = doctors.find(d => d.id === newDoctorId);
      if (!newDoctor) return;

      // Check if new slot is available
      const newSlotId = `${newDoctorId}_${appt.date}_${appt.time}`;
      const newSlotRef = doc(db, 'booked_slots', newSlotId);
      const newSlotSnap = await getDoc(newSlotRef);

      if (newSlotSnap.exists() && appt.status !== 'cancelled') {
        alert("This doctor is already booked for this time slot.");
        return;
      }

      // Delete old slot
      if (appt.status !== 'cancelled') {
        await deleteDoc(doc(db, 'booked_slots', `${appt.doctorId}_${appt.date}_${appt.time}`));
      }

      // Add new slot
      if (appt.status !== 'cancelled') {
        await setDoc(newSlotRef, {
          doctorId: newDoctorId,
          date: appt.date,
          time: appt.time
        });
      }

      // Update appointment
      await updateDoc(doc(db, 'appointments', apptId), {
        doctorId: newDoctorId,
        doctorName: newDoctor.name
      });
      
      alert("Doctor allocated successfully.");
    } catch (error) {
      console.error("Error allocating doctor:", error);
      alert("Failed to allocate doctor.");
    }
  };

  const seedDummyData = async () => {
    if (!window.confirm("This will add dummy departments and doctors to your database. Proceed?")) return;
    setLoading(true);
    try {
      const dummyDepartments = [
        { name: 'Cardiology', description: 'Expert care for heart and cardiovascular conditions.', icon: 'Cardiology' },
        { name: 'Neurology', description: 'Advanced treatment for brain and nervous system disorders.', icon: 'Neurology' },
        { name: 'Orthopedics', description: 'Comprehensive care for bones, joints, and muscles.', icon: 'Orthopedics' },
        { name: 'Pediatrics', description: 'Dedicated healthcare for infants, children, and adolescents.', icon: 'Pediatrics' },
        { name: 'Dermatology', description: 'Advanced skincare and treatment of skin conditions.', icon: 'General' },
        { name: 'Ophthalmology', description: 'Comprehensive eye care and vision services.', icon: 'Ophthalmology' },
        { name: 'Oncology', description: 'Expert cancer care and treatment facilities.', icon: 'General' },
        { name: 'Psychiatry', description: 'Mental health services and psychological support.', icon: 'General' },
      ];

      const deptIds: Record<string, string> = {};
      for (const dept of dummyDepartments) {
        const docRef = await addDoc(collection(db, 'departments'), dept);
        deptIds[dept.name] = docRef.id;
      }

      const dummyDoctors = [
        { name: 'Dr. Sarah Jenkins', specialty: 'Cardiologist', departmentId: deptIds['Cardiology'], experience: 15, about: 'Dr. Jenkins is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions.', userId: 'dummy_user_1', photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400' },
        { name: 'Dr. Michael Chen', specialty: 'Neurologist', departmentId: deptIds['Neurology'], experience: 12, about: 'Specializing in neurodegenerative diseases, Dr. Chen brings a wealth of knowledge and compassionate care to his patients.', userId: 'dummy_user_2', photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400' },
        { name: 'Dr. Emily Rodriguez', specialty: 'Orthopedic Surgeon', departmentId: deptIds['Orthopedics'], experience: 10, about: 'Dr. Rodriguez is an expert in sports medicine and joint replacement surgeries.', userId: 'dummy_user_3', photoURL: 'https://images.unsplash.com/photo-1594824432258-f6a1154c2e58?auto=format&fit=crop&q=80&w=400&h=400' },
        { name: 'Dr. James Wilson', specialty: 'Pediatrician', departmentId: deptIds['Pediatrics'], experience: 8, about: 'Dedicated to child health, Dr. Wilson provides comprehensive pediatric care from newborns to teens.', userId: 'dummy_user_4', photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400&h=400' },
        { name: 'Dr. Lisa Wong', specialty: 'Dermatologist', departmentId: deptIds['Dermatology'], experience: 9, about: 'Dr. Wong specializes in medical and cosmetic dermatology, helping patients achieve healthy skin.', userId: 'dummy_user_5', photoURL: 'https://images.unsplash.com/photo-1527613426406-8bbde7706173?auto=format&fit=crop&q=80&w=400&h=400' },
        { name: 'Dr. Robert Taylor', specialty: 'Ophthalmologist', departmentId: deptIds['Ophthalmology'], experience: 20, about: 'With two decades of experience, Dr. Taylor is a leading expert in cataract and refractive surgery.', userId: 'dummy_user_6', photoURL: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400&h=400' },
        { name: 'Dr. Amanda Lewis', specialty: 'Oncologist', departmentId: deptIds['Oncology'], experience: 14, about: 'Dr. Lewis provides compassionate, evidence-based care for patients battling various forms of cancer.', userId: 'dummy_user_7', photoURL: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400&h=400' },
        { name: 'Dr. David Kim', specialty: 'Psychiatrist', departmentId: deptIds['Psychiatry'], experience: 11, about: 'Dr. Kim focuses on holistic mental health treatments, combining therapy with modern psychiatric medicine.', userId: 'dummy_user_8', photoURL: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400&h=400' },
      ];

      for (const doc of dummyDoctors) {
        await addDoc(collection(db, 'doctors'), doc);
      }

      alert("Dummy data added successfully!");
    } catch (error) {
      console.error("Error seeding data:", error);
      alert("Failed to add dummy data.");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'appointments', id), { status });
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      
      if (status === 'cancelled') {
        const appt = appointments.find(a => a.id === id);
        if (appt) {
          await deleteDoc(doc(db, 'booked_slots', `${appt.doctorId}_${appt.date}_${appt.time}`));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteAppointment = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) return;
    try {
      const appt = appointments.find(a => a.id === id);
      await deleteDoc(doc(db, 'appointments', id));
      if (appt) {
        await deleteDoc(doc(db, 'booked_slots', `${appt.doctorId}_${appt.date}_${appt.time}`));
      }
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const handleAddDepartment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, 'departments'), {
        name: formData.get('name'),
        description: formData.get('description'),
        icon: 'General'
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };

  const handleAddDoctor = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, 'doctors'), {
        name: formData.get('name'),
        specialty: formData.get('specialty'),
        departmentId: formData.get('departmentId'),
        experience: Number(formData.get('experience')),
        about: formData.get('about'),
        userId: 'placeholder_user_id', // In a real app, this would link to an actual user account
        photoURL: ''
      });
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'appointments' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Calendar className="w-5 h-5" /> Appointments
          </button>
          <button 
            onClick={() => setActiveTab('doctors')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'doctors' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Stethoscope className="w-5 h-5" /> Doctors
          </button>
          <button 
            onClick={() => setActiveTab('departments')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'departments' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Building className="w-5 h-5" /> Departments
          </button>
        </nav>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <button 
            onClick={seedDummyData}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <Database className="w-5 h-5" /> Load Dummy Data
          </button>
          <p className="text-xs text-gray-400 mt-2 px-2">Click to populate database with sample departments and doctors.</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10">
        {activeTab === 'appointments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Appointments</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 font-semibold text-gray-600">Patient</th>
                    <th className="p-4 font-semibold text-gray-600">Doctor</th>
                    <th className="p-4 font-semibold text-gray-600">Date & Time</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                    <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{appt.patientName}</td>
                      <td className="p-4 text-gray-600">
                        {appt.status !== 'cancelled' && appt.status !== 'completed' ? (
                          <select 
                            value={appt.doctorId} 
                            onChange={(e) => handleAllocateDoctor(appt.id, e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          >
                            <option value="" disabled>Select Doctor</option>
                            {doctors.map(doc => (
                              <option key={doc.id} value={doc.id}>{doc.name.startsWith('Dr.') ? doc.name : `Dr. ${doc.name}`}</option>
                            ))}
                          </select>
                        ) : (
                          appt.doctorName.startsWith('Dr.') ? appt.doctorName : `Dr. ${appt.doctorName}`
                        )}
                      </td>
                      <td className="p-4 text-gray-600">{appt.date} at {appt.time}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize
                          ${appt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 
                            appt.status === 'completed' ? 'bg-blue-100 text-blue-700' : 
                            appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                            'bg-amber-100 text-amber-700'}`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-4 flex items-center justify-end gap-2">
                        {appt.status === 'pending' && (
                          <button onClick={() => updateAppointmentStatus(appt.id, 'confirmed')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Confirm">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                        )}
                        {appt.status !== 'cancelled' && (
                          <button onClick={() => updateAppointmentStatus(appt.id, 'cancelled')} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg" title="Cancel">
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button onClick={() => deleteAppointment(appt.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
              {appointments.length === 0 && <div className="p-8 text-center text-gray-500">No appointments found.</div>}
            </div>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Doctors</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 font-semibold text-gray-600">Name</th>
                        <th className="p-4 font-semibold text-gray-600">Specialty</th>
                        <th className="p-4 font-semibold text-gray-600">Experience</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctors.map(doc => (
                        <tr key={doc.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{doc.name}</td>
                          <td className="p-4 text-gray-600">{doc.specialty}</td>
                          <td className="p-4 text-gray-600">{doc.experience} Years</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Doctor</h3>
                <form onSubmit={handleAddDoctor} className="space-y-4">
                  <input name="name" required placeholder="Doctor Name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <input name="specialty" required placeholder="Specialty" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <select name="departmentId" required className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                  <input name="experience" type="number" required placeholder="Years of Experience" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <textarea name="about" required placeholder="About the doctor..." className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={3}></textarea>
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">Add Doctor</button>
                </form>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'departments' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Departments</h2>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="p-4 font-semibold text-gray-600">Name</th>
                        <th className="p-4 font-semibold text-gray-600">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departments.map(dept => (
                        <tr key={dept.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="p-4 font-medium text-gray-900">{dept.name}</td>
                          <td className="p-4 text-gray-600">{dept.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Add Department</h3>
                <form onSubmit={handleAddDepartment} className="space-y-4">
                  <input name="name" required placeholder="Department Name" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  <textarea name="description" required placeholder="Description..." className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none resize-none" rows={4}></textarea>
                  <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">Add Department</button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
