import { SignedIn, SignedOut, SignIn, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { motion } from 'framer-motion';
import { HeroSection } from "@/components/home/hero/hero";
import { HomePageBackground } from "@/components/gradients/home-background";
import Header from "@/components/home/header";

const Home= () => {
  return (
    <>
    
    <Header user={''}/>
    {/* <SignedIn>
      <UserButton/>
    </SignedIn>
    <SignedOut>
      <SignInButton/>
    </SignedOut> */}
      
      <HomePageBackground/>
    <HeroSection/>
    </>
  );
}


export default Home;