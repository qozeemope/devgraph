import type {
  DeveloperDetail,
  GraphStats,
  ProjectDetail,
  RecommendedDeveloper,
  Project,
} from "../types";

const API_URL = import.meta.env.API_URL || "http://localhost:8000";

async function request<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getDevelopers() {
  return request("/api/developers");
}

export function getTechnologies() {
  return request("/api/technologies");
}

export function getDeveloper(developerId: string) {
  return request<DeveloperDetail>(`/api/developers/${developerId}`);
}

export function getDeveloperProjects(developerId: string) {
  return request(`/api/developers/${developerId}/projects`);
}

export function getRelatedTechnologies(technologyId: string) {
  return request(`/api/technologies/${technologyId}/related`);
}

export function getGraphStats() {
  return request<GraphStats>("/api/stats");
}

export function getProjects() {
  return request<Project[]>("/api/projects");
}

export function getProject(projectId: string) {
  return request<ProjectDetail>(`/api/projects/${projectId}`);
}

export function getRecommendedDevelopers(projectId: string) {
  return request<RecommendedDeveloper[]>(
    `/api/projects/${projectId}/recommended-developers`,
  );
}
