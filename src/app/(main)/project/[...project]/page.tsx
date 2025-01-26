"use client"

import { getProject } from '@/actions/project';
import { notFound } from 'next/navigation';
import React, { useContext, useEffect } from 'react'
import { SprintForm } from '../_component/sprintsForm';
import SprintBoard from '../_component/sprintBoard';
import { checkProjectUser } from '@/actions/organizations';
import SideBar from '@/app/dashboard/page';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Bug, Filter, FilterX, SquarePlus, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIssueOpener } from '@/app/contexts/IssueOpener';
import Members from '../_component/membersList';


  interface ProjectDetailPageProps {
    params: {
      project: string;
    };
  }
  
const TabsEnum = ["board", "members", "meetings"]

  const ProjectDetailPage = ({ params }: ProjectDetailPageProps) => {
    const [OpenSprint, setOpenSprint] = React.useState<boolean>(false);
    const [filterNeeded, setFilterNeeded] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [TheProjectid, setProjectid] = React.useState<string>("");
    const [projectData, setProjectData] = React.useState<any>();
    const [URLTab, setURLTab] = React.useState<any>();
    const { IssueOpen, setIssueOpen } = useIssueOpener();


    useEffect(()=>
    {
        getParams()
    }, [])

    const getParams = async ()=>
    {
        const { project } = await params;
        const projectid = project[0]
        console.log(projectid)
        setURLTab(project[1])
        setProjectid(projectid);
        if(!projectid)
        {
            notFound()
        }
        const projectInfo = await getProject(projectid);
        const isValidUser = await checkProjectUser(projectid);
        console.log(isValidUser)
        if(!isValidUser)
        {
            notFound();
        }
        setProjectData(projectInfo)
        setIsLoading(false)

    }



  
    return (
      <>
      {
        isLoading?
        <>
        </>
        :
        <>
        <Tabs defaultValue={TabsEnum.includes(URLTab?.toLowerCase()) ? URLTab.toLowerCase():'board'} className='w-full p-8 flex flex-col gap-6'>
        <header className="flex h-auto shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-20">
          <div className="flex w-full h-full items-center">
            <div className="w-3/5 h-full flex items-start rounded-br-[40px] group-has-[[data-collapsible=icon]]/sidebar-wrapper:rounded-br-[35px]">
            
                {/* <div className='h-3/5 flex items-center'>
                <h2 className='text-2xl font-semibold'>WS - {project?.name}</h2>
                </div> */}
                <div className='flex items-start'>
                <TabsList className="w-full h-auto m-0 p-0 bg-transparent inline-flex gap-8 justify-start tabs-ul">
                    <TabsTrigger value="board">Board</TabsTrigger>
                    <TabsTrigger value="members">Members</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                </TabsList>
                    </div>

            </div>
            <div className="w-full h-full flex items-center justify-between gap-6 bg-background rounded-tl-[40px] group-has-[[data-collapsible=icon]]/sidebar-wrapper:rounded-tl-[35px]">

            <Input className='w-full h-[40px]' placeholder='Search...'/>
            {
                filterNeeded?
                <>
                <FilterX size={30} className='cursor-pointer' onClick={()=> setFilterNeeded(false)}/>
                </>
                :
                <>
                <Filter size={30} className='cursor-pointer' onClick={()=> setFilterNeeded(true)}/>
                </>
            }
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="destructive">ACTIONS</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Create</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        
                        <DropdownMenuItem onClick={()=> setOpenSprint(true)}>
                            <SquarePlus/> Create new sprint
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={()=> setIssueOpen(true)}>
                            <Bug /> Issue
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Add</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        
                        <DropdownMenuItem onClick={()=> setOpenSprint(true)}>
                        <Users /> Project Teammate
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            
            </div>
            </div>
        </header>
        <div>
        <h2 className='text-2xl font-semibold'>{projectData?.key} - {projectData?.name}</h2>
        </div>
        <TabsContent value="board">
            <div className='w-full mx-auto'>
            
                    {
                        projectData?.sprints?.length>0?
                        <>
                        </>
                        :
                        <>
                        <div>
                            <h3>Create a sprint</h3>
                        </div>
                        </>
                    }
            <SprintBoard
                sprints={projectData.sprints}
                orgId={projectData.organizationId}
                projectId={TheProjectid}
                filterNeeded={filterNeeded}
            />
        </div>
      
        <SprintForm isOpen={OpenSprint}
        setIsOpen={(e:boolean)=> setOpenSprint(e)}
        projectTitle={projectData.name}
        projectId={TheProjectid}
        projectKey={projectData.key}
        sprintKey={projectData.sprints?.length + 1}
        />

        </TabsContent>

        <TabsContent value='members'>
            <Members orgId={projectData.organizationId} projectId={TheProjectid}/>
        </TabsContent>
        
        </Tabs>
        </>
      }
        
      </>
    );
  };
  
  export default ProjectDetailPage;