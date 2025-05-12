// import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from '@clerk/backend';
import { db } from "@/lib/prisma";

const adminClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export const checkUser = async () => {
    const user = await currentUser();

    if (!user) {
        return null;
    }

    try {
        const loggedInUser = await db?.user.findUnique({
            where: {
                clerkUserId: user.id,
            },
        });

        if (loggedInUser) {
            return loggedInUser;
        }

        const name = `${user.firstName} ${user.lastName}`;

        await adminClient.users.updateUser(user.id, {
            username: name.split(" ").join("-") + user.id.slice(-4),
        });

        // await clerkClient.users.updateUserMetadata(user.id, {
        //     publicMetadata: {
        //         username: name.split(" ").join("-") + user.id.slice(-4),
        //     },
        // });

        // await clerkClient.users.updateUser(user.id, {
        //     username: name.split(" ").join("-") + user.id.slice(-4),
        // });

        const newUser = await db.user.create({
            data: {
                clerkUserId: user.id,
                name,
                imageUrl: user.imageUrl,
                email: user.emailAddresses[0].emailAddress,
                username: name.split(" ").join("-") + user.id.slice(-4),
            },
        });

        return newUser;
    } catch (error) {
        console.log(error);
    }
};
