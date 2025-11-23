import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MacroCorrelations } from "@/components/macro/MacroCorrelations";

const Macro = () => {
  return (
    <div className="h-full overflow-y-auto p-8 space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Macro Environment</h2>
        <p className="text-muted-foreground">Global economic indicators and liquidity metrics.</p>
      </div>

      <MacroCorrelations fixedPeriod="15" />
      <MacroCorrelations fixedPeriod="30" />
      <MacroCorrelations fixedPeriod="60" />
      <MacroCorrelations fixedPeriod="90" />
    </div>
  );
};

export default Macro;
