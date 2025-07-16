import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import FormField from "@/components/molecules/FormField";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";

// Helper function to validate dates
const isValidDate = (dateString) => {
  if (!dateString || dateString.trim() === '') return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date instanceof Date;
};

const ProjectModal = ({ 
  isOpen = false, 
  onClose, 
  project = null,
  onSave,
  onDelete,
  ...props 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    endDate: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "planning",
        startDate: project.startDate && isValidDate(project.startDate) 
          ? format(new Date(project.startDate), "yyyy-MM-dd") 
          : "",
        endDate: project.endDate && isValidDate(project.endDate) 
          ? format(new Date(project.endDate), "yyyy-MM-dd") 
          : ""
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "planning",
        startDate: "",
        endDate: ""
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

const projectData = {
      ...formData,
      startDate: formData.startDate && isValidDate(formData.startDate) 
        ? new Date(formData.startDate).toISOString() 
        : null,
      endDate: formData.endDate && isValidDate(formData.endDate) 
        ? new Date(formData.endDate).toISOString() 
        : null
    };

    onSave?.(projectData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const statusOptions = [
    { value: "planning", label: "Planning" },
    { value: "active", label: "Active" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-card shadow-xl"
            {...props}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="font-display font-semibold text-xl text-gray-900">
                {project ? "Edit Project" : "Create New Project"}
              </h2>
<Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <FormField
                type="input"
                label="Project Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                error={errors.name}
                placeholder="Enter project name..."
                required
              />

              {/* Description */}
              <FormField
                type="textarea"
                label="Description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                error={errors.description}
                placeholder="Enter project description..."
                rows={4}
                required
              />

              {/* Status */}
              <FormField
                type="select"
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </FormField>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  type="date"
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />

                <FormField
                  type="date"
                  label="End Date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                  error={errors.endDate}
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div>
                  {project && onDelete && (
<Button
                      type="button"
                      variant="danger"
                      onClick={() => onDelete(project.id)}
                      className="flex items-center gap-2"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19ZM10 11V17M14 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Delete Project
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                  >
                    {project ? "Update Project" : "Create Project"}
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;