import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  className, 
  title = "No items found", 
  message = "Get started by creating your first item.", 
  actionLabel = "Create New",
  onAction,
  icon = "Plus",
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-full p-6 mb-6">
        <ApperIcon name={icon} className="text-primary-500" size={48} />
      </div>
      
      <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onAction && (
        <Button 
          variant="primary" 
          onClick={onAction}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;