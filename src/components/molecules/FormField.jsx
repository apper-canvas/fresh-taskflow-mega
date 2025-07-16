import React from "react";
import { cn } from "@/utils/cn";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Textarea from "@/components/atoms/Textarea";

const FormField = ({ 
  type = "input", 
  label, 
  error, 
  className,
  children,
  ...props 
}) => {
  const renderField = () => {
    switch (type) {
      case "select":
        return (
          <Select error={!!error} {...props}>
            {children}
          </Select>
        );
      case "textarea":
        return <Textarea error={!!error} {...props} />;
      default:
        return <Input error={!!error} {...props} />;
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;