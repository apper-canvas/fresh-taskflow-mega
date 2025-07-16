import projectsData from "@/services/mockData/projects.json";

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.projects];
  }

  async getById(id) {
    await this.delay();
    const project = this.projects.find(p => p.Id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return { ...project };
  }

  async create(projectData) {
    await this.delay();
    const newProject = {
      ...projectData,
      Id: Math.max(...this.projects.map(p => p.Id)) + 1,
      createdAt: new Date().toISOString()
    };
    this.projects.push(newProject);
    return { ...newProject };
  }

  async update(id, updateData) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    this.projects[index] = { 
      ...this.projects[index], 
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.projects.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error("Project not found");
    }
    this.projects.splice(index, 1);
    return true;
  }
}

export const projectService = new ProjectService();