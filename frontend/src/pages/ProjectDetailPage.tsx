import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, GitBranch, Star, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getProject, getRecommendedDevelopers } from "../services/api";

import type { ProjectDetail, RecommendedDeveloper } from "../types";

function ProjectDetailPage() {
  const { projectId } = useParams();

  const [project, setProject] = useState<ProjectDetail | null>(null);

  const [recommendations, setRecommendations] = useState<
    RecommendedDeveloper[]
  >([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      if (!projectId) {
        setError("Project not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [projectData, recommendedData] = await Promise.all([
          getProject(projectId),
          getRecommendedDevelopers(projectId),
        ]);

        setProject(projectData);
        setRecommendations(recommendedData);
        setError(null);
      } catch {
        setError("Unable to load this project.");
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [projectId]);

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-900">
            {error ?? "Project not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/projects"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to projects
      </Link>

      {/* Project header */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">
                {project.name}
              </h1>

              {project.domains.map((domain) => (
                <span
                  key={domain}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {domain}
                </span>
              ))}
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Star size={16} />
                {project.stars} stars
              </span>

              <a
                href={project.repository_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-medium text-slate-900 hover:underline"
              >
                Repository
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
            <GitBranch size={22} />
          </div>
        </div>
      </div>

      {/* Technologies */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <GitBranch size={20} className="text-emerald-600" />

          <h2 className="text-lg font-semibold">Technologies</h2>
        </div>

        {project.technologies.length === 0 ? (
          <EmptyState text="No technologies recorded for this project." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {project.technologies.map((technology) => (
              <div
                key={technology.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <h3 className="font-medium">{technology.name}</h3>

                <p className="mt-1 text-xs text-slate-400">
                  {technology.category}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recommendations */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Users size={20} className="text-emerald-600" />

          <div>
            <h2 className="text-lg font-semibold">Recommended developers</h2>

            <p className="text-sm text-slate-500">
              Developers matched through their skills and related technologies.
            </p>
          </div>
        </div>

        {recommendations.length === 0 ? (
          <EmptyState text="No matching developers found." />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {recommendations.map((developer) => (
              <Link
                key={`${developer.developer_id}-${developer.match_type}`}
                to={`/developers/${developer.developer_id}`}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-bold text-white">
                      {developer.developer.charAt(0)}
                    </div>

                    <div>
                      <h3 className="font-semibold">{developer.developer}</h3>

                      <span
                        className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                          developer.match_type === "direct"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {developer.match_type === "direct"
                          ? "Direct match"
                          : "Related skill"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold">{developer.score}</p>

                    <p className="text-xs text-slate-400">match score</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {developer.matched_skills.map((skill, index) => (
                    <span
                      key={`${skill.technology}-${index}`}
                      className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600"
                    >
                      {skill.technology}
                      {" · "}
                      {skill.proficiency}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
      <p className="text-sm text-slate-500">{text}</p>
    </div>
  );
}

function ProjectDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-32 rounded bg-slate-200" />

      <div className="mt-6 h-48 rounded-2xl bg-slate-200" />

      <div className="mt-8 h-6 w-40 rounded bg-slate-200" />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-slate-200" />
        ))}
      </div>

      <div className="mt-8 h-6 w-56 rounded bg-slate-200" />

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-32 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export default ProjectDetailPage;
