import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { format } from "date-fns";

const Dashboard = ({ 
  className,
  onNewProject,
  onNewTask,
  onProjectSelect,
  ...props 
}) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getRecentTasks = () => {
    return tasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === "done").length;
    const inProgress = tasks.filter(task => task.status === "in-progress").length;
    const todo = tasks.filter(task => task.status === "todo").length;
    
    return { total, completed, inProgress, todo };
  };

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(project => project.status === "active").length;
    const completed = projects.filter(project => project.status === "completed").length;
    const planning = projects.filter(project => project.status === "planning").length;
    
    return { total, active, completed, planning };
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      task.status !== "done"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const StatCard = ({ title, value, subtitle, icon, color = "primary", trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-card border border-gray-200 p-6 shadow-card hover:shadow-card-hover transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-lg",
              color === "primary" && "bg-gradient-to-br from-primary-500 to-primary-600",
              color === "accent" && "bg-gradient-to-br from-accent-500 to-accent-600",
              color === "success" && "bg-gradient-to-br from-green-500 to-green-600",
              color === "warning" && "bg-gradient-to-br from-yellow-500 to-yellow-600"
            )}>
              <ApperIcon name={icon} className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {subtitle && (
                <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
        {trend && (
          <div className="text-right">
            <span className={cn(
              "text-sm font-medium",
              trend > 0 ? "text-green-600" : "text-red-600"
            )}>
              {trend > 0 ? "+" : ""}{trend}%
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );

  const taskStats = getTaskStats();
  const projectStats = getProjectStats();
  const recentTasks = getRecentTasks();
  const overdueTasks = getOverdueTasks();

  if (loading) {
    return <Loading className={className} />;
  }

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back! Here"s what"s happening with your projects.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={onNewTask}
            className="flex items-center gap-2"
          >
            <ApperIcon name="Plus" size={16} />
            New Task
          </Button>
          <Button
            variant="primary"
            onClick={onNewProject}
            className="flex items-center gap-2"
          >
            <ApperIcon name="FolderPlus" size={16} />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Projects"
          value={projectStats.total}
          subtitle={`${projectStats.active} active`}
          icon="FolderOpen"
          color="primary"
        />
        <StatCard
          title="Total Tasks"
          value={taskStats.total}
          subtitle={`${taskStats.completed} completed`}
          icon="CheckSquare"
          color="success"
        />
        <StatCard
          title="In Progress"
          value={taskStats.inProgress}
          subtitle="Tasks active"
          icon="Clock"
          color="accent"
        />
        <StatCard
          title="Overdue"
          value={overdueTasks.length}
          subtitle="Need attention"
          icon="AlertCircle"
          color="warning"
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Projects */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-card border border-gray-200 shadow-card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-xl text-gray-900">
                  Recent Projects
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewProject}
                  className="flex items-center gap-1"
                >
                  <ApperIcon name="Plus" size={16} />
                  New
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {projects.length === 0 ? (
                <Empty
                  title="No projects yet"
                  message="Create your first project to get started with task management."
                  actionLabel="Create Project"
                  onAction={onNewProject}
                  icon="FolderPlus"
                />
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 5).map((project) => (
                    <motion.div
                      key={project.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-default hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => onProjectSelect(project)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {project.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant={project.status === "active" ? "success" : "default"}>
                            {project.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            Due: {formatDate(project.endDate)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {project.progress}%
                          </p>
                          <ProgressBar
                            value={project.progress}
                            className="w-20 mt-1"
                            size="sm"
                          />
                        </div>
                        <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <div className="bg-white rounded-card border border-gray-200 shadow-card">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-xl text-gray-900">
                  Recent Tasks
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNewTask}
                  className="flex items-center gap-1"
                >
                  <ApperIcon name="Plus" size={16} />
                  New
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              {tasks.length === 0 ? (
                <Empty
                  title="No tasks yet"
                  message="Create your first task to start tracking progress."
                  actionLabel="Create Task"
                  onAction={onNewTask}
                  icon="CheckSquare"
                />
              ) : (
                <div className="space-y-4">
                  {recentTasks.map((task) => (
                    <motion.div
                      key={task.Id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-default hover:bg-gray-100 transition-colors"
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        task.status === "done" && "bg-green-500",
                        task.status === "in-progress" && "bg-purple-500",
                        task.status === "todo" && "bg-blue-500"
                      )} />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">
                          {task.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {task.assignee}
                        </p>
                      </div>
                      <Badge variant={task.priority === "high" ? "high" : task.priority === "medium" ? "medium" : "low"}>
                        {task.priority}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;