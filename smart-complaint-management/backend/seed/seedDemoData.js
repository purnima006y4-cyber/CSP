const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Admin = require('../models/Admin');
const Complaint = require('../models/Complaint');
const ComplaintUpdate = require('../models/ComplaintUpdate');
const Notification = require('../models/Notification');
const Counter = require('../models/Counter');

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_complaint_management';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB...');

    // Clear existing collections
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Complaint.deleteMany({});
    await ComplaintUpdate.deleteMany({});
    await Notification.deleteMany({});
    await Counter.deleteMany({});

    console.log('[Seed] Cleared existing data.');

    // 1. Create Default Panchayat Administrator
    const adminSalt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('Admin@123', adminSalt);

    const admin = await Admin.create({
      name: 'Sri K. Ramesh (Panchayat Secretary)',
      username: 'admin',
      email: 'admin@venkatapuram.gov.in',
      passwordHash: adminPasswordHash,
      role: 'Panchayat Secretary'
    });
    console.log('[Seed] Admin created: admin / Admin@123');

    // 2. Create Sample Residents
    const userSalt = await bcrypt.genSalt(10);
    const userPasswordHash = await bcrypt.hash('User@123', userSalt);

    const user1 = await User.create({
      fullName: 'Venkat Rao',
      mobile: '9876543210',
      email: 'venkat@gmail.com',
      village: 'Venkatapuram',
      wardNumber: 'Ward 2',
      address: 'Door No. 3-45, Temple Street, Venkatapuram',
      passwordHash: userPasswordHash,
      preferredLanguage: 'en'
    });

    const user2 = await User.create({
      fullName: 'Lakshmi Devi',
      mobile: '9876543211',
      email: 'lakshmi@gmail.com',
      village: 'Venkatapuram',
      wardNumber: 'Ward 1',
      address: 'Door No. 1-12, BC Colony, Venkatapuram',
      passwordHash: userPasswordHash,
      preferredLanguage: 'te'
    });

    const user3 = await User.create({
      fullName: 'Suresh Kumar',
      mobile: '9876543212',
      email: 'suresh@gmail.com',
      village: 'Venkatapuram',
      wardNumber: 'Ward 4',
      address: 'Door No. 4-88, Main Road, Near Bus Shelter',
      passwordHash: userPasswordHash,
      preferredLanguage: 'en'
    });

    console.log('[Seed] Created 3 sample residents (Password: User@123)');

    // 3. Create Sample Complaints & Timelines
    const complaintsData = [
      {
        complaintId: 'SCM-2026-0001',
        user: user1._id,
        title: 'Drinking water pipeline burst near Shiva Temple',
        category: 'Drinking Water',
        description: 'The main distribution pipe connecting Temple Street burst two days ago. Clean water is spilling into the mud and surrounding households have zero tap pressure.',
        village: 'Venkatapuram',
        location: 'Temple Street, near Shiva Temple',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'B. Naidu (Water Lines Technician)',
        complaintDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updates: [
          {
            status: 'Pending',
            remarks: 'Grievance submitted by resident Venkat Rao.',
            updatedBy: 'System',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          },
          {
            status: 'In Progress',
            remarks: 'Site inspection completed. Pipeline replacement parts dispatched with technician B. Naidu.',
            updatedBy: 'Sri K. Ramesh (Panchayat Secretary)',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        complaintId: 'SCM-2026-0002',
        user: user2._id,
        title: 'Non-functioning streetlights near ZP High School',
        category: 'Streetlights',
        description: 'Four pole lights between the high school entrance and the main arch are dead for past 10 days. Girls and evening commuters face serious danger after 6:30 PM.',
        village: 'Venkatapuram',
        location: 'Zilla Parishad High School Junction',
        priority: 'Medium',
        status: 'Resolved',
        assignedTo: 'P. Prasad (Lineman)',
        complaintDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        resolvedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        updates: [
          {
            status: 'Pending',
            remarks: 'Grievance submitted by resident Lakshmi Devi.',
            updatedBy: 'System',
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
          },
          {
            status: 'In Progress',
            remarks: 'Panchayat lineman assigned with 4 replacement 45W LED luminaires.',
            updatedBy: 'Sri K. Ramesh (Panchayat Secretary)',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
          },
          {
            status: 'Resolved',
            remarks: 'All 4 LED lights replaced and tested. Full illumination restored along School Road.',
            updatedBy: 'P. Prasad (Lineman)',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        complaintId: 'SCM-2026-0003',
        user: user2._id,
        title: 'Severe drainage overflow and silt blockage in BC Colony',
        category: 'Drainage and Sanitation',
        description: 'Side drain has not been cleared for two months. Heavy monsoon water overflowed onto pedestrian paths, causing intense foul smell and mosquito menace.',
        village: 'Venkatapuram',
        location: 'BC Colony, 2nd Lane',
        priority: 'High',
        status: 'Pending',
        assignedTo: null,
        complaintDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updates: [
          {
            status: 'Pending',
            remarks: 'Grievance submitted by resident Lakshmi Devi. Awaiting sanitation crew allocation.',
            updatedBy: 'System',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        complaintId: 'SCM-2026-0004',
        user: user3._id,
        title: 'Deep road craters on Venkatapuram-Mandal Link Road',
        category: 'Roads and Potholes',
        description: 'A 200m section has massive potholes where two auto-rickshaws overturned last week during rainfall. Urgent gravelling and patch-up needed.',
        village: 'Venkatapuram',
        location: 'Mandal Link Road, near Mile Marker 2',
        priority: 'High',
        status: 'Pending',
        assignedTo: null,
        complaintDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updates: [
          {
            status: 'Pending',
            remarks: 'Grievance submitted by resident Suresh Kumar. Forwarded to R&B Engineering department.',
            updatedBy: 'System',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        complaintId: 'SCM-2026-0005',
        user: user1._id,
        title: 'Garbage dumping in open ground behind Anganwadi',
        category: 'Garbage Collection',
        description: 'Solid waste collection tractor did not visit Ward 2 for over 8 days. Waste is piling up and stray animals are scattering garbage on the pathway.',
        village: 'Venkatapuram',
        location: 'Behind Anganwadi Center, Ward 2',
        priority: 'Medium',
        status: 'Resolved',
        assignedTo: 'M. Srinivas (Sanitation Supervisor)',
        complaintDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        resolvedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        updates: [
          {
            status: 'Pending',
            remarks: 'Grievance submitted by resident Venkat Rao.',
            updatedBy: 'System',
            createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000)
          },
          {
            status: 'In Progress',
            remarks: 'Sanitation tractor directed to Ward 2 Anganwadi perimeter for special clearance drive.',
            updatedBy: 'Sri K. Ramesh (Panchayat Secretary)',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          },
          {
            status: 'Resolved',
            remarks: 'Accumulated solid waste cleared and bleaching powder sprinkled across the perimeter.',
            updatedBy: 'M. Srinivas (Sanitation Supervisor)',
            createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
          }
        ]
      },
      {
        complaintId: 'SCM-2026-0006',
        user: user3._id,
        title: 'Low voltage and sparking wire near Agriculture Feeder',
        category: 'Electricity',
        description: 'Agricultural pump sets cannot start due to 160V line drops. High voltage sparks observed near transformer pole #12.',
        village: 'Venkatapuram',
        location: 'South Fields, Borewell Cluster #4',
        priority: 'High',
        status: 'In Progress',
        assignedTo: 'A. Ramana (APEPDCL Lineman)',
        complaintDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updates: [
          {
            status: 'Pending',
            remarks: 'Grievance submitted by resident Suresh Kumar.',
            updatedBy: 'System',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
          },
          {
            status: 'In Progress',
            remarks: 'Notified electricity board sub-station. Transformer fuse tightened; load balancing scheduled.',
            updatedBy: 'Sri K. Ramesh (Panchayat Secretary)',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
          }
        ]
      }
    ];

    for (const item of complaintsData) {
      const { updates, ...complaintProps } = item;
      const complaint = await Complaint.create(complaintProps);

      for (const upd of updates) {
        await ComplaintUpdate.create({
          complaint: complaint._id,
          status: upd.status,
          remarks: upd.remarks,
          updatedBy: upd.updatedBy,
          createdAt: upd.createdAt
        });
      }

      // Add a notification for resolved or in-progress complaints
      if (complaint.status !== 'Pending') {
        await Notification.create({
          user: complaint.user,
          complaint: complaint._id,
          message: `Your complaint ${complaint.complaintId} status updated to ${complaint.status}.`,
          isRead: complaint.status === 'Resolved'
        });
      }
    }

    // Initialize atomic sequence Counter to 6
    const year = new Date().getFullYear();
    await Counter.create({
      _id: `complaintId_${year}`,
      seq: complaintsData.length
    });

    console.log(`[Seed] Seeded ${complaintsData.length} complaints, progress timelines & notifications!`);
    console.log('[Seed] Database successfully populated!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
