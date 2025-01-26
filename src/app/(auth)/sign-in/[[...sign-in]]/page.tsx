import React from 'react'
import { SignIn } from '@clerk/nextjs'
import { HomePageBackground } from '@/components/gradients/home-background';
import Header from '@/components/home/header';

const SignInPage = () => {
  return (
    <>
    
    <Header user={''}/>
    <HomePageBackground/>
    <div className='flex justify-center items-center min-h-screen p-8'>
       <SignIn/>
    </div>
    </>
   
   
  )
}

export default SignInPage;