import { useEffect, useState } from "react";
import { ArrowRight, GitBranch, Search, Star } from "lucide-react";
import { Link } from "react-router-dom";

import { getProjects } from "../services/api";
import type { Project } from "../types";

function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);

        const data = await getProjects();

        setProjects(data);
        setError(null);
      } catch {
        setError("Unable to load projects.");
      } finally {
        setLoading(false);
      }
    }

    loadProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const query = search.toLowerCase();

    return (
      project.name.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return <ProjectsSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-900">{error}</p>

        <p className="mt-1 text-sm text-red-700">Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-emerald-600">
            Explore the graph
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight">Projects</h1>

          <p className="mt-2 max-w-xl text-sm text-slate-500">
            Explore projects, their technologies, and developers connected to
            them.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />
        </div>
      </div>

      {/* Empty search state */}
      {filteredProjects.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <GitBranch size={28} className="mx-auto text-slate-300" />

          <h2 className="mt-3 font-semibold">No projects found</h2>

          <p className="mt-1 text-sm text-slate-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
                  <GitBranch size={20} />
                </div>

                <ArrowRight
                  size={18}
                  className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-600"
                />
              </div>

              <h2 className="mt-5 text-lg font-semibold">{project.name}</h2>

              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                {project.description}
              </p>

              <div className="mt-5 flex items-center gap-2 text-sm text-slate-400">
                <Star size={15} />

                <span>{project.stars} stars</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-32 rounded bg-slate-200" />

      <div className="mt-2 h-8 w-40 rounded bg-slate-200" />

      <div className="mt-2 h-4 w-80 rounded bg-slate-200" />

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-48 rounded-2xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export default ProjectsPage;
