"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

// Define types for organization, user, project, and issue to match the expected structure
type Organization = {
  id: string;
  name: string;
  slug: string;
};

type User = {
  id: string;
  clerkUserId: string;
};

type Project = {
  id: string;
  name: string;
  organizationId: string;
  createdAt: Date;
};

type Issue = {
  id: string;
  title: string;
  description: string;
  assigneeId: string | null;
  reporterId: string | null;
  project: Project;
  assignee: User | null;
  reporter: User | null;
  updatedAt: Date;
};

type Membership = {
  publicUserData: {
    userId: string;
  };
};

export async function getUserOrganizations() {
  const { userId } = await auth();
  const params = { userId };
  const clerk = await clerkClient();
  if(userId)
  {
    const resp = await clerk.users.getOrganizationMembershipList({userId});
    const memberships = resp.data;
    // Extract all organization memberships
    const organizations = memberships.reduce((acc:any, membership) => {
      const organization = membership.organization;
      // Add each organization to the object directly
      acc[organization.id] = organization;
      return acc;
    }, {});
    console.log(organizations)
    return organizations
  }

}

export async function getOrganization(slug:any) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get the organization details
  const clerk = await clerkClient();
  const organization = await clerk.organizations.getOrganization({
    slug,
  });

  if (!organization) {
    return null;
  }

  // Check if user belongs to this organization
  const { data: membership } =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );

  // If user is not a member, return null
  if (!userMembership) {
    return null;
  }

  return organization;
}


export async function getProjects(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });

  return projects;
}

export async function getUserProjects() {
  const { userId, orgId, orgRole } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (orgRole === "org:admin")
  {
    const projects = await db.project.findMany({
      where: { organizationId: orgId },
      orderBy: { createdAt: "desc" },
    });
    return projects;
  }
  else
  {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    const projects = await db.project.findMany({
      where: {
        organizationId: orgId,
        userProjects: {some:{
          userId: user.id
        }
      }},
      include: {
        userProjects: true, // Include the associated UserProjects for more info
      },
    });
    return projects;
  }
}

export async function getOrganizationUsers(orgId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const clerk = await clerkClient();
  const organizationMemberships =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data.map(
    (membership) => membership?.publicUserData?.userId
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  console.log(users)
  return users;
}

export async function getUsersOfProject(orgId: string, projectId: string)
{
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
    ,
  });

  if (!user) {
    throw new Error("User not found");
  }

  console.log(projectId)

  const users = await db.userProject.findMany({
    where: 
    { 
      projectId:projectId
    },
    include:{
      user: true
    }
  });

  console.log(users)

  return users;

}

export async function getProjectUsers(orgId: string, projectId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const clerk = await clerkClient();
  const organizationMemberships =
    await clerk.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data.map(
    (membership) => membership?.publicUserData?.userId
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
      userProjects: {
        projectId: projectId
      }
      ,
    },
  });

  return users;
}

export async function checkProjectUser(projectId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId,
      userProjects: {some: {
        projectId: projectId
      }}
     },
  });

  if (!user) {
    return false;
  }

  return user;
}