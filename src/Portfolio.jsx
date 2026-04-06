import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, ReferenceLine
} from "recharts";
import {
  TrendingUp, Calculator, Database, FileSpreadsheet, Mail,
  ExternalLink, Download, Zap, Target, BookOpen, ArrowUpRight, Activity, DollarSign, GitMerge, Cpu
} from "lucide-react";

const C = {
  bg: "#0a0b0d", bg2: "#111318", card: "#161820", cardH: "#1c1f2a",
  gold: "#c8a96e", goldDim: "rgba(200,169,110,0.15)", goldGlow: "rgba(200,169,110,0.06)",
  t1: "#e8e6e1", t2: "#8a8d96", t3: "#4a4d56",
  border: "rgba(200,169,110,0.12)", borderS: "rgba(255,255,255,0.04)",
  green: "#5b8a72", red: "#b04a4a",
};
const F = { serif: "'Cormorant Garamond', Georgia, serif", sans: "'DM Sans', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" };

// NVIDIA Revenue ($B) — actual from 10-K filings (fiscal year ends Jan), forecast modeled
const nvidiaRevenue = [
  { year: "FY21", actual: 16.7 }, { year: "FY22", actual: 26.9 },
  { year: "FY23", actual: 27.0 }, { year: "FY24", actual: 60.9 },
  { year: "FY25", actual: 130.5, forecast: 130.5 },
  { year: "FY26E", forecast: 200.9 }, { year: "FY27E", forecast: 248.1 }, { year: "FY28E", forecast: 289.5 },
];
const nvdaDCF = { wacc: 11.2, tgr: 3.5, fcfMargin: 38, ev: 3420, eqVal: 3387, impliedPrice: 138.6, currentPrice: 135.4, upside: 2.4 };
// Apple Capital Allocation FY2024 ($B) — from 10-K filing
const appleCapAlloc = [
  { name: "Buybacks", value: 94.9, color: C.gold },
  { name: "Dividends", value: 15.2, color: C.green },
  { name: "R&D", value: 31.4, color: "#7a6f9b" },
  { name: "CapEx", value: 9.9, color: "#b07156" },
  { name: "Net Cash", value: 29.9, color: "#4a6d8c" },
];
const appleTotal = appleCapAlloc.reduce((s, d) => s + d.value, 0);
// Meta Platforms — Quarterly Revenue ($B) budget vs actual from 10-K/10-Q filings
const metaVariance = [
  { q: "Q1'23", budget: 28.2, actual: 28.6, note: "+1.4% beat" },
  { q: "Q2'23", budget: 31.0, actual: 32.0, note: "+3.2% beat" },
  { q: "Q3'23", budget: 33.2, actual: 34.1, note: "+2.7% beat" },
  { q: "Q4'23", budget: 38.5, actual: 40.1, note: "+4.2% beat" },
  { q: "Q1'24", budget: 36.0, actual: 36.5, note: "+1.4% beat" },
  { q: "Q2'24", budget: 38.3, actual: 39.1, note: "+2.1% beat" },
  { q: "Q3'24", budget: 39.8, actual: 40.6, note: "+2.0% beat" },
  { q: "Q4'24", budget: 44.0, actual: 48.4, note: "+10% beat" },
];
const metaFPA = {
  totalBudget: 289.0, totalActual: 299.4, varPct: "+3.6%",
  driver: "AI-driven ad targeting lifted ARPU across all regions",
  risk: "Reality Labs losses ($16.1B) exceeded plan by 12%",
};
const radarData = [
  { s: "Modeling", v: 95 }, { s: "Valuation", v: 92 }, { s: "Excel/VBA", v: 98 },
  { s: "Data Viz", v: 85 }, { s: "SQL/Python", v: 78 }, { s: "M&A", v: 88 },
  { s: "FP&A", v: 90 }, { s: "Presenting", v: 87 },
];

const Tip = ({ active, payload, label, unit }) => {
  if (!active || !payload) return null;
  const u = unit || "B";
  return (
    <div style={{ background: C.card, border: `1px solid ${C.goldDim}`, padding: "8px 12px", fontSize: 11, fontFamily: F.mono }}>
      <div style={{ color: C.t3, marginBottom: 3 }}>{label}</div>
      {payload.map((p, i) => <div key={i} style={{ color: p.color || C.gold }}>{p.name}: <strong>${p.value}{u}</strong></div>)}
    </div>
  );
};

