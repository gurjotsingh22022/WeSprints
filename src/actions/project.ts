"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data: any) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // Check if the user is an admin of the organization
  const clerk = await clerkClient();
  const { data: membershipList } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userMembership = membershipList.find(
    (membership) => membership?.publicUserData?.userId === userId
  );

  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    const project = await db.project.create({
      data: {
        name: data.name,
        key: data.key,
        description: data.description,
        organizationId: orgId,
      },
    });

    const userProject = await db.userProject.create({
      data: {
        userId: user.id,
        projectId: project.id
      },
    });

    return project;
  } catch (error: any) {
    throw new Error("Error creating project: " + error.message);
  }
}




export async function deleteProject(projectId:string) {
    const { userId, orgId, orgRole } = await auth();
  
    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }
  
    if (orgRole !== "org:admin") {
      throw new Error("Only organization admins can delete projects");
    }
  
    const project = await db.project.findUnique({
      where: { id: projectId },
    });
  

    if (!project || project.organizationId !== orgId) {
      throw new Error(
        "Project not found or you don't have permission to delete it"
      );
    }
  
    await db.project.delete({
      where: { id: projectId },
    });
  
    return { success: true };
  }

  
export async function getProject(projectId: any) {
    const { userId, orgId } = await auth();
  
    if (!userId || !orgId) {
      throw new Error("Unauthorized");
    }
  
    // Find user to verify existence
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    // Get project with sprints and organization
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        sprints: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
  
    if (!project) {
      throw new Error("Project not found");
    }
  
    // Verify project belongs to the organization
    if (project.organizationId !== orgId) {
      return null;
    }
  
    return project;
  }
  