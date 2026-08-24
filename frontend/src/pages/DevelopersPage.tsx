import { useEffect, useState } from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { getDevelopers } from "../services/api";
import type { Developer } from "../types";
import { Link } from "react-router-dom";

function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDevelopers() {
      try {
        setLoading(true);

        const data = await getDevelopers();

        setDevelopers(data as Developer[]);
        setError(null);
      } catch {
        setError("Unable to load developers.");
      } finally {
        setLoading(false);
      }
    }

    loadDevelopers();
  }, []);

  const filteredDevelopers = developers.filter((developer) => {
    const query = search.toLowerCase();

    return (
      developer.name.toLowerCase().includes(query) ||
      developer.username.toLowerCase().includes(query) ||
      developer.location.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Developer ecosystem
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight">Developers</h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Explore developers and discover the projects and technologies
          connected to them.
        </p>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search developers..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <DeveloperSkeleton />
      ) : filteredDevelopers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="font-medium text-slate-900">No developers found</p>

          <p className="mt-1 text-sm text-slate-500">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredDevelopers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} />
          ))}
        </div>
      )}
    </div>
  );
}

function DeveloperCard({ developer }: { developer: Developer }) {
  return (
    <Link
      to={`/developers/${developer.id}`}
      className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 font-semibold text-white">
          {developer.name.charAt(0)}
        </div>

        <ArrowRight
          size={18}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-700"
        />
      </div>

      <h2 className="mt-4 font-semibold text-slate-900">{developer.name}</h2>

      <p className="mt-1 text-sm text-slate-500">@{developer.username}</p>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
        {developer.bio}
      </p>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
        <MapPin size={14} />
        {developer.location}
      </div>
    </Link>
  );
}

function DeveloperSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="h-11 w-11 rounded-full bg-slate-200" />

          <div className="mt-4 h-4 w-32 rounded bg-slate-200" />

          <div className="mt-2 h-3 w-24 rounded bg-slate-200" />

          <div className="mt-4 h-3 w-full rounded bg-slate-200" />

          <div className="mt-2 h-3 w-4/5 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}

export default DevelopersPage;
