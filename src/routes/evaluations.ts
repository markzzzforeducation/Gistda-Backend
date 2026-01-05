import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from './auth';
import { z } from 'zod';

export const router = Router();

const createEvaluationSchema = z.object({
    internId: z.string(),
    mentorId: z.string(),
    mentorName: z.string(),
    punctuality: z.number().min(0).max(5),
    qualityOfWork: z.number().min(0).max(5),
    teamwork: z.number().min(0).max(5),
    problemSolving: z.number().min(0).max(5),
    comment: z.string(),
});

// Get all evaluations
router.get('/', requireAuth, async (req, res) => {
    try {
        const evaluations = await prisma.evaluation.findMany({
            include: {
                intern: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(evaluations);
    } catch (error) {
        console.error('Get evaluations error:', error);
        res.status(500).json({ error: 'Failed to fetch evaluations' });
    }
});

// Get evaluations for a specific intern
router.get('/intern/:internId', requireAuth, async (req, res) => {
    try {
        const evaluations = await prisma.evaluation.findMany({
            where: { internId: req.params.internId },
            include: {
                intern: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(evaluations);
    } catch (error) {
        console.error('Get intern evaluations error:', error);
        res.status(500).json({ error: 'Failed to fetch evaluations' });
    }
});

// Create evaluation
router.post('/', requireAuth, async (req, res) => {
    try {
        const parse = createEvaluationSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error.flatten() });
        }

        const evaluation = await prisma.evaluation.create({
            data: parse.data,
            include: {
                intern: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.json(evaluation);
    } catch (error) {
        console.error('Create evaluation error:', error);
        res.status(500).json({ error: 'Failed to create evaluation' });
    }
});

// Delete evaluation
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await prisma.evaluation.delete({
            where: { id: req.params.id },
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete evaluation error:', error);
        res.status(500).json({ error: 'Failed to delete evaluation' });
    }
});
