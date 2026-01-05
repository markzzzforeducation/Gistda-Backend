import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { requireAuth } from './auth';
import { z } from 'zod';

export const router = Router();

// Get all users
router.get('/', requireAuth, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                provider: true,
                avatar: true,
                profile: true,
                createdAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Get single user
router.get('/:id', requireAuth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                provider: true,
                avatar: true,
                profile: true,
                createdAt: true,
            },
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

const updateUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    role: z.enum(['admin', 'intern', 'external']).optional(),
});

// Update user
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const parse = updateUserSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error.flatten() });
        }

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: parse.data,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                provider: true,
                avatar: true,
                profile: true,
            },
        });
        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

const updateProfileSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    university: z.string().optional(),
    faculty: z.string().optional(),
    major: z.string().optional(),
    studentId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    mobile: z.string().optional(),
    advisorName: z.string().optional(),
    advisorEmail: z.string().optional(),
});

// Update user profile
router.put('/:id/profile', requireAuth, async (req, res) => {
    try {
        const parse = updateProfileSchema.safeParse(req.body);
        if (!parse.success) {
            return res.status(400).json({ errors: parse.error.flatten() });
        }

        // Check if profile exists
        const existingProfile = await prisma.profile.findUnique({
            where: { userId: req.params.id },
        });

        let profile;
        if (existingProfile) {
            profile = await prisma.profile.update({
                where: { userId: req.params.id },
                data: parse.data,
            });
        } else {
            profile = await prisma.profile.create({
                data: {
                    userId: req.params.id,
                    ...parse.data,
                },
            });
        }

        res.json(profile);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// Delete user
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        await prisma.user.delete({
            where: { id: req.params.id },
        });
        res.json({ success: true });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});
