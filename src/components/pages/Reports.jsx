import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns";

const Reports = ({ 
  className,
  ...props 
}) => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
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
      setError("Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  const getProjectStats = () => {
    const total = projects.length;
    const active = projects.filter(p => p.status === "active").length;
    const completed = projects.filter(p => p.status === "completed").length;
    const planning = projects.filter(p => p.status === "planning").length;
    const onHold = projects.filter(p => p.status === "on_hold").length;
    const averageProgress = projects.reduce((sum, p) => sum + p.progress, 0) / total || 0;
    
    return { total, active, completed, planning, onHold, averageProgress };
  };

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "done").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const todo = tasks.filter(t => t.status === "todo").length;
    
    const highPriority = tasks.filter(t => t.priority === "high").length;
    const mediumPriority = tasks.filter(t => t.priority === "medium").length;
    const lowPriority = tasks.filter(t => t.priority === "low").length;
    
    const overdue = tasks.filter(t => 
      t.dueDate && 
      new Date(t.dueDate) < new Date() && 
      t.status !== "done"
    ).length;
    
    return { 
      total, 
      completed, 
      inProgress, 
      todo, 
      highPriority, 
      mediumPriority, 
      lowPriority, 
      overdue 
    };
  };

  const getProductivityData = () => {
    const now = new Date();
    const start = startOfMonth(now);
    const end = endOfMonth(now);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayTasks = tasks.filter(task => {
        const taskDate = new Date(task.createdAt);
        return taskDate.toDateString() === day.toDateString();
      });
      
      const completedTasks = tasks.filter(task => {
        const taskDate = new Date(task.updatedAt);
        return taskDate.toDateString() === day.toDateString() && task.status === "done";
      });
      
      return {
        date: day,
        created: dayTasks.length,
        completed: completedTasks.length,
        isToday: isToday(day)
      };
    });
  };

  const getTopProjects = () => {
    return projects
      .sort((a, b) => b.progress - a.progress)
      .slice(0, 5);
  };

  const getTeamPerformance = () => {
    const assignees = [...new Set(tasks.map(t => t.assignee))];
    
    return assignees.map(assignee => {
      const assigneeTasks = tasks.filter(t => t.assignee === assignee);
      const completed = assigneeTasks.filter(t => t.status === "done").length;
      const total = assigneeTasks.length;
      const completionRate = total > 0 ? (completed / total) * 100 : 0;
      
      return {
        name: assignee,
        total,
        completed,
        completionRate
      };
    }).sort((a, b) => b.completionRate - a.completionRate);
  };

  const ReportCard = ({ title, children, className: cardClassName }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("bg-white rounded-card border border-gray-200 shadow-card", cardClassName)}
    >
      <div className="p-6 border-b border-gray-200">
        <h3 className="font-display font-semibold text-lg text-gray-900">
          {title}
        </h3>
      </div>
      <div className="p-6">
        {children}
      </div>
    </motion.div>
  );

  const StatItem = ({ label, value, change, icon, color = "primary" }) => (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-default">
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-lg",
          color === "primary" && "bg-primary-100 text-primary-600",
          color === "success" && "bg-green-100 text-green-600",
          color === "warning" && "bg-yellow-100 text-yellow-600",
          color === "error" && "bg-red-100 text-red-600"
        )}>
          <ApperIcon name={icon} size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {change && (
        <div className={cn(
          "text-sm font-medium",
          change > 0 ? "text-green-600" : "text-red-600"
        )}>
          {change > 0 ? "+" : ""}{change}%
        </div>
      )}
    </div>
  );

  if (loading) {
    return <Loading className={className} />;
  }

  if (error) {
    return (
      <Error
        title="Failed to load reports"
        message={error}
        onRetry={loadReportsData}
        className={className}
      />
    );
  }

  if (projects.length === 0 && tasks.length === 0) {
    return (
      <Empty
        title="No data available"
        message="Create some projects and tasks to see detailed reports and analytics."
        actionLabel="Get Started"
        icon="BarChart3"
        className={className}
      />
    );
  }

  const projectStats = getProjectStats();
  const taskStats = getTaskStats();
  const productivityData = getProductivityData();
  const topProjects = getTopProjects();
  const teamPerformance = getTeamPerformance();

  return (
    <div className={cn("space-y-8", className)} {...props}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Track your project progress and team performance.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatItem
          label="Active Projects"
          value={projectStats.active}
          icon="FolderOpen"
          color="primary"
        />
        <StatItem
          label="Completed Tasks"
          value={taskStats.completed}
          icon="CheckCircle"
          color="success"
        />
        <StatItem
          label="In Progress"
          value={taskStats.inProgress}
          icon="Clock"
          color="warning"
        />
        <StatItem
          label="Overdue Tasks"
          value={taskStats.overdue}
          icon="AlertCircle"
          color="error"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Project Status Distribution */}
        <ReportCard title="Project Status">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Active</span>
              <span className="text-sm font-semibold text-gray-900">
                {projectStats.active}
              </span>
            </div>
            <ProgressBar 
              value={projectStats.active} 
              max={projectStats.total}
              variant="success"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Completed</span>
              <span className="text-sm font-semibold text-gray-900">
                {projectStats.completed}
              </span>
            </div>
            <ProgressBar 
              value={projectStats.completed} 
              max={projectStats.total}
              variant="primary"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Planning</span>
              <span className="text-sm font-semibold text-gray-900">
                {projectStats.planning}
              </span>
            </div>
            <ProgressBar 
              value={projectStats.planning} 
              max={projectStats.total}
              variant="warning"
            />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">On Hold</span>
              <span className="text-sm font-semibold text-gray-900">
                {projectStats.onHold}
              </span>
            </div>
            <ProgressBar 
              value={projectStats.onHold} 
              max={projectStats.total}
              variant="error"
            />
          </div>
        </ReportCard>

        {/* Task Priority Distribution */}
        <ReportCard title="Task Priority">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">High</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {taskStats.highPriority}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Medium</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {taskStats.mediumPriority}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-600">Low</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {taskStats.lowPriority}
              </span>
            </div>
            
            <div className="mt-6 p-4 bg-gray-50 rounded-default">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Completion Rate:</span> {" "}
                {taskStats.total > 0 ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
              </p>
            </div>
          </div>
        </ReportCard>

        {/* Team Performance */}
        <ReportCard title="Team Performance">
          <div className="space-y-4">
            {teamPerformance.slice(0, 5).map((member, index) => (
              <div key={member.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {member.name}
                    </span>
                    <span className="text-sm text-gray-500">
                      {member.completed}/{member.total}
                    </span>
                  </div>
                  <ProgressBar 
                    value={member.completionRate} 
                    variant={index === 0 ? "success" : "primary"}
                    size="sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Top Projects */}
        <ReportCard title="Top Performing Projects">
          <div className="space-y-4">
            {topProjects.map((project, index) => (
              <div key={project.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-default">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <Badge variant={project.status === "active" ? "success" : "default"}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <ProgressBar 
                      value={project.progress} 
                      className="flex-1"
                      variant={index === 0 ? "success" : "primary"}
                    />
                    <span className="text-sm font-semibold text-gray-900">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ReportCard>

        {/* Recent Activity */}
        <ReportCard title="Recent Activity">
          <div className="space-y-4">
            {productivityData.slice(-7).map((day, index) => (
              <div key={day.date.toISOString()} className="flex items-center justify-between p-3 bg-gray-50 rounded-default">
                <div>
                  <p className="font-medium text-gray-900">
                    {format(day.date, "MMM d")}
                    {day.isToday && (
                      <span className="ml-2 text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                        Today
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    {day.created} created, {day.completed} completed
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-900">
                    {day.created + day.completed}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>
    </div>
  );
};

export default Reports;