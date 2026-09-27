const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
require('dotenv').config();

const prisma = new PrismaClient();

async function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString('hex')}`);
    });
  });
}

async function main() {
  console.log('Seeding Supabase PostgreSQL database...');

  const adminPasswordHash = await hashPassword('admin123456');
  const studentPasswordHash = await hashPassword('password123');
  const mentorPasswordHash = await hashPassword('password123');

  // 1. Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'dean@jijnasu.edu' },
    update: {},
    create: {
      id: 'usr_admin',
      email: 'dean@jijnasu.edu',
      name: 'Dr. Vikram Sen',
      role: 'ADMIN',
      major: 'Academic Affairs & Counseling',
      semester: 8,
      weeklyTargetHours: 20,
      passwordHash: adminPasswordHash
    }
  });
  console.log('Upserted Admin:', admin.email);

  // 2. Student user
  const student = await prisma.user.upsert({
    where: { email: 'student@eng.edu' },
    update: {},
    create: {
      id: 'usr_demo_student',
      email: 'student@eng.edu',
      name: 'Aarav Patel',
      role: 'STUDENT',
      major: 'Computer Science & Engineering',
      semester: 5,
      weeklyTargetHours: 25,
      passwordHash: studentPasswordHash
    }
  });
  console.log('Upserted Demo Student:', student.email);

  // 3. Mentor user
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@eng.edu' },
    update: {},
    create: {
      id: 'usr_mentor_01',
      email: 'mentor@eng.edu',
      name: 'Prof. Ananya Roy',
      role: 'MENTOR',
      major: 'Computer Systems Architecture',
      semester: 8,
      weeklyTargetHours: 25,
      passwordHash: mentorPasswordHash
    }
  });
  console.log('Upserted Demo Mentor:', mentor.email);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
