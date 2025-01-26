"use client"

import { createSprint } from "@/actions/sprints"
import { sprintSchema } from "@/app/validators/validators"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import useFetch from "@/hooks/use-fetch"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { addDays, format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { toast } from "sonner"
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"


interface PropsType {
        isOpen: boolean,
        setIsOpen: any,
        projectTitle : string,
        projectId : string,
        projectKey : string,
        sprintKey: string
    
    }

interface dayPicker {
    startDate: Date,
    endData: Date
}

interface projectData {
    name: string,
}

export function SprintForm(
    {
        isOpen,
        setIsOpen,
        projectTitle,
        projectId,
        projectKey,
        sprintKey
    }: PropsType
) {

    const [showForm, setShowForm] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState({
      from: new Date(),
      to: addDays(new Date(), 14),
    });
    const router = useRouter();
  
    const { loading: createSprintLoading, fn: createSprintFn } =
      useFetch(createSprint);
  
    const {
      register,
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: zodResolver(sprintSchema),
      defaultValues: {
        name: `${projectKey}-${sprintKey}`,
        startDate: dateRange.from,
        endDate: dateRange.to,
      },
    });

    useEffect(()=>
    {
        console.log(dateRange)
    }, [dateRange])
  
    const onSubmit = async (data: any) => {

      console.log(projectId)
    
      const a = await createSprintFn(projectId, {
        ...data,
        startDate: dateRange.from,
        endDate: dateRange.to,
      });
      setShowForm(false);
      toast.success("Sprint created")
      router.refresh(); // Refresh the page to show updated data
    };

  return (
    <Dialog defaultOpen={isOpen} open={isOpen} onOpenChange={(e)=> setIsOpen(e)}>
      {/* <DialogTrigger asChild>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                    Name
                    </Label>
                    <Input
                    id="name"
                    {...register("name")}
                    defaultValue="Pedro Duarte"
                    className="col-span-3"
                    />
                </div>
                
                <div className="grid grid-cols-[auto_75%] items-center gap-4">
                    <Label htmlFor="dateRange" className="text-right">
                    Duration
                    </Label>
                    <Controller
                        control={control}
                        name="name"
                        render={({ field }) => (
                            <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                variant="outline"
                                className={`w-full justify-start text-left font-normal bg-slate-950 ${
                                    !dateRange && "text-muted-foreground"
                                }`}
                                >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateRange.from && dateRange.to ? (
                                    format(dateRange.from, "LLL dd, y") +
                                    " - " +
                                    format(dateRange.to, "LLL dd, y")
                                ) : (
                                    <span>Pick a date</span>
                                )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto bg-slate-900"
                                align="start"
                            >
                                <DayPicker
                                classNames={{
                                    today: "border-2 border-blue-700 rounded-lg overflow-hidden",
                                    chevron: "fill-blue-500",
                                    range_start: "bg-blue-700 rounded-none rounded-tl-lg",
                                    range_end: "bg-blue-700 rounded-br-lg",
                                    range_middle: "bg-blue-400",
                                    day_button: "border-none",
                                    month_grid: "border-separate border-spacing-0"
                                }}
                                mode="range"
                                disabled={[{ before: new Date() }]}
                                selected={dateRange}
                                onSelect={(range: any) => {
                                    if (range?.from && range?.to) {
                                    setDateRange(range);
                                    field.onChange(range);
                                    }
                                }}
                                />
                            </PopoverContent>
                            </Popover>
                        )}
                        />
                </div>
                
            </div>
            <DialogFooter>
            <Button type="submit" disabled={createSprintLoading}>{createSprintLoading ? "Creating..." : "Create Sprint"}</Button>
            </DialogFooter>
        </form>
        </DialogContent>
    </Dialog>
  )
}
