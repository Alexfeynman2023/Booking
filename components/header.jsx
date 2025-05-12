import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import { SignedIn, SignedOut, SignUpButton, UserButton } from '@clerk/nextjs'
import UserMenu from './user-menu'
import { checkUser } from '@/lib/checkUser'

const Header = async () => {
    const user = await checkUser();

    return (
        <nav className='mx-auto py-2 px-4 flex justify-between items-center shadow-md  border-b-2'>
            <Link href="/" className='flex items-center '>
                <Image src="/logo.svg" alt="Booking Logo" width={60} height={60} className='h-16 w-auto' />
            </Link>
            <div className='flex items-center gap-4'>
                <Link href="/events?create=true">
                    <Button className="flex items-center gap-2">
                        <PenBox size={18} />Create Event
                    </Button>
                </Link>

                <SignedOut>
                    <SignUpButton forceRedirectUrl="/dashboard">
                        <Button variant="outline">Login</Button>
                    </SignUpButton >
                </SignedOut>

                <SignedIn>
                    <UserMenu />
                </SignedIn>

            </div>
        </nav>
    )
}

export default Header