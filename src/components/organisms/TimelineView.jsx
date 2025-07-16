import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from "date-fns";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const TimelineView = ({
  className,
  tasks = [],
  loading = false,
  onTaskClick,
  onTaskScheduleChange,
  onNewTask,
  ...props
}) => {
  const [expandedTasks, setExpandedTasks] = useState(new Set());
  const [draggedTask, setDraggedTask] = useState(null);
  const [viewStartDate, setViewStartDate] = useState(new Date());

  // Generate timeline dates (3 months)
  const timelineDates = useMemo(() => {
    const start = startOfMonth(viewStartDate);
    const end = endOfMonth(addDays(start, 90));
    return eachDayOfInterval({ start, end });
  }, [viewStartDate]);

  // Process tasks for timeline display
  const timelineTasks = useMemo(() => {
    return tasks.map(task => {
      const startDate = task.startDate ? parseISO(task.startDate) : parseISO(task.createdAt);
      const endDate = task.dueDate ? parseISO(task.dueDate) : addDays(startDate, 1);
      
      return {
        ...task,
        startDate,
        endDate,
        duration: Math.max(1, Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))),
        isOverdue: task.status !== "done" && endDate < new Date()
      };
    });
  }, [tasks]);

  const priorityColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500"
  };

  const priorityVariant = {
    high: "high",
    medium: "medium",
    low: "low"
  };

  const handleTaskExpand = (taskId) => {
    setExpandedTasks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(taskId)) {
        newSet.delete(taskId);
      } else {
        newSet.add(taskId);
      }
      return newSet;
    });
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.Id.toString());
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetDate) => {
    e.preventDefault();
    if (!draggedTask) return;

    const daysDiff = Math.ceil((targetDate - draggedTask.startDate) / (1000 * 60 * 60 * 24));
    const newStartDate = targetDate;
    const newEndDate = addDays(draggedTask.endDate, daysDiff);

    onTaskScheduleChange?.(draggedTask.Id, newStartDate, newEndDate);
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
  };

  const getTaskPosition = (task, dateIndex) => {
    const taskStartIndex = timelineDates.findIndex(date => 
      isSameDay(date, task.startDate)
    );
    
    if (taskStartIndex === -1 || dateIndex < taskStartIndex) return null;
    if (dateIndex > taskStartIndex + task.duration - 1) return null;
    
    const isStart = dateIndex === taskStartIndex;
    const isEnd = dateIndex === taskStartIndex + task.duration - 1;
    const isMiddle = !isStart && !isEnd;
    
    return { isStart, isEnd, isMiddle, taskStartIndex };
  };

  const navigateMonth = (direction) => {
    setViewStartDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  if (loading) {
    return <Loading variant="timeline" className={className} />;
  }

  if (tasks.length === 0) {
    return (
      <Empty
        icon="Calendar"
        title="No tasks found"
        description="Create your first task to see it in the timeline view"
        action={{
          label: "Create Task",
          onClick: onNewTask
        }}
        className={className}
      />
    );
  }

  return (
    <div className={cn("bg-white rounded-card border border-gray-200 shadow-card overflow-hidden", className)} {...props}>
      {/* Timeline Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="font-display font-semibold text-lg text-gray-900">
              Timeline View
            </h2>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(-1)}
              >
                <ApperIcon name="ChevronLeft" size={16} />
              </Button>
              <span className="text-sm font-medium text-gray-600 min-w-32 text-center">
                {format(viewStartDate, "MMM yyyy")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigateMonth(1)}
              >
                <ApperIcon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
          <Button onClick={onNewTask} size="sm">
            <ApperIcon name="Plus" size={16} />
            New Task
          </Button>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="timeline-container">
        {/* Date Headers */}
        <div className="timeline-header">
          <div className="timeline-task-labels">
            <div className="text-xs font-medium text-gray-500 p-2">Tasks</div>
          </div>
          <div className="timeline-dates">
            {timelineDates.map((date, index) => (
              <div
                key={index}
                className={cn(
                  "timeline-date-cell",
                  format(date, "d") === "1" && "timeline-month-start"
                )}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, date)}
              >
                <div className="text-xs font-medium text-gray-700">
                  {format(date, "d")}
                </div>
                {format(date, "d") === "1" && (
                  <div className="text-xs font-bold text-gray-900 mt-1">
                    {format(date, "MMM")}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Tasks */}
        <div className="timeline-body">
          {timelineTasks.map((task) => (
            <div key={task.Id} className="timeline-task-row">
              {/* Task Label */}
              <div className="timeline-task-label">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTaskExpand(task.Id)}
                    className="flex items-center gap-2 text-left hover:bg-gray-50 p-2 rounded w-full"
                  >
                    <ApperIcon
                      name={expandedTasks.has(task.Id) ? "ChevronDown" : "ChevronRight"}
                      size={14}
                      className="text-gray-400"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={priorityVariant[task.priority]} size="sm">
                          {task.priority}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {task.assignee}
                        </span>
                      </div>
                    </div>
                  </button>
                </div>
                
                <AnimatePresence>
                  {expandedTasks.has(task.Id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 bg-gray-50 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">
                          {task.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Status: {task.status}</span>
                          <span>Due: {format(task.endDate, "MMM d, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onTaskClick?.(task)}
                          >
                            <ApperIcon name="Edit" size={14} />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Task Timeline */}
              <div className="timeline-task-timeline">
                {timelineDates.map((date, dateIndex) => {
                  const position = getTaskPosition(task, dateIndex);
                  
                  if (!position) {
                    return <div key={dateIndex} className="timeline-cell" />;
                  }

                  const { isStart, isEnd, isMiddle } = position;

                  return (
                    <div
                      key={dateIndex}
                      className="timeline-cell"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, date)}
                    >
                      <div
                        className={cn(
                          "timeline-task-bar",
                          priorityColors[task.priority],
                          task.isOverdue && "timeline-task-overdue",
                          isStart && "timeline-task-start",
                          isEnd && "timeline-task-end",
                          isMiddle && "timeline-task-middle",
                          draggedTask?.Id === task.Id && "timeline-task-dragging"
                        )}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onTaskClick?.(task)}
                      >
                        {isStart && (
                          <div className="timeline-task-content">
                            <span className="timeline-task-title">
                              {task.title}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineView;