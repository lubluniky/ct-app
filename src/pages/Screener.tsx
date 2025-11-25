import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

// Placeholder data interface
interface ScreenerData {
  symbol: string;
  price: string;
  ticks5m: number;
  change5m: string;
  volume5m: string;
  volatility15m: string;
  volume1h: string;
  vdelta1h: string;
  oiChange8h: string;
  change1d: string;
  fundingRate: string;
  openInterest: string;
  marketCap: string;
}

// Placeholder data
const data: ScreenerData[] = [
  {
    symbol: "1000000BOB/USDT",
    price: "0.02743",
    ticks5m: 150,
    change5m: "0.44%",
    volume5m: "9,851$",
    volatility15m: "0.150",
    volume1h: "67,138$",
    vdelta1h: "4,558$",
    oiChange8h: "24,546$",
    change1d: "-2.59%",
    fundingRate: "0.231%",
    openInterest: "678,360$",
    marketCap: ""
  },
  {
    symbol: "1000000MOG/USDT",
    price: "0.2638",
    ticks5m: 41,
    change5m: "-0.26%",
    volume5m: "186,067$",
    volatility15m: "0.167",
    volume1h: "539,183$",
    vdelta1h: "40,247$",
    oiChange8h: "-30,823$",
    change1d: "-2.76%",
    fundingRate: "0.005%",
    openInterest: "1,135,957$",
    marketCap: ""
  },
  {
    symbol: "OG/USDT",
    price: "1.1869",
    ticks5m: 650,
    change5m: "-0.16%",
    volume5m: "137,102$",
    volatility15m: "0.100",
    volume1h: "945,063$",
    vdelta1h: "-16,770$",
    oiChange8h: "286,015$",
    change1d: "-3.53%",
    fundingRate: "-0.035%",
    openInterest: "18,482,679$",
    marketCap: "253,285,923$"
  },
  {
    symbol: "1INCH/USDT",
    price: "0.1882",
    ticks5m: 215,
    change5m: "0.11%",
    volume5m: "15,580$",
    volatility15m: "0.081",
    volume1h: "316,236$",
    vdelta1h: "44,819$",
    oiChange8h: "-8,017$",
    change1d: "-4.81%",
    fundingRate: "0.01%",
    openInterest: "4,964,938$",
    marketCap: "262,959,093$"
  },
  {
    symbol: "1MBABYDOGE/USDT",
    price: "0.0007324",
    ticks5m: 64,
    change5m: "-0.01%",
    volume5m: "17,042$",
    volatility15m: "0.097",
    volume1h: "285,132$",
    vdelta1h: "-3,959$",
    oiChange8h: "-40,595$",
    change1d: "-0.75%",
    fundingRate: "0.005%",
    openInterest: "2,164,033$",
    marketCap: "112,300,812$"
  },
  {
    symbol: "2Z/USDT",
    price: "0.12454",
    ticks5m: 602,
    change5m: "-0.02%",
    volume5m: "53,433$",
    volatility15m: "0.087",
    volume1h: "418,949$",
    vdelta1h: "21,160$",
    oiChange8h: "7,522$",
    change1d: "2.76%",
    fundingRate: "-0.048%",
    openInterest: "5,410,199$",
    marketCap: ""
  },
  {
    symbol: "4/USDT",
    price: "0.03572",
    ticks5m: 182,
    change5m: "-0.03%",
    volume5m: "34,460$",
    volatility15m: "0.175",
    volume1h: "948,239$",
    vdelta1h: "-9,926$",
    oiChange8h: "-69,520$",
    change1d: "1.05%",
    fundingRate: "0.067%",
    openInterest: "8,748,007$",
    marketCap: ""
  },
  {
    symbol: "42/USDT",
    price: "0.05744",
    ticks5m: 185,
    change5m: "-0.33%",
    volume5m: "43,240$",
    volatility15m: "0.244",
    volume1h: "548,681$",
    vdelta1h: "-33,591$",
    oiChange8h: "-86,595$",
    change1d: "5.69%",
    fundingRate: "0.091%",
    openInterest: "2,215,199$",
    marketCap: ""
  },
  {
    symbol: "A/USDT",
    price: "0.2012",
    ticks5m: 42,
    change5m: "0.10%",
    volume5m: "19,735$",
    volatility15m: "0.091",
    volume1h: "403,130$",
    vdelta1h: "-32,790$",
    oiChange8h: "60,423$",
    change1d: "-5.72%",
    fundingRate: "-0.007%",
    openInterest: "5,194,905$",
    marketCap: "322,091,085$"
  },
  {
    symbol: "A2Z/USDT",
    price: "0.003181",
    ticks5m: 211,
    change5m: "-0.03%",
    volume5m: "11,141$",
    volatility15m: "0.060",
    volume1h: "54,792$",
    vdelta1h: "-2,368$",
    oiChange8h: "-61,070$",
    change1d: "-0.87%",
    fundingRate: "0.005%",
    openInterest: "4,170,701$",
    marketCap: "23,061,730$"
  },
  {
    symbol: "AAVE/USDC",
    price: "177.45",
    ticks5m: 142,
    change5m: "-0.04%",
    volume5m: "13,457$",
    volatility15m: "0.086",
    volume1h: "395,362$",
    vdelta1h: "45,603$",
    oiChange8h: "-62,469$",
    change1d: "0.03%",
    fundingRate: "0.007%",
    openInterest: "5,432,037$",
    marketCap: "2,709,218,049$"
  },
  {
    symbol: "AAVE/USDT",
    price: "177.67",
    ticks5m: 1234,
    change5m: "-0.07%",
    volume5m: "365,748$",
    volatility15m: "0.081",
    volume1h: "6,475,012$",
    vdelta1h: "-30,041$",
    oiChange8h: "168,175$",
    change1d: "0.02%",
    fundingRate: "-0.003%",
    openInterest: "59,147,160$",
    marketCap: "2,711,812,647$"
  },
  {
    symbol: "ACE/USDT",
    price: "0.2204",
    ticks5m: 142,
    change5m: "0.14%",
    volume5m: "4,075$",
    volatility15m: "0.109",
    volume1h: "100,599$",
    vdelta1h: "3,430$",
    oiChange8h: "9,555$",
    change1d: "-2.65%",
    fundingRate: "0.005%",
    openInterest: "1,313,025$",
    marketCap: "17,218,770$"
  },
  {
    symbol: "ACH/USDT",
    price: "0.009794",
    ticks5m: 275,
    change5m: "-0.06%",
    volume5m: "24,348$",
    volatility15m: "0.093",
    volume1h: "235,071$",
    vdelta1h: "-9,562$",
    oiChange8h: "-96,287$",
    change1d: "0.56%",
    fundingRate: "-0.034%",
    openInterest: "2,448,544$",
    marketCap: "94,537,125$"
  },
  {
    symbol: "ACT/USDT",
    price: "0.0221",
    ticks5m: 42,
    change5m: "0.32%",
    volume5m: "35,077$",
    volatility15m: "0.116",
    volume1h: "391,316$",
    vdelta1h: "-48,339$",
    oiChange8h: "-101,188$",
    change1d: "-6.20%",
    fundingRate: "0.005%",
    openInterest: "4,129,252$",
    marketCap: "27,802,574$"
  },
  {
    symbol: "ACX/USDT",
    price: "0.05942",
    ticks5m: 98,
    change5m: "-0.32%",
    volume5m: "6,093$",
    volatility15m: "0.106",
    volume1h: "46,002$",
    vdelta1h: "6,773$",
    oiChange8h: "34,852$",
    change1d: "-4.18%",
    fundingRate: "0.005%",
    openInterest: "1,460,374$",
    marketCap: "38,055,214$"
  },
  {
    symbol: "ADA/USDT",
    price: "0.4176",
    ticks5m: 310,
    change5m: "0.10%",
    volume5m: "807,671$",
    volatility15m: "0.085",
    volume1h: "16,483,684$",
    vdelta1h: "-267,141$",
    oiChange8h: "-673,566$",
    change1d: "-2.36%",
    fundingRate: "0.002%",
    openInterest: "111,808,679$",
    marketCap: "14,978,955,404$"
  },
  {
    symbol: "ADA/USDC",
    price: "0.4174",
    ticks5m: 85,
    change5m: "0.07%",
    volume5m: "43,133$",
    volatility15m: "0.095",
    volume1h: "1,030,631$",
    vdelta1h: "-111,576$",
    oiChange8h: "27,756$",
    change1d: "-2.43%",
    fundingRate: "0.005%",
    openInterest: "4,402,427$",
    marketCap: "14,961,025,125$"
  },
  {
    symbol: "AERGO/USDT",
    price: "0.05976",
    ticks5m: 42,
    change5m: "0.07%",
    volume5m: "1,160$",
    volatility15m: "0.072",
    volume1h: "21,501$",
    vdelta1h: "6,899$",
    oiChange8h: "28,701$",
    change1d: "-2.23%",
    fundingRate: "0.005%",
    openInterest: "1,121,340$",
    marketCap: "29,267,700$"
  },
  {
    symbol: "AERO/USDT",
    price: "0.6836",
    ticks5m: 469,
    change5m: "0.35%",
    volume5m: "85,371$",
    volatility15m: "0.123",
    volume1h: "629,664$",
    vdelta1h: "12,805$",
    oiChange8h: "-90,188$",
    change1d: "-2.02%",
    fundingRate: "0.005%",
    openInterest: "7,030,845$",
    marketCap: "615,654,207$"
  },
  {
    symbol: "AEVO/USDT",
    price: "0.04803",
    ticks5m: 99,
    change5m: "0.04%",
    volume5m: "27,864$",
    volatility15m: "0.078",
    volume1h: "189,314$",
    vdelta1h: "-7,572$",
    oiChange8h: "-22,421$",
    change1d: "-3.20%",
    fundingRate: "0.005%",
    openInterest: "1,843,500$",
    marketCap: "43,979,894$"
  },
  {
    symbol: "AGLD/USDT",
    price: "0.2956",
    ticks5m: 77,
    change5m: "0.10%",
    volume5m: "6,344$",
    volatility15m: "0.119",
    volume1h: "70,387$",
    vdelta1h: "-21,217$",
    oiChange8h: "14,176$",
    change1d: "-1.40%",
    fundingRate: "-0.005%",
    openInterest: "1,703,490$",
    marketCap: "25,601,916$"
  },
  {
    symbol: "AGT/USDT",
    price: "0.002843",
    ticks5m: 63,
    change5m: "-0.32%",
    volume5m: "4,522$",
    volatility15m: "0.213",
    volume1h: "132,698$",
    vdelta1h: "-6,961$",
    oiChange8h: "76,073$",
    change1d: "2.86%",
    fundingRate: "0.005%",
    openInterest: "2,903,516$",
    marketCap: "5,118,598$"
  },
  {
    symbol: "AI/USDT",
    price: "0.05102",
    ticks5m: 109,
    change5m: "-0.06%",
    volume5m: "7,721$",
    volatility15m: "0.104",
    volume1h: "145,600$",
    vdelta1h: "8,020$",
    oiChange8h: "20,581$",
    change1d: "-3.99%",
    fundingRate: "0.005%",
    openInterest: "1,286,949$",
    marketCap: "22,234,300$"
  },
  {
    symbol: "AIA/USDT",
    price: "0.5009",
    ticks5m: 1184,
    change5m: "-0.18%",
    volume5m: "157,602$",
    volatility15m: "0.281",
    volume1h: "2,319,840$",
    vdelta1h: "26,680$",
    oiChange8h: "-188,398$",
    change1d: "3.00%",
    fundingRate: "0.017%",
    openInterest: "10,742,805$",
    marketCap: "64,818,875$"
  },
  {
    symbol: "AIN/USDT",
    price: "0.08251",
    ticks5m: 64,
    change5m: "-0.11%",
    volume5m: "1,070$",
    volatility15m: "0.109",
    volume1h: "29,579$",
    vdelta1h: "2,094$",
    oiChange8h: "-6,782$",
    change1d: "2.93%",
    fundingRate: "0.029%",
    openInterest: "3,341,905$",
    marketCap: "18,285,175$"
  },
  {
    symbol: "AIO/USDT",
    price: "0.08512",
    ticks5m: 120,
    change5m: "0.24%",
    volume5m: "10,260$",
    volatility15m: "0.105",
    volume1h: "142,895$",
    vdelta1h: "5,658$",
    oiChange8h: "93,932$",
    change1d: "-8.32%",
    fundingRate: "0.06%",
    openInterest: "2,023,113$",
    marketCap: "19,557,435$"
  },
  {
    symbol: "AIOT/USDT",
    price: "0.3854",
    ticks5m: 82,
    change5m: "-0.23%",
    volume5m: "5,288$",
    volatility15m: "0.119",
    volume1h: "258,563$",
    vdelta1h: "-5,207$",
    oiChange8h: "23,029$",
    change1d: "-11.63%",
    fundingRate: "0.005%",
    openInterest: "616,897$",
    marketCap: "35,711,433$"
  },
  {
    symbol: "AIXBT/USDT",
    price: "0.04506",
    ticks5m: 74,
    change5m: "0.11%",
    volume5m: "44,956$",
    volatility15m: "0.127",
    volume1h: "716,414$",
    vdelta1h: "-127,866$",
    oiChange8h: "-224,554$",
    change1d: "1.19%",
    fundingRate: "0.005%",
    openInterest: "3,637,040$",
    marketCap: "44,949,665$"
  },
  {
    symbol: "AKE/USDT",
    price: "0.0003424",
    ticks5m: 38,
    change5m: "0.38%",
    volume5m: "6,730$",
    volatility15m: "0.161",
    volume1h: "165,305$",
    vdelta1h: "5,583$",
    oiChange8h: "62,896$",
    change1d: "-13.88%",
    fundingRate: "0.005%",
    openInterest: "2,328,604$",
    marketCap: ""
  }
];

