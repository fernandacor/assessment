import React from 'react'
import Link from 'next/link'

async function Profile() {
  return (
    <div className='flex w-full flex-col px-6 py-12 bg-[url(/lightBG.jpg)] dark:bg-[url(/darkBG.jpg)] bg-cover h-screen' >
    <div className='flex flex-col flex-initial w-3xl h-9/10 items-center bg-slate-50/50 rounded-xl mx-auto dark:bg-stone-700/25'>
    <div className='flex h-auto w-full flex-col'>
      <div className='flex w-full flex-col space-y-4 rounded-xl bg-medium p-5 justify-center items-center'>
      <div className="relative mb-6">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-[#6A8C91] mt-6">
              <img src="/profilePic.jpg" alt="User Profile" className="w-full h-full object-cover" />
            </div>
          </div>
        <div className='text-3xl font-bold'>
          <p> John Doe</p>
        </div>
        <div className='flex items-center space-x-5'>

          {/* User info */}
          
          <div className='text-lg'>Username: johndoe</div>
        </div>
        <div className='flex items-center space-x-5'>
          <div className='text-lg'>Email: johndoe@example.comf</div>
        </div>
        <div className='flex items-center space-x-5'>
          <div className='text-lg'>
            Birthdate: 01/01/2000
          </div>
        </div>

        {/* Logout */}
      <button
        type="submit"
        className=" w-2/5 justify-center rounded-md bg-gradient-to-r from-sky-600/50 to-pink-200 px-3 py-1.5 text-sm font-bold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-10"
      >
        LogOut
      </button>
      </div>
    </div>
    </div>
    </div>
  )
}

export default Profile