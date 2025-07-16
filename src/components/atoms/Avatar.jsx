import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ 
  className, 
  src, 
  alt, 
  fallback,
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg"
  };

  const generateFallback = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-white font-medium">
          {fallback || generateFallback(alt)}
        </div>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;