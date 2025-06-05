//Sign In form
"use client";

import SignInForm from '@/components/SignInForm'
import Link from 'next/link'

export default function SignIn() {
  return (
    <div className='flex w-full flex-col px-6 py-12 bg-[url(/lightBG.jpg)] dark:bg-[url(/darkBG.jpg)] bg-cover h-screen' >
      <div className='flex flex-col flex-initial w-3xl h-9/10 items-center bg-slate-50/50 rounded-xl mx-auto dark:bg-stone-700/25'>
      <div className='mx-auto w-full max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-light leading-9 tracking-tight text-lightest'>
          Sign in to your account
        </h2>
      </div>

      <div className='mx-auto mt-10 w-full max-w-sm'>
        <SignInForm />

        <p className='mt-10 text-center text-sm text-gray-500'>
          Not a member?{' '}
          <Link
            href='/auth/signup'
            className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'
          >
            Register now!
          </Link>
        </p>
      </div>
    </div>
    </div>
  )
}