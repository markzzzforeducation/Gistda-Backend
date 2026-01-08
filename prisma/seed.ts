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
                        title: 'Project Management',
                        content: 'บทนำและการจัดการโครงการทั่วไป - เรียนรู้เกี่ยวกับพื้นฐานของการจัดการโครงการและวงจรชีวิตของโครงการ',
                        videoUrl: 'https://www.youtube.com/embed/KspE1OiCduA',
                        instructor: 'ระนิพนธ์ วะชินี',
                        duration: '1:22:48 hrs',
                    },
                    {
                        id: 'l5',
                        title: 'Introduction to Spacecraft Systems Engineering',
                        content: 'วิศวกรรมระบบยานอวกาศ - ศึกษาหลักการและกระบวนการออกแบบระบบยานอวกาศ',
                        videoUrl: 'https://www.youtube.com/embed/VitMejketVs',
                        instructor: 'มาสเตอร์ศักดิ์สิทธิ์ ทิณณกร',
                        duration: '1:32:34 hrs',
                    },
                    {
                        id: 'l6',
                        title: 'Structural Design',
                        content: 'การออกแบบโครงสร้าง - ศึกษาการออกแบบและวิเคราะห์โครงสร้างดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/M7TJ6pcfsoI',
                        instructor: 'มาสเตอร์ศักดิ์สิทธิ์ วงษ์รองเมือง',
                        duration: '1:26:06 hrs',
                    },
                    {
                        id: 'l7',
                        title: 'Introduction to Thermal and Radiation',
                        content: 'การจัดการความร้อนและการป้องกันรังสี - เรียนรู้เกี่ยวกับระบบควบคุมอุณหภูมิและการป้องกันรังสีในอวกาศ',
                        videoUrl: 'https://www.youtube-nocookie.com/embed/KspE1OiCduA?rel=0&controls=1&disablekb=0&enablejsapi=1&modestbranding=1',
                        instructor: 'มาสเตอร์อธิคม ศิรฉันทรัตน์',
                        duration: '1:00:14 hrs',
                    },
                    {
                        id: 'l8',
                        title: 'Introduction to Spacecraft Structural Analysis & Test',
                        content: 'การวิเคราะห์และทดสอบโครงสร้างยานอวกาศ - ศึกษาวิธีการทดสอบและวิเคราะห์ความแข็งแรงของโครงสร้าง',
                        videoUrl: 'https://www.youtube.com/embed/SEMovRH5hA4',
                        instructor: 'มาสเตอร์มณฑ์ชัย สันทนาทร',
                        duration: '1:10:52 hrs',
                    },
                    {
                        id: 'l9',
                        title: 'Introduction to AOCS Hardware & GPS',
                        content: 'ระบบควบคุมทิศทางและตำแหน่ง - เรียนรู้เกี่ยวกับฮาร์ดแวร์ AOCS และระบบ GPS',
                        videoUrl: 'https://www.youtube.com/embed/KB-w27uMM34',
                        instructor: 'ถาวร/อภิบริรักษ์ อินทั้งมี',
                        duration: '1:05:26 hrs',
                    },
                    {
                        id: 'l10',
                        title: 'Introduction to Flight Software',
                        content: 'ซอฟต์แ วร์การบิน - ศึกษาระบบซอฟต์แวร์ที่ใช้ควบคุมการบินของดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'ปาหยง สุกร',
                        duration: '1:18:53 hrs',
                    },
                    {
                        id: 'l11',
                        title: 'Introduction to Power System',
                        content: 'ระบบพลังงาน - เรียนรู้เกี่ยวกับระบบจ่ายไฟและการเก็บพลังงานบนดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'มาตรธรีกมล เจริญศรี',
                        duration: '1:15:16 hrs',
                    },
                    {
                        id: 'l12',
                        title: 'RF System for Satellite',
                        content: 'ระบบคลื่นวิทยุสำหรับดาวเทียม - ศึกษาระบบสื่อสารและการส่งรับสัญญาณ',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'พันธริษอพ่ารรริตน์ หาญตระกูล',
                        duration: '1:02:48 hrs',
                    },
                    {
                        id: 'l13',
                        title: 'On-board Data Handling (OBDH)',
                        content: 'ระบบจัดการข้อมูลบนดาวเทียม - เรียนรู้เกี่ยวกับการประมวลผลและจัดเก็บข้อมูล',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'เธียบคุมทีที กาชัล',
                        duration: '1:02:27 hrs',
                    },
                    {
                        id: 'l14',
                        title: 'Optics and Imager Electronics Introduction Course',
                        content: 'ระบบเซ็นเซอร์ภาพและอิเล็กทรอนิกส์ - ศึกษาระบบถ่ายภาพและการประมวลผลสัญญาณ',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'นวลจิต พรหมวงศา',
                        duration: '53:33 mins',
                    },
                    {
                        id: 'l15',
                        title: 'Introduction to AOCS System and Software',
                        content: 'ระบบและซอฟต์แวร์ AOCS - เรียนรู้เกี่ยวกับระบบควบคุมทิศทางและตำแหน่งแบบครบวงจร',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'ประชุม มาผลผล',
                        duration: '1:24:36 hrs',
                    },
                    {
                        id: 'l16',
                        title: 'Introduction to AIV Part 1',
                        content: 'การประกอบ บูรณาการ และทดสอบ ส่วนที่ 1 - ศึกษากระบวนการ AIV',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'ศักดิ์สิทธิ์ ชูธรรมศักดิ์',
                        duration: '45:56 mins',
                    },
                    {
                        id: 'l17',
                        title: 'Introduction to AIV Part 2',
                        content: 'การประกอบ บูรณาการ และทดสอบ ส่วนที่ 2 - ศึกษากระบวนการ AIV (ต่อ)',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'วันเพ็ญ ดีเงา',
                        duration: '46:16 mins',
                    },
                    {
                        id: 'l18',
                        title: 'Introduction to Simulator',
                        content: 'ระบบจำลอง - เรียนรู้เกี่ยวกับการจำลองการทำงานของดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'ประทีป ขุนเพียร',
                        duration: '56:43 mins',
                    },
                    {
                        id: 'l19',
                        title: 'Introduction to Operate Simulator',
                        content: 'การใช้งานระบบจำลอง - ฝึกปฏิบัติการใช้งานระบบจำลองการทำงาน',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'เจนจันวัช คำอิสระ',
                        duration: '47:51 mins',
                    },
                    {
                        id: 'l20',
                        title: 'Introduction to Ground Segment',
                        content: 'ระบบภาคพื้นดิน - ศึกษาโครงสร้างพื้นฐานและระบบควบคุมภาคพื้นดิน',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'พลเทพ พุทอง',
                        duration: '40:44 mins',
                    },
                    {
                        id: 'l21',
                        title: 'Introduction to Spacecraft Operation Centre',
                        content: 'ศูนย์ควบคุมการปฏิบัติการดาวเทียม - เรียนรู้เกี่ยวกับการควบคุมและติดตามดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'พ้อย้ดิม อซันคุ',
                        duration: '1:34:04 hrs',
                    },
                    {
                        id: 'l22',
                        title: 'Introduction to Mission Planning System',
                        content: 'ระบบวางแผนภารกิจ - ศึกษาการวางแผนและจัดการภารกิจดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'ธนมกรึ คุบัขา',
                        duration: '44:12 mins',
                    },
                    {
                        id: 'l23',
                        title: 'Introduction to Flight Dynamics System (FDS)',
                        content: 'ระบบพลวัตการบิน - เรียนรู้เกี่ยวกับการคำนวณวงโคจรและพลวัตการบิน',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'วริยะศัม จันทรานุชิต',
                        duration: '1:08:56 hrs',
                    },
                    {
                        id: 'l24',
                        title: 'Introduction to Image Processing',
                        content: 'การประมวลผลภาพ - ศึกษาการประมวลผลและวิเคราะห์ภาพจากดาวเทียม',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'สุภวัจริศักดิ์ สมหมาย',
                        duration: '31:31 mins',
                    },
                    {
                        id: 'l25',
                        title: 'Overview of Satellite and Ground Station Operation',
                        content: 'ภาพรวมการปฏิบัติการดาวเทียมและสถานีภาคพื้นดิน - สรุปการทำงานของระบบทั้งหมด',
                        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                        instructor: 'ประวีระ ไผ่สะอี',
                        duration: '1:49:39 hrs',
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
