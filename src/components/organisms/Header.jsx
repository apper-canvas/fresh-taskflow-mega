import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ 
  className, 
  onMenuToggle,
  onNewProject,
  onNewTask,
  ...props 
}) => {
  return (
    <header className={cn("bg-white border-b border-gray-200 px-6 py-4", className)} {...props}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuToggle}
            className="lg:hidden"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-2">
              <ApperIcon name="CheckSquare" className="text-white" size={24} />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-gray-900">
                TaskFlow Pro
              </h1>
              <p className="text-sm text-gray-600">Project Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={onNewTask}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            <span className="hidden sm:inline">New Task</span>
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={onNewProject}
            className="flex items-center gap-2"
          >
            <ApperIcon name="FolderPlus" size={16} />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;