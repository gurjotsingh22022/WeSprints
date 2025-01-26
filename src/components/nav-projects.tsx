"use client"

import {
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { getJwtCookie } from "@/actions/cookies"
import { useEffect, useState } from "react"
import { getCookie, setCookie } from "cookies-next";
import useFetch from "@/hooks/use-fetch"
import { deleteProject } from "@/actions/project"

interface Props {
  projects: any,
  projectDelete: (e:string)=> {}
}

export function NavProjects( {projects, projectDelete}: Props ) {
  const { isMobile } = useSidebar()
  const [org, setOrg] = useState<string>('');
  

  useEffect(()=>
  {
      getOrg();
  }, [])
  
  const getOrg = async() =>
  {
    const token = getCookie("my-Org")
    const resp = await getJwtCookie(token as string);
    const data = JSON.parse(resp as string);
    setOrg(`/organization/${data.slug}`);
  }


  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
      <SidebarMenuItem key="All Projects">
            <SidebarMenuButton asChild>
              <Link href={`${org}`}>
                
                <span>All Projects</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        {projects?.map((item: any) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={`/project/${item.id}`}>
                {
                  item?.icon?
                  <>
                  <item.icon />
                  </>:null
                }
                
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                  <Link href={`/project/${item.id}/members`}>
                <DropdownMenuItem>
                  <Users className="text-muted-foreground" />
                  <span>View Members</span>
                  
                </DropdownMenuItem>
                  </Link>
                <Link href={`/project/${item.id}/meetings`}>
                <DropdownMenuItem>
                  <Video className="text-muted-foreground" />
                  <span>View Meetings</span>
                </DropdownMenuItem>
                  </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=> projectDelete(item.id)}>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>
  )
}
