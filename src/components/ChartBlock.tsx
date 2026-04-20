import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export interface ChartSpec {
  type: "bar" | "line" | "pie";
  title?: string;
  data: Array<Record<string, string | number>>;
  xKey?: string;
  yKeys?: string[];
}

const COLORS = [
  "hsl(195, 100%, 55%)", // blue
  "hsl(45, 100%, 55%)", // yellow
  "hsl(0, 0%, 95%)", // white
  "hsl(195, 80%, 70%)",
  "hsl(45, 90%, 70%)",
];

export const ChartBlock = ({ spec }: { spec: ChartSpec }) => {
  const { type, title, data, xKey = "name", yKeys = ["value"] } = spec;

  return (
    <div className="my-3 rounded-xl glass p-3 border border-border/50">
      {title && (
        <h4 className="text-xs font-semibold text-bee mb-2 font-heading">{title}</h4>
      )}
      <div className="w-full h-56">
        <ResponsiveContainer>
          {type === "bar" ? (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {yKeys.map((k, i) => (
                <Bar key={k} dataKey={k} fill={COLORS[i % COLORS.length]} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          ) : type === "line" ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey={xKey} stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              {yKeys.map((k, i) => (
                <Line
                  key={k}
                  type="monotone"
                  dataKey={k}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                dataKey={yKeys[0]}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={{ fontSize: 10 }}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

/**
 * Parses ```chart\n{json}\n``` blocks from markdown.
 * Returns { cleaned, charts } where cleaned has placeholder tokens like {{CHART:0}}.
 */
export function extractCharts(markdown: string): { cleaned: string; charts: ChartSpec[] } {
  const charts: ChartSpec[] = [];
  const cleaned = markdown.replace(/```chart\s*\n([\s\S]*?)\n```/g, (_, json) => {
    try {
      const spec = JSON.parse(json) as ChartSpec;
      if (spec && spec.type && Array.isArray(spec.data)) {
        const idx = charts.length;
        charts.push(spec);
        return `\n\n{{CHART:${idx}}}\n\n`;
      }
    } catch {
      /* ignore */
    }
    return "";
  });
  return { cleaned, charts };
}
