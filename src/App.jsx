import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import ProjectBoard from "@/components/pages/ProjectBoard";
import Projects from "@/components/pages/Projects";
import Reports from "@/components/pages/Reports";
import Settings from "@/components/pages/Settings";
import ProjectModal from "@/components/organisms/ProjectModal";
import TaskModal from "@/components/organisms/TaskModal";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [modalProject, setModalProject] = useState(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      toast.error("Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    navigate(`/project/${project.Id}`);
    setIsSidebarOpen(false);
  };

  const handleNewProject = () => {
    setModalProject(null);
    setIsProjectModalOpen(true);
  };

  const handleNewTask = () => {
    if (!selectedProject) {
      toast.error("Please select a project first");
      return;
    }
    setIsTaskModalOpen(true);
  };

  const handleProjectSave = async (projectData) => {
    try {
      let updatedProject;
      
      if (modalProject) {
        updatedProject = await projectService.update(modalProject.Id, projectData);
        setProjects(prev => prev.map(p => p.Id === modalProject.Id ? updatedProject : p));
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
      
      setIsProjectModalOpen(false);
      setModalProject(null);
    } catch (err) {
      toast.error("Failed to save project");
    }
  };

  const handleProjectDelete = async (projectId) => {
    try {
      await projectService.delete(projectId);
      setProjects(prev => prev.filter(p => p.Id !== projectId));
      setIsProjectModalOpen(false);
      setModalProject(null);
      toast.success("Project deleted successfully!");
      
      if (selectedProject?.Id === projectId) {
        setSelectedProject(null);
        navigate("/");
      }
    } catch (err) {
      toast.error("Failed to delete project");
    }
  };

  const handleTaskSave = async (taskData) => {
    try {
      const newTaskData = {
        ...taskData,
        projectId: selectedProject.Id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await taskService.create(newTaskData);
      setIsTaskModalOpen(false);
      toast.success("Task created successfully!");
    } catch (err) {
      toast.error("Failed to create task");
    }
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects(prev => prev.map(p => p.Id === updatedProject.Id ? updatedProject : p));
    setSelectedProject(updatedProject);
  };

return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onMenuToggle={handleMenuToggle}
      />
      <div className="flex">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={handleSidebarClose}
          projects={projects}
          loading={projectsLoading}
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
onNewProject={handleNewProject}
        />
        
        <main className={`flex-1 ${isSidebarOpen ? 'lg:ml-80' : ''} min-h-screen`}>
          <div className="p-6">
            <Routes>
              <Route
                path="/"
                element={
                  <Dashboard
                    onNewProject={handleNewProject}
                    onNewTask={handleNewTask}
                    onProjectSelect={handleProjectSelect}
                  />
                }
              />
              <Route
                path="/projects"
                element={
                  <Projects
                    onProjectSelect={handleProjectSelect}
                  />
                }
              />
              <Route
                path="/project/:projectId"
                element={
                  <ProjectBoard
                    selectedProject={selectedProject}
                    onProjectUpdate={handleProjectUpdate}
                  />
                }
              />
              <Route
                path="/reports"
                element={<Reports />}
              />
              <Route
                path="/settings"
                element={<Settings />}
              />
            </Routes>
          </div>
        </main>
      </div>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setModalProject(null);
        }}
        project={modalProject}
        onSave={handleProjectSave}
        onDelete={handleProjectDelete}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleTaskSave}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;