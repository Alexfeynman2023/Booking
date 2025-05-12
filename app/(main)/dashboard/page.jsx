"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/use-fetch";
import { usernameSchema } from "@/app/lib/validators";
import { updateUsername } from "@/actions/users";
import { getLatestUpdates } from "@/actions/dashboard";
import { format } from "date-fns";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const [origin, setOrigin] = useState("");

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(usernameSchema),
    });

    useEffect(() => {
        setValue("username", user?.username);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    const {
        loading: loadingUpdates,
        data: upcomingMeetings,
        fn: fnUpdates,
    } = useFetch(getLatestUpdates);
    // const {
    //     loading: loadingUpdates,
    //     data: upcomingMeetings,
    //     fn: fnUpdates,
    // } = useFetch(async () => {
    //     const res = await fetch("/api/get-latest-updates", {
    //         method: "GET",
    //         credentials: "include",
    //     });
    //     const data = await res.json();
    //     if (!res.ok) {
    //         throw new Error(data.error || "Failed to fetch updates");
    //     }
    //     return data.data;
    // });

    useEffect(() => {
        (async () => await fnUpdates())();
    }, []);

    const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);
    // const { loading, error, fn: fnUpdateUsername } = useFetch(async (username) => {
    //     const res = await fetch('/api/update-username', {
    //         method: 'POST',
    //         credentials: "include",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ username }),
    //     });

    //     if (!res.ok) {
    //         const data = await res.json();
    //         throw new Error(data.error || "Unknown error");
    //     }

    //     return await res.json();
    // });

    const onSubmit = async (data) => {
        await fnUpdateUsername(data.username);
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome, {user?.firstName}!</CardTitle>
                </CardHeader>
                <CardContent>
                    {!loadingUpdates ? (
                        <div className="space-y-6 font-light">
                            <div>
                                {upcomingMeetings && upcomingMeetings?.length > 0 ? (
                                    <ul className="list-disc pl-5">
                                        {upcomingMeetings?.map((meeting) => (
                                            <li key={meeting.id}>
                                                {meeting.event.title} on{" "}
                                                {format(
                                                    new Date(meeting.startTime),
                                                    "MMM d, yyyy h:mm a"
                                                )}{" "}
                                                with {meeting.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No upcoming meetings</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p>Loading updates...</p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Unique Link</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <span>{origin}/</span>
                                <Input {...register("username")} placeholder="username" />
                            </div>
                            {errors.username && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.username.message}
                                </p>
                            )}
                            {error && (
                                <p className="text-red-500 text-sm mt-1">{error?.message}</p>
                            )}
                        </div>
                        {loading && (
                            <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
                        )}
                        <Button type="submit" disabled={loading}>
                            Update Username
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
