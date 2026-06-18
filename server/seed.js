import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Department from './models/Department.js';
import Doctor from './models/Doctor.js';
import Patient from './models/Patient.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Doctor.deleteMany({});
    await Patient.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@hospital.com',
      password: 'admin123',
      role: 'admin',
      phone: '+91-9876543210'
    });
    console.log('👤 Admin user created: admin@hospital.com / admin123');

    // Create departments
    const departments = await Department.insertMany([
      { name: 'Cardiology', description: 'Heart and cardiovascular system care', icon: '❤️' },
      { name: 'Neurology', description: 'Brain and nervous system disorders', icon: '🧠' },
      { name: 'Orthopedics', description: 'Bone, joint, and muscle care', icon: '🦴' },
      { name: 'Pediatrics', description: 'Medical care for infants and children', icon: '👶' },
      { name: 'Dermatology', description: 'Skin, hair, and nail care', icon: '🧴' },
      { name: 'Ophthalmology', description: 'Eye care and vision', icon: '👁️' },
      { name: 'ENT', description: 'Ear, nose, and throat care', icon: '👂' },
      { name: 'General Medicine', description: 'Primary and general healthcare', icon: '🏥' }
    ]);
    console.log(`🏥 ${departments.length} departments created`);

    // Create doctor users and profiles
    const doctorData = [
      { name: 'Dr. Sarah Johnson', email: 'sarah@hospital.com', specialization: 'Cardiologist', qualification: 'MD, DM Cardiology', experience: 12, fees: 1500, deptIndex: 0 },
      { name: 'Dr. Michael Chen', email: 'michael@hospital.com', specialization: 'Neurologist', qualification: 'MD, DM Neurology', experience: 8, fees: 1200, deptIndex: 1 },
      { name: 'Dr. Priya Sharma', email: 'priya@hospital.com', specialization: 'Orthopedic Surgeon', qualification: 'MS Orthopedics', experience: 15, fees: 1000, deptIndex: 2 },
      { name: 'Dr. James Wilson', email: 'james@hospital.com', specialization: 'Pediatrician', qualification: 'MD Pediatrics', experience: 10, fees: 800, deptIndex: 3 },
      { name: 'Dr. Aisha Khan', email: 'aisha@hospital.com', specialization: 'Dermatologist', qualification: 'MD Dermatology', experience: 6, fees: 900, deptIndex: 4 }
    ];

    for (const doc of doctorData) {
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: 'doctor123',
        role: 'doctor',
        phone: '+91-98765' + Math.floor(10000 + Math.random() * 90000)
      });

      await Doctor.create({
        user: user._id,
        department: departments[doc.deptIndex]._id,
        specialization: doc.specialization,
        qualification: doc.qualification,
        experience: doc.experience,
        fees: doc.fees,
        bio: `Experienced ${doc.specialization} with ${doc.experience} years of practice.`
      });
    }
    console.log(`👨‍⚕️ ${doctorData.length} doctors created (password: doctor123)`);

    // Create sample patient
    const patientUser = await User.create({
      name: 'John Doe',
      email: 'patient@hospital.com',
      password: 'patient123',
      role: 'patient',
      phone: '+91-9876500001'
    });

    await Patient.create({
      user: patientUser._id,
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      bloodGroup: 'O+',
      address: { street: '123 Health St', city: 'Mumbai', state: 'Maharashtra', zipCode: '400001' },
      emergencyContact: { name: 'Jane Doe', relationship: 'Spouse', phone: '+91-9876500002' }
    });
    console.log('🤒 Sample patient created: patient@hospital.com / patient123');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log('   Admin:   admin@hospital.com   / admin123');
    console.log('   Doctor:  sarah@hospital.com   / doctor123');
    console.log('   Patient: patient@hospital.com / patient123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
