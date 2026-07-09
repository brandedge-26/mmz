"use client";

import { useEffect, useState, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, ShoppingBag, Users, Package,
  XCircle, RefreshCw, BarChart3,
} from "lucide-react";
import Topbar from "@/components/Topbar";
import { privateAxios } from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────

interface KPIs {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  cancelledOrders: number;
  periodRevenue: number;
  periodOrders: number;
}

interface DayPoint   { date: string; label: string; revenue: number; orders: number }
interface StatusPoint{ name: string; value: number }
interface TopProduct { name: string; units: number; revenue: number }
interface CustPoint  { date: string; label: string; count: number }

interface AnalyticsData {
  kpis:        KPIs;
  daily:       DayPoint[];
  statusData:  StatusPoint[];
  topProducts: TopProduct[];
  apptData:    StatusPoint[];
  customers:   CustPoint[];
  days:        number;
}

// ── Palette ───────────────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
  Pending:    "#facc15",
  Processing: "#60a5fa",
  Shipped:    "#a78bfa",
  Delivered:  "#34d399",
  Cancelled:  "#f87171",
};

const APPT_COLORS: Record<string, string> = {
  Pending:      "#facc15",
  Confirmed:    "#60a5fa",
  "In progress":"#a78bfa",
  Completed:    "#34d399",
  Cancelled:    "#f87171",
};

const PIE_FALLBACK = ["#7c3aed","#60a5fa","#34d399","#facc15","#f87171","#fb923c"];

// ── Helpers ───────────────────────────────────────────────────────────────────

