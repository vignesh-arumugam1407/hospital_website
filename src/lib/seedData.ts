import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const autoSeedDatabase = async () => {
  try {
    const depsSnap = await getDocs(collection(db, 'departments'));
    if (!depsSnap.empty) return; // Already seeded

    console.log("Database is empty. Auto-seeding dummy data...");
    
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
    
    console.log("Auto-seeding complete!");
    window.dispatchEvent(new Event('data-seeded'));
  } catch (error) {
    console.error("Error auto-seeding database:", error);
  }
};
