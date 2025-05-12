// app/api/get-latest-updates/route.js

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { userId } = auth();


    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    });

    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();

    const upcomingMeetings = await db.booking.findMany({
        where: {
            userId: user.id,
            startTime: { gte: now },
        },
        include: {
            event: {
                select: { title: true },
            },
        },
        orderBy: {
            startTime: "asc",
        },
        take: 3,
    });

    return NextResponse.json({ success: true, data: upcomingMeetings });
}
