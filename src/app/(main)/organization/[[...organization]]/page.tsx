import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import OrgSwitcher from "@/components/org-switcher";
import { getOrganization } from "@/actions/organizations";
import { GetServerSideProps } from "next";
import ProjectList from "./_components/project-list";



export default async function OrganizationPage({ params }: { params: Promise<{ organization: string }> }) {
  const organization = (await params)?.organization;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const org = await getOrganization(organization);

  if (!org) {
    return <div>Organization not found</div>;
  }


  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-3xl font-bold gradient-title pb-2">
          {org?.name}&rsquo;s Projects
        </h1>

        <OrgSwitcher />
      </div>
      <div className="mb-4">
        <ProjectList orgId={String(org.id)} />
      </div>
      <div className="mt-8">
        {/* <UserIssues userId={userId} /> */}
      </div>
    </div>
  );
}
