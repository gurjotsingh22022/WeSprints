import { deleteProject } from "@/actions/project";
import useFetch from "@/hooks/use-fetch";
import { useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const { membership } = useOrganization();
const router = useRouter();

const DeleteProject = async(projectId: string)=>
{

  const {
    loading: isDeleting,
    error,
    fn: deleteProjectFn,
    data: deleted,
  } = useFetch(deleteProject);
  

    const isAdmin = membership?.role === "org:admin";
    if (!isAdmin) return null;

    if (window.confirm("Are you sure you want to delete this project?")) {
        deleteProjectFn(projectId);
    }

    if (deleted) {
      toast.success("Project Deleted")
      router.refresh();
    }

}