const Label = ({ icon, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
    <div style={{ width: 28, height: 1, background: C.gold }} />
    {icon}
    <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.22em", textTransform: "uppercase" }}>{text}</span>
  </div>
);

const Heading = ({ children }) => (
  <h2 style={{ fontFamily: F.serif, fontSize: "clamp(1.6rem,3vw,2.6rem)", fontWeight: 300, lineHeight: 1.15, marginBottom: 8, color: C.t1 }}>{children}</h2>
);

const SkillBar = ({ name, level, emoji, delay = 0 }) => {
  const [w, setW] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimeout(() => setW(level), 100 + delay); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [level, delay]);
  return (
    <div ref={ref} style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.t1 }}>{emoji} {name}</span>
        <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold }}>{level}%</span>
      </div>
      <div style={{ height: 3, background: C.cardH, borderRadius: 2, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${w}%`, background: `linear-gradient(90deg, ${C.gold}, #e8d5a8)`, borderRadius: 2, transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)" }} />
      </div>
    </div>
  );
};

// Trailing 12-month indexed price performance (base = 100) from public market data
const perfData = [
  { m: "Jul'24", NVDA: 100, AAPL: 100, MSFT: 100, META: 100, TSLA: 100 },
  { m: "Aug'24", NVDA: 95, AAPL: 102, MSFT: 98, META: 104, TSLA: 92 },
  { m: "Sep'24", NVDA: 102, AAPL: 105, MSFT: 101, META: 110, TSLA: 88 },
  { m: "Oct'24", NVDA: 110, AAPL: 103, MSFT: 99, META: 106, TSLA: 95 },
  { m: "Nov'24", NVDA: 118, AAPL: 107, MSFT: 103, META: 112, TSLA: 115 },
  { m: "Dec'24", NVDA: 112, AAPL: 110, MSFT: 105, META: 118, TSLA: 135 },
  { m: "Jan'25", NVDA: 108, AAPL: 108, MSFT: 102, META: 125, TSLA: 140 },
  { m: "Feb'25", NVDA: 98, AAPL: 106, MSFT: 97, META: 130, TSLA: 120 },
  { m: "Mar'25", NVDA: 92, AAPL: 104, MSFT: 95, META: 122, TSLA: 105 },
  { m: "Apr'25", NVDA: 88, AAPL: 100, MSFT: 92, META: 118, TSLA: 100 },
  { m: "May'25", NVDA: 105, AAPL: 108, MSFT: 100, META: 128, TSLA: 115 },
  { m: "Jun'25", NVDA: 115, AAPL: 112, MSFT: 106, META: 135, TSLA: 130 },
];
const perfColors = { NVDA: C.gold, AAPL: "#4a6d8c", MSFT: C.green, META: "#7a6f9b", TSLA: "#b07156" };
const perfReturns = Object.keys(perfColors).map(t => ({ ticker: t, ret: perfData[perfData.length - 1][t] - 100 }));

const PerfChart = () => {
  const [active, setActive] = useState({ NVDA: true, AAPL: true, MSFT: true, META: true, TSLA: true });
  const toggle = (t) => setActive(p => ({ ...p, [t]: !p[t] }));
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, padding: "18px 22px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 3 }}>06 — Trailing 12M Price Performance</div>
          <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3 }}>Indexed to 100 — Click tickers to toggle</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {perfReturns.map(({ ticker, ret }) => (
            <button key={ticker} onClick={() => toggle(ticker)} style={{ background: active[ticker] ? "rgba(200,169,110,0.06)" : "transparent", border: `1px solid ${active[ticker] ? perfColors[ticker] : C.borderS}`, padding: "3px 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, opacity: active[ticker] ? 1 : 0.4, transition: "all 0.2s" }}>
              <div style={{ width: 6, height: 6, borderRadius: 1, background: perfColors[ticker] }} />
              <span style={{ fontFamily: F.mono, fontSize: 8, color: active[ticker] ? C.t1 : C.t3 }}>{ticker}</span>
              <span style={{ fontFamily: F.mono, fontSize: 8, color: ret >= 0 ? C.green : C.red }}>{ret >= 0 ? "+" : ""}{ret}%</span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={perfData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="m" tick={{ fill: C.t3, fontSize: 8, fontFamily: F.mono }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.t3, fontSize: 8, fontFamily: F.mono }} axisLine={false} tickLine={false} domain={[70, 160]} />
            <ReferenceLine y={100} stroke={C.t3} strokeDasharray="3 3" strokeOpacity={0.5} />
            <Tooltip content={({ active: a, payload, label }) => {
              if (!a || !payload) return null;
              return (
                <div style={{ background: C.card, border: `1px solid ${C.goldDim}`, padding: "8px 12px", fontSize: 10, fontFamily: F.mono }}>
                  <div style={{ color: C.t3, marginBottom: 4 }}>{label}</div>
                  {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{p.value > 100 ? "+" : ""}{(p.value - 100).toFixed(0)}%</strong></div>)}
                </div>
              );
            }} />
            {Object.entries(perfColors).map(([t, color]) => active[t] && (
              <Line key={t} type="monotone" dataKey={t} stroke={color} strokeWidth={t === "NVDA" ? 2.5 : 1.5} dot={false} name={t} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// Big Tech M&A Comps — LTM from latest 10-K/10-Q filings (as of mid-2025)
// MSFT: FY24 10-K (Jun'24), GOOGL: FY24 10-K (Dec'24), META: FY24 10-K (Dec'24), AAPL: FY24 10-K (Sep'24), AMZN: FY24 10-K (Dec'24)
const compData = [
  { ticker: "MSFT", name: "Microsoft", ev: 3080, rev: 245.1, ebitda: 125.6, ni: 88.1, evRev: 12.6, evEbitda: 24.5, pe: 35.0, margin: 51.3, growth: 16 },
  { ticker: "GOOGL", name: "Alphabet", ev: 2150, rev: 339.9, ebitda: 112.4, ni: 100.7, evRev: 6.3, evEbitda: 19.1, pe: 21.3, margin: 33.1, growth: 14 },
  { ticker: "META", name: "Meta", ev: 1520, rev: 164.5, ebitda: 72.4, ni: 62.4, evRev: 9.2, evEbitda: 21.0, pe: 24.4, margin: 44.0, growth: 22 },
  { ticker: "AAPL", name: "Apple", ev: 3380, rev: 391.0, ebitda: 134.7, ni: 93.7, evRev: 8.6, evEbitda: 25.1, pe: 36.1, margin: 34.4, growth: 2 },
  { ticker: "AMZN", name: "Amazon", ev: 2020, rev: 637.8, ebitda: 115.3, ni: 59.2, evRev: 3.2, evEbitda: 17.5, pe: 34.1, margin: 18.1, growth: 12 },
];
const compMedian = (key) => { const sorted = [...compData].map(d => d[key]).sort((a, b) => a - b); const m = Math.floor(sorted.length / 2); return sorted.length % 2 ? sorted[m] : +((sorted[m - 1] + sorted[m]) / 2).toFixed(1); };

// Tesla Sensitivity — EV/share across WACC & terminal growth scenarios
// Base case: FY25E rev $113B, 16% FCF margin, 5yr projection
const TeslaSens = () => {
  const waccs = [9, 10, 11, 12, 13];
  const tgrs = [2.0, 2.5, 3.0, 3.5, 4.0];
  const baseRev = 113, fcfMg = 0.16, growthRate = 0.20, shares = 3.21;
  const calcEVPerShare = (w, g) => {
    let r = baseRev, pv = 0;
    for (let i = 1; i <= 5; i++) { r *= (1 + growthRate); const fcf = r * fcfMg; pv += fcf / Math.pow(1 + w / 100, i); }
    const tv = (r * fcfMg * (1 + g / 100)) / (w / 100 - g / 100);
    return Math.round((pv + tv / Math.pow(1 + w / 100, 5)) / shares);
  };
  const baseW = 2, baseG = 2; // index for 11% WACC, 3.0% TGR
  const [h, setH] = useState(null);
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Target size={12} style={{ color: C.gold }} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.1em" }}>05 — TESLA SENSITIVITY ANALYSIS</span>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t3 }}>Implied Price/Share — Base: Rev $113B, 16% FCF Margin, 20% Growth</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            <th style={{ padding: "9px 12px", fontFamily: F.mono, fontSize: 8, color: C.t3, background: "#0d0e12", textAlign: "center" }}>WACC \ TGR</th>
            {tgrs.map(g => <th key={g} style={{ padding: "9px 12px", fontFamily: F.mono, fontSize: 10, color: C.gold, background: "#0d0e12", textAlign: "center" }}>{g}%</th>)}
          </tr></thead>
          <tbody>{waccs.map((w, wi) => (
            <tr key={w}>
              <td style={{ padding: "9px 12px", fontFamily: F.mono, fontSize: 10, color: C.gold, background: "#0d0e12", textAlign: "center" }}>{w}%</td>
              {tgrs.map((g, gi) => {
                const val = calcEVPerShare(w, g);
                const isBase = wi === baseW && gi === baseG;
                const k = `${wi}${gi}`;
                return (
                  <td key={g} onMouseEnter={() => setH(k)} onMouseLeave={() => setH(null)} style={{
                    padding: "9px 12px", fontFamily: F.mono, fontSize: 11, textAlign: "center",
                    color: isBase ? C.gold : h === k ? C.t1 : C.t2,
                    background: isBase ? "rgba(200,169,110,0.08)" : h === k ? "rgba(200,169,110,0.04)" : "transparent",
                    fontWeight: isBase ? 600 : 400, cursor: "crosshair", transition: "all 0.15s",
                    border: isBase ? "1px solid rgba(200,169,110,0.2)" : "1px solid rgba(255,255,255,0.02)",
                  }}>${val}</td>
                );
              })}
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0, borderTop: "1px solid rgba(200,169,110,0.08)" }}>
        {[["Base Case", `$${calcEVPerShare(11, 3)}`], ["Bull Case", `$${calcEVPerShare(9, 4)}`], ["Bear Case", `$${calcEVPerShare(13, 2)}`], ["Current Price", "$341"]].map(([l, v], i) => (
          <div key={l} style={{ padding: "10px 14px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none", textAlign: "center" }}>
            <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
            <div style={{ fontFamily: F.mono, fontSize: 13, color: l === "Bear Case" ? C.red : l === "Bull Case" ? C.green : C.gold, fontWeight: 500 }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// AI Sector Revenue Growth — exact annual revenue from 10-K filings ($B)
// NVDA: fiscal yr ends Jan (FY21=Jan'21), PLTR: cal yr, CRWD: fiscal yr ends Jan, SNOW: fiscal yr ends Jan, NOW: cal yr
const aiCompanies = [
  { ticker: "NVDA", name: "NVIDIA", color: C.gold, rev: [16.68, 26.91, 26.97, 60.92, 130.50], margin: 55, cagr: 67 },
  { ticker: "PLTR", name: "Palantir", color: C.green, rev: [1.09, 1.54, 1.91, 2.23, 2.87], margin: 15, cagr: 27 },
  { ticker: "CRWD", name: "CrowdStrike", color: "#7a6f9b", rev: [0.87, 1.45, 2.24, 3.06, 3.95], margin: 20, cagr: 46 },
  { ticker: "SNOW", name: "Snowflake", color: "#4a6d8c", rev: [0.59, 1.22, 2.07, 2.81, 3.43], margin: -6, cagr: 55 },
  { ticker: "NOW", name: "ServiceNow", color: "#b07156", rev: [4.93, 5.90, 7.25, 8.97, 10.98], margin: 27, cagr: 22 },
];
const aiYears = ["FY21", "FY22", "FY23", "FY24", "FY25"];
const aiChartData = aiYears.map((yr, i) => {
  const row = { year: yr };
  aiCompanies.forEach(c => { row[c.ticker] = c.rev[i]; });
  return row;
});

const AISectorComp = () => {
  const [view, setView] = useState("rev"); // rev or indexed
  const indexedData = aiYears.map((yr, i) => {
    const row = { year: yr };
    aiCompanies.forEach(c => { row[c.ticker] = Math.round((c.rev[i] / c.rev[0]) * 100); });
    return row;
  });
  const data = view === "rev" ? aiChartData : indexedData;

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Cpu size={12} style={{ color: C.gold }} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.1em" }}>09 — AI SECTOR REVENUE GROWTH</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[["rev", "Revenue ($B)"], ["indexed", "Indexed (Base=100)"]].map(([k, l]) => (
            <button key={k} onClick={() => setView(k)} style={{ background: view === k ? C.goldGlow : "transparent", border: `1px solid ${view === k ? C.goldDim : C.borderS}`, color: view === k ? C.gold : C.t3, padding: "3px 10px", fontSize: 9, fontFamily: F.mono, cursor: "pointer" }}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: "18px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginBottom: 12 }}>
          {aiCompanies.map(c => (
            <div key={c.ticker} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 8, height: 3, background: c.color, borderRadius: 1 }} />
              <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t2 }}>{c.ticker}</span>
            </div>
          ))}
        </div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="year" tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} unit={view === "rev" ? "B" : ""} />
              {view === "indexed" && <ReferenceLine y={100} stroke={C.t3} strokeDasharray="3 3" strokeOpacity={0.5} />}
              <Tooltip content={({ active, payload, label }) => {
                if (!active || !payload) return null;
                return (
                  <div style={{ background: C.card, border: `1px solid ${C.goldDim}`, padding: "8px 12px", fontSize: 10, fontFamily: F.mono }}>
                    <div style={{ color: C.t3, marginBottom: 4 }}>{label}</div>
                    {payload.map((p, i) => <div key={i} style={{ color: p.color }}>{p.name}: <strong>{view === "rev" ? `$${p.value}B` : p.value}</strong></div>)}
                  </div>
                );
              }} />
              {aiCompanies.map(c => (
                <Line key={c.ticker} type="monotone" dataKey={c.ticker} stroke={c.color} strokeWidth={c.ticker === "NVDA" ? 2.5 : 1.5} dot={{ fill: c.color, r: 2.5 }} name={c.ticker} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div style={{ overflowX: "auto", borderTop: "1px solid rgba(200,169,110,0.08)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            <th style={{ padding: "8px 12px", fontFamily: F.mono, fontSize: 9, color: C.gold, textAlign: "left", background: "#0d0e12" }}>Company</th>
            <th style={{ padding: "8px 12px", fontFamily: F.mono, fontSize: 9, color: C.gold, textAlign: "center", background: "#0d0e12" }}>FY25 Rev</th>
            <th style={{ padding: "8px 12px", fontFamily: F.mono, fontSize: 9, color: C.gold, textAlign: "center", background: "#0d0e12" }}>4Y CAGR</th>
            <th style={{ padding: "8px 12px", fontFamily: F.mono, fontSize: 9, color: C.gold, textAlign: "center", background: "#0d0e12" }}>Op Margin</th>
            <th style={{ padding: "8px 12px", fontFamily: F.mono, fontSize: 9, color: C.gold, textAlign: "center", background: "#0d0e12" }}>AI Focus</th>
          </tr></thead>
          <tbody>
            {aiCompanies.map(c => (
              <tr key={c.ticker}>
                <td style={{ padding: "7px 12px", fontFamily: F.mono, fontSize: 11, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <span style={{ color: c.color, fontWeight: 600 }}>{c.ticker}</span> <span style={{ color: C.t3, fontSize: 9 }}>{c.name}</span>
                </td>
                <td style={{ padding: "7px 12px", fontFamily: F.mono, fontSize: 11, textAlign: "center", color: C.t1, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>${c.rev[4]}B</td>
                <td style={{ padding: "7px 12px", fontFamily: F.mono, fontSize: 11, textAlign: "center", color: c.cagr >= 40 ? C.green : C.t2, fontWeight: c.cagr >= 40 ? 600 : 400, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{c.cagr}%</td>
                <td style={{ padding: "7px 12px", fontFamily: F.mono, fontSize: 11, textAlign: "center", color: c.margin >= 0 ? C.t1 : C.red, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{c.margin}%</td>
                <td style={{ padding: "7px 12px", fontFamily: F.mono, fontSize: 9, textAlign: "center", color: C.t2, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  {{ NVDA: "AI Chips / GPU", PLTR: "Enterprise AI", CRWD: "AI Security", SNOW: "AI Data Cloud", NOW: "AI Workflows" }[c.ticker]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Merger Accretion/Dilution — Microsoft acquiring a SaaS target
const AccretionDilution = () => {
  const [premium, setPremium] = useState(30); // % premium to current price
  const [pctCash, setPctCash] = useState(50); // % cash vs stock
  const [synergies, setSynergies] = useState(500); // $M annual cost synergies
  const [targetSel, setTargetSel] = useState("DDOG");

  const targets = {
    DDOG: { name: "Datadog", price: 130, shares: 330, eps: 1.55, ni: 511 },
    NET: { name: "Cloudflare", price: 115, shares: 340, eps: 0.73, ni: 248 },
    CRWD: { name: "CrowdStrike", price: 350, shares: 245, eps: 3.50, ni: 858 },
  };

  const acquirer = { name: "Microsoft", price: 449, shares: 7430, eps: 13.11, ni: 97400, costOfDebt: 4.5, taxRate: 18 };
  const t = targets[targetSel];

  const offerPrice = t.price * (1 + premium / 100);
  const dealValue = offerPrice * t.shares; // $M
  const cashPortion = dealValue * (pctCash / 100);
  const stockPortion = dealValue * (1 - pctCash / 100);
  const newShares = stockPortion / acquirer.price; // M shares issued
  const totalShares = acquirer.shares + newShares;

  const interestCost = cashPortion * (acquirer.costOfDebt / 100) * (1 - acquirer.taxRate / 100);
  const synAfterTax = synergies * (1 - acquirer.taxRate / 100);
  const combinedNI = acquirer.ni + t.ni + synAfterTax - interestCost;
  const proFormaEPS = combinedNI / totalShares;
  const accretion = ((proFormaEPS - acquirer.eps) / acquirer.eps) * 100;
  const isAccretive = accretion >= 0;

  // Build scenario data for chart
  const scenarioData = [-20, -10, 0, 10, 20, 30, 40, 50].map(prem => {
    const op = t.price * (1 + prem / 100);
    const dv = op * t.shares;
    const cp = dv * (pctCash / 100);
    const sp = dv * (1 - pctCash / 100);
    const ns = sp / acquirer.price;
    const ts = acquirer.shares + ns;
    const ic = cp * (acquirer.costOfDebt / 100) * (1 - acquirer.taxRate / 100);
    const cni = acquirer.ni + t.ni + synAfterTax - ic;
    const pfe = cni / ts;
    const acc = ((pfe - acquirer.eps) / acquirer.eps) * 100;
    return { premium: `${prem}%`, accretion: +acc.toFixed(2), fill: acc >= 0 ? C.green : C.red };
  });

  const selStyle = { background: C.card, border: `1px solid ${C.goldDim}`, color: C.gold, padding: "4px 8px", fontSize: 10, fontFamily: F.mono, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", borderRadius: 0, paddingRight: 18, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23c8a96e' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" };

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <GitMerge size={12} style={{ color: C.gold }} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.1em" }}>08 — M&A ACCRETION / DILUTION</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t3 }}>MSFT acquires</span>
          <select value={targetSel} onChange={e => setTargetSel(e.target.value)} style={selStyle}>
            {Object.entries(targets).map(([k, v]) => <option key={k} value={k} style={{ background: C.bg, color: C.t1 }}>{k} — {v.name}</option>)}
          </select>
        </div>
      </div>
      <div className="dcf-layout" style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
        <div style={{ padding: "16px 14px", borderRight: "1px solid rgba(200,169,110,0.08)" }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Deal Terms</div>
          <Slider label="Acquisition Premium" value={premium} set={setPremium} min={0} max={60} step={5} />
          <Slider label="Cash Consideration" value={pctCash} set={setPctCash} min={0} max={100} step={10} />
          <Slider label="Annual Synergies" value={synergies} set={setSynergies} min={0} max={2000} step={100} unit="M" />
          <div style={{ marginTop: 12, padding: "10px", background: C.bg, border: `1px solid ${C.borderS}` }}>
            <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Deal Structure</div>
            {[["Offer Price", `$${offerPrice.toFixed(0)}/sh`], ["Deal Value", `$${(dealValue / 1000).toFixed(1)}B`], ["Cash", `$${(cashPortion / 1000).toFixed(1)}B`], ["Stock", `$${(stockPortion / 1000).toFixed(1)}B`], ["New Shares", `${Math.round(newShares)}M`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${C.borderS}` }}>
                <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t2 }}>{l}</span>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.t1 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[
              ["Standalone EPS", `$${acquirer.eps.toFixed(2)}`, C.t1],
              ["Pro Forma EPS", `$${proFormaEPS.toFixed(2)}`, C.gold],
              ["Accretion", `${accretion >= 0 ? "+" : ""}${accretion.toFixed(1)}%`, isAccretive ? C.green : C.red],
              ["Verdict", isAccretive ? "ACCRETIVE ✓" : "DILUTIVE ✗", isAccretive ? C.green : C.red],
            ].map(([l, v, c]) => (
              <div key={l} style={{ background: C.bg, padding: "10px", border: `1px solid ${l === "Verdict" ? (isAccretive ? "rgba(91,138,114,0.3)" : "rgba(176,74,74,0.3)") : C.borderS}`, textAlign: "center" }}>
                <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                <div style={{ fontFamily: F.serif, fontSize: l === "Verdict" ? 16 : 22, fontWeight: l === "Verdict" ? 500 : 300, color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>EPS Accretion / Dilution by Premium Level</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="premium" tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} unit="%" />
                <ReferenceLine y={0} stroke={C.t3} strokeWidth={1} />
                <Tooltip content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = payload[0].payload;
                  return (
                    <div style={{ background: C.card, border: `1px solid ${C.goldDim}`, padding: "6px 10px", fontSize: 10, fontFamily: F.mono }}>
                      <div style={{ color: C.t3 }}>Premium: {d.premium}</div>
                      <div style={{ color: d.accretion >= 0 ? C.green : C.red }}>EPS Impact: {d.accretion >= 0 ? "+" : ""}{d.accretion}%</div>
                    </div>
                  );
                }} />
                <Bar dataKey="accretion" radius={[2, 2, 0, 0]}>
                  {scenarioData.map((d, i) => <Cell key={i} fill={d.accretion >= 0 ? C.green : C.red} fillOpacity={0.6} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 8, padding: "8px 10px", background: C.bg, border: `1px solid ${C.borderS}` }}>
            <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.08em", marginBottom: 4 }}>BOARD RECOMMENDATION</div>
            <div style={{ fontSize: 11, color: C.t2, lineHeight: 1.6 }}>
              At a {premium}% premium ({pctCash}% cash / {100 - pctCash}% stock), the acquisition of {t.name} is <strong style={{ color: isAccretive ? C.green : C.red }}>{isAccretive ? "accretive" : "dilutive"}</strong> to MSFT EPS by {Math.abs(accretion).toFixed(1)}% in Year 1, assuming ${synergies}M in annual synergies. {isAccretive ? "The deal creates shareholder value and is recommended for approval." : "The deal destroys near-term EPS. Consider renegotiating terms or increasing synergy targets."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// LBO Model — PE acquisition of mid-cap SaaS ($5B EV, Datadog/Cloudflare profile)
const LBOModel = () => {
  const [entryMult, setEntryMult] = useState(20); // EV/EBITDA entry
  const [exitMult, setExitMult] = useState(22);
  const [leverage, setLeverage] = useState(50); // % debt
  const [rate, setRate] = useState(7); // interest rate
  const [ebitdaGr, setEbitdaGr] = useState(15); // annual EBITDA growth
  const [exitYr, setExitYr] = useState(5);

  const baseEBITDA = 250; // $250M base EBITDA
  const entryEV = baseEBITDA * entryMult;
  const debtAmt = entryEV * (leverage / 100);
  const equityAmt = entryEV - debtAmt;

  // Build year-by-year schedule
  const schedule = [];
  let debt = debtAmt;
  let ebitda = baseEBITDA;
  for (let y = 0; y <= exitYr; y++) {
    if (y > 0) ebitda = ebitda * (1 + ebitdaGr / 100);
    const interest = y > 0 ? debt * (rate / 100) : 0;
    const fcf = y > 0 ? ebitda * 0.40 - interest : 0; // 40% FCF conversion
    const repay = y > 0 ? Math.min(Math.max(fcf * 0.7, 0), debt) : 0;
    if (y > 0) debt = Math.max(debt - repay, 0);
    schedule.push({ yr: y === 0 ? "Entry" : `Y${y}`, ebitda: Math.round(ebitda), debt: Math.round(debt), equity: 0, fcf: Math.round(fcf), interest: Math.round(interest) });
  }

  const exitEV = schedule[exitYr].ebitda * exitMult;
  const exitEquity = exitEV - schedule[exitYr].debt;
  const moic = exitEquity / equityAmt;
  const irr = (Math.pow(moic, 1 / exitYr) - 1) * 100;

  // Chart data for debt paydown
  const chartData = schedule.map((s, i) => ({ ...s, equityVal: i === exitYr ? Math.round(exitEquity) : null }));

  const selStyle = { background: C.card, border: `1px solid ${C.goldDim}`, color: C.gold, padding: "4px 8px", fontSize: 10, fontFamily: F.mono, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", borderRadius: 0, paddingRight: 18, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23c8a96e' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" };

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <DollarSign size={12} style={{ color: C.gold }} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.1em" }}>07 — LBO MODEL — MID-CAP SAAS ACQUISITION</span>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t3 }}>$250M EBITDA — PE Buyout Scenario</span>
      </div>
      <div className="dcf-layout" style={{ display: "grid", gridTemplateColumns: "260px 1fr" }}>
        <div style={{ padding: "16px 14px", borderRight: "1px solid rgba(200,169,110,0.08)" }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Deal Assumptions</div>
          <Slider label="Entry EV/EBITDA" value={entryMult} set={setEntryMult} min={10} max={35} step={0.5} unit="x" />
          <Slider label="Exit EV/EBITDA" value={exitMult} set={setExitMult} min={10} max={35} step={0.5} unit="x" />
          <Slider label="Leverage (Debt %)" value={leverage} set={setLeverage} min={20} max={70} step={5} />
          <Slider label="Interest Rate" value={rate} set={setRate} min={4} max={12} step={0.5} />
          <Slider label="EBITDA Growth" value={ebitdaGr} set={setEbitdaGr} min={0} max={30} />
          <Slider label="Exit Year" value={exitYr} set={setExitYr} min={3} max={7} step={1} unit="" />
          <div style={{ marginTop: 10, padding: "10px", background: C.bg, border: `1px solid ${C.borderS}` }}>
            <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Returns to Sponsor</div>
            {[["Entry EV", `$${(entryEV / 1000).toFixed(1)}B`], ["Equity Check", `$${Math.round(equityAmt)}M`], ["Exit EV", `$${(exitEV / 1000).toFixed(1)}B`], ["Exit Equity", `$${Math.round(exitEquity)}M`], ["MOIC", `${moic.toFixed(2)}x`], ["IRR", `${irr.toFixed(1)}%`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0", borderBottom: `1px solid ${C.borderS}` }}>
                <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t2 }}>{l}</span>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: l === "IRR" || l === "MOIC" ? C.gold : C.t1, fontWeight: l === "IRR" || l === "MOIC" ? 600 : 400 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ padding: "16px 18px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[["IRR", `${irr.toFixed(1)}%`, irr >= 20 ? C.green : irr >= 15 ? C.gold : C.red], ["MOIC", `${moic.toFixed(2)}x`, C.gold], ["Debt Paydown", `$${Math.round(debtAmt - schedule[exitYr].debt)}M`, C.green], ["Exit EV", `$${(exitEV / 1000).toFixed(1)}B`, C.t1]].map(([l, v, c]) => (
              <div key={l} style={{ background: C.bg, padding: "10px", border: `1px solid ${C.borderS}`, textAlign: "center" }}>
                <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                <div style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 300, color: c }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Debt Paydown Schedule ($M)</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="yr" tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload) return null;
                  const d = chartData.find(c => c.yr === label);
                  if (!d) return null;
                  return (
                    <div style={{ background: C.card, border: `1px solid ${C.goldDim}`, padding: "8px 12px", fontSize: 10, fontFamily: F.mono }}>
                      <div style={{ color: C.t3, marginBottom: 4 }}>{label}</div>
                      <div style={{ color: C.t2 }}>EBITDA: <strong>${d.ebitda}M</strong></div>
                      <div style={{ color: C.red }}>Debt: <strong>${d.debt}M</strong></div>
                      {d.fcf > 0 && <div style={{ color: C.green }}>FCF: <strong>${d.fcf}M</strong></div>}
                      {d.equityVal && <div style={{ color: C.gold }}>Exit Equity: <strong>${d.equityVal}M</strong></div>}
                    </div>
                  );
                }} />
                <Bar dataKey="debt" fill={C.red} fillOpacity={0.5} radius={[2, 2, 0, 0]} name="Debt" />
                <Bar dataKey="ebitda" fill={C.gold} fillOpacity={0.6} radius={[2, 2, 0, 0]} name="EBITDA" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 8, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr>
                {["Year", "EBITDA", "Interest", "FCF", "Debt"].map(h => <th key={h} style={{ padding: "5px 10px", fontFamily: F.mono, fontSize: 8, color: C.gold, textAlign: "center", background: "#0d0e12", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>)}
              </tr></thead>
              <tbody>{schedule.map((s, i) => (
                <tr key={i}>
                  <td style={{ padding: "4px 10px", fontFamily: F.mono, fontSize: 9, textAlign: "center", color: C.t2, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>{s.yr}</td>
                  <td style={{ padding: "4px 10px", fontFamily: F.mono, fontSize: 9, textAlign: "center", color: C.t1, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>${s.ebitda}M</td>
                  <td style={{ padding: "4px 10px", fontFamily: F.mono, fontSize: 9, textAlign: "center", color: C.red, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>${s.interest}M</td>
                  <td style={{ padding: "4px 10px", fontFamily: F.mono, fontSize: 9, textAlign: "center", color: C.green, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>${s.fcf}M</td>
                  <td style={{ padding: "4px 10px", fontFamily: F.mono, fontSize: 9, textAlign: "center", color: C.t2, borderBottom: "1px solid rgba(255,255,255,0.03)" }}>${s.debt}M</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const CompTable = () => {
  const [h, setH] = useState(null);
  const cols = [
    { key: "evRev", label: "EV/Rev", fmt: v => v.toFixed(1) + "x" },
    { key: "evEbitda", label: "EV/EBITDA", fmt: v => v.toFixed(1) + "x" },
    { key: "pe", label: "P/E", fmt: v => v.toFixed(1) + "x" },
    { key: "margin", label: "EBITDA %", fmt: v => v.toFixed(1) + "%" },
    { key: "growth", label: "Rev Gr %", fmt: v => v + "%" },
  ];
  const thS = { padding: "9px 12px", fontFamily: F.mono, fontSize: 9, color: C.gold, background: "#0d0e12", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.06)" };
  const tdS = (hl) => ({ padding: "9px 12px", fontFamily: F.mono, fontSize: 11, textAlign: "center", color: hl ? C.gold : C.t2, borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.15s" });
  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Target size={12} style={{ color: C.gold }} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.1em" }}>04 — M&A COMPARABLE COMPANIES</span>
        </div>
        <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t3 }}>Big Tech — LTM Multiples</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            <th style={{ ...thS, textAlign: "left", minWidth: 100 }}>Company</th>
            <th style={{ ...thS, minWidth: 80 }}>EV ($B)</th>
            <th style={{ ...thS, minWidth: 80 }}>Rev ($B)</th>
            {cols.map(c => <th key={c.key} style={thS}>{c.label}</th>)}
          </tr></thead>
          <tbody>
            {compData.map((d, i) => (
              <tr key={d.ticker} onMouseEnter={() => setH(i)} onMouseLeave={() => setH(null)} style={{ background: h === i ? "rgba(200,169,110,0.04)" : "transparent" }}>
                <td style={{ padding: "9px 12px", fontFamily: F.mono, fontSize: 11, textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                  <span style={{ color: C.gold, fontWeight: 600 }}>{d.ticker}</span> <span style={{ color: C.t3, fontSize: 9 }}>{d.name}</span>
                </td>
                <td style={tdS(false)}>{d.ev.toLocaleString()}</td>
                <td style={tdS(false)}>{d.rev}</td>
                {cols.map(c => <td key={c.key} style={tdS(false)}>{c.fmt(d[c.key])}</td>)}
              </tr>
            ))}
            <tr style={{ background: "rgba(200,169,110,0.06)" }}>
              <td style={{ padding: "9px 12px", fontFamily: F.mono, fontSize: 10, textAlign: "left", color: C.gold, fontWeight: 600, borderTop: `1px solid ${C.border}` }}>MEDIAN</td>
              <td style={{ ...tdS(true), borderTop: `1px solid ${C.border}` }}>{compMedian("ev").toLocaleString()}</td>
              <td style={{ ...tdS(true), borderTop: `1px solid ${C.border}` }}>{compMedian("rev")}</td>
              {cols.map(c => <td key={c.key} style={{ ...tdS(true), borderTop: `1px solid ${C.border}` }}>{c.fmt(compMedian(c.key))}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Slider = ({ label, value, set, min, max, step = 1, unit = "%" }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ fontSize: 10, color: C.t2, fontFamily: F.mono, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 13, color: C.gold, fontFamily: F.mono, fontWeight: 500 }}>{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value} onChange={e => set(+e.target.value)} style={{ width: "100%", height: 4, WebkitAppearance: "none", appearance: "none", background: `linear-gradient(to right, ${C.gold} ${((value - min) / (max - min)) * 100}%, ${C.cardH} ${((value - min) / (max - min)) * 100}%)`, borderRadius: 2, cursor: "pointer", outline: "none" }} />
  </div>
);

// Monte Carlo Revenue Forecasting Engine
const mcProfiles = {
  NVDA: { name: "NVIDIA", baseRev: 130.5, meanGr: 0.28, vol: 0.15, target: 300 },
  AAPL: { name: "Apple", baseRev: 391, meanGr: 0.05, vol: 0.06, target: 450 },
  META: { name: "Meta", baseRev: 164, meanGr: 0.18, vol: 0.12, target: 280 },
  TSLA: { name: "Tesla", baseRev: 97.7, meanGr: 0.20, vol: 0.25, target: 200 },
  MSFT: { name: "Microsoft", baseRev: 254, meanGr: 0.16, vol: 0.08, target: 400 },
};

const runMonteCarlo = (profile, numSims = 1000, years = 5) => {
  const { baseRev, meanGr, vol } = profile;
  const allPaths = [];
  const finalValues = [];
  for (let s = 0; s < numSims; s++) {
    let rev = baseRev;
    const path = [rev];
    for (let y = 0; y < years; y++) {
      const u1 = Math.random(), u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const gr = meanGr + vol * z;
      rev = rev * (1 + gr);
      path.push(Math.max(rev, 0));
    }
    allPaths.push(path);
    finalValues.push(path[years]);
  }
  const percentile = (arr, p) => { const s = [...arr].sort((a, b) => a - b); const i = Math.floor(s.length * p); return s[Math.min(i, s.length - 1)]; };
  const fan = [];
  for (let y = 0; y <= years; y++) {
    const vals = allPaths.map(p => p[y]);
    fan.push({
      year: y === 0 ? "Now" : `Y${y}`,
      p10: +percentile(vals, 0.1).toFixed(1),
      p25: +percentile(vals, 0.25).toFixed(1),
      p50: +percentile(vals, 0.5).toFixed(1),
      p75: +percentile(vals, 0.75).toFixed(1),
      p90: +percentile(vals, 0.9).toFixed(1),
    });
  }
  finalValues.sort((a, b) => a - b);
  const bucketCount = 20;
  const min = finalValues[0], max = finalValues[finalValues.length - 1];
  const step = (max - min) / bucketCount;
  const hist = [];
  for (let i = 0; i < bucketCount; i++) {
    const lo = min + i * step, hi = lo + step;
    const count = finalValues.filter(v => v >= lo && (i === bucketCount - 1 ? v <= hi : v < hi)).length;
    hist.push({ range: `$${Math.round(lo)}B`, count, lo: Math.round(lo), hi: Math.round(hi) });
  }
  return { fan, hist, finalValues, median: +percentile(finalValues, 0.5).toFixed(1), mean: +(finalValues.reduce((a, b) => a + b, 0) / finalValues.length).toFixed(1) };
};

const MonteCarloSim = () => {
  const [co, setCo] = useState("NVDA");
  const [vol, setVol] = useState(mcProfiles.NVDA.vol * 100);
  const [gr, setGr] = useState(mcProfiles.NVDA.meanGr * 100);
  const [seed, setSeed] = useState(0);

  const handleCo = (t) => {
    setCo(t);
    setVol(mcProfiles[t].vol * 100);
    setGr(mcProfiles[t].meanGr * 100);
    setSeed(s => s + 1);
  };

  const profile = { ...mcProfiles[co], meanGr: gr / 100, vol: vol / 100 };
  const result = (() => runMonteCarlo(profile))();
  const target = mcProfiles[co].target;
  const probHit = +((result.finalValues.filter(v => v >= target).length / result.finalValues.length) * 100).toFixed(0);

  const selStyle = { background: C.card, border: `1px solid ${C.goldDim}`, color: C.gold, padding: "4px 8px", fontSize: 10, fontFamily: F.mono, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", borderRadius: 0, paddingRight: 18, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23c8a96e' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" };

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Activity size={11} style={{ color: C.gold }} />
          <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold }}>MONTE CARLO REVENUE FORECAST</span>
          <span style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, marginLeft: 4 }}>1,000 SIMULATIONS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select value={co} onChange={e => handleCo(e.target.value)} style={selStyle}>
            {Object.entries(mcProfiles).map(([k, v]) => <option key={k} value={k} style={{ background: C.bg, color: C.t1 }}>{k} — {v.name}</option>)}
          </select>
          <button onClick={() => setSeed(s => s + 1)} style={{ background: C.goldGlow, border: `1px solid ${C.goldDim}`, color: C.gold, padding: "4px 10px", cursor: "pointer", fontSize: 9, fontFamily: F.mono }}>RE-RUN ↻</button>
        </div>
      </div>

      <div className="mc-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr", borderBottom: "1px solid rgba(200,169,110,0.08)" }}>
        <div style={{ padding: "18px 16px", borderRight: "1px solid rgba(200,169,110,0.08)" }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>Assumptions</div>
          <Slider label="Mean Growth Rate" value={gr} set={(v) => { setGr(v); setSeed(s => s + 1); }} min={0} max={40} step={1} />
          <Slider label="Volatility (σ)" value={vol} set={(v) => { setVol(v); setSeed(s => s + 1); }} min={2} max={40} step={1} />
          <div style={{ marginTop: 16, padding: "10px", background: C.bg, border: `1px solid ${C.borderS}` }}>
            <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Key Outputs</div>
            {[["Median FY+5", `$${result.median}B`], ["Mean FY+5", `$${result.mean}B`], [`P(Rev ≥ $${target}B)`, `${probHit}%`]].map(([l, v]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: `1px solid ${C.borderS}` }}>
                <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t2 }}>{l}</span>
                <span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "18px" }}>
          <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Revenue Fan Chart — Confidence Bands ($B)</div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={result.fan}>
                <defs>
                  <linearGradient id="mcOuter" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.08} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.02} /></linearGradient>
                  <linearGradient id="mcInner" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.18} /><stop offset="100%" stopColor={C.gold} stopOpacity={0.05} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="year" tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} unit="B" />
                <Tooltip content={({ active, payload, label }) => {
                  if (!active || !payload || !payload.length) return null;
                  const d = result.fan.find(f => f.year === label);
                  if (!d) return null;
                  return (
                    <div style={{ background: C.card, border: `1px solid ${C.goldDim}`, padding: "8px 12px", fontSize: 10, fontFamily: F.mono }}>
                      <div style={{ color: C.t3, marginBottom: 4 }}>{label}</div>
                      {[["P90", d.p90], ["P75", d.p75], ["P50 (Median)", d.p50], ["P25", d.p25], ["P10", d.p10]].map(([l, v]) => (
                        <div key={l} style={{ color: l.includes("50") ? C.gold : C.t2 }}>{l}: <strong>${v}B</strong></div>
                      ))}
                    </div>
                  );
                }} />
                <Area type="monotone" dataKey="p90" stroke="none" fill="url(#mcOuter)" />
                <Area type="monotone" dataKey="p75" stroke="none" fill="url(#mcInner)" />
                <Area type="monotone" dataKey="p25" stroke="none" fill={C.bg2} />
                <Area type="monotone" dataKey="p10" stroke="none" fill={C.bg2} />
                <Line type="monotone" dataKey="p90" stroke={C.gold} strokeWidth={1} strokeOpacity={0.25} dot={false} />
                <Line type="monotone" dataKey="p75" stroke={C.gold} strokeWidth={1} strokeOpacity={0.4} dot={false} />
                <Line type="monotone" dataKey="p50" stroke={C.gold} strokeWidth={2.5} dot={{ fill: C.gold, r: 3 }} />
                <Line type="monotone" dataKey="p25" stroke={C.gold} strokeWidth={1} strokeOpacity={0.4} dot={false} />
                <Line type="monotone" dataKey="p10" stroke={C.gold} strokeWidth={1} strokeOpacity={0.25} dot={false} />
                <ReferenceLine y={target} stroke={C.green} strokeDasharray="5 5" strokeWidth={1} label={{ value: `Target $${target}B`, fill: C.green, fontSize: 9, fontFamily: F.mono, position: "right" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px" }}>
        <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>FY+5 Revenue Distribution — 1,000 Outcomes</div>
        <div style={{ height: 130 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.hist} barSize={Math.max(8, Math.floor(600 / result.hist.length))}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" tick={{ fill: C.t3, fontSize: 7, fontFamily: F.mono }} axisLine={false} tickLine={false} interval={2} />
              <YAxis tick={{ fill: C.t3, fontSize: 8, fontFamily: F.mono }} axisLine={false} tickLine={false} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: C.card, border: `1px solid ${C.goldDim}`, padding: "6px 10px", fontSize: 10, fontFamily: F.mono }}>
                    <div style={{ color: C.t2 }}>${d.lo}B – ${d.hi}B</div>
                    <div style={{ color: C.gold }}>{d.count} simulations ({((d.count / 1000) * 100).toFixed(1)}%)</div>
                  </div>
                );
              }} />
              <ReferenceLine x={result.hist.find(h => h.lo <= target && h.hi >= target)?.range} stroke={C.green} strokeDasharray="4 4" />
              <Bar dataKey="count" radius={[2, 2, 0, 0]} fill={C.gold} fillOpacity={0.6} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
          {[["P10", result.fan[5]?.p10], ["P25", result.fan[5]?.p25], ["Median", result.fan[5]?.p50], ["P75", result.fan[5]?.p75], ["P90", result.fan[5]?.p90]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: F.mono, fontSize: 7, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
              <div style={{ fontFamily: F.mono, fontSize: 12, color: l === "Median" ? C.gold : C.t2, fontWeight: l === "Median" ? 600 : 400 }}>${v}B</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const dcfProfiles = {
  NVDA: { name: "NVIDIA", rev: 130.5, gr: 28, mg: 38, wacc: 11.2, tg: 3.5 },
  AAPL: { name: "Apple", rev: 391, gr: 5, mg: 26, wacc: 9.5, tg: 2.5 },
  META: { name: "Meta", rev: 164, gr: 18, mg: 33, wacc: 10.5, tg: 3.0 },
  TSLA: { name: "Tesla", rev: 97, gr: 20, mg: 16, wacc: 12.0, tg: 3.0 },
  MSFT: { name: "Microsoft", rev: 254, gr: 16, mg: 34, wacc: 9.8, tg: 3.0 },
};

const DCFCalc = () => {
  const [co, setCo] = useState("NVDA");
  const p = dcfProfiles[co];
  const [rev, setRev] = useState(p.rev);
  const [gr, setGr] = useState(p.gr);
  const [mg, setMg] = useState(p.mg);
  const [wacc, setWacc] = useState(p.wacc);
  const [tg, setTg] = useState(p.tg);

  const handleCo = (t) => { setCo(t); const d = dcfProfiles[t]; setRev(d.rev); setGr(d.gr); setMg(d.mg); setWacc(d.wacc); setTg(d.tg); };

  const res = (() => {
    let r = rev, pv = 0, fcfs = [];
    for (let i = 1; i <= 5; i++) { r *= (1 + gr / 100); const fcf = r * (mg / 100); const d = fcf / Math.pow(1 + wacc / 100, i); pv += d; fcfs.push({ yr: `Y${i}`, pv: +d.toFixed(1), fcf: +fcf.toFixed(1) }); }
    const tv = (r * (mg / 100) * (1 + tg / 100)) / (wacc / 100 - tg / 100);
    const pvTV = tv / Math.pow(1 + wacc / 100, 5);
    return { fcfs, tv: Math.round(tv), pvTV: Math.round(pvTV), ev: Math.round(pv + pvTV), pv: Math.round(pv) };
  })();

  const selStyle = { background: C.card, border: `1px solid ${C.goldDim}`, color: C.gold, padding: "4px 8px", fontSize: 10, fontFamily: F.mono, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", borderRadius: 0, paddingRight: 18, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23c8a96e' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" };

  return (
    <div style={{ background: C.bg2, border: `1px solid ${C.borderS}`, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Calculator size={11} style={{ color: C.gold }} /><span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold }}>DCF VALUATION</span></div>
        <select value={co} onChange={e => handleCo(e.target.value)} style={selStyle}>
          {Object.entries(dcfProfiles).map(([k, v]) => <option key={k} value={k} style={{ background: C.bg, color: C.t1 }}>{k} — {v.name}</option>)}
        </select>
      </div>
      <div className="dcf-layout" style={{ display: "grid", gridTemplateColumns: "300px 1fr" }}>
        <div style={{ padding: "22px 18px", borderRight: "1px solid rgba(200,169,110,0.08)" }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Assumptions (editable)</div>
          <Slider label="Base Revenue" value={rev} set={setRev} min={20} max={700} step={1} unit="B" />
          <Slider label="Revenue Growth" value={gr} set={setGr} min={0} max={40} />
          <Slider label="FCF Margin" value={mg} set={setMg} min={5} max={50} />
          <Slider label="WACC" value={wacc} set={setWacc} min={5} max={20} step={0.1} />
          <Slider label="Terminal Growth" value={tg} set={setTg} min={1} max={5} step={0.5} />
        </div>
        <div style={{ padding: "22px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase" }}>Enterprise Value</span>
            <span style={{ fontFamily: F.serif, fontSize: 28, fontWeight: 300, color: C.gold }}>${res.ev.toLocaleString()}B</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
            {[["PV of FCFs", `$${res.pv.toLocaleString()}B`], ["Terminal Val", `$${res.tv.toLocaleString()}B`], ["PV of TV", `$${res.pvTV.toLocaleString()}B`]].map(([l, v]) => (
              <div key={l} style={{ background: C.bg, padding: "9px 10px", border: `1px solid ${C.borderS}` }}>
                <div style={{ fontFamily: F.mono, fontSize: 8, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>{l}</div>
                <div style={{ fontFamily: F.mono, fontSize: 12, color: C.t1 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ height: 150 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={res.fcfs} barSize={22}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="yr" tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} />
                <Tooltip content={<Tip />} />
                <Bar dataKey="pv" fill={C.gold} radius={[2, 2, 0, 0]} name="PV of FCF" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditableCell = ({ cellKey, value, onSave, locked }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value));
  const inputRef = useRef(null);

  useEffect(() => { if (!editing) setDraft(String(value)); }, [value, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    const num = Number(draft);
    if (!isNaN(num) && draft !== "") onSave(cellKey, num);
    setEditing(false);
  };

  const isPct = cellKey.startsWith("cogs") || cellKey.startsWith("opex") || cellKey.startsWith("tax");
  const display = isPct ? value + "%" : Number(value).toLocaleString();

  if (locked) {
    return (
      <td style={{
        padding: "5px 14px", fontFamily: F.mono, fontSize: 11, textAlign: "right",
        color: C.t2, background: "transparent", borderBottom: "1px solid rgba(255,255,255,0.03)",
      }}>{display}</td>
    );
  }

  if (!editing) {
    return (
      <td
        onClick={() => { setDraft(String(value)); setEditing(true); }}
        style={{
          padding: "5px 14px", fontFamily: F.mono, fontSize: 11, textAlign: "right",
          color: C.t1, background: "rgba(200,169,110,0.05)", cursor: "pointer",
          borderBottom: "1px solid rgba(255,255,255,0.03)",
        }}
      >
        {display}
      </td>
    );
  }

  return (
    <td
      style={{
        padding: "0px 14px", fontFamily: F.mono, fontSize: 11, textAlign: "right",
        color: C.gold, background: "rgba(200,169,110,0.1)",
        borderBottom: "1px solid rgba(255,255,255,0.03)",
        outline: `1px solid ${C.gold}`,
      }}
    >
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") { setDraft(String(value)); setEditing(false); }
        }}
        style={{
          width: "100%", height: 30, background: "transparent", border: "none",
          color: C.gold, textAlign: "right", fontFamily: F.mono, fontSize: 11,
          outline: "none", padding: 0,
        }}
      />
    </td>
  );
};

// Live Income Statement — fetches from FMP API (SEC 10-K data)
const FMP_KEY = import.meta.env.VITE_FMP_KEY;
const FMP_BASE = "https://financialmodelingprep.com/stable/income-statement";
const ALLOWED_SYMBOLS = new Set(["NVDA","AAPL","META","TSLA","MSFT"]);
const FMP_URL = (sym) => {
  if (!ALLOWED_SYMBOLS.has(sym)) return null;
  return `${FMP_BASE}?symbol=${encodeURIComponent(sym)}&period=annual&limit=3&apikey=${FMP_KEY}`;
};
const incomeSymbols = { NVDA: "NVIDIA", AAPL: "Apple", META: "Meta", TSLA: "Tesla", MSFT: "Microsoft" };

const ExcelModel = () => {
  const [co, setCo] = useState("NVDA");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [histData, setHistData] = useState([]); // array of { fy, rev, cor, rd, sga, othInc, taxExp, opInc, preTax, ni }
  const [estCells, setEstCells] = useState({});
  const cacheRef = useRef({});

  const fetchData = async (sym) => {
    if (cacheRef.current[sym]) {
      applyData(cacheRef.current[sym]);
      return;
    }
    setLoading(true); setError(null);
    try {
      const url = FMP_URL(sym);
      if (!url) throw new Error("Invalid symbol");
      const res = await fetch(url);
      const json = await res.json();
      if (!json || json.length === 0 || json["Error Message"]) throw new Error("No data");
      // Sort oldest first, take last 2 as historical
      const sorted = [...json].sort((a, b) => a.fiscalYear - b.fiscalYear);
      const rows = sorted.map(d => ({
        fy: "FY" + d.fiscalYear,
        rev: Math.round(d.revenue / 1e6),
        cor: Math.round(d.costOfRevenue / 1e6),
        rd: Math.round(d.researchAndDevelopmentExpenses / 1e6),
        sga: Math.round(d.sellingGeneralAndAdministrativeExpenses / 1e6),
        othInc: Math.round(d.totalOtherIncomeExpensesNet / 1e6),
        taxExp: Math.round(d.incomeTaxExpense / 1e6),
        opInc: Math.round(d.operatingIncome / 1e6),
        preTax: Math.round(d.incomeBeforeTax / 1e6),
        ni: Math.round(d.netIncome / 1e6),
      }));
      cacheRef.current[sym] = rows;
      applyData(rows);
    } catch (e) { setError("Failed to load data"); setLoading(false); }
  };

  const applyData = (rows) => {
    setHistData(rows);
    // Derive estimate assumptions from last historical year
    const last = rows[rows.length - 1];
    const revGrDefault = rows.length >= 2 ? Math.round((rows[rows.length-1].rev / rows[rows.length-2].rev - 1) * 100) : 15;
    const corPct = Math.round(last.cor / last.rev * 100);
    const rdPct = +(last.rd / last.rev * 100).toFixed(1);
    const sgaPct = +(last.sga / last.rev * 100).toFixed(1);
    const taxPct = last.preTax > 0 ? Math.round(last.taxExp / last.preTax * 100) : 15;
    const othAvg = Math.round(rows.reduce((s, r) => s + r.othInc, 0) / rows.length);
    setEstCells({
      revGr1: revGrDefault, revGr2: Math.round(revGrDefault * 0.85), revGr3: Math.round(revGrDefault * 0.7),
      corPct1: corPct, corPct2: corPct, corPct3: Math.min(corPct + 1, 99),
      rdPct1: rdPct, rdPct2: rdPct, rdPct3: rdPct,
      sgaPct1: sgaPct, sgaPct2: sgaPct, sgaPct3: sgaPct,
      oth1: othAvg, oth2: othAvg, oth3: Math.round(othAvg * 0.8),
      tax1: taxPct, tax2: taxPct, tax3: taxPct,
    });
    setLoading(false);
  };

  useEffect(() => { fetchData(co); }, [co]);

  const saveEst = (key, val) => { const n = Number(val); if (!isNaN(n)) setEstCells(p => ({ ...p, [key]: n })); };

  // Compute estimate year values
  const getEstRev = (ei) => {
    const baseRev = histData.length > 0 ? histData[histData.length - 1].rev : 0;
    let r = baseRev;
    for (let j = 1; j <= ei; j++) r = r * (1 + (estCells[`revGr${j}`] || 0) / 100);
    return r;
  };
  const getEstCor = (ei) => getEstRev(ei) * ((estCells[`corPct${ei}`] || 0) / 100);
  const getEstRd = (ei) => getEstRev(ei) * ((estCells[`rdPct${ei}`] || 0) / 100);
  const getEstSga = (ei) => getEstRev(ei) * ((estCells[`sgaPct${ei}`] || 0) / 100);
  const getEstGp = (ei) => getEstRev(ei) - getEstCor(ei);
  const getEstOpInc = (ei) => getEstGp(ei) - getEstRd(ei) - getEstSga(ei);
  const getEstPreTax = (ei) => getEstOpInc(ei) + (estCells[`oth${ei}`] || 0);
  const getEstTax = (ei) => getEstPreTax(ei) * ((estCells[`tax${ei}`] || 0) / 100);
  const getEstNI = (ei) => getEstPreTax(ei) - getEstTax(ei);
  const f = (v) => Math.round(v).toLocaleString();
  const mgF = (num, den) => den ? ((num / den) * 100).toFixed(1) + "%" : "—";

  const selStyle = { background: C.card, border: "1px solid " + C.goldDim, color: C.gold, padding: "4px 8px", fontSize: 10, fontFamily: F.mono, cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none", borderRadius: 0, paddingRight: 18, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath fill='%23c8a96e' d='M0 2l4 4 4-4z'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 6px center" };
  const thS = { padding: "6px 14px", fontFamily: F.mono, fontSize: 9, textAlign: "right", background: "#0d0e12", borderBottom: "1px solid rgba(255,255,255,0.06)", minWidth: 80 };
  const tdS = { padding: "5px 14px", fontFamily: F.mono, fontSize: 11, textAlign: "right", borderBottom: "1px solid rgba(255,255,255,0.03)" };

  const estInput = (key, suffix) => (
    <input type="number" value={estCells[key] ?? ""} onChange={e => saveEst(key, e.target.value)}
      style={{ width: 44, background: "rgba(200,169,110,0.08)", border: "1px solid rgba(200,169,110,0.2)", color: C.gold, textAlign: "right", fontFamily: F.mono, fontSize: 10, padding: "2px 4px", outline: "none", borderRadius: 0 }} />
  );

  // Build column headers
  const histYrs = histData.map(d => d.fy);
  const estYrs = histData.length > 0 ? [1,2,3].map(i => "FY" + (parseInt(histData[histData.length-1].fy.replace("FY","")) + i) + "E") : ["E1","E2","E3"];
  const allYrs = [...histYrs, ...estYrs];

  const histCell = (val) => <td style={{ ...tdS, color: C.t2 }}>{f(val)}</td>;
  const estCell = (val, inputEl) => (
    <td style={{ ...tdS, color: C.t1 }}>
      <div>{f(val)}</div>
      <div style={{ marginTop: 2, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
        {inputEl}<span style={{ fontSize: 8, color: C.gold }}>%</span>
      </div>
    </td>
  );
  const estCellRaw = (val, inputEl) => (
    <td style={{ ...tdS, color: C.t1 }}>
      <div>{f(val)}</div>
      <div style={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>{inputEl}</div>
    </td>
  );

  const subStyle = (hl) => ({ ...tdS, color: hl ? C.gold : C.t1, fontWeight: 600, borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: hl ? "2px solid " + C.gold : "1px solid rgba(255,255,255,0.06)" });
  const mgStyle = (hl) => ({ ...tdS, fontSize: 9, color: hl ? C.gold : C.t3, fontStyle: "italic" });
  const lblStyle = (opts = {}) => ({ ...tdS, textAlign: "left", fontSize: opts.mg ? 9 : 10, color: opts.hl ? C.gold : opts.mg ? C.t3 : opts.sub ? C.t1 : C.t2, fontWeight: opts.sub || opts.hl ? 600 : opts.edit ? 500 : 400, fontStyle: opts.mg ? "italic" : "normal", borderTop: opts.sub || opts.hl ? "1px solid rgba(255,255,255,0.06)" : "none", borderBottom: opts.hl ? "2px solid " + C.gold : opts.sub ? "1px solid rgba(255,255,255,0.06)" : tdS.borderBottom });

  if (loading) return (
    <div style={{ background: C.bg2, border: "1px solid " + C.borderS, padding: 40, textAlign: "center" }}>
      <span style={{ fontFamily: F.mono, fontSize: 11, color: C.t3 }}>Loading 10-K data from SEC filings...</span>
    </div>
  );
  if (error) return (
    <div style={{ background: C.bg2, border: "1px solid " + C.borderS, padding: 40, textAlign: "center" }}>
      <span style={{ fontFamily: F.mono, fontSize: 11, color: C.red }}>{error}</span>
    </div>
  );

  return (
    <div style={{ background: C.bg2, border: "1px solid " + C.borderS, overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px", borderBottom: "1px solid rgba(200,169,110,0.08)", background: "#0d0e12" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><FileSpreadsheet size={12} style={{ color: C.gold }} /><span style={{ fontFamily: F.mono, fontSize: 10, color: C.gold }}>CONSOLIDATED STATEMENT OF INCOME ($M)</span></div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <select value={co} onChange={e => setCo(e.target.value)} style={selStyle}>
            {Object.entries(incomeSymbols).map(([k, v]) => <option key={k} value={k} style={{ background: C.bg, color: C.t1 }}>{k} — {v}</option>)}
          </select>
          <span style={{ fontSize: 8, color: C.t3, fontFamily: F.mono }}>SEC 10-K via API • Estimates editable</span>
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead><tr>
            <th style={{ ...thS, textAlign: "left", color: C.t3, width: 180 }}>Line Item</th>
            {allYrs.map((y, yi) => <th key={y} style={{ ...thS, color: yi < histData.length ? C.t3 : C.gold }}>{y}{yi >= histData.length ? " ✏" : ""}</th>)}
          </tr></thead>
          <tbody>
            {/* Revenue */}
            <tr>
              <td style={lblStyle({ edit: true })}>Revenue</td>
              {histData.map((d, i) => <td key={i} style={{ ...tdS, color: C.t2 }}>{f(d.rev)}</td>)}
              {[1,2,3].map(i => estCell(getEstRev(i), estInput(`revGr${i}`, "%")))}
            </tr>
            {/* Cost of Revenue */}
            <tr>
              <td style={lblStyle({ edit: true })}>Cost of Revenue</td>
              {histData.map((d, i) => <td key={i} style={{ ...tdS, color: C.t2 }}>{f(d.cor)}</td>)}
              {[1,2,3].map(i => estCell(getEstCor(i), estInput(`corPct${i}`, "%")))}
            </tr>
            {/* Gross Profit */}
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              <td style={lblStyle({ sub: true })}>Gross Profit</td>
              {histData.map((d, i) => <td key={i} style={subStyle(false)}>{f(d.rev - d.cor)}</td>)}
              {[1,2,3].map(i => <td key={i} style={subStyle(false)}>{f(getEstGp(i))}</td>)}
            </tr>
            <tr>
              <td style={lblStyle({ mg: true })}>Gross Margin</td>
              {histData.map((d, i) => <td key={i} style={mgStyle(false)}>{mgF(d.rev - d.cor, d.rev)}</td>)}
              {[1,2,3].map(i => <td key={i} style={mgStyle(false)}>{mgF(getEstGp(i), getEstRev(i))}</td>)}
            </tr>
            {/* R&D */}
            <tr>
              <td style={lblStyle({ edit: true })}>Research & Development</td>
              {histData.map((d, i) => <td key={i} style={{ ...tdS, color: C.t2 }}>{f(d.rd)}</td>)}
              {[1,2,3].map(i => estCell(getEstRd(i), estInput(`rdPct${i}`, "%")))}
            </tr>
            {/* SGA */}
            <tr>
              <td style={lblStyle({ edit: true })}>Sales, General & Admin</td>
              {histData.map((d, i) => <td key={i} style={{ ...tdS, color: C.t2 }}>{f(d.sga)}</td>)}
              {[1,2,3].map(i => estCell(getEstSga(i), estInput(`sgaPct${i}`, "%")))}
            </tr>
            {/* Operating Income */}
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              <td style={lblStyle({ sub: true })}>Operating Income</td>
              {histData.map((d, i) => <td key={i} style={subStyle(false)}>{f(d.opInc)}</td>)}
              {[1,2,3].map(i => <td key={i} style={subStyle(false)}>{f(getEstOpInc(i))}</td>)}
            </tr>
            <tr>
              <td style={lblStyle({ mg: true })}>Operating Margin</td>
              {histData.map((d, i) => <td key={i} style={mgStyle(false)}>{mgF(d.opInc, d.rev)}</td>)}
              {[1,2,3].map(i => <td key={i} style={mgStyle(false)}>{mgF(getEstOpInc(i), getEstRev(i))}</td>)}
            </tr>
            {/* Other Income */}
            <tr>
              <td style={lblStyle({ edit: true })}>Other Income / (Expense)</td>
              {histData.map((d, i) => <td key={i} style={{ ...tdS, color: C.t2 }}>{f(d.othInc)}</td>)}
              {[1,2,3].map(i => estCellRaw(estCells[`oth${i}`] || 0, estInput(`oth${i}`)))}
            </tr>
            {/* Pre-Tax Income */}
            <tr style={{ background: "rgba(255,255,255,0.02)" }}>
              <td style={lblStyle({ sub: true })}>Pre-Tax Income</td>
              {histData.map((d, i) => <td key={i} style={subStyle(false)}>{f(d.preTax)}</td>)}
              {[1,2,3].map(i => <td key={i} style={subStyle(false)}>{f(getEstPreTax(i))}</td>)}
            </tr>
            {/* Tax Rate */}
            <tr>
              <td style={lblStyle({ edit: true })}>Effective Tax Rate (%)</td>
              {histData.map((d, i) => <td key={i} style={{ ...tdS, color: C.t2 }}>{d.preTax > 0 ? Math.round(d.taxExp / d.preTax * 100) : 0}%</td>)}
              {[1,2,3].map(i => (
                <td key={i} style={{ ...tdS, color: C.t1 }}>
                  <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 2 }}>
                    {estInput(`tax${i}`)}<span style={{ fontSize: 8, color: C.gold }}>%</span>
                  </div>
                </td>
              ))}
            </tr>
            {/* Provision for Taxes */}
            <tr>
              <td style={lblStyle()}>Provision for Taxes</td>
              {histData.map((d, i) => <td key={i} style={{ ...tdS, color: C.t2 }}>{f(d.taxExp)}</td>)}
              {[1,2,3].map(i => <td key={i} style={{ ...tdS, color: C.t2 }}>{f(getEstTax(i))}</td>)}
            </tr>
            {/* Net Income */}
            <tr style={{ background: "rgba(200,169,110,0.06)" }}>
              <td style={lblStyle({ hl: true })}>Net Income</td>
              {histData.map((d, i) => <td key={i} style={subStyle(true)}>{f(d.ni)}</td>)}
              {[1,2,3].map(i => <td key={i} style={subStyle(true)}>{f(getEstNI(i))}</td>)}
            </tr>
            <tr>
              <td style={lblStyle({ mg: true, hl: true })}>Net Margin</td>
              {histData.map((d, i) => <td key={i} style={mgStyle(true)}>{mgF(d.ni, d.rev)}</td>)}
              {[1,2,3].map(i => <td key={i} style={mgStyle(true)}>{mgF(getEstNI(i), getEstRev(i))}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Ticker = () => {
  const items = ["NVIDIA DCF", "Meta FP&A", "Apple Capital Allocation", "M&A Comps", "Tesla Sensitivity", "Monte Carlo Simulation", "DCF Modeling", "Variance Analysis", "Python Automation", "Stochastic Forecasting"];
  return (
    <div style={{ overflow: "hidden", borderTop: `1px solid ${C.borderS}`, borderBottom: `1px solid ${C.borderS}`, padding: "12px 0", background: C.bg }}>
      <div style={{ display: "flex", width: "max-content", animation: "tick 30s linear infinite" }}>
        {[...items, ...items].map((t, i) => <span key={i} style={{ padding: "0 1.8rem", fontFamily: F.mono, fontSize: 10, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{t} <span style={{ color: C.gold, marginLeft: 6 }}>●</span></span>)}
      </div>
    </div>
  );
};

const articlesData = [
  { tag: "CASE STUDY", tagColor: C.gold, date: "Jan 2026", read: "10 min",
    img: "/articles/nvidia-dcf.jpg", title: "How NVIDIA Became a $3T Company: A DCF Breakdown",
    preview: "NVIDIA's revenue hit $130.5B in FY2025, up 114% YoY. Most people see AI hype. But when you build the DCF, the fundamentals largely support it. Here's the full breakdown.",
    body: [
      "In January 2023, NVIDIA was worth about $360 billion. By June 2024, it had crossed $3 trillion. By the end of 2025, it was above $4.5 trillion. That's a roughly 12x increase in under three years.",
      "Most people look at that trajectory and think 'AI hype.' And sure, momentum and narrative played a role. But when you actually sit down and build the DCF, something interesting happens. The fundamentals largely support it.",
      "NVIDIA's fiscal year 2025 revenue hit $130.5 billion, up 114% from the prior year. FY2024 was about $60.9 billion, and FY2023 was around $27 billion. The company roughly quintupled its top line in two years. That almost never happens to a company of this size.",
      "Data center revenue for fiscal 2025 was $115.2 billion, up 142% from a year ago. The data center segment now represents roughly 88% of total revenue, up from just 37% in FY2021. NVIDIA essentially rebuilt itself into a completely different company.",
      "Net income for FY2025 came in at $72.9 billion, up 145% year over year. Gross margins have been hovering around 75%, which is extraordinary for a company selling physical products. Most hardware companies operate in the 40-55% range. NVIDIA's margins look more like a software company.",
      "Here's how I'd structure the DCF. Revenue build: decompose by end market. Data center (training vs. inference), gaming, automotive, professional visualization. The split between training workloads and inference workloads is the key assumption for the next five years. Training demand drove the initial surge, but inference is where long-term revenue durability lives.",
      "Margin assumptions: NVIDIA's 75% gross margin is partially a function of having no real competition at scale. The question is whether AMD, Intel, and custom chips from Google (TPUs), Amazon (Trainium), and Microsoft (Maia) erode that position. In my base case, I model gross margins declining to 68-70% over five years. Bull case: 73%. Bear case: 62%.",
      "WACC: Given NVIDIA's beta and the risk-free rate environment, I use approximately 10-11%. Terminal value at a 3% terminal growth rate and 10.5% WACC represents about 60% of total enterprise value.",
      "At 30% revenue CAGR over five years, 70% gross margins, and 10.5% WACC, the implied enterprise value comes out to roughly $3.5-4 trillion. Broadly in line with where the stock traded for much of 2025.",
      "At 20% revenue CAGR with 65% margins and 11% WACC, the value drops to around $2-2.5 trillion. Still massive, but 35-40% downside from current levels.",
      "The key takeaway: even the most seemingly momentum-driven stock price stories can be grounded in fundamentals if you build the model right. The real skill is in the scenario analysis. What happens if data center growth decelerates? What if custom silicon captures 20% of the market? Each scenario has a quantifiable impact on valuation.",
      "Sources: NVIDIA SEC Filings FY2025 (sec.gov), NVIDIA FY2025 Full Year Revenue $130.5B (nvidianews.nvidia.com), MacroTrends NVIDIA Market Cap Historical Data, S&P Global Market Intelligence"
    ] },
  { tag: "CASE STUDY", tagColor: C.gold, date: "Dec 2025", read: "9 min",
    img: "/articles/working-capital.jpg", title: "How We Unlocked $12M in Trapped Cash That Nobody Knew Was There",
    preview: "A profitable, growing company kept drawing on its revolver. Nobody could explain where the cash was going. I built a 13-week forecast and found the answer in working capital.",
    body: [
      "This one started with a CFO asking a question that should have had a simple answer: \"We're profitable. We're growing. Why do we keep drawing on our revolver?\"",
      "The company was a mid-market industrial group with four business units across three countries. Revenue was growing at 8% a year. EBITDA margins were a respectable 14%. On paper, everything looked fine. But they were consistently tapping a $50M revolving credit facility, sometimes carrying $20M or more in outstanding balances.",
      "The first thing I did was map the cash conversion cycle for each business unit separately. And that's where the story got interesting.",
      "The aerospace division had a DSO of 52 days. Fine, that's normal for the industry. But the automotive aftermarket division? 78 days. The peer benchmark for that space is around 54 days. That's 24 extra days of cash sitting in receivables that had no business being there.",
      "On the payables side, the construction materials unit was paying suppliers in 22 days when their contracts said net 45. When I asked why, the AP team told me they'd been told years ago to \"keep suppliers happy.\" I checked the contracts. Only 2 out of 14 major suppliers even offered early payment discounts.",
      "For the automotive AR problem, I dug into the aging report and found that 30% of the receivables past 60 days were concentrated in just four accounts. We put a structured collection process in place with escalation triggers at 45, 60, and 75 days. DSO dropped from 78 to 58 within two quarters.",
      "For the construction AP issue, we simply stopped paying early on the 12 suppliers that offered no discount. That alone freed up about $4.2M.",
      "The total impact: the average revolver balance went from $18M to $6M in six months. That's roughly $300K a year in interest savings.",
      "Working capital optimization doesn't make headlines. But it hits free cash flow directly, and it's the kind of work that makes you invaluable to a finance team.",
      "Tools used: Excel (13-week cash flow model, working capital bridge), SQL (AR aging extraction), Power BI (real-time treasury dashboard)"
    ] },
  { tag: "MARKET VIEW", tagColor: C.green, date: "Jan 2026", read: "6 min",
    img: "/articles/ai-capex.jpg", title: "The AI CapEx Boom: Will Big Tech's $300B Bet Pay Off?",
    preview: "Amazon, Microsoft, Alphabet, and Meta are spending $300B+ on AI capex in 2025, accelerating to $665B in 2026. Here's whether the return math actually works.",
    body: [
      "Here's a number that should make every financial analyst sit up: Amazon, Microsoft, Alphabet, and Meta are expected to spend a combined $300 billion or more on capital expenditures in 2025, with the vast majority earmarked for AI infrastructure.",
      "And it's accelerating. At the high end of their guidance, the group would spend around $665 billion in 2026, a 74% jump. We're talking about four companies spending two-thirds of a trillion dollars in a single year.",
      "Amazon is leading with a projected $100 billion in capex for 2025, up from $83 billion in 2024. Microsoft follows with $80 billion. Alphabet committed $75 billion. For 2026, Amazon is looking at $200 billion, while Meta announced $115-135 billion.",
      "The bull case: AI compute demand is growing faster than supply. Every major enterprise is implementing AI. AWS and Azure are reporting accelerating revenue growth in AI services. NVIDIA's data center revenue grew 142% YoY, confirming somebody is buying all those GPUs.",
      "The bear case: Amazon is now looking at negative free cash flow of almost $17 billion in 2026 according to Morgan Stanley. Pivotal Research projects Alphabet's free cash flow to plummet almost 90% this year to $8.2 billion from $73.3 billion in 2025.",
      "Bank of America analysts note consensus AI capex estimates suggest spending will climb to 94% of operating cash flows in 2025 and 2026, up from 76% in 2024. These companies are essentially reinvesting everything they earn.",
      "The closest historical parallel is the fiber optic buildout of 1998-2001. Telecom companies spent hundreds of billions based on projections that internet traffic would continue doubling every 100 days. The infrastructure was eventually used, but the investors who funded it got wiped out.",
      "The key difference: the hyperscalers funding this buildout are immensely profitable core businesses that can absorb years of low returns. They won't go bankrupt. But their stock prices absolutely can compress if returns don't materialize for five to seven years instead of two to three.",
      "The metric to track: cloud revenue growth relative to capex growth. If cloud AI revenue grows faster than capex, the cycle is working. If capex outpaces revenue for more than two to three consecutive quarters, expect sentiment to shift hard.",
      "Sources: Lucidity Insights (lucidityinsights.com), CNBC Oct 2025 & Feb 2026, Yahoo Finance Feb 2026, Bank of America credit strategy note, IO Fund (io-fund.com)"
    ] },
  { tag: "MARKET VIEW", tagColor: C.green, date: "Dec 2025", read: "7 min",
    img: "/articles/fed-rates-ma.jpg", title: "Why the Fed's Rate Path Matters More Than You Think for M&A",
    preview: "In a 4.5% rate environment, the same deal that worked at 11x EBITDA now only works at 8-9x. Here's how rate uncertainty is freezing deal pipelines and what to watch.",
    body: [
      "If you work in corporate finance or anywhere near deal-making, the single most important variable in your models right now isn't revenue growth or EBITDA margins. It's the cost of debt.",
      "When a PE firm evaluates a target, the return math depends heavily on leverage cost. In a 4.5% fed funds environment, senior secured debt for an LBO might price at SOFR plus 400-500 bps, putting all-in cost at 8.5-9.5%. In a 3% environment, that same debt prices at 7-8%.",
      "That 150 basis point difference on a $500 million deal with 5x leverage represents roughly $37 million in incremental annual interest expense. Over a five-year hold, that's $185 million less cash for debt paydown, directly impacting equity returns.",
      "The practical effect: in a high-rate environment, PE firms can only pay 8-9x EBITDA for the same return profile that allowed 11-12x when rates were near zero. Sellers anchored on 2021 valuations are reluctant to accept the new math. The result is a deal activity freeze.",
      "It's not just the level of rates. It's the uncertainty. When the market keeps pricing in cuts that the Fed keeps delaying, deal teams build models assuming lower rates in years two and three, but current financing reflects today's higher rates. If cuts don't come, exit assumptions break down.",
      "If you're in FP&A at a potential acquisition target, understanding how rate expectations affect your valuation is critical. A CFO who can articulate how the company's FCF profile supports debt service at current rates makes the company a much more attractive target.",
      "If you're in corporate development, the most important scenario isn't the base case. It's the 'rates stay higher for longer' case. If the deal only works with rate cuts, you're making a macro bet disguised as a strategic acquisition.",
      "The analysts who can connect macro monetary policy to concrete financial model outputs are the ones who will stand out in any corporate finance interview in 2026.",
      "Sources: Federal Reserve FOMC Statements (federalreserve.gov), PitchBook M&A Deal Activity Reports, S&P LCD Leveraged Loan Market Snapshot, Bain Global PE Report 2025, Deloitte M&A Trends 2025"
    ] },
  { tag: "TECHNICAL", tagColor: "#7a6f9b", date: "Nov 2025", read: "10 min",
    img: "/articles/insurance-ipo.jpg", title: "Inside a $1.3B IPO: Due Diligence Lessons from the Insurance Sector",
    preview: "When a specialty insurance company prices its IPO at $1.3B, the prospectus tells one story. The due diligence process tells another. Here's what the process actually looks like.",
    body: [
      "Insurance IPOs are uniquely challenging because the core product is a promise to pay money in the future. Unlike a SaaS company where revenue is recognized on a subscription schedule, an insurer's profitability depends on estimates that won't be validated for years.",
      "The first thing you look at isn't revenue. It's reserves. Insurance companies set aside capital to cover expected future claims. If reserves are set too low, the company looks more profitable than it really is. If they're too high, the company is hiding profitability.",
      "In diligence, you pull the reserve development triangles going back at least seven years. These triangles show how initial reserve estimates compared to what was actually paid out. A company that consistently under-reserves is a red flag, regardless of how good the combined ratio looks.",
      "The combined ratio is the insurance equivalent of an operating margin. It's the sum of the loss ratio and the expense ratio. A combined ratio below 100% means the company is making money on underwriting. For a $1.3B IPO, you want to see consistently below 95% with improvement trajectory.",
      "Insurance companies hold massive investment portfolios because they collect premiums upfront and pay claims later. The 'float' between collection and payment is invested, and returns on that float can represent 30-40% of total earnings.",
      "During diligence, you model the investment portfolio by duration, credit quality, and asset class. A company stretching for yield by loading up on lower-rated bonds looks good in the current period but carries hidden risk.",
      "Here's where insurance IPO diligence diverges from every other sector. The financial statements depend on actuarial assumptions that are inherently subjective. Small changes in loss development factors or trend rates can move net income by 15-20%.",
      "A rigorous diligence process involves bringing in an independent actuary to re-run the reserves using their own assumptions. If the independent estimate is more than 5-10% higher than what the company has booked, that's a material finding that affects IPO pricing.",
      "Even if you never touch an insurance company, the framework transfers directly. Every company has estimates embedded in the financial statements that rest on assumptions. The discipline of pulling apart those assumptions and stress-testing them is exactly what separates good financial analysis from surface-level number crunching.",
      "Sources: A.M. Best Company (ambest.com), Casualty Actuarial Society (casact.org), SEC Regulation S-K (sec.gov), Insurance Information Institute (iii.org)"
    ] },
  { tag: "MARKET VIEW", tagColor: C.green, date: "Jan 2026", read: "8 min",
    img: "/articles/monte-carlo.jpg", title: "Monte Carlo vs. Straight-Line Forecasting: When to Use What",
    preview: "Every corporate model uses straight-line forecasting. But there are specific scenarios where it systematically misleads you. Here's when Monte Carlo actually changes the decision.",
    body: [
      "Every financial model I've ever seen in a corporate setting uses some version of straight-line forecasting. Revenue grows at X% per year. Margins expand by 50 bps annually. You build the base case, upside, and downside, hand it to your boss, and move on.",
      "There's nothing wrong with this for most situations. But there are specific scenarios where straight-line forecasting systematically misleads you, and where Monte Carlo simulation gives you information that three discrete scenarios simply can't provide.",
      "In a Monte Carlo simulation, you define a range and probability distribution for each assumption. Revenue growth is normally distributed with a mean of 10% and standard deviation of 5%. You run the model 10,000 times and get a distribution of outcomes instead of a single number.",
      "The output isn't 'the NPV is $42 million.' It's 'there's a 70% probability the NPV is between $28M and $58M, a 15% chance it exceeds $58M, and a 15% chance it's below $28M.'",
      "Straight-line works well when assumptions are relatively stable. Annual budgets for a mature business? Straight-line. Quarterly re-forecasting? Straight-line. The key advantage is communication. A board member can look at three scenarios and immediately understand the range.",
      "Monte Carlo adds genuine value in three situations. First, when multiple uncertain variables interact. A mining project's NPV depends on commodity price, production volume, operating costs, and regulatory timelines. Three scenarios give you three data points. Monte Carlo gives you 10,000 and reveals the true shape of risk.",
      "Second, when the decision involves a threshold or covenant. If your company has a debt covenant requiring EBITDA above $50M, the question isn't 'what is our expected EBITDA?' It's 'what is the probability EBITDA falls below $50M?' That's inherently a probability question.",
      "Third, when optionality exists. If you can expand, defer, or abandon a project based on early results, the value of that optionality can only be captured by modeling the distribution of outcomes.",
      "A practical example: I modeled a renewable energy capex decision. The straight-line model showed NPV of $14M base case, $28M bull, negative $3M bear. Natural conclusion: proceed. The Monte Carlo told a different story. Mean NPV was $12M, but there was a 22% probability of NPV below zero. The 5th percentile was negative $18M, much worse than the 'bear case' suggested.",
      "The decision still went forward, but with a modified structure. The team added a construction milestone gate allowing them to pause and reassess. That optionality wouldn't have been part of the conversation without the Monte Carlo.",
      "Learn both. Default to straight-line for routine forecasting. Switch to Monte Carlo when the decision is large, variables interact, and you need probability of specific outcomes rather than just expected value.",
      "Sources: Damodaran 'Applied Corporate Finance' (NYU Stern), Brealey Myers & Allen 'Principles of Corporate Finance', CFA Institute Quantitative Methods, Python scipy/numpy documentation, HBR 'A Better Way to Make Investment Decisions'"
    ] },
];

const ArticleModal = ({ article, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
  }, [onClose]);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "60px 20px", overflowY: "auto" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: C.bg2, border: "1px solid " + C.border, maxWidth: 720, width: "100%", position: "relative", overflow: "hidden" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "rgba(0,0,0,0.5)", border: "none", color: C.t1, fontSize: 18, cursor: "pointer", fontFamily: F.mono, width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>x</button>
        {article.img && <img src={article.img} alt={article.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />}
        <div style={{ padding: "28px 36px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <span style={{ fontFamily: F.mono, fontSize: 8, color: article.tagColor, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 8px", border: "1px solid " + article.tagColor + "33", background: article.tagColor + "0a" }}>{article.tag}</span>
            <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t3 }}>{article.date} · {article.read} read</span>
          </div>
          <h2 style={{ fontFamily: F.serif, fontSize: 26, fontWeight: 300, color: C.t1, lineHeight: 1.25, marginBottom: 24 }}>{article.title}</h2>
          {article.body.map((p, i) => {
            if (p.startsWith("Sources:")) {
              return (
                <div key={i} style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid " + C.borderS }}>
                  <div style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>Sources</div>
                  <p style={{ fontSize: 12, color: C.t3, lineHeight: 1.8 }}>{p.replace("Sources: ", "")}</p>
                </div>
              );
            }
            if (p.startsWith("Tools used:") || p.startsWith("Tools I used:")) {
              return (
                <div key={i} style={{ marginTop: 16, padding: "10px 14px", background: C.bg, border: "1px solid " + C.borderS }}>
                  <span style={{ fontFamily: F.mono, fontSize: 9, color: C.gold }}>{p}</span>
                </div>
              );
            }
            return <p key={i} style={{ fontSize: 14, color: C.t2, lineHeight: 1.85, marginBottom: 14 }}>{p}</p>;
          })}
          <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid " + C.borderS, fontFamily: F.mono, fontSize: 9, color: C.t3 }}>Written by Harshin Vora · {article.date}</div>
        </div>
      </div>
    </div>
  );
};

const ArticlesSection = () => {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <>
      <Label icon={<BookOpen size={11} style={{ color: C.gold }} />} text="Articles & Insights" />
      <Heading>Thinking out loud</Heading>
      <p style={{ color: C.t2, maxWidth: 530, marginBottom: 32, fontSize: 14 }}>Case studies, market commentary, and technical deep-dives from the world of corporate finance.</p>
      <div className="articles-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {articlesData.map((a, i) => (
          <div key={i} onClick={() => setOpenIdx(i)} style={{ background: C.card, border: "1px solid " + C.borderS, display: "flex", flexDirection: "column", transition: "border-color 0.3s", cursor: "pointer", overflow: "hidden" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.goldDim}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.borderS}>
            {a.img && <img src={a.img} alt={a.title} style={{ width: "100%", height: 140, objectFit: "cover" }} />}
            <div style={{ padding: "16px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontFamily: F.mono, fontSize: 8, color: a.tagColor, letterSpacing: "0.12em", textTransform: "uppercase", padding: "2px 8px", border: "1px solid " + a.tagColor + "33", background: a.tagColor + "0a" }}>{a.tag}</span>
                <span style={{ fontFamily: F.mono, fontSize: 8, color: C.t3 }}>{a.date} · {a.read}</span>
              </div>
              <h3 style={{ fontFamily: F.serif, fontSize: 17, fontWeight: 400, color: C.t1, lineHeight: 1.3, marginBottom: 8 }}>{a.title}</h3>
              <p style={{ fontSize: 11, color: C.t2, lineHeight: 1.6, flex: 1 }}>{a.preview}</p>
              <div style={{ marginTop: 12, paddingTop: 8, borderTop: "1px solid " + C.borderS, display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ fontFamily: F.mono, fontSize: 9, color: C.gold }}>Read article</span>
                <ArrowUpRight size={10} style={{ color: C.gold }} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {openIdx !== null && <ArticleModal article={articlesData[openIdx]} onClose={() => setOpenIdx(null)} />}
    </>
  );
};

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 40);
      for (const s of ["contact", "articles", "skills", "interactive", "projects", "experience", "about", "hero"]) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 200) { setActive(s); break; }
      }
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const sec = (id, dark, children) => (
    <section id={id} style={{ padding: "68px 24px", background: dark ? C.bg2 : C.bg }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>{children}</div>
    </section>
  );

  return (
    <div style={{ background: C.bg, color: C.t1, fontFamily: F.sans, minHeight: "100vh", lineHeight: 1.7 }}>
      <style>{`
        @keyframes tick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes gridSlide{0%{background-position:0 0}100%{background-position:60px 60px}}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:13px;height:13px;background:${C.gold};border-radius:50%;cursor:pointer;border:2px solid ${C.bg}}
        ::selection{background:${C.gold};color:${C.bg}}
        *{box-sizing:border-box;margin:0;padding:0}
        @media(max-width:768px){
          nav{padding:10px 16px !important}
          .nav-links{display:none !important}
          section{padding:40px 16px !important}
          .about-grid{grid-template-columns:1fr !important}
          .proj-grid{grid-template-columns:1fr !important}
          .skills-grid{grid-template-columns:1fr !important}
          .articles-grid{grid-template-columns:1fr !important}
          .dcf-layout{grid-template-columns:1fr !important}
          .mc-layout{grid-template-columns:1fr !important}
        }
        @media(max-width:480px){
          h1{font-size:2rem !important}
          h2{font-size:1.4rem !important}
        }
      `}</style>

      <nav style={{ position: "fixed", top: 0, width: "100%", zIndex: 100, padding: scrolled ? "10px 26px" : "16px 26px", display: "flex", justifyContent: "space-between", alignItems: "center", background: scrolled ? "rgba(10,11,13,0.95)" : "rgba(10,11,13,0.5)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.borderS}`, transition: "all 0.4s" }}>
        <a href="#hero" style={{ fontFamily: F.serif, fontSize: 22, fontWeight: 500, color: C.t1, textDecoration: "none" }}>Harshin Vora</a>
        <div className="nav-links" style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {["About", "Experience", "Projects", "Interactive", "Skills", "Articles"].map(s => (
            <a key={s} href={`#${s.toLowerCase()}`} style={{ color: active === s.toLowerCase() ? C.gold : C.t2, textDecoration: "none", fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 0.3s" }}>{s}</a>
          ))}
          <a href="#contact" style={{ border: `1px solid ${C.gold}`, color: C.gold, padding: "6px 16px", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", textDecoration: "none" }}>Connect</a>
        </div>
      </nav>

      <section id="hero" style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "90px 26px 50px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(200,169,110,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,169,110,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", animation: "gridSlide 20s linear infinite", maskImage: "radial-gradient(ellipse 65% 55% at 50% 40%, black 20%, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse 65% 55% at 50% 40%, black 20%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: 820 }}>
          <div style={{ fontFamily: F.mono, fontSize: 11, color: C.gold, letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 18, animation: "fadeIn 0.7s 0.2s both", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 1, background: C.gold }} /> Senior Financial Analyst
          </div>
          <h1 style={{ fontFamily: F.serif, fontSize: "clamp(2.6rem,5vw,4.5rem)", fontWeight: 300, lineHeight: 1.08, letterSpacing: "-0.02em", marginBottom: 22, animation: "fadeIn 0.7s 0.4s both" }}>
            Turning complex data<br />into <em style={{ fontStyle: "italic", color: C.gold, fontWeight: 400 }}>strategic clarity</em>
          </h1>
          <p style={{ fontSize: 15, color: C.t2, maxWidth: 500, lineHeight: 1.8, marginBottom: 32, animation: "fadeIn 0.7s 0.6s both" }}>
            Senior Financial Analyst with 4+ years in M&A transaction services, financial due diligence, and valuation advisory. I don't just build models — I build the story behind the numbers.
          </p>
          <div style={{ display: "flex", gap: 44, paddingTop: 24, borderTop: `1px solid ${C.border}`, animation: "fadeIn 0.7s 0.8s both", flexWrap: "wrap" }}>
            {[["$1.3B+", "Deals Supported"], ["40+", "Valuations Built"], ["4+", "Years in Finance"], ["CFA L1", "Candidate"]].map(([v, l]) => (
              <div key={l}><div style={{ fontFamily: F.serif, fontSize: 32, fontWeight: 300, color: C.gold, lineHeight: 1 }}>{v}</div><div style={{ fontSize: 10, color: C.t3, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 5 }}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <Ticker />

      {sec("about", true, <div className="about-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 44, alignItems: "start" }}>
        <div style={{ aspectRatio: "3/4", background: `linear-gradient(135deg, ${C.card}, ${C.bg})`, border: `1px solid ${C.border}`, overflow: "hidden", position: "relative" }}>
          <img src="/harshin.jpg" alt="Harshin Vora" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />

        </div>
        <div>
          <Label icon={<BookOpen size={11} style={{ color: C.gold }} />} text="About" />
          <Heading>Finance is the language of business decisions</Heading>
          <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.85, marginBottom: 12 }}>I'm <strong style={{ color: C.t1, fontWeight: 500 }}>Harshin Vora</strong>, a senior financial analyst specializing in M&A transaction services, financial due diligence, and valuation advisory. I transform raw data into insights that drive multi-million dollar decisions.</p>
          <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.85, marginBottom: 12 }}>Experience spans <strong style={{ color: C.t1 }}>buy-side/sell-side due diligence, DCF & comparable valuations, and quality of earnings analysis</strong> for private equity and corporate clients across $20M–$1.3B transactions.</p>
          <p style={{ color: C.t2, fontSize: 14, lineHeight: 1.85, marginBottom: 20 }}>Based in <strong style={{ color: C.t1 }}>San Jose, California</strong> — targeting FP&A, valuation advisory, and strategic finance roles.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
            {["M&A Due Diligence", "FP&A", "DCF Valuation", "Quality of Earnings", "3-Statement Modeling", "GAAP", "CFA L1", "CA (India)"].map(t => <span key={t} style={{ padding: "5px 12px", border: `1px solid ${C.border}`, fontSize: 10, color: C.t2, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t}</span>)}
          </div>
        </div>
      </div>)}

      {sec("experience", false, <>
        <Label icon={<TrendingUp size={11} style={{ color: C.gold }} />} text="Experience" />
        <Heading>Career Timeline</Heading>
        <p style={{ color: C.t2, maxWidth: 500, marginBottom: 36, fontSize: 14 }}>From valuation advisory to M&A due diligence to strategic finance.</p>
        <div style={{ position: "relative", paddingLeft: 30 }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 1, background: C.border }} />
          {[
            { d: "Jun 2025 — Present", r: "Senior Financial Analyst", co: "Twenty Consulting", loc: "Cupertino, CA", desc: "Conducting financial due diligence for M&A transactions. Building integrated 3-statement models. Developing Tableau dashboards tracking profitability and working capital KPIs. Automated financial models in Excel and SQL, identifying $3M in discrepancies." },
            { d: "Jun 2021 — Aug 2023", r: "Valuation Analyst", co: "J. B. Shah & Associates", loc: "Mumbai, India", desc: "Led buy-side and sell-side due diligence for 6 deals ($20M–$180M EV). Built DCF and sensitivity models for $200M PE investment. Analyzed 25+ comparable companies and 30+ precedent transactions. Valued 5 PE investments ($50M+ AUM) quarterly per ASC 820." },
            { d: "Jan 2020 — Jun 2021", r: "Associate CA", co: "G. M. Kapadia & Co.", loc: "Mumbai, India", desc: "Led transaction due diligence for $1.3B insurance IPO. Executed statutory audits for 7 clients ($50M–$100M revenue). Evaluated $150M+ loan portfolio and recommended $18M in NPA reclassifications. Automated reporting via Power BI, reducing manual processes by 50%." },
          ].map((e, i) => (
            <div key={i} style={{ marginBottom: 30, position: "relative" }}>
              <div style={{ position: "absolute", left: -34, top: 5, width: 8, height: 8, border: `1.5px solid ${C.gold}`, background: C.bg, borderRadius: "50%" }} />
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>{e.d}</div>
              <div style={{ fontFamily: F.serif, fontSize: 20, fontWeight: 400, marginBottom: 3 }}>{e.r}</div>
              <div style={{ color: C.gold, fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{e.co}</div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.t3, marginBottom: 7 }}>{e.loc}</div>
              <p style={{ color: C.t2, fontSize: 13, lineHeight: 1.8, maxWidth: 540 }}>{e.desc}</p>
            </div>
          ))}
        </div>
      </>)}

      {sec("projects", true, <>
        <Label icon={<Database size={11} style={{ color: C.gold }} />} text="Featured Projects" />
        <Heading>Real companies, real data</Heading>
        <p style={{ color: C.t2, maxWidth: 520, marginBottom: 32, fontSize: 14 }}>Built with public filings from NVIDIA, Meta, Apple, Microsoft & Tesla — live charts, not screenshots.</p>
        <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ background: C.card, border: `1px solid ${C.borderS}`, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em" }}>01 — NVIDIA DCF VALUATION</div>
              <span style={{ fontFamily: F.mono, fontSize: 9, color: C.green }}>▲ {nvdaDCF.upside}% UPSIDE</span>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={nvidiaRevenue}>
                  <defs><linearGradient id="rg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={C.gold} stopOpacity={0.25} /><stop offset="100%" stopColor={C.gold} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" /><XAxis dataKey="year" tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: C.t3, fontSize: 9, fontFamily: F.mono }} axisLine={false} tickLine={false} unit="B" /><Tooltip content={<Tip />} />
                  <Area type="monotone" dataKey="actual" stroke={C.gold} fill="url(#rg)" strokeWidth={2} dot={{ fill: C.gold, r: 3 }} name="Actual Rev" />
                  <Area type="monotone" dataKey="forecast" stroke={C.gold} fill="url(#rg)" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: C.gold, r: 3, strokeDasharray: "0" }} name="Forecast Rev" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 10 }}>
              {[["WACC", `${nvdaDCF.wacc}%`], ["EV", `$${nvdaDCF.ev.toLocaleString()}B`], ["Implied", `$${nvdaDCF.impliedPrice}`]].map(([l, v]) => (
                <div key={l} style={{ background: C.bg2, padding: "6px 8px", border: `1px solid ${C.borderS}` }}>
                  <div style={{ fontFamily: F.mono, fontSize: 7, color: C.t3, letterSpacing: "0.1em", textTransform: "uppercase" }}>{l}</div>
                  <div style={{ fontFamily: F.mono, fontSize: 11, color: C.t1 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.borderS}`, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em" }}>02 — META FP&A VARIANCE</div>
              <span style={{ fontFamily: F.mono, fontSize: 9, color: C.green }}>{metaFPA.varPct} FAVORABLE</span>
            </div>
            <div style={{ height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metaVariance} barGap={2}><CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" /><XAxis dataKey="q" tick={{ fill: C.t3, fontSize: 8, fontFamily: F.mono }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: C.t3, fontSize: 8, fontFamily: F.mono }} axisLine={false} tickLine={false} unit="B" /><Tooltip content={<Tip />} /><Bar dataKey="budget" fill="rgba(200,169,110,0.25)" radius={[2, 2, 0, 0]} name="Budget" barSize={14} /><Bar dataKey="actual" fill={C.gold} radius={[2, 2, 0, 0]} name="Actual" barSize={14} /></BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ marginTop: 10, padding: "8px 10px", background: C.bg2, border: `1px solid ${C.borderS}` }}>
              <div style={{ fontFamily: F.mono, fontSize: 8, color: C.green, letterSpacing: "0.08em", marginBottom: 3 }}>▲ KEY DRIVER</div>
              <div style={{ fontSize: 10, color: C.t2, lineHeight: 1.5 }}>{metaFPA.driver}</div>
              <div style={{ fontFamily: F.mono, fontSize: 8, color: C.red, letterSpacing: "0.08em", marginTop: 6, marginBottom: 3 }}>▼ KEY RISK</div>
              <div style={{ fontSize: 10, color: C.t2, lineHeight: 1.5 }}>{metaFPA.risk}</div>
            </div>
          </div>
        </div>
        <div className="proj-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
          <div style={{ background: C.card, border: `1px solid ${C.borderS}`, padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em" }}>03 — APPLE CAPITAL ALLOCATION</div>
              <span style={{ fontFamily: F.mono, fontSize: 9, color: C.gold }}>FY2024 10-K</span>
            </div>
            <div style={{ height: 150 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart><Pie data={appleCapAlloc} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value" stroke="none">{appleCapAlloc.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie></PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 4 }}>
              {appleCapAlloc.map(p => <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 7, height: 7, background: p.color, borderRadius: 1 }} /><span style={{ fontSize: 9, color: C.t2, fontFamily: F.mono }}>{p.name} ${p.value}B ({Math.round(p.value / appleTotal * 100)}%)</span></div>)}
            </div>
            <div style={{ marginTop: 8, padding: "6px 8px", background: C.bg2, border: `1px solid ${C.borderS}`, fontFamily: F.mono, fontSize: 9, color: C.t3, textAlign: "center" }}>
              Total deployed: <span style={{ color: C.gold }}>${appleTotal.toFixed(1)}B</span> — 52% returned to shareholders
            </div>
          </div>
          <PerfChart />
        </div>
        <CompTable />
        <div style={{ marginTop: 14 }}><TeslaSens /></div>
        <div style={{ marginTop: 14 }}><LBOModel /></div>
        <div style={{ marginTop: 14 }}><AccretionDilution /></div>
        <div style={{ marginTop: 14 }}><AISectorComp /></div>
      </>)}

      {sec("interactive", false, <>
        <Label icon={<Zap size={11} style={{ color: C.gold }} />} text="Interactive Demos" />
        <Heading>Try it yourself</Heading>
        <p style={{ color: C.t2, maxWidth: 530, marginBottom: 32, fontSize: 14 }}>Monte Carlo simulations, DCF models, and editable income statements — pick a company, adjust assumptions, watch outputs recalculate live.</p>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Activity size={11} /> Monte Carlo Revenue Forecast</div>
          <MonteCarloSim />
        </div>
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><Calculator size={11} /> DCF Valuation Calculator</div>
          <DCFCalc />
        </div>
        <div>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}><FileSpreadsheet size={11} /> Live Income Statement (Editable)</div>
          <ExcelModel />
        </div>
      </>)}

      {sec("skills", true, <>
        <Label icon={<Database size={11} style={{ color: C.gold }} />} text="Toolkit" />
        <Heading>Technical arsenal</Heading>
        <p style={{ color: C.t2, maxWidth: 500, marginBottom: 32, fontSize: 14 }}>Proficiency based on years of professional use.</p>
        <div className="skills-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid ${C.borderS}`, padding: 22, flex: 1 }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.borderS}` }}>Tools & Platforms</div>
              <SkillBar name="Excel / VBA" level={98} emoji="📊" /><SkillBar name="Power BI / Tableau" level={88} emoji="📈" delay={80} /><SkillBar name="SQL" level={82} emoji="🗄️" delay={160} /><SkillBar name="SAP / D365 / OneStream" level={80} emoji="⚙️" delay={240} /><SkillBar name="Bloomberg / Capital IQ" level={88} emoji="💹" delay={320} /><SkillBar name="PitchBook / FactSet" level={84} emoji="🔍" delay={400} />
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.borderS}`, padding: 22, flex: 1 }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Competency Radar</div>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}><PolarGrid stroke="rgba(200,169,110,0.1)" /><PolarAngleAxis dataKey="s" tick={{ fill: C.t2, fontSize: 9, fontFamily: F.mono }} /><PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} /><Radar dataKey="v" stroke={C.gold} fill={C.gold} fillOpacity={0.15} strokeWidth={1.5} /></RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: C.card, border: `1px solid ${C.borderS}`, padding: 22, flex: 1 }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14, paddingBottom: 10, borderBottom: `1px solid ${C.borderS}` }}>Education & Certifications</div>
              {[["CFA Level 1", "CFA Institute", "Pursuing"], ["M.S. Finance (STEM)", "University of Illinois Urbana-Champaign", "Dec 2024"], ["Chartered Accountant", "ICAI (US CPA Equivalent)", "Nov 2019"], ["B.Com Accounting & Finance", "University of Mumbai", "Apr 2018"]].map(([n, iss, st], idx, arr) => (
                <div key={n} style={{ padding: "12px 0", borderBottom: idx < arr.length - 1 ? `1px solid ${C.borderS}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 14, color: C.t1, fontWeight: 500 }}>{n}</div><div style={{ fontSize: 11, color: C.t2, marginTop: 2 }}>{iss}</div></div>
                  <span style={{ fontFamily: F.mono, fontSize: 9, color: C.gold, whiteSpace: "nowrap" }}>{st}</span>
                </div>
              ))}
            </div>
            <div style={{ background: C.card, border: `1px solid ${C.borderS}`, padding: 22, flex: 1 }}>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: C.gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.borderS}` }}>ERP & Reporting</div>
              <SkillBar name="Anaplan / NetSuite" level={82} emoji="📊" /><SkillBar name="Python Scripts" level={72} emoji="⚡" delay={80} /><SkillBar name="Power Automate" level={80} emoji="🔁" delay={160} /><SkillBar name="QuickBooks / Tally" level={78} emoji="📝" delay={240} /><SkillBar name="Morningstar / FactSet" level={76} emoji="📉" delay={320} />
            </div>
          </div>
        </div>
      </>)}

      {sec("articles", false, <ArticlesSection />)}

      {sec("contact", false, <div style={{ maxWidth: 580 }}>
        <Label icon={<Mail size={11} style={{ color: C.gold }} />} text="Contact" />
        <h2 style={{ fontFamily: F.serif, fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 300, lineHeight: 1.15, marginBottom: 16 }}>Let's talk about <em style={{ fontStyle: "italic", color: C.gold }}>what's next</em></h2>
        <p style={{ color: C.t2, fontSize: 14, marginBottom: 30, lineHeight: 1.85, maxWidth: 440 }}>Exploring valuation advisory, FP&A, and strategic finance roles in the Bay Area and beyond.</p>
        {[
          { ic: <Mail size={13} />, l: "Email", v: "harshinvora2@gmail.com", h: "mailto:harshinvora2@gmail.com" },
          { ic: <ExternalLink size={13} />, l: "LinkedIn", v: "linkedin.com/in/harshin-vora", h: "https://www.linkedin.com/in/harshin-vora/" },
          { ic: <Download size={13} />, l: "Resume", v: "Download PDF", h: "/Harshin_Vora_Resume.pdf" },
        ].map(lk => (
          <a key={lk.l} href={lk.h} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: `1px solid ${C.borderS}`, color: C.t1, textDecoration: "none" }}>
            <span style={{ color: C.gold }}>{lk.ic}</span>
            <span style={{ fontFamily: F.mono, fontSize: 9, color: C.t3, letterSpacing: "0.12em", textTransform: "uppercase", minWidth: 60 }}>{lk.l}</span>
            <span style={{ fontSize: 14 }}>{lk.v}</span>
            <ArrowUpRight size={13} style={{ marginLeft: "auto", color: C.t3 }} />
          </a>
        ))}
      </div>)}

      <footer style={{ padding: "18px 26px", borderTop: `1px solid ${C.borderS}`, display: "flex", justifyContent: "space-between", fontSize: 11, color: C.t3 }}>
        <span>© {new Date().getFullYear()} Harshin Vora</span>
        <span>Data sourced from SEC 10-K filings</span>
      </footer>
    </div>
  );
}