const Screener = () => {
  // Helper function to determine color based on value
  const getColorClass = (value: string) => {
    if (value.includes('-')) return 'text-red-500';
    if (value === '0.00%' || value === '0.000%') return 'text-muted-foreground';
    return 'text-green-500';
  };

  return (
    <div className="h-full flex flex-col p-4 space-y-4 overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Screener</h1>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search symbols..." className="pl-8" />
        </div>
      </div>

      <Card className="flex-1 overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="py-3 px-4 border-b border-border/50">
          <CardTitle className="text-sm font-medium text-muted-foreground">Market Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-0 h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
              <TableRow className="hover:bg-transparent border-b border-border/50">
                <TableHead className="w-[180px] font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Symbol</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Price</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Ticks 5m</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Change 5m</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Volume 5m</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Volatility 15m</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Volume 1h</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Vdelta 1h</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">OI change 8h</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Change 1d</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Funding rate</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">OpenInterest</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-wider text-foreground/70 bg-card">Marketcap</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/50 border-b border-border/30 even:bg-muted/10 transition-colors">
                  <TableCell className="font-medium flex items-center gap-2 py-2 whitespace-nowrap">
                    <span className="text-muted-foreground text-[10px]">▶</span>
                    <span className="text-sm text-foreground">{row.symbol}</span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm py-2 whitespace-nowrap text-muted-foreground">{row.price}</TableCell>
                  <TableCell className="text-right font-mono text-sm py-2 whitespace-nowrap text-muted-foreground">{row.ticks5m}</TableCell>
                  <TableCell className={`text-right font-mono text-sm py-2 whitespace-nowrap ${getColorClass(row.change5m)}`}>{row.change5m}</TableCell>
                  <TableCell className="text-right font-mono text-sm py-2 whitespace-nowrap text-muted-foreground">{row.volume5m}</TableCell>
                  <TableCell className="text-right font-mono text-sm py-2 whitespace-nowrap text-muted-foreground">{row.volatility15m}</TableCell>
                  <TableCell className="text-right font-mono text-sm py-2 whitespace-nowrap text-muted-foreground">{row.volume1h}</TableCell>
                  <TableCell className={`text-right font-mono text-sm py-2 whitespace-nowrap ${getColorClass(row.vdelta1h)}`}>{row.vdelta1h}</TableCell>
                  <TableCell className={`text-right font-mono text-sm py-2 whitespace-nowrap ${getColorClass(row.oiChange8h)}`}>{row.oiChange8h}</TableCell>
                  <TableCell className={`text-right font-mono text-sm py-2 whitespace-nowrap ${getColorClass(row.change1d)}`}>{row.change1d}</TableCell>
                  <TableCell className={`text-right font-mono text-sm py-2 whitespace-nowrap ${getColorClass(row.fundingRate)}`}>{row.fundingRate}</TableCell>
                  <TableCell className="text-right font-mono text-sm py-2 whitespace-nowrap text-muted-foreground">{row.openInterest}</TableCell>
                  <TableCell className="text-right font-mono text-sm py-2 whitespace-nowrap text-muted-foreground">{row.marketCap}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Screener;
