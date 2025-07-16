import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ProjectCard = ({ 
  project, 
  className, 
  onClick,
  isActive = false,
  ...props 
}) => {
  const statusVariant = {
    active: "success",
    planning: "warning",
    completed: "default",
    on_hold: "error"
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  return (
    <motion.div
      className={cn(
        "bg-white rounded-card border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-card-hover",
        isActive ? "border-primary-500 shadow-lg shadow-primary-500/20" : "border-gray-200",
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="font-display font-semibold text-lg text-gray-900 line-clamp-1">
              {project.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
          <Badge variant={statusVariant[project.status]} className="flex-shrink-0">
            {project.status.replace("_", " ")}
          </Badge>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-primary-600">
              {project.progress}%
            </span>
          </div>
          <ProgressBar value={project.progress} variant="primary" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ApperIcon name="Calendar" size={14} />
            {formatDate(project.startDate)}
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Target" size={14} />
            {formatDate(project.endDate)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;