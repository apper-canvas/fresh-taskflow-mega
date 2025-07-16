import React from "react";
import { cn } from "@/utils/cn";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ 
  className, 
  placeholder = "Search...", 
  onSearch,
  ...props 
}) => {
  return (
    <div className={cn("relative", className)}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        size={18}
      />
      <Input
        className="pl-10 pr-4"
        placeholder={placeholder}
        onChange={(e) => onSearch?.(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default SearchBar;