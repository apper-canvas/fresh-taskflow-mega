import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const TaskCard = ({ 
  task, 
  className, 
  onClick,
  isDragging = false,
  ...props 
}) => {
  const priorityVariant = {
    high: "high",
    medium: "medium",
    low: "low"
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d");
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "done";

  return (
    <motion.div
      className={cn(
        "bg-white rounded-card border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover",
        isDragging && "shadow-task-drag scale-105 rotate-2",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: isDragging ? 1.05 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900 line-clamp-2 flex-1">
            {task.title}
          </h3>
          <Badge variant={priorityVariant[task.priority]} className="flex-shrink-0">
            {task.priority}
          </Badge>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-sm text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar 
              size="sm" 
              alt={task.assignee} 
              src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`}
            />
            <span className="text-sm text-gray-600">{task.assignee}</span>
          </div>
          
          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-sm",
              isOverdue ? "text-red-600" : "text-gray-500"
            )}>
              <ApperIcon name="Calendar" size={14} />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;