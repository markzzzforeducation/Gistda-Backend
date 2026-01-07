import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from './auth';
import { z } from 'zod';

export const router = Router();

const lessonSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    content: z.string(),
    videoUrl: z.string().optional(),
    instructor: z.string().optional(),
    duration: z.string().optional(),
});

const createCourseSchema = z.object({
    title: z.string().min(1),
    description: z.string(),
    lessons: z.array(lessonSchema).optional(),
});

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await prisma.course.findMany({
            include: {
                lessons: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(courses);
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

// Get single course
router.get('/:id', async (req, res) => {
    try {
        const course = await prisma.course.findUnique({
            where: { id: req.params.id },
            include: {
                lessons: true,
            },
        });
        if (!course) return res.status(404).json({ error: 'Course not found' });
        res.json(course);
    } catch (error) {
        console.error('Get course error:', error);
        res.status(500).json({ error: 'Failed to fetch course' });
    }
});

// Create course
router.post('/', requireAuth, async (req, res) => {
    try {
        const parse = createCourseSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error.flatten() });
        }

        const { title, description, lessons } = parse.data;

        const course = await prisma.course.create({
            data: {
                title,
                description,
                lessons: lessons
                    ? {
                        create: lessons.map((lesson) => ({
                            title: lesson.title,
                            content: lesson.content,
                            videoUrl: lesson.videoUrl || '',
                            instructor: lesson.instructor,
                            duration: lesson.duration,
                        })),
                    }
                    : undefined,
            },
            include: {
                lessons: true,
            },
        });

        res.json(course);
    } catch (error) {
        console.error('Create course error:', error);
        res.status(500).json({ error: 'Failed to create course' });
    }
});

const updateCourseSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    lessons: z.array(lessonSchema).optional(),
});

// Update course
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const parse = updateCourseSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error.flatten() });
        }

        const { title, description, lessons } = parse.data;

        // If lessons are provided, delete old ones and create new ones
        if (lessons) {
            await prisma.lesson.deleteMany({
                where: { courseId: req.params.id },
            });
        }

        const course = await prisma.course.update({
            where: { id: req.params.id },
            data: {
                title,
                description,
                lessons: lessons
                    ? {
                        create: lessons.map((lesson) => ({
                            title: lesson.title,
                            content: lesson.content,
                            videoUrl: lesson.videoUrl || '',
                            instructor: lesson.instructor,
                            duration: lesson.duration,
                        })),
                    }
                    : undefined,
            },
            include: {
                lessons: true,
            },
        });

        res.json(course);
    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
});

// Delete course
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        console.log('Attempting to delete course:', req.params.id);
        const result = await prisma.course.delete({
            where: { id: req.params.id },
        });
        console.log('Course deleted successfully:', result);
        res.json({ success: true });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ error: 'Failed to delete course', details: error instanceof Error ? error.message : 'Unknown error' });
    }
});

// Update lesson
router.put('/:courseId/lessons/:lessonId', requireAuth, async (req, res) => {
    try {
        const { title, content, videoUrl, instructor, duration } = req.body;

        const lesson = await prisma.lesson.update({
            where: { id: req.params.lessonId },
            data: {
                title,
                content,
                videoUrl: videoUrl || '',
                instructor,
                duration,
            },
        });

        res.json(lesson);
    } catch (error) {
        console.error('Update lesson error:', error);
        res.status(500).json({ error: 'Failed to update lesson' });
    }
});

// Delete lesson
router.delete('/:courseId/lessons/:lessonId', requireAuth, async (req, res) => {
    try {
        await prisma.lesson.delete({
            where: { id: req.params.lessonId },
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete lesson error:', error);
        res.status(500).json({ error: 'Failed to delete lesson' });
    }
});
