import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const KanbanBoard = ({ 
  className, 
  tasks = [],
  loading = false,
  onTaskClick,
  onTaskMove,
  onNewTask,
  ...props 
}) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", color: "bg-blue-50 border-blue-200" },
    { id: "in-progress", title: "In Progress", color: "bg-purple-50 border-purple-200" },
    { id: "done", title: "Done", color: "bg-green-50 border-green-200" }
  ];

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, status) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== status) {
      onTaskMove?.(draggedTask.Id, status);
    }
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  if (loading) {
    return <Loading variant="kanban" className={className} />;
  }

  if (tasks.length === 0) {
    return (
      <Empty
        title="No tasks yet"
        message="Create your first task to start tracking progress on this project."
        actionLabel="Create Task"
        onAction={onNewTask}
        icon="CheckSquare"
        className={className}
      />
    );
  }

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)} {...props}>
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <div key={column.id} className="flex flex-col">
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-display font-semibold text-lg text-gray-900">
                  {column.title}
                </h3>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
                  {columnTasks.length}
                </span>
              </div>
              
              {column.id === "todo" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewTask}
                  className="flex items-center gap-1"
                >
                  <ApperIcon name="Plus" size={16} />
                </Button>
              )}
            </div>

            {/* Column Content */}
            <div
              className={cn(
                "flex-1 min-h-[200px] p-4 rounded-card border-2 border-dashed transition-colors",
                column.color,
                draggedTask && "border-solid"
              )}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="space-y-4">
                {columnTasks.map((task) => (
                  <div
                    key={task.Id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick?.(task)}
                      isDragging={draggedTask?.Id === task.Id}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;