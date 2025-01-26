import { getUsersOfProject } from '@/actions/organizations';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Info, LogOut } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect } from 'react'



interface Props {
    projectId: string,
    orgId: string,
}

const Members = ({
    projectId,
    orgId,
  }: Props) => {

    const {
        loading: usersLoading,
        fn: fetchUsers,
        data: users,
      } = useFetch(getUsersOfProject);

    useEffect(() => {
        if (orgId) {
        fetchUsers(orgId,projectId);
        }
    }, [orgId]);

    useEffect(()=>
    {
        if(users)
        {
            console.log(users)
        }
    }, [users])
  return (
    <>
        <div className='flex items-center justify-between'>
            <h1 className='text-2xl'>Team Members {
                users?.length>0?
                <>
                ({users.length})
                </>
                :null
  }</h1>
  <Button>Add Teammate</Button>
        </div>
        <div className="my-8">
            <div className="flex flex-col gap-4">
            {
                usersLoading?
                <>
                    
                    <div className="flex flex-row gap-2">
                        <div className="animate-pulse bg-gray-300 w-12 h-12 rounded-full"></div>
                        <div className="flex flex-col gap-2">
                            <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-full"></div>
                            <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="animate-pulse bg-gray-300 w-12 h-12 rounded-full"></div>
                        <div className="flex flex-col gap-2">
                            <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-full"></div>
                            <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-full"></div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2">
                        <div className="animate-pulse bg-gray-300 w-12 h-12 rounded-full"></div>
                        <div className="flex flex-col gap-2">
                            <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-full"></div>
                            <div className="animate-pulse bg-gray-300 w-60 h-5 rounded-full"></div>
                        </div>
                    </div>
                </>
                :
                <>
                {
                    users?.map((data: any)=>
                    <div key={data.user.id} className="p-4 rounded-2xl bg-secondary flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Image className='rounded-full aspect-square' src={data.user.imageUrl} alt={data.user.name} width={30} height={30} />
                        <h1 className='text-base'>{data.user.name}</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <Info />
                            <LogOut className='cursor-pointer' onClick={()=>{}}/>
                        </div>
                    </div>
                    )
                }
                
                </>
            }
            </div>
            
        </div>
    </>
  )
}

export default Members