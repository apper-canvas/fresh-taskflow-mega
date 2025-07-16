import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";

const Settings = ({ 
  className,
  ...props 
}) => {
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: false,
      taskReminders: true,
      projectUpdates: true
    },
    display: {
      theme: "light",
      compactMode: false,
      showCompletedTasks: true
    },
    defaults: {
      taskPriority: "medium",
      projectStatus: "planning",
      dueDateReminder: "1"
    }
  });

  const handlePreferenceChange = (section, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // In a real app, this would save to a backend or local storage
    toast.success("Settings saved successfully!");
  };

  const handleReset = () => {
    setPreferences({
      notifications: {
        email: true,
        push: false,
        taskReminders: true,
        projectUpdates: true
      },
      display: {
        theme: "light",
        compactMode: false,
        showCompletedTasks: true
      },
      defaults: {
        taskPriority: "medium",
        projectStatus: "planning",
        dueDateReminder: "1"
      }
    });
    toast.success("Settings reset to defaults!");
  };

  const SettingSection = ({ title, children, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-card border border-gray-200 shadow-card"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary-100 rounded-lg">
            <ApperIcon name={icon} className="text-primary-600" size={20} />
          </div>
          <h3 className="font-display font-semibold text-lg text-gray-900">
            {title}
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {children}
      </div>
    </motion.div>
  );

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <label className="text-sm font-medium text-gray-900">
          {label}
        </label>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
          checked ? "bg-primary-600" : "bg-gray-200"
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900">
            Settings
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your TaskFlow Pro experience.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Notifications */}
        <SettingSection title="Notifications" icon="Bell">
          <ToggleSwitch
            checked={preferences.notifications.email}
            onChange={(value) => handlePreferenceChange("notifications", "email", value)}
            label="Email Notifications"
            description="Receive email updates for important events"
          />
          <ToggleSwitch
            checked={preferences.notifications.push}
            onChange={(value) => handlePreferenceChange("notifications", "push", value)}
            label="Push Notifications"
            description="Get browser notifications for real-time updates"
          />
          <ToggleSwitch
            checked={preferences.notifications.taskReminders}
            onChange={(value) => handlePreferenceChange("notifications", "taskReminders", value)}
            label="Task Reminders"
            description="Notify when tasks are approaching due dates"
          />
          <ToggleSwitch
            checked={preferences.notifications.projectUpdates}
            onChange={(value) => handlePreferenceChange("notifications", "projectUpdates", value)}
            label="Project Updates"
            description="Get notified about project milestone changes"
          />
        </SettingSection>

        {/* Display */}
        <SettingSection title="Display" icon="Monitor">
          <FormField
            type="select"
            label="Theme"
            value={preferences.display.theme}
            onChange={(e) => handlePreferenceChange("display", "theme", e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </FormField>
          
          <ToggleSwitch
            checked={preferences.display.compactMode}
            onChange={(value) => handlePreferenceChange("display", "compactMode", value)}
            label="Compact Mode"
            description="Use smaller card sizes and reduced spacing"
          />
          
          <ToggleSwitch
            checked={preferences.display.showCompletedTasks}
            onChange={(value) => handlePreferenceChange("display", "showCompletedTasks", value)}
            label="Show Completed Tasks"
            description="Display completed tasks in project boards"
          />
        </SettingSection>

        {/* Defaults */}
        <SettingSection title="Default Values" icon="Settings">
          <FormField
            type="select"
            label="Default Task Priority"
            value={preferences.defaults.taskPriority}
            onChange={(e) => handlePreferenceChange("defaults", "taskPriority", e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </FormField>
          
          <FormField
            type="select"
            label="Default Project Status"
            value={preferences.defaults.projectStatus}
            onChange={(e) => handlePreferenceChange("defaults", "projectStatus", e.target.value)}
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
          </FormField>
          
          <FormField
            type="select"
            label="Due Date Reminder"
            value={preferences.defaults.dueDateReminder}
            onChange={(e) => handlePreferenceChange("defaults", "dueDateReminder", e.target.value)}
          >
            <option value="0">Same day</option>
            <option value="1">1 day before</option>
            <option value="2">2 days before</option>
            <option value="7">1 week before</option>
          </FormField>
        </SettingSection>

        {/* Account */}
        <SettingSection title="Account" icon="User">
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-default">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Version:</span> TaskFlow Pro v1.0.0
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Last Updated:</span> {new Date().toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-col gap-3">
              <Button variant="secondary" className="flex items-center gap-2">
                <ApperIcon name="Download" size={16} />
                Export Data
              </Button>
              <Button variant="secondary" className="flex items-center gap-2">
                <ApperIcon name="Upload" size={16} />
                Import Data
              </Button>
              <Button variant="danger" className="flex items-center gap-2">
                <ApperIcon name="Trash2" size={16} />
                Clear All Data
              </Button>
            </div>
          </div>
        </SettingSection>
      </div>
    </div>
  );
};

export default Settings;