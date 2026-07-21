export interface ScoringCriteriaRow {
  range: string;
  points: string;
  label: string;
  isActive?: boolean;
}

interface ScoringCriteriaTableProps {
  title: string;
  rows: ScoringCriteriaRow[];
}

export function ScoringCriteriaTable({ title, rows }: ScoringCriteriaTableProps) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-bold text-foreground">{title}</h4>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="px-4 py-2.5 text-start font-semibold">النطاق</th>
              <th className="px-4 py-2.5 text-start font-semibold">النقاط</th>
              <th className="px-4 py-2.5 text-start font-semibold">التقييم</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.range}
                className={`border-t border-border ${row.isActive ? "bg-primary/5 font-semibold text-foreground" : "text-foreground/90"}`}
              >
                <td className="px-4 py-2.5 whitespace-nowrap">{row.range}</td>
                <td className="px-4 py-2.5 tabular-nums whitespace-nowrap">{row.points}</td>
                <td className="px-4 py-2.5 whitespace-nowrap">{row.label}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
