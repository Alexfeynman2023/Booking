"use server";

import { db } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function getLatestUpdates() {
    // const { userId } = auth();
    const cUser = await currentUser();

    if (!cUser) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: cUser.id },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const now = new Date();

    const upcomingMeetings = await db.booking.findMany({
        where: {
            userId: user.id,
            startTime: { gte: now },
        },
        include: {
            event: {
                select: {
                    title: true,
                },
            },
        },
        orderBy: {
            startTime: "asc",
        },
        take: 3,
    });

    return upcomingMeetings;
}
