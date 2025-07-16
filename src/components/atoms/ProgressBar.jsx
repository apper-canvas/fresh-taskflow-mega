import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";

const ProgressBar = React.forwardRef(({ 
  className, 
  value = 0, 
  max = 100, 
  variant = "primary",
  size = "md",
  showValue = false,
  ...props 
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const variants = {
    primary: "from-primary-500 to-primary-600",
    accent: "from-accent-500 to-accent-600",
    success: "from-green-500 to-green-600",
    warning: "from-yellow-500 to-yellow-600",
    error: "from-red-500 to-red-600"
  };

  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  return (
    <div
      ref={ref}
      className={cn("relative w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <motion.div
        className={cn(
          "h-full rounded-full bg-gradient-to-r transition-all duration-500",
          variants[variant],
          sizes[size]
        )}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-medium text-gray-700">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
});

ProgressBar.displayName = "ProgressBar";

export default ProgressBar;