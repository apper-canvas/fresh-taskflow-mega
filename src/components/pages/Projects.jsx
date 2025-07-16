import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import ProjectCard from "@/components/molecules/ProjectCard";
import ProjectModal from "@/components/organisms/ProjectModal";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";

const Projects = ({ 
  className,
  onProjectSelect,
  ...props 
}) => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [projects, searchTerm, statusFilter, sortBy]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...projects];
    
    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Status filter
    if (statusFilter) {
      filtered = filtered.filter(project => project.status === statusFilter);
    }
    
    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress":
          return b.progress - a.progress;
        case "endDate":
          return new Date(a.endDate) - new Date(b.endDate);
        case "createdAt":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });
    
    setFilteredProjects(filtered);
  };

  const handleProjectClick = (project) => {
    onProjectSelect?.(project);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleProjectSave = async (projectData) => {
    try {
      let updatedProject;
      
      if (selectedProject) {
        updatedProject = await projectService.update(selectedProject.Id, projectData);
        setProjects(prev => prev.map(p => p.Id === selectedProject.Id ? updatedProject : p));
        toast.success("Project updated successfully!");
      } else {
        const newProjectData = {
          ...projectData,
          progress: 0,
          createdAt: new Date().toISOString()
        };
        updatedProject = await projectService.create(newProjectData);
        setProjects(prev => [...prev, updatedProject]);
        toast.success("Project created successfully!");
      }
      
      setIsModalOpen(false);
      setSelectedProject(null);
    } catch (err) {
      toast.error("Failed to save project");
    }
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.Id !== projectId));
      setIsModalOpen(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "planning", label: "Planning" },
    { value: "active", label: "Active" },
    { value: "on_hold", label: "On Hold" },
    { value: "completed", label: "Completed" }
  ];

  const sortOptions = [
    { value: "name", label: "Name" },
    { value: "progress", label: "Progress" },
    { value: "endDate", label: "Due Date" },
    { value: "createdAt", label: "Created Date" }
  ];

  if (loading) {
    return <Loading variant="projects" className={className} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load projects"
        message={error}
        onRetry={loadProjects}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900">
            All Projects
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and track all your projects from one place.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleNewProject}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={16} />
          New Project
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-card border border-gray-200 shadow-card p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              placeholder="Search projects..."
              onSearch={setSearchTerm}
            />
          </div>
          <div className="flex gap-4">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  Sort by {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Empty
          title="No projects found"
          message={searchTerm || statusFilter ? "Try adjusting your filters to find projects." : "Create your first project to get started with task management."}
          actionLabel="Create Project"
          onAction={handleNewProject}
          icon="FolderPlus"
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProjectCard
                project={project}
                onClick={() => handleProjectClick(project)}
                onEdit={() => handleEditProject(project)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onSave={handleProjectSave}
        onDelete={handleProjectDelete}
      />
    </div>
  );
};

export default Projects;