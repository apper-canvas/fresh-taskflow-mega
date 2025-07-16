import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  const SkeletonCard = () => (
    <div className="bg-white rounded-card border border-gray-200 p-4 animate-pulse">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded-full w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonProject = () => (
    <div className="bg-white rounded-card border border-gray-200 p-4 animate-pulse">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-6 bg-gray-300 rounded-full w-20"></div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-10"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  );

  if (variant === "kanban") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-4">
            <div className="h-8 bg-gray-300 rounded animate-pulse"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <SkeletonCard key={j} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "projects") {
    return (
      <div className={cn("grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6", className)}>
        {[...Array(6)].map((_, i) => (
          <SkeletonProject key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center gap-3">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="text-gray-600 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;