"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { useOrganization, useUser } from "@clerk/nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import statuses from "@/data/status.json";
import { deleteIssue, updateIssue } from "@/actions/issues";
import UserAvatar from "./user-avatar";
import dynamic from "next/dynamic";
const Markdown = dynamic(() => import('@uiw/react-md-editor').then(mod => mod.default.Markdown), {
    ssr: false,
  });

const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];


interface Props {
    isOpen: boolean,
    onClose: any,
    issue: any,
    onDelete: any,
    onUpdate: any,
    borderCol: string,
}

export default function IssueDetailsDialog({
  isOpen,
  onClose,
  issue,
  onDelete = () => {},
  onUpdate = () => {},
  borderCol = "",
}:
    Props) {
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);
  const { user } = useUser();
  const { membership } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(issue.id);
    }
  };

  const handleStatusChange = async (newStatus: any) => {
    setStatus(newStatus);
    updateIssueFn(issue.id, { status: newStatus, priority });
  };

  const handlePriorityChange = async (newPriority: any) => {
    setPriority(newPriority);
    updateIssueFn(issue.id, { status, priority: newPriority });
  };

  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete();
    }
    if (updated) {
      onUpdate(updated);
    }
  }, [deleted, updated, deleteLoading, updateLoading]);

  const canChange =
    user?.id === issue.reporter.clerkUserId || membership?.role === "org:admin";

  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  const isProjectPage = !pathname.startsWith("/project/");

  return (
    <>
        <div>
            <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                <div className="flex justify-between items-center">
                    <DialogTitle className="text-3xl">{issue.title}</DialogTitle>
                    {isProjectPage && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleGoToProject}
                        title="Go to Project"
                    >
                        <ExternalLink className="h-4 w-4" />
                    </Button>
                    )}
                </div>
                </DialogHeader>
                {(updateLoading || deleteLoading) && (
                <div className="loading-line"></div>
                )}
                <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {statuses.map((option: any) => (
                        <SelectItem key={option.key} value={option.key}>
                            {option.name}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                    <Select
                    value={priority}
                    onValueChange={handlePriorityChange}
                    disabled={!canChange}
                    >
                    <SelectTrigger className={`border ${borderCol} rounded`}>
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {priorityOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                        ))}
                    </SelectContent>
                    </Select>
                </div>
                <div data-color-mode="dark" suppressHydrationWarning>
                    <h4 className="font-semibold">Description</h4>
                    {
                        Markdown?
                        <>
                        <Markdown
                    className="rounded px-2 py-1"
                    source={issue.description ? issue.description : "--"}
                    />
                        </>
                        :
                        <div className="loader-line"></div>
                    }
                    
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2">
                    <h4 className="font-semibold">Assignee</h4>
                    <UserAvatar user={issue.assignee} />
                    </div>
                    <div className="flex flex-col gap-2">
                    <h4 className="font-semibold">Reporter</h4>
                    <UserAvatar user={issue.reporter} />
                    </div>
                </div>
                {canChange && (
                    <Button
                    onClick={handleDelete}
                    disabled={deleteLoading}
                    variant="destructive"
                    >
                    {deleteLoading ? "Deleting..." : "Delete Issue"}
                    </Button>
                )}
                {(deleteError || updateError) && (
                    <p className="text-red-500">
                    {deleteError?.message || updateError?.message}
                    </p>
                )}
                </div>
            </DialogContent>
            </Dialog>
        </div>

        {(updateLoading) && (
            <div className="loader-line-global"></div>
        )}
    </>
  );
}