import React from 'react';
import { HeartPulse, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center space-x-2 mb-4 text-white">
            <HeartPulse className="h-8 w-8 text-emerald-500" />
            <span className="font-bold text-xl tracking-tight">Shree Lakshmi Child Hospital</span>
          </Link>
          <p className="text-sm text-gray-400 leading-relaxed">
            Shree Lakshmi Clinic started of as small 24 hours clinic in Velachery Chennai in the year 2014. It was an initiative taken by Mr. Subramanian to provide better first-hand care to their patients.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/departments" className="hover:text-emerald-400 transition-colors">Departments</Link></li>
            <li><Link to="/doctors" className="hover:text-emerald-400 transition-colors">Find a Doctor</Link></li>
            <li><Link to="/book" className="hover:text-emerald-400 transition-colors">Book Appointment</Link></li>
            <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Patient Dashboard</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Emergency Care</li>
            <li>Laboratory Services</li>
            <li>Radiology & Imaging</li>
            <li>24/7 Pharmacy</li>
            <li>Blood Bank</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-500 shrink-0" /> 
              <span>No.41, Karunanidhi Street, Nehur Nagar, Velachery, Chennai - 600042</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-emerald-500 shrink-0" /> 
              <span>+91-90871 20926</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-emerald-500 shrink-0" /> 
              <span>info@shreelakshmiclinic.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
        &copy; {new Date().getFullYear()} Shree Lakshmi Child Hospital. All Rights Reserved. Developed and Hosting by iGlowSoft
      </div>
    </footer>
  );
};
