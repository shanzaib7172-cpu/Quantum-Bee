import { CheckCircle2, AlertTriangle, TrendingUp, Sparkles, X, Bot, Route } from "lucide-react";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Cell,
} from "recharts";

export interface AnalysisData {
  url: string;
  meta: {
    title: string;
    description: string;
    status: number;
    loadMs: number;
    sizeKb: number;
  };
  analysis: {
    score: number;
    summary: string;
    categories: {
      seo: number;
      performance: number;
      design: number;
      content: number;
      conversion: number;
    };
    strengths: string[];
    improvements: { title: string; priority: "high" | "medium" | "low"; detail: string }[];
    scale_recommendations: string[];
    agent_recommendations?: { agent: string; fit: number; reason: string }[];
    roadmap?: { step: number; agent: string; action: string; outcome: string }[];
  };
}

const ScoreMeter = ({ score }: { score: number }) => {
  const safe = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (safe / 100) * circumference;
  const colorClass =
    safe >= 80 ? "text-green-400" : safe >= 60 ? "text-bee" : safe >= 40 ? "text-orange-400" : "text-red-400";

  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-1000 ease-out`}
          style={{ filter: "drop-shadow(0 0 6px currentColor)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold font-heading ${colorClass}`}>{safe}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">/ 100</span>
      </div>
    </div>
  );
};

const CategoryBar = ({ label, value }: { label: string; value: number }) => {
  const safe = Math.max(0, Math.min(100, Math.round(value)));
  const color =
    safe >= 80 ? "bg-green-400" : safe >= 60 ? "bg-bee" : safe >= 40 ? "bg-orange-400" : "bg-red-400";
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground capitalize">{label}</span>
        <span className="text-[11px] font-medium text-foreground">{safe}</span>
      </div>
      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-700`} style={{ width: `${safe}%` }} />
      </div>
    </div>
  );
};

export const AnalysisResult = ({ data, onClose }: { data: AnalysisData; onClose?: () => void }) => {
  const { analysis, meta, url } = data;

  const agentRecs = analysis.agent_recommendations ?? [];
  const roadmap = analysis.roadmap ?? [];

  return (
    <div className="glass rounded-xl p-3 sm:p-4 space-y-4 mt-3 animate-in fade-in slide-in-from-top-2 duration-300 w-full max-w-full overflow-hidden">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Analyzed</p>
          <p className="text-xs font-medium text-foreground truncate">{url}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4">
        <ScoreMeter score={analysis.score} />
        <div className="flex-1 min-w-0 w-full">
          <p className="text-xs text-foreground/80 leading-relaxed">{analysis.summary}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 mt-2 text-[10px] text-muted-foreground">
            <span>{meta.loadMs}ms</span>
            <span>•</span>
            <span>{meta.sizeKb}KB</span>
            <span>•</span>
            <span>HTTP {meta.status}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
        {Object.entries(analysis.categories).map(([k, v]) => (
          <CategoryBar key={k} label={k} value={v} />
        ))}
      </div>

      {/* Visual graphs */}
      {(() => {
        const chartData = Object.entries(analysis.categories).map(([k, v]) => ({
          name: k.charAt(0).toUpperCase() + k.slice(1),
          value: Math.max(0, Math.min(100, Math.round(v as number))),
        }));
        const barColor = (val: number) =>
          val >= 80 ? "hsl(142 76% 55%)" : val >= 60 ? "hsl(45 100% 55%)" : val >= 40 ? "hsl(25 95% 55%)" : "hsl(0 84% 60%)";
        const agentChart = agentRecs
          .slice(0, 6)
          .map((a) => ({ name: a.agent, fit: Math.max(0, Math.min(100, Math.round(a.fit))) }));
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/40 bg-secondary/20 p-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-1">Score radar</p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={chartData} outerRadius="75%">
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      dataKey="value"
                      stroke="hsl(45 100% 55%)"
                      fill="hsl(45 100% 55%)"
                      fillOpacity={0.35}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-border/40 bg-secondary/20 p-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 px-1">
                {agentChart.length > 0 ? "Agent fit" : "Category scores"}
              </p>
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={agentChart.length > 0 ? agentChart : chartData}
                    margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Bar
                      dataKey={agentChart.length > 0 ? "fit" : "value"}
                      radius={[4, 4, 0, 0]}
                    >
                      {(agentChart.length > 0 ? agentChart : chartData).map((d: any, i) => (
                        <Cell key={i} fill={barColor(d.fit ?? d.value)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      })()}

      {analysis.strengths.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Strengths</span>
          </div>
          <ul className="space-y-1">
            {analysis.strengths.slice(0, 4).map((s, i) => (
              <li key={i} className="text-xs text-foreground/80 pl-5 relative">
                <span className="absolute left-1 top-1.5 w-1 h-1 rounded-full bg-green-400" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {analysis.improvements.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-bee" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Improvements</span>
          </div>
          <div className="space-y-1.5">
            {analysis.improvements.slice(0, 5).map((imp, i) => {
              const pColor =
                imp.priority === "high"
                  ? "bg-red-400/15 text-red-400 border-red-400/30"
                  : imp.priority === "medium"
                    ? "bg-bee/15 text-bee border-bee/30"
                    : "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30";
              return (
                <div key={i} className="rounded-lg bg-secondary/30 p-2 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-medium text-foreground leading-tight">{imp.title}</p>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${pColor}`}>
                      {imp.priority}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">{imp.detail}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {analysis.scale_recommendations.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-accent" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Scale Up</span>
          </div>
          <ul className="space-y-1">
            {analysis.scale_recommendations.slice(0, 5).map((s, i) => (
              <li key={i} className="text-xs text-foreground/80 pl-5 relative">
                <Sparkles className="absolute left-0 top-0.5 w-3 h-3 text-accent" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {agentRecs.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5 text-bee-blue" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Best-Fit Agents</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {agentRecs.slice(0, 6).map((a, i) => (
              <div key={i} className="rounded-lg bg-bee-blue/5 border border-bee-blue/20 p-2.5 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-bee-blue">{a.agent}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-bee-blue/15 text-bee-blue border border-bee-blue/30">
                    {Math.round(a.fit)}%
                  </span>
                </div>
                <p className="text-[11px] text-foreground/75 leading-snug">{a.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {roadmap.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <Route className="w-3.5 h-3.5 text-bee" />
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Growth Roadmap</span>
          </div>
          <ol className="space-y-2">
            {roadmap.map((r) => (
              <li
                key={r.step}
                className="relative pl-7 rounded-lg bg-secondary/30 p-2.5"
              >
                <span className="absolute left-2 top-2.5 w-4 h-4 rounded-full bg-bee/20 border border-bee/40 flex items-center justify-center text-[9px] font-bold text-bee">
                  {r.step}
                </span>
                <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-bee-blue/15 text-bee-blue border border-bee-blue/30">
                    {r.agent}
                  </span>
                  <p className="text-xs font-medium text-foreground leading-tight">{r.action}</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">→ {r.outcome}</p>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};
