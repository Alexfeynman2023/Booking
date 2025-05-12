import { Suspense } from "react";

export default function NotFound() {
    return (
        <Suspense>
            <div className="text-4xl font-extrabold w-screen pt-96 grid place-items-center">
                <h1>404 - Page Not Found</h1>
            </div>
        </Suspense>
    );
}
