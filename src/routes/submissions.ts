import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from './auth';
import { z } from 'zod';

export const router = Router();

const createSubmissionSchema = z.object({
    title: z.string().min(1),
    abstract: z.string(),
    studentName: z.string(),
    studentId: z.string(),
    imageUrl: z.string().url(),
});

// Get all submissions
router.get('/', async (req, res) => {
    try {
        const submissions = await prisma.submission.findMany({
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                submittedAt: 'desc',
            },
        });
        res.json(submissions);
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Get single submission
router.get('/:id', async (req, res) => {
    try {
        const submission = await prisma.submission.findUnique({
            where: { id: req.params.id },
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        if (!submission) return res.status(404).json({ error: 'Submission not found' });
        res.json(submission);
    } catch (error) {
        console.error('Get submission error:', error);
        res.status(500).json({ error: 'Failed to fetch submission' });
    }
});

// Create submission
router.post('/', requireAuth, async (req, res) => {
    try {
        const parse = createSubmissionSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error.flatten() });
        }

        const submission = await prisma.submission.create({
            data: parse.data,
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.json(submission);
    } catch (error) {
        console.error('Create submission error:', error);
        res.status(500).json({ error: 'Failed to create submission' });
    }
});

const updateSubmissionSchema = z.object({
    title: z.string().optional(),
    abstract: z.string().optional(),
    imageUrl: z.string().url().optional(),
    status: z.enum(['pending', 'published', 'rejected']).optional(),
});

// Update submission
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const parse = updateSubmissionSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error.flatten() });
        }

        const submission = await prisma.submission.update({
            where: { id: req.params.id },
            data: parse.data,
            include: {
                student: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.json(submission);
    } catch (error) {
        console.error('Update submission error:', error);
        res.status(500).json({ error: 'Failed to update submission' });
    }
});

// Delete submission
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await prisma.submission.delete({
            where: { id: req.params.id },
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete submission error:', error);
        res.status(500).json({ error: 'Failed to delete submission' });
    }
});
