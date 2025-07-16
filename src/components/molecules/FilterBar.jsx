import React from "react";
import { cn } from "@/utils/cn";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterBar = ({ 
  className, 
  filters = {}, 
  onFilterChange,
  onReset,
  ...props 
}) => {
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" }
  ];

  const priorityOptions = [
    { value: "", label: "All Priority" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const assigneeOptions = [
    { value: "", label: "All Assignees" },
    { value: "john", label: "John Doe" },
    { value: "jane", label: "Jane Smith" },
    { value: "mike", label: "Mike Johnson" },
    { value: "sarah", label: "Sarah Wilson" }
  ];

  return (
    <div className={cn("flex flex-wrap gap-4 p-4 bg-white rounded-card border border-gray-200", className)} {...props}>
      <div className="flex-1 min-w-[120px]">
        <Select
          value={filters.status || ""}
          onChange={(e) => onFilterChange?.("status", e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      
      <div className="flex-1 min-w-[120px]">
        <Select
          value={filters.priority || ""}
          onChange={(e) => onFilterChange?.("priority", e.target.value)}
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      
      <div className="flex-1 min-w-[120px]">
        <Select
          value={filters.assignee || ""}
          onChange={(e) => onFilterChange?.("assignee", e.target.value)}
        >
          {assigneeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onReset}
        className="flex items-center gap-2"
      >
        <ApperIcon name="RotateCcw" size={16} />
        Reset
      </Button>
    </div>
  );
};

export default FilterBar;