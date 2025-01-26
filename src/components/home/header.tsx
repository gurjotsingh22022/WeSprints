import { Button } from '../ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { checkUser } from '@/lib/checkUser';
import { SignedIn, SignedOut } from '@clerk/nextjs';
import UserMenu from '../user-menu';
import { SquarePen } from 'lucide-react';

interface Props {
    user: String | null;
  }
const Header = async ({ user }: Props) => {

    await checkUser();
    
  return (
    <>
     <nav className='fixed sticky-header top-0 w-full z-10'>
      <div className="mx-auto max-w-7xl relative px-[32px] py-[12px] flex items-center justify-between">
        <div className="flex flex-1 gap-16 items-center justify-start">
          <Link className="flex items-center justify-center font-medium text-[1.4em] tracking-tighter" href={'/'}>
            <Image className="block me-2" src="/sprint.png" width={45} height={45} alt="We Sprints" />
            WeSprints
          </Link>
          <div className='flex flex-1 gap-10 items-center justify-start'>
            <Link href={`/features`}>Features</Link>
            <Link href={`/pricing`}>Pricing</Link>
            <Link href={`/demo`}>Demo</Link>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <div className="flex gap-5 items-center">
            {/* {user? (
              <Button variant={'secondary'} asChild={true}>
                <Link href={'/dashboard'}>Dashboard</Link>
              </Button>
            ) : (
              <Button asChild={true} variant={'secondary'}>
                <Link href={'/sign-in'}>Sign in</Link>
              </Button>
            )} */}
          <SignedIn>
              <Button asChild={true} variant={'secondary'} className='bg-red-700 hover:bg-red-900'>
                <Link href={'/project/create'}><SquarePen /> Create Project</Link>
              </Button>
            <UserMenu />
          </SignedIn>
          <SignedOut>
              <Button asChild={true} variant={'secondary'}>
                <Link href={'/sign-up'}>Get Started</Link>
              </Button>
              <Button asChild={true} variant={'outline'}>
                <Link href={'/sign-in'}>Log in</Link>
              </Button>
          </SignedOut>
          </div>
        </div>
      </div>
    </nav>
    </>
  )
}

export default Header