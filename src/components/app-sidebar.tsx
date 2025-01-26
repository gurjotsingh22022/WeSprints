"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { getCookie } from "cookies-next"
import { getJwtCookie } from "@/actions/cookies"
import { getUserProjects } from "@/actions/organizations"
import { Button } from "./ui/button"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useFetch from "@/hooks/use-fetch"
import { deleteProject } from "@/actions/project"
import { useOrganization } from "@clerk/nextjs"
import { useOrgInfoContext } from "@/app/contexts/orgContext"
import { useProChanged } from "@/app/contexts/isProChangedContext"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain:
    {
      title: "Platform",
      url: "#",
      items: [
        {
          title: "Create New Project",
          url: "/project/create",
        },
        {
          title: "Invite User",
          url: "/project/create",
        },
      ],
    },
  projects: [
    {
      name: "Design Engineering",
      url: "#",
    },
    {
      name: "Sales & Marketing",
      url: "#",
    },
    {
      name: "Travel",
      url: "#",
    },
  ],
}



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [projectsData, setProjects] = React.useState<any>(null);
  const { membership } = useOrganization();
  const router = useRouter();
  const { isChanged, setIsChanged } = useProChanged();


    const {
      loading: isDeleting,
      error,
      fn: deleteProjectFn,
      data: deleted,
    } = useFetch(deleteProject);

  React.useEffect(()=>
  {
    setSome();
  }, [])

  const setSome = async ()=>
    {
      const projects = await getUserProjects();
      if(projects.length>0)
      {

        setProjects(projects);
      }
    }

    
  const DeleteProject = async(projectId: string)=>
    {
    console.log(projectId)

      
        const isAdmin = membership?.role === "org:admin";
        if (!isAdmin) return null;
    
        if (window.confirm("Are you sure you want to delete this project?")) {
            deleteProjectFn(projectId);
        }
    
        
    
    }

    React.useEffect(()=>
    {
      if(isChanged)
      {
        setSome();
        setIsChanged(false);
      }
    }, [isChanged])

    React.useEffect(()=>
    {
      if (deleted) {
        toast.success("Project Deleted");
        setSome();
        router.refresh();
        pushOrg();
      }
    }, [deleted])

    const pushOrg=async()=>
    {
      const token = getCookie("my-Org")
        const resp = await getJwtCookie(token as string);
        const data = JSON.parse(resp as string);
        router.push(`/organization/${data.slug}`)
    }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
      <SidebarGroup key={data.navMain.title}>
            <SidebarGroupLabel>{data.navMain.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.items.map((item: any) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
        <NavProjects projects={projectsData} projectDelete={(e: string)=>DeleteProject(e)}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
