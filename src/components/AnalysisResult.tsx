import { CheckCircle2, AlertTriangle, TrendingUp, Sparkles, X } from "lucide-react";

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

export const AnalysisResult = ({ data, onClose }: { data: AnalysisData; onClose: () => void }) => {
  const { analysis, meta, url } = data;

  return (
    <div className="glass rounded-xl p-4 space-y-4 mt-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Analyzed</p>
          <p className="text-xs font-medium text-foreground truncate">{url}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <ScoreMeter score={analysis.score} />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-4">{analysis.summary}</p>
          <div className="flex gap-2 mt-2 text-[10px] text-muted-foreground">
            <span>{meta.loadMs}ms</span>
            <span>•</span>
            <span>{meta.sizeKb}KB</span>
            <span>•</span>
            <span>HTTP {meta.status}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(analysis.categories).map(([k, v]) => (
          <CategoryBar key={k} label={k} value={v} />
        ))}
      </div>

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
    </div>
  );
};
