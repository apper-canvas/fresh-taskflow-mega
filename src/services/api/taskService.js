import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.tasks = [...tasksData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.tasks];
  }

  async getById(id) {
    await this.delay();
    const task = this.tasks.find(t => t.Id === id);
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  }

  async getByProjectId(projectId) {
    await this.delay();
    return this.tasks.filter(t => t.projectId === projectId).map(t => ({ ...t }));
  }

  async create(taskData) {
    await this.delay();
    const newTask = {
      ...taskData,
      Id: Math.max(...this.tasks.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks[index] = { 
      ...this.tasks[index], 
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.tasks.findIndex(t => t.Id === id);
    if (index === -1) {
      throw new Error("Task not found");
    }
    this.tasks.splice(index, 1);
    return true;
  }
}

export const taskService = new TaskService();