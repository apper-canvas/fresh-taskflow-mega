import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import { toast } from "react-toastify";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import TimelineView from "@/components/organisms/TimelineView";
import TaskModal from "@/components/organisms/TaskModal";
import FilterBar from "@/components/molecules/FilterBar";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";

const ProjectBoard = ({ 
  className,
  selectedProject,
  onProjectUpdate,
  ...props 
}) => {
  const { projectId } = useParams();
  const [project, setProject] = useState(selectedProject || null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: ""
  });
  const [viewMode, setViewMode] = useState("kanban");

  useEffect(() => {
    if (projectId) {
      loadProjectData();
    }
  }, [projectId]);

  useEffect(() => {
    if (selectedProject) {
      setProject(selectedProject);
      loadTasks();
    }
  }, [selectedProject]);

  useEffect(() => {
    applyFilters();
  }, [tasks, filters]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const projectData = await projectService.getById(parseInt(projectId));
      setProject(projectData);
      
      const tasksData = await taskService.getByProjectId(parseInt(projectId));
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load project data");
    } finally {
      setLoading(false);
    }
  };

  const loadTasks = async () => {
    if (!selectedProject) return;
    
    try {
      setLoading(true);
      setError("");
      
      const tasksData = await taskService.getByProjectId(selectedProject.Id);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];
    
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }
    
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }
    
    if (filters.assignee) {
      filtered = filtered.filter(task => task.assignee === filters.assignee);
    }
    
    setFilteredTasks(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleFilterReset = () => {
    setFilters({
      status: "",
      priority: "",
      assignee: ""
    });
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setSelectedTask(null);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = async (taskData) => {
    try {
      let updatedTask;
      
      if (selectedTask) {
        updatedTask = await taskService.update(selectedTask.Id, taskData);
        setTasks(prev => prev.map(t => t.Id === selectedTask.Id ? updatedTask : t));
        toast.success("Task updated successfully!");
      } else {
        const newTaskData = {
          ...taskData,
          projectId: project.Id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        updatedTask = await taskService.create(newTaskData);
        setTasks(prev => [...prev, updatedTask]);
        toast.success("Task created successfully!");
      }
      
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      
      // Update project progress
      await updateProjectProgress();
    } catch (err) {
      toast.error("Failed to save task");
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success("Task moved successfully!");
      
      // Update project progress
      await updateProjectProgress();
    } catch (err) {
      toast.error("Failed to move task");
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await taskService.delete(taskId);
      setTasks(prev => prev.filter(t => t.Id !== taskId));
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      toast.success("Task deleted successfully!");
      
      // Update project progress
      await updateProjectProgress();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const updateProjectProgress = async () => {
    if (!project) return;
    
    try {
      const currentTasks = await taskService.getByProjectId(project.Id);
      const completedTasks = currentTasks.filter(task => task.status === "done").length;
      const totalTasks = currentTasks.length;
      const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      
      const updatedProject = await projectService.update(project.Id, { progress });
      setProject(updatedProject);
      onProjectUpdate?.(updatedProject);
    } catch (err) {
      console.error("Failed to update project progress:", err);
    }
  };

  if (loading) {
    return <Loading variant="kanban" className={className} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load project"
        message={error}
        onRetry={loadProjectData}
        className={className}
      />
    );
  }

  if (!project) {
    return (
      <Error
        title="Project not found"
        message="The project you're looking for doesn't exist or has been deleted."
        className={className}
      />
    );
  }

  const statusVariant = {
    active: "success",
    planning: "warning",
    completed: "default",
    on_hold: "error"
  };

return (
    <div className={cn("space-y-6", className)} {...props}>
      {/* Project Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-card border border-gray-200 shadow-card p-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-display font-bold text-2xl text-gray-900">
                {project.name}
              </h1>
              <Badge variant={statusVariant[project.status]}>
                {project.status.replace("_", " ")}
              </Badge>
            </div>
            <p className="text-gray-600 mb-4">
              {project.description}
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <ApperIcon name="Calendar" size={16} />
                Started: {new Date(project.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Target" size={16} />
                Due: {new Date(project.endDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-1">Progress</p>
              <div className="flex items-center gap-2">
                <ProgressBar
                  value={project.progress}
                  className="w-24"
                  variant="primary"
                />
                <span className="text-sm font-semibold text-primary-600">
                  {project.progress}%
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600 mb-1">Tasks</p>
              <p className="text-xl font-bold text-gray-900">
                {tasks.filter(t => t.status === "done").length}/{tasks.length}
              </p>
            </div>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-200">
          <Button
            variant={viewMode === "kanban" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <ApperIcon name="Columns" size={16} />
            Kanban
          </Button>
          <Button
            variant={viewMode === "timeline" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("timeline")}
          >
            <ApperIcon name="Calendar" size={16} />
            Timeline
          </Button>
        </div>
      </motion.div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleFilterReset}
      />

{/* View Content */}
      {viewMode === "kanban" ? (
        <KanbanBoard
          tasks={filteredTasks}
          loading={loading}
          onTaskClick={handleTaskClick}
          onTaskMove={handleTaskMove}
          onNewTask={handleNewTask}
        />
      ) : (
        <TimelineView
          tasks={filteredTasks}
          loading={loading}
          onTaskClick={handleTaskClick}
          onTaskScheduleChange={async (taskId, startDate, endDate) => {
            try {
              const updatedTask = await taskService.update(taskId, {
                startDate: startDate.toISOString(),
                dueDate: endDate.toISOString()
              });
              setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
              toast.success("Task schedule updated successfully!");
            } catch (err) {
              toast.error("Failed to update task schedule");
            }
          }}
          onNewTask={handleNewTask}
        />
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        onSave={handleTaskSave}
        onDelete={handleTaskDelete}
      />
    </div>
  );
};

export default ProjectBoard;