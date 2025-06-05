//Sign up form
"use client";

import SignUpForm2 from '@/components/SignUpForm2'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className='flex w-full flex-col px-6 py-12 bg-[url(/lightBG.jpg)] dark:bg-[url(/darkBG.jpg)] bg-cover h-screen' >
      <div className='flex flex-col flex-initial w-3xl h-full items-center bg-slate-50/50 rounded-xl mx-auto dark:bg-stone-700/25'>
      <div className='mx-auto w-full max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-light leading-9 tracking-tight text-lightest'>
          Sign Up for a New Account
        </h2>
      </div>

      <div className='mx-auto mt-10 w-full max-w-sm'>
        <SignUpForm2 />
      </div>
    </div>
    </div>
  )
}