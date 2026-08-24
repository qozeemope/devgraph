import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Cpu,
  Network,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { getGraphStats } from "./services/api";
import type { GraphStats } from "./types";

function App() {
  return <AppLayout />;
}

function AppLayout() {
  const location = useLocation();

  const [stats, setStats] = useState<GraphStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);

        const data = await getGraphStats();

        setStats(data);
        setError(null);
      } catch {
        setError("Unable to load graph statistics.");
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const isOverview = location.pathname === "/";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-slate-200 bg-white lg:block">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white">
              D
            </div>

            <span className="text-lg font-semibold tracking-tight">
              DevGraph
            </span>
          </div>

          <nav className="flex-1 space-y-1 p-4">
            <NavItem
              to="/"
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              active={isOverview}
            />

            <NavItem
              to="/developers"
              icon={<Users size={18} />}
              label="Developers"
              active={location.pathname.startsWith("/developers")}
            />

            <NavItem
              to="/projects"
              icon={<FolderKanban size={18} />}
              label="Projects"
              active={location.pathname.startsWith("/projects")}
            />

            <NavItem
              to="/technologies"
              icon={<Cpu size={18} />}
              label="Technologies"
              active={location.pathname.startsWith("/technologies")}
            />
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="rounded-lg bg-slate-50 p-3">
              <div className="flex items-center gap-2">
                <Network size={16} className="text-emerald-600" />

                <span className="text-sm font-medium">Graph connected</span>
              </div>

              <p className="mt-1 text-xs text-slate-500">Powered by CognoDB</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
          <div>
            <h1 className="text-sm font-semibold">
              {isOverview ? "Developer Explorer" : "DevGraph"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">DevGraph</p>
              <p className="text-xs text-slate-500">Graph-powered discovery</p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
              D
            </div>
          </div>
        </header>

        <section className="p-6">
          <div className="mx-auto max-w-7xl">
            {isOverview && (
              <Overview stats={stats} loading={loading} error={error} />
            )}

            <Outlet />
          </div>
        </section>
      </main>
    </div>
  );
}

function Overview({
  stats,
  loading,
  error,
}: {
  stats: GraphStats | null;
  loading: boolean;
  error: string | null;
}) {
  return (
    <>
      <div className="mb-8">
        <p className="text-sm font-medium text-emerald-600">
          Developer ecosystem
        </p>

        <h2 className="mt-2 text-3xl font-bold tracking-tight">
          Explore the connections
        </h2>

        <p className="mt-2 max-w-2xl text-slate-500">
          Discover developers, technologies and projects through their
          relationships.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Developers"
          value={loading ? "..." : String(stats?.developers ?? 0)}
          description="People in the graph"
        />

        <StatCard
          label="Projects"
          value={loading ? "..." : String(stats?.projects ?? 0)}
          description="Connected projects"
        />

        <StatCard
          label="Technologies"
          value={loading ? "..." : String(stats?.technologies ?? 0)}
          description="Skills and tools"
        />
      </div>
    </>
  );
}

function NavItem({
  to,
  icon,
  label,
  active = false,
}: {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-slate-100 text-slate-900"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function StatCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>

      <p className="mt-1 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export default App;
