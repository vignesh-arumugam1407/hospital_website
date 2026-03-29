import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { HeartPulse, LogIn, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="bg-emerald-600 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <HeartPulse className="h-8 w-8 text-emerald-100" />
              <span className="font-bold text-xl tracking-tight">Shree Lakshmi Child Hospital</span>
            </Link>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/departments" className="hover:text-emerald-200 px-3 py-2 rounded-md font-medium transition-colors">Specialities</Link>
              <Link to="/doctors" className="hover:text-emerald-200 px-3 py-2 rounded-md font-medium transition-colors">Doctors</Link>
              <Link to="/book" className="hover:text-emerald-200 px-3 py-2 rounded-md font-medium transition-colors">Book Appointment</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {profile?.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-medium hover:text-emerald-200 transition-colors">Admin Panel</Link>
                )}
                <Link to="/dashboard" className="flex items-center space-x-2 hover:text-emerald-200 transition-colors">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="Profile" className="h-8 w-8 rounded-full border-2 border-emerald-400" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="h-6 w-6" />
                  )}
                  <span className="hidden sm:inline font-medium">{profile?.name}</span>
                </Link>
                <button onClick={handleLogout} className="p-2 rounded-full hover:bg-emerald-700 transition-colors" title="Logout">
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link 
                to="/login"
                className="flex items-center space-x-2 bg-white text-emerald-600 px-4 py-2 rounded-full font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
