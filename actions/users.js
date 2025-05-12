"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from '@clerk/backend';
const adminClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function updateUsername(username) {
    // const { userId } = auth();
    const cUser = await currentUser();
    if (!cUser) {
        throw new Error("Unauthorized");
    }

    // Check if username is already taken
    const existingUser = await db.user.findUnique({
        where: { username },
    });

    if (existingUser && existingUser.id !== cUser.id) {
        throw new Error("Username is already taken");
    }

    // Update username in database
    await db.user.update({
        where: { clerkUserId: cUser.id },
        data: { username },
    });

    // Update username in Clerk
    // await clerkClient.users.updateUser(userId, {
    //     username,
    // });

    await adminClient.users.updateUser(cUser.id, {
        username,
    });


    return { success: true };
}

export async function getUserByUsername(username) {
    const user = await db.user.findUnique({
        where: { username },
        select: {
            id: true,
            name: true,
            email: true,
            imageUrl: true,
            events: {
                where: {
                    isPrivate: false,
                },
                orderBy: {
                    createdAt: "desc",
                },
                select: {
                    id: true,
                    title: true,
                    description: true,
                    duration: true,
                    isPrivate: true,
                    _count: {
                        select: { bookings: true },
                    },
                },
            },
        },
    });

    return user;
}
