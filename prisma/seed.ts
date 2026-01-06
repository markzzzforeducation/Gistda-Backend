import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    // Create users
    const hashedPassword = await bcrypt.hash('password', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            name: 'Admin (Mentor)',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
        },
    });

    const intern = await prisma.user.upsert({
        where: { email: 'intern@example.com' },
        update: {},
        create: {
            name: 'Intern User',
            email: 'intern@example.com',
            password: hashedPassword,
            role: 'intern',
        },
    });

    // Create profile for intern
    await prisma.profile.upsert({
        where: { userId: intern.id },
        update: {},
        create: {
            userId: intern.id,
            firstName: 'Intern',
            lastName: 'User',
            university: 'GISTDA University',
            faculty: 'Engineering',
            major: 'Computer Engineering',
            studentId: '63010001',
            startDate: '2024-01-01',
            endDate: '2024-04-30',
            mobile: '0812345678',
            advisorName: 'Dr. Advisor',
            advisorEmail: 'advisor@university.ac.th',
        },
    });

    const external = await prisma.user.upsert({
        where: { email: 'external@example.com' },
        update: {},
        create: {
            name: 'External User',
            email: 'external@example.com',
            password: hashedPassword,
            role: 'external',
        },
    });

    console.log('Created users:', { admin, intern, external });

    // Create courses
    const course1 = await prisma.course.upsert({
        where: { id: 'c1' },
        update: {},
        create: {
            id: 'c1',
            title: 'Introduction to Space Technology',
            description: 'Learn the basics of space tech and satellite systems.',
            lessons: {
                create: [
                    {
                        id: 'l1',
                        title: 'History of Spaceflight',
                        content: 'Content about history...',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    },
                    {
                        id: 'l2',
                        title: 'Satellite Orbits',
                        content: 'Content about orbits...',
                        videoUrl: '',
                    },
                ],
            },
        },
    });

    const course2 = await prisma.course.upsert({
        where: { id: 'c2' },
        update: {},
        create: {
            id: 'c2',
            title: 'GISTDA Orientation',
            description: 'Welcome to GISTDA internship program.',
            lessons: {
                create: [
                    {
                        id: 'l3',
                        title: 'Safety Guidelines',
                        content: 'Safety first...',
                        videoUrl: '',
                    },
                ],
            },
        },
    });

    const course3 = await prisma.course.upsert({
        where: { id: 'c3' },
        update: {},
        create: {
            id: 'c3',
            title: 'THEOS-2: การพัฒนาดาวเทียมดวงเล็กและระบบภาคพื้นดิน',
            description: 'หลักสูตรการพัฒนาดาวเทียมเล็กและระบบภาคพื้นดินสำหรับการทบทวนบทเรียนของเจ้าหน้าที่ Theos-2/GISTDA',
            lessons: {
                create: [
                    {
                        id: 'l4',
                        title: 'VDO 1-1-23: Introduction and General Project Management',
                        content: 'บทนำและการจัดการโครงการทั่วไป - เรียนรู้เกี่ยวกับพื้นฐานของการจัดการโครงการและวงจรชีวิตของโครงการ',
                        videoUrl: 'https://www.youtube.com/embed/KspE1OiCduA',
                    },
                    {
                        id: 'l5',
                        title: 'VDO 2-2-23: Spacecraft Systems Engineering',
                        content: 'วิศวกรรมระบบยานอวกาศ - ศึกษาหลักการและกระบวนการออกแบบระบบยานอวกาศ',
                        videoUrl: 'https://www.youtube.com/embed/VitMejketVs',
                    },
                    {
                        id: 'l6',
                        title: 'VDO 3-3-23: Satellite Design and Development',
                        content: 'การออกแบบและพัฒนาดาวเทียม - เจาะลึกกระบวนการออกแบบและพัฒนาดาวเทียมขนาดเล็ก',
                        videoUrl: 'https://www.youtube.com/embed/M7TJ6pcfsoI',
                    },
                    {
                        id: 'l7',
                        title: 'VDO Advance 23: Ground System Infrastructure',
                        content: 'โครงสร้างพื้นฐานระบบภาคพื้นดิน - ศึกษาระบบควบคุมและรับส่งข้อมูลกับดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/SEMovRH5hA4',
                    },
                    {
                        id: 'l8',
                        title: 'VDO Baisc: Fundamentals of Satellite Technology',
                        content: 'พื้นฐานเทคโนโลยีดาวเทียม - ความรู้พื้นฐานที่จำเป็นสำหรับการทำงานกับเทคโนโลยีดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/KB-w27uMM34',
                    },
                ],
            },
        },
    });

    console.log('Created courses:', { course1, course2, course3 });

    // Create submissions
    const submission1 = await prisma.submission.upsert({
        where: { id: 's1' },
        update: {},
        create: {
            id: 's1',
            title: 'Satellite Image Processing using AI',
            abstract: 'A study on using CNNs to detect deforestation.',
            studentName: 'Intern User',
            studentId: intern.id,
            imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
            status: 'published',
        },
    });

    console.log('Created submissions:', { submission1 });

    console.log('Seeding completed!');
}

main()
    .catch((e) => {
        console.error('Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