function pkr(n: number) {
  if (n >= 1_000_000) return `PKR ${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `PKR ${(n / 1_000).toFixed(1)}K`;
  return `PKR ${n.toLocaleString()}`;
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function ChartSkeleton({ h = 260 }: { h?: number }) {
  return (
    <div className="animate-pulse bg-gray-100 rounded-2xl w-full" style={{ height: h }} />
  );
}

// ── KPI card ──────────────────────────────────────────────────────────────────

function KpiCard({ label, value, Icon, bg, text, sub }: {
  label: string; value: string; sub?: string;
  Icon: React.ElementType; bg: string; text: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}>
        <Icon className={`w-5 h-5 ${text}`} />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-[11px] text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// ── Chart card wrapper ────────────────────────────────────────────────────────

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Custom Tooltip ────────────────────────────────────────────────────────────

function RevenueTooltip({ active, payload, label }: { active?: boolean; payload?: {value:number}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-gray-500">
          Sales: <span className="font-semibold text-violet-600">PKR {p.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
}

function OrderTooltip({ active, payload, label }: { active?: boolean; payload?: {value:number}[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-3 py-2.5 text-xs">
      <p className="font-bold text-gray-700 mb-1">{label}</p>
      <p className="text-gray-500">Orders: <span className="font-semibold text-blue-600">{payload[0].value}</span></p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const RANGES = [
  { label: "7 days",  value: "7" },
  { label: "30 days", value: "30" },
  { label: "90 days", value: "90" },
  { label: "1 year",  value: "365" },
];

// Thin out x-axis labels for small ranges
function thinLabels(data: { label: string }[], maxTicks = 10) {
  if (data.length <= maxTicks) return data.map((d) => d.label);
  const step = Math.ceil(data.length / maxTicks);
  return data.map((d, i) => (i % step === 0 ? d.label : ""));
}

export default function AnalyticsPage() {
  const [data,    setData]    = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range,   setRange]   = useState("30");

  const fetch = useCallback(async (r = range) => {
    setLoading(true);
    try {
      const { data: res } = await privateAxios.get(`/analytics?range=${r}`);
      setData(res);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  }, [range]);

  useEffect(() => { fetch(range); }, [range]);

  const kpis = data?.kpis;
  const xLabels = data ? thinLabels(data.daily) : [];

  return (
    <>
      <Topbar title="Analytics" />

      <div className="p-6 space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500 mt-0.5">Business overview and performance</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {/* Range tabs */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
              {RANGES.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setRange(r.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    range === r.value
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => fetch(range)}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
          <KpiCard label="Total Sales"   value={kpis ? pkr(kpis.totalRevenue)   : "—"} Icon={TrendingUp}  bg="bg-violet-50"  text="text-violet-600" sub={kpis ? `${pkr(kpis.periodRevenue)} this period` : undefined} />
          <KpiCard label="Total Orders"    value={kpis ? kpis.totalOrders.toLocaleString()    : "—"} Icon={ShoppingBag} bg="bg-blue-50"    text="text-blue-600"   sub={kpis ? `${kpis.periodOrders} this period` : undefined} />
          <KpiCard label="Customers"       value={kpis ? kpis.totalCustomers.toLocaleString() : "—"} Icon={Users}       bg="bg-green-50"   text="text-green-600" />
          <KpiCard label="Active Products" value={kpis ? kpis.totalProducts.toLocaleString()  : "—"} Icon={Package}     bg="bg-amber-50"   text="text-amber-500" />
          <KpiCard label="Cancelled"       value={kpis ? kpis.cancelledOrders.toLocaleString(): "—"} Icon={XCircle}     bg="bg-red-50"     text="text-red-500"   />
        </div>

        {/* Revenue chart (full width) */}
        <ChartCard title="Sales Over Time" sub={`Last ${range} days — cancelled orders excluded`}>
          {loading ? <ChartSkeleton h={280} /> : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={data?.daily} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#7c3aed" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="label" ticks={xLabels} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => pkr(v)} width={72} />
                <Tooltip content={<RevenueTooltip />} />
                <Area type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Orders + Customers — 2 col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard title="Orders Per Day" sub={`Last ${range} days`}>
            {loading ? <ChartSkeleton h={220} /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.daily} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="label" ticks={xLabels} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<OrderTooltip />} />
                  <Bar dataKey="orders" fill="#60a5fa" radius={[4, 4, 0, 0]} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="New Customers" sub={`Last ${range} days`}>
            {loading ? <ChartSkeleton h={220} /> : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data?.customers} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="label" ticks={xLabels} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [v, "New customers"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Order status + Appointment status — 2 col */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <ChartCard title="Order Status Breakdown" sub="All time">
            {loading ? <ChartSkeleton h={240} /> : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data?.statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false} fontSize={11}>
                    {data?.statusData.map((entry, i) => (
                      <Cell key={i} fill={STATUS_COLORS[entry.name] ?? PIE_FALLBACK[i % PIE_FALLBACK.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, "Orders"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          <ChartCard title="Repair Appointment Status" sub="All time">
            {loading ? <ChartSkeleton h={240} /> : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={data?.apptData} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
                    paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false} fontSize={11}>
                    {data?.apptData.map((entry, i) => (
                      <Cell key={i} fill={APPT_COLORS[entry.name] ?? PIE_FALLBACK[i % PIE_FALLBACK.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [v, "Appointments"]} contentStyle={{ borderRadius: 12, fontSize: 12 }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>

        {/* Top products */}
        <ChartCard title="Top 5 Products by Units Sold" sub="Cancelled orders excluded">
          {loading ? <ChartSkeleton h={220} /> : data?.topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <BarChart3 className="w-10 h-10 text-gray-200" />
              <p className="text-sm text-gray-400">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data?.topProducts.map((p, i) => {
                const max = data.topProducts[0].units;
                const pct = Math.round((p.units / max) * 100);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-[65%]">{p.name}</p>
                        <div className="text-right shrink-0 ml-2">
                          <span className="text-xs font-bold text-gray-700">{p.units} units</span>
                          <span className="text-xs text-gray-400 ml-2">{pkr(p.revenue)}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ChartCard>

      </div>
    </>
  );
}
