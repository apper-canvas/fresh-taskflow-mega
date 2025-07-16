import React from "react";
import { cn } from "@/utils/cn";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import ProjectCard from "@/components/molecules/ProjectCard";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";

const Sidebar = ({ 
  className, 
  isOpen = false, 
  onClose,
  projects = [],
  loading = false,
  selectedProject,
  onProjectSelect,
  onNewProject,
  ...props 
}) => {
  const navigationItems = [
    { name: "Dashboard", icon: "LayoutDashboard", path: "/" },
    { name: "All Projects", icon: "FolderOpen", path: "/projects" },
    { name: "Reports", icon: "BarChart3", path: "/reports" },
    { name: "Settings", icon: "Settings", path: "/settings" }
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Navigation */}
      <nav className="p-4 border-b border-gray-200">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-default text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25"
                    : "text-gray-700 hover:bg-gray-100"
                )
              }
            >
              <ApperIcon name={item.icon} size={18} />
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Projects Section */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-gray-900">
              Projects
            </h2>
            <button
              onClick={onNewProject}
              className="p-1 rounded-default hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="Plus" size={16} className="text-gray-600" />
            </button>
          </div>

          {loading ? (
            <Loading variant="projects" />
          ) : projects.length === 0 ? (
            <Empty
              title="No projects yet"
              message="Create your first project to get started with task management."
              actionLabel="Create Project"
              onAction={onNewProject}
              icon="FolderPlus"
            />
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.Id}
                  project={project}
                  onClick={() => onProjectSelect(project)}
                  isActive={selectedProject?.Id === project.Id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            
            {/* Mobile Sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="font-display font-semibold text-lg text-gray-900">
                  Navigation
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 rounded-default hover:bg-gray-100 transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={cn("hidden lg:block w-80 bg-white border-r border-gray-200", className)} {...props}>
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;