import { HomePageBackground } from '@/components/gradients/home-background'
import Header from '@/components/home/header'
import { SignUp } from '@clerk/nextjs'
import React from 'react'

const page = () => {
  return (
    <>
          <Header user={''}/>
      <HomePageBackground/>
      <div className='flex justify-center items-center min-h-screen p-8'>
        <SignUp/>
      </div>
    </>
    
  )
}

export default page