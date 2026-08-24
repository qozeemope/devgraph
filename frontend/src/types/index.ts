export interface Developer {
  id: string;
  name: string;
  username: string;
  bio: string;
  location: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  stars: number;
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface DeveloperProject {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  stars: number;
  role: string;
  year: number;
}

export interface RecommendedDeveloper {
  developer_id: string;
  developer: string;
  match_type: "direct" | "related";
  matched_skills: {
    technology: string;
    proficiency: string;
    match_type: "direct" | "related";
  }[];
  score: number;
}

export interface GraphStats {
  developers: number;
  projects: number;
  technologies: number;
}

export interface DeveloperSkill {
  id: string;
  name: string;
  category: string;
  proficiency: string;
}

export interface DeveloperProject {
  id: string;
  name: string;
  role: string;
  year: number;
}

export interface DeveloperDetail extends Developer {
  skills: DeveloperSkill[];
  projects: DeveloperProject[];
}

export interface ProjectTechnology {
  id: string;
  name: string;
  category: string;
}

export interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  repository_url: string;
  stars: number;
  technologies: ProjectTechnology[];
  domains: string[];
}

export interface RecommendedDeveloperSkill {
  technology: string;
  proficiency: string;
  match_type: "direct" | "related";
}

export interface RecommendedDeveloper {
  developer_id: string;
  developer: string;
  match_type: "direct" | "related";
  matched_skills: RecommendedDeveloperSkill[];
  score: number;
}
