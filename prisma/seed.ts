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

    console.log('Created courses:', { course1, course2 });

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
