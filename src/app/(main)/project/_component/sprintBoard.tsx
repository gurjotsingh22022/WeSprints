"use client"

import React, { useEffect, useState } from 'react'
import SprintManager from './sprintManager';
import IssueCreationDrawer from './createIssue';
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { toast } from 'sonner';
import status from "@/data/status.json";
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import useFetch from '@/hooks/use-fetch';
import { getIssuesForSprint, updateIssueOrder } from '@/actions/issues';
import IssueCard from '@/components/global-ui/issueCard';
import BoardFilters from './board-filter';
import { useIssueOpener } from '@/app/contexts/IssueOpener';


interface Props {
    sprints: any,
    projectId: string,
    orgId: string;
    filterNeeded: boolean
}


function reorder(list: any, startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
  
    return result;
  }

const SprintBoard = ({ sprints, projectId, orgId, filterNeeded=false }: Props) => {
    
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const { IssueOpen, setIssueOpen } = useIssueOpener();

  useEffect(()=>
  {
    if(IssueOpen)
    {
      setIsDrawerOpen(IssueOpen);
    }
  }, [IssueOpen])

    const [currentSprint, setCurrentSprint] = useState(
        sprints?.find((spr: any) => spr.status === "ACTIVE") || sprints[0]
      );

    const handleIssueCreated = () => {
    fetchIssues(currentSprint?.id);
    };

    const {
        fn: updateIssueOrderFn,
        loading: updateIssuesLoading,
        error: updateIssuesError,
      } = useFetch(updateIssueOrder);

    const onDragEnd = async (result: any) => {
        if (currentSprint.status === "PLANNED") {
          toast.warning("Start the sprint to update board");
          return;
        }
        if (currentSprint.status === "COMPLETED") {
          toast.warning("Cannot update board after sprint end");
          return;
        }
        const { destination, source } = result;
    
        if (!destination) {
          return;
        }
    
        if (
          destination.droppableId === source.droppableId &&
          destination.index === source.index
        ) {
          return;
        }
    
        const newOrderedData = [...issues];
    
        // source and destination list
        const sourceList = newOrderedData.filter(
          (list) => list.status === source.droppableId
        );
    
        const destinationList = newOrderedData.filter(
          (list) => list.status === destination.droppableId
        );
    
        if (source.droppableId === destination.droppableId) {
          const reorderedCards = reorder(
            sourceList,
            source.index,
            destination.index
          );
    
          reorderedCards.forEach((card: any, i) => {
            card.order = i;
          });
        } else {
          // remove card from the source list
          const [movedCard] = sourceList.splice(source.index, 1);
    
          // assign the new list id to the moved card
          movedCard.status = destination.droppableId;
    
          // add new card to the destination list
          destinationList.splice(destination.index, 0, movedCard);
    
          sourceList.forEach((card, i) => {
            card.order = i;
          });
    
          // update the order for each card in destination list
          destinationList.forEach((card, i) => {
            card.order = i;
          });
        }
    
        const sortedIssues = newOrderedData.sort((a, b) => a.order - b.order);
        setIssues(sortedIssues);
    
        updateIssueOrderFn(sortedIssues)
      };

    const {
        loading: issuesLoading,
        error: issuesError,
        fn: fetchIssues,
        data: issues,
        setData: setIssues,
      } = useFetch(getIssuesForSprint);

      const [filteredIssues, setFilteredIssues] = useState(issues);

      
    useEffect(() => {
        if (currentSprint?.id) {
        fetchIssues(currentSprint?.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSprint?.id]);
    

    const handleAddIssue = (status: string) => {
        setSelectedStatus(status);
        setIsDrawerOpen(true);
      };
    
      const handleFilterChange = (newFilteredIssues: any) => {
        setFilteredIssues(newFilteredIssues);
      };
    

  return (
    
    <>
    <div>
        <SprintManager
            sprint={currentSprint}
            setSprint={setCurrentSprint}
            projectId={projectId}
            sprints={sprints}
        />
    </div>

    {issues && !issuesLoading && (
        <BoardFilters filterNeeded={filterNeeded} issues={issues} onFilterChange={handleFilterChange} />
    )}


      {updateIssuesError && (
        <p className="text-red-500 mt-2">{updateIssuesError?.message}</p>
      )}

      {(updateIssuesLoading || issuesLoading) && (
        <div className="loader-line mt-3"></div>
      )}

    <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {status.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>
                  {filteredIssues
                    ?.filter((issue: any) => issue.status === column.key)
                    .map((issue: any, index: number) => (
                      <Draggable
                        key={issue?.id}
                        draggableId={issue?.id}
                        index={index}
                        // isDragDisabled={updateIssuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='box-border'
                          >
                            <IssueCard
                                issue={issue}
                                onDelete={() => fetchIssues(currentSprint?.id)}
                                onUpdate={(updated: any) =>
                                setIssues((issues: any) =>
                                    issues.map((issue: any) => {
                                    if (issue?.id === updated?.id) return updated;
                                    return issue;
                                    })
                                )
                                }
                                showStatus
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                  {column.key === "TODO" &&
                    currentSprint?.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleAddIssue(column.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>

      </DragDropContext>

      
        <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={(e: boolean) => {setIsDrawerOpen(e); setIssueOpen(e)}}
        sprintId={currentSprint?.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />

    
        
    </>

  )
}

export default SprintBoard