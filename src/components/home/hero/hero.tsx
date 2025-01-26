import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
    return (
      <section className={'mx-auto max-w-7xl px-[32px] relative flex items-center justify-between py-16 min-h-screen'}>
        <div className={'text-center w-full '}>
          <h1 className={'text-[48px] leading-[48px] md:text-[80px] md:leading-[80px] tracking-[-1.6px] font-medium'}>
          Manage Sprints Better,<br />Deliver Faster Results
          </h1>
          <p className={'mt-6 text-[16px] leading-[27px] md:text-[20px] md:leading-[30px]'}>
          Plan, track, and deliver effortlessly with our team-focused sprint management tool.
          </p>
          <Link href={'/onboarding'}>
            <Button size={"lg"} className="mr-4 my-8">
                Get Started WeSprints <ChevronRight size={18}/>
            </Button>
          </Link>
          <Link href={'/onboarding'}>
            <Button size={"lg"} variant={'outline'} className="mr-4 my-5">
                Learn more
            </Button>
          </Link>
        </div>
      </section>
    );
  }