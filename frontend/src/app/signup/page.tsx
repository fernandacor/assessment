//Sign up form
"use client";

import SignUpForm2 from '@/components/SignUpForm2'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className="relative flex w-full flex-col px-6 py-12 bg-gray-50 dark:bg-[url(/darkBG.jpg)] bg-cover h-screen overflow-hidden">
          
          {/* Blobs */}
          <div className="absolute top-0 left-35 w-72 h-72 bg-[#355C7D] rounded-full opacity-70 mix-blend-multiply filter blur-xl scale-200 hover:scale-250 transition-transform duration-700 delay-300"></div>
          <div className="absolute top-5 right-40 w-72 h-72 bg-[#A8E6CF] rounded-full opacity-70 mix-blend-multiply filter blur-xl scale-200 hover:scale-250 transition-transform duration-700 delay-150"></div>
          <div className="absolute -bottom-8 left-100 w-72 h-72 bg-[#a9b1e0] rounded-full opacity-70 mix-blend-multiply filter blur-xl scale-200 hover:scale-250 transition-transform duration-700 delay-300"></div>
          <div className="absolute bottom-40 left-20 w-72 h-72 bg-[#A8E6CF] rounded-full opacity-70 mix-blend-multiply filter blur-xl scale-200 hover:scale-250 transition-transform duration-700 delay-150"></div>
          <div className="absolute top-75 -right-2 w-72 h-72 bg-[#a9b1e0] rounded-full opacity-70 mix-blend-multiply filter blur-xl scale-200 hover:scale-250 transition-transform duration-700 delay-300"></div>
    
    
          {/* Sign-in card */}
          <div className="relative flex flex-col flex-initial w-2xl h-auto mt-5 items-center bg-gray-100/50 rounded-xl mx-auto dark:bg-stone-700/25 z-10 shadow-lg backdrop-blur-md">
            <div className="mx-auto w-full max-w-sm">
              <h2 className="mt-10 text-center text-2xl font-light leading-9 tracking-tight text-lightest">
              Crea una cuenta
              </h2>
            </div>
    
            <div className="mx-auto mt-5 w-full max-w-sm">
            <SignUpForm2 />
              <p className="mt-5 mb-5 text-center text-sm text-gray-500">
                Ya tienes una cuenta?{' '}
                <Link
                  href="/signin"
                  className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  Inicia sesión!
                </Link>
              </p>  
            </div>
          </div>
        </div>
  )
}