import { useEffect, useState } from "react";
import { ArrowLeft, BriefcaseBusiness, Code2, MapPin } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getDeveloper } from "../services/api";
import type { DeveloperDetail } from "../types";

function DeveloperDetailPage() {
  const { developerId } = useParams();

  const [developer, setDeveloper] = useState<DeveloperDetail | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDeveloper() {
      if (!developerId) {
        setError("Developer not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await getDeveloper(developerId);

        setDeveloper(data);
        setError(null);
      } catch {
        setError("Unable to load this developer.");
      } finally {
        setLoading(false);
      }
    }

    loadDeveloper();
  }, [developerId]);

  if (loading) {
    return <DeveloperDetailSkeleton />;
  }

  if (error || !developer) {
    return (
      <div>
        <Link
          to="/developers"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to developers
        </Link>

        <div className="mt-8 rounded-xl border border-red-200 bg-red-50 p-8 text-center">
          <p className="font-medium text-red-900">
            {error ?? "Developer not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/developers"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to developers
      </Link>

      {/* Profile header */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
            {developer.name.charAt(0)}
          </div>

          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight">
              {developer.name}
            </h1>

            <p className="mt-1 text-sm text-slate-500">@{developer.username}</p>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
              <MapPin size={16} />
              {developer.location}
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              {developer.bio}
            </p>
          </div>
        </div>
      </div>

      {/* Skills */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <Code2 size={20} className="text-emerald-600" />

          <h2 className="text-lg font-semibold">Skills & technologies</h2>
        </div>

        {developer.skills.length === 0 ? (
          <EmptyState text="No skills recorded for this developer." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {developer.skills.map((skill) => (
              <div
                key={skill.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{skill.name}</h3>

                    <p className="mt-1 text-xs text-slate-400">
                      {skill.category}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {skill.proficiency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Projects */}
      <section className="mt-8">
        <div className="mb-4 flex items-center gap-2">
          <BriefcaseBusiness size={20} className="text-emerald-600" />

          <h2 className="text-lg font-semibold">Projects</h2>
        </div>

        {developer.projects.length === 0 ? (
          <EmptyState text="No projects recorded for this developer." />
        ) : (
          <div className="space-y-3">
            {developer.projects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold">{project.name}</h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {project.role}
                    </p>
                  </div>

                  <span className="text-sm text-slate-400">{project.year}</span>
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

function DeveloperDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-5 w-36 rounded bg-slate-200" />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex gap-5">
          <div className="h-16 w-16 rounded-2xl bg-slate-200" />

          <div className="flex-1">
            <div className="h-6 w-48 rounded bg-slate-200" />
            <div className="mt-2 h-4 w-28 rounded bg-slate-200" />
            <div className="mt-4 h-4 w-40 rounded bg-slate-200" />
            <div className="mt-4 h-4 w-full max-w-xl rounded bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="mt-8 h-6 w-48 rounded bg-slate-200" />

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="h-24 rounded-xl bg-slate-200" />
        ))}
      </div>
    </div>
  );
}

export default DeveloperDetailPage;
