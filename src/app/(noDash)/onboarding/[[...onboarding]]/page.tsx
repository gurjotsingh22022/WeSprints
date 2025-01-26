"use client"


import { getJwtCookie, setJwtCookie } from "@/actions/cookies";
import { getUserOrganizations } from "@/actions/organizations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOrganizationList } from "@clerk/nextjs";
import { getCookie, setCookie } from "cookies-next";
import { ChevronRight, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(()=>
  {
    const token = getCookie("my-Org")
    if(token)
    {
      navToDash(token as string)
    }
  }, [])

  const {isLoaded, userMemberships} = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const [organizations, setOrganizations] = useState<any[]>([]);


  const navToDash =async(token: string) =>
  {
    const resp = await getJwtCookie(token as string);
    const data = JSON.parse(resp as string);
    router.push(`organization/${data.slug}`);
  }

  useEffect(() => {
    if (isLoaded && userMemberships?.data) {
      setOrganizations(userMemberships.data);
    }
  }, [isLoaded, userMemberships?.data]);


  const handleOrganizationSelection = async (organization: any) => {
    // Set a cookie for the selected organization
    const encypted_data = await setJwtCookie({
      id: organization.id,
      slug: organization.slug,
      name: organization.name,
      img: organization.imageUrl,
    });

    setCookie('my-Org', encypted_data, {
      path: '/', // Makes the cookie available across the site
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Protect against CSRF
    });

    // Return the URL to navigate to
    router.push(`/organization/${organization.slug}`);
  };


  return (
    <div className="flex justify-center items-center pt-14 mt-10">
      <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">My Organizations</TabsTrigger>
        <TabsTrigger value="password">Create Organization</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Choose an organization</CardTitle>
            <CardDescription>
              to continue to WeSprints
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
          {
                organizations.length > 0 ? (
                  organizations.map((data: any, index: number) => (
                    <div key={index}
                         className={`group p-4 flex justify-between items-center hover:bg-black hover:transition-all duration-150 hover:cursor-pointer
                              ${index === 0 ? 'border-t' : ''} 
                              ${index === organizations.length - 1 ? 'border-b' : ''} 
                              ${index !== 0 && index !== organizations.length - 1 ? 'border-y' : ''}`}
                         onClick={() => handleOrganizationSelection(data.organization)}
                    >
                      <div className="flex gap-4 items-center">
                        <Image src={data.organization.imageUrl} alt={`${data.organization.name} Logo`} width={20} height={20} className="h-10 w-10" quality={80} unoptimized/>
                        <h4>{data.organization.name}</h4>
                      </div>
                      <div className=" opacity-0 invisible pointer-events-none group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-150">
                        <ChevronRight/>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No organizations found.</p>
                )
              }

                <div
                         className={`group p-4 py-6 flex justify-between items-center hover:bg-black hover:transition-all duration-150 hover:cursor-pointer`}
                        //  onClick={() => handleOrganizationSelection(organization)}
                    >
                      <div className="flex gap-4 items-center">
                        <PlusCircle/>
                        <h4>Create organization</h4>
                      </div>
                    </div>
            
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password here. After saving, you'll be logged out.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <>
            </>
          </CardContent>
          <CardFooter>
            <Button>Create Organization</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
    </div>
  );
}