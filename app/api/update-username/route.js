import { currentUser, auth } from "@clerk/nextjs/server";
import { createClerkClient } from '@clerk/backend';
import { db } from "@/lib/prisma";

const adminClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function POST(req) {
    // const { userId } = auth(req);

    const { userId, sessionId } = auth();


    console.log("userId:", userId);
    console.log("sessionId:", sessionId);

    const user = await currentUser();
    console.log(user);


    if (!userId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const { username } = await req.json();

    // Check if username is already taken
    const existingUser = await db.user.findUnique({
        where: { username },
    });
    if (existingUser && existingUser.id !== userId) {
        return new Response(JSON.stringify({ error: "Username is already taken" }), { status: 400 });
    }

    // Update username in database
    await db.user.update({
        where: { clerkUserId: userId },
        data: { username },
    });

    // Update username in Clerk
    await adminClient.users.updateUser(userId, {
        username,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
} 