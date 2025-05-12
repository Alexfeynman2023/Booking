"use client";
import { UserButton } from "@clerk/nextjs"
import { ChartNoAxesGantt } from "lucide-react";
function UserMenu() {
    return (
        <UserButton appearance={{
            elements: {
                avatarBox: "h-10 w-10",
            }
        }} >
            <UserButton.MenuItems>
                <UserButton.Link
                    label="My Events"
                    labelIcon={<ChartNoAxesGantt size={15} />}
                    href="/events"
                />
            </UserButton.MenuItems>
        </UserButton>
    )
}

export default UserMenu