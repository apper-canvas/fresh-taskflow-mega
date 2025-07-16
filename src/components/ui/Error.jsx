import React from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  className, 
  title = "Something went wrong", 
  message = "We encountered an error while loading this content.", 
  onRetry,
  ...props 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)} {...props}>
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full p-4 mb-6">
        <ApperIcon name="AlertCircle" className="text-red-500" size={48} />
      </div>
      
      <h3 className="font-display font-semibold text-xl text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <Button 
          variant="primary" 
          onClick={onRetry}
          className="flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;