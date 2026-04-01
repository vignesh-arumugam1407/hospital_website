import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Activity, Heart, ShieldPlus, ArrowRight, Microscope, Pill, Syringe, TestTube } from 'lucide-react';
import { motion } from 'motion/react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-emerald-700 text-white py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
              WELCOME TO SHREE LAKSHMI 24 HRS CHILD HOSPITAL
            </h1>
            <p className="text-xl text-emerald-100 mb-10 leading-relaxed">
              Shree Lakshmi Clinic started of as small 24 hours clinic in Velachery Chennai in the year 2014. It was an initiative taken by Mr. Subramanian to provide better first-hand care to their patients. Their aim was a better patient-doctor rapport. To meet the growing medical needs and challenges to their patients.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/book" 
                className="bg-white text-emerald-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors shadow-lg flex items-center gap-2"
              >
                Book Appointment <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/doctors" 
                className="bg-emerald-600 border border-emerald-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-500 transition-colors shadow-lg"
              >
                Find a Doctor
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Shree Lakshmi Clinic, Chennai is a multispeciality facility catering to the healthcare needs of the people of Chennai. With a team of expert medical professionals and state-of-the-art medical infrastructure, the hospital provides advanced medical care in over 10 medical specialties.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Microscope className="w-8 h-8 text-emerald-600" />, title: "24×7 Availability", desc: "24×7 Availability of Doctors and Nurses." },
              { icon: <Pill className="w-8 h-8 text-emerald-600" />, title: "24×7 Pharmacy", desc: "Fully stocked pharmacy open round the clock." },
              { icon: <Syringe className="w-8 h-8 text-emerald-600" />, title: "Oxygen Support", desc: "Round-the-clock emergency oxygen support." },
              { icon: <TestTube className="w-8 h-8 text-emerald-600" />, title: "Nutrition Advice", desc: "Expert nutrition advice for children and adults." }
            ].map((service, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-xl bg-emerald-50 flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Shree Lakshmi Child Hospital?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Shree Lakshmi Clinic has all facilities. We are specialists in Pediatrics, Infertility, Skin, Diabetes, Orthopedics, Gynecology, etc…</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { icon: <Stethoscope className="w-10 h-10 text-emerald-600" />, title: "Expert Doctors", desc: "Our specialists are leaders in their respective fields." },
              { icon: <Activity className="w-10 h-10 text-emerald-600" />, title: "Modern Facilities", desc: "Equipped with the latest medical technology and equipment." },
              { icon: <ShieldPlus className="w-10 h-10 text-emerald-600" />, title: "24/7 Care", desc: "Round-the-clock emergency services and patient support." }
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-shadow text-center group"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
