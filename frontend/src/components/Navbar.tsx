import Link from 'next/link'
import { LogIn, User } from 'lucide-react'

export default async function Navbar() {
    return (
        <nav className='top-0 z-50 w-full bg-pink-900 bg-opacity-10 backdrop-filter'>
            <div className='mx-auto max-w-7xl px-6 sm:px-8 lg:px-10'>
                <div className='relative flex h-16 items-center justify-between'>
                    <div className='flex flex-1 items-stretch justify-start'>
                        <Link
                            className='flex flex-shrink-0 items-center space-x-4 text-white hover:text-gray-100'
                            href='/'
                        >
                            <div className='inline-block w-auto text-xl font-semibold'>
                                Compilacompi
                            </div>
                        </Link>
                    </div>
                    <div className='absolute inset-y-0 right-0 flex items-center space-x-4'>
                            <Link
                                href='/signup'
                                className='rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100'
                            >
                                Sign up
                            </Link>
                            <Link
                                href=' /signin'
                                className='rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100'
                            >
                                <LogIn
                                    className='h-6 w-6'
                                />
                            </Link>
                            <Link
                                href='/profile'
                                className='rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-gray-700 hover:text-gray-100'
                            >
                            < User
                                className='h-6 w-6'
                                />
                            </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}