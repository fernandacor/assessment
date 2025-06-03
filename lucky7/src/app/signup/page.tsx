//Sign up form
import SignUpForm from '@/components/SignUpForm'
import Link from 'next/link'

export default function SignUp() {
  return (
    <div className='flex w-full flex-col px-6 py-12'>
      <div className='mx-auto w-full max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-darkest'>
          Sign Up for a New Account
        </h2>
      </div>

      <div className='mx-auto mt-10 w-full max-w-sm'>
        <SignUpForm />
      </div>
    </div>
  )
}