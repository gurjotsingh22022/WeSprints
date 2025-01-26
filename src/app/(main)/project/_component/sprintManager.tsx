"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

import { formatDistanceToNow, isAfter, isBefore, format } from "date-fns";

import useFetch from "@/hooks/use-fetch";
import { useRouter, useSearchParams } from "next/navigation";

import { updateSprintStatus } from "@/actions/sprints";


export interface sprintDeclared {
    id: string,
    name: string,
    startDate: Date,
    endDate: Date,
    status: string,
    projectId: string,
    createdAt: Date,
    updatedAt: Date,
}

interface Props {
    sprint: sprintDeclared,
    setSprint: React.Dispatch<React.SetStateAction<sprintDeclared>>,
    sprints: any,
    projectId: string,
}

export default function SprintManager({
  sprint,
  setSprint,
  sprints,
  projectId,
}: Props) {
  const [status, setStatus] = useState(sprint?.status);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    fn: updateStatus,
    loading,
    error,
    data: updatedStatus,
  } = useFetch(updateSprintStatus);

  const startDate = new Date(sprint?.startDate);
  const endDate = new Date(sprint?.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  const canEnd = status === "ACTIVE";

  const handleStatusChange = async (newStatus: string) => {
    updateStatus(sprint.id, newStatus);
  };

  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s: any) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint?.status);
      }
    }
  }, [searchParams, sprints]);

  const handleSprintChange = (value: string) => {
    const selectedSprint = sprints?.find((s: any) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint?.status);
    router.replace(`/project/${projectId}`, undefined);
  };

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <Select value={sprint?.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints?.length>0?
            <>
            {
                sprints.map((sprint: sprintDeclared) => (
                    <SelectItem key={sprint?.id} value={sprint?.id}>
                      {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")} to{" "}
                      {format(sprint.endDate, "MMM d, yyyy")})
                    </SelectItem>
                  ))
            }
            </>:
            <>
            No Sprint Available
            </>
            }
          </SelectContent>
        </Select>

        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            className="bg-green-900 text-white"
          >
            Start Sprint
          </Button>
        )}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            variant="destructive"
          >
            End Sprint
          </Button>
        )}
      </div>
      {loading && <div className="loader-line mt-3"></div>}
      {getStatusText() && (
        <Badge variant="default" className="mt-3 ml-1 self-start">
          {getStatusText()}
        </Badge>
      )}
    </>
  );
}