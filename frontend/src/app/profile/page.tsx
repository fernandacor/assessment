import React from 'react'
import Link from 'next/link'

async function Profile() {
  return (
    <div className='flex h-auto w-full flex-col'>
      <div className='flex w-full flex-col space-y-4 rounded-xl bg-medium p-5 justify-center items-center'>
        <div className='text-3xl font-bold'>
          <p> John Doe</p>
        </div>
        <div className='flex items-center space-x-3'>
          
          <div className='text-lg'>Email: johndoe@example.com</div>
        </div>
        <div className='flex items-center space-x-3'>
          <div className='text-lg'>Address: tec csf</div>
        </div>
        <div className='flex items-center space-x-3'>
          <div className='text-lg'>
            Birthdate: 01/01/2000
          </div>
        </div>
      </div>
      {/* Agregar botón de log out aquí. */}
    </div>
  )
}

export default Profile