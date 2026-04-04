import { useState, createContext, useContext } from "react";
import { useStorage } from "./hooks/useStorage";
import { formatBRL, formatPct } from "./utils/formatters";
import { todayStr, daysInMonth, dayOfMonth } from "./utils/date";
import { defaultData, calcProj } from "./utils/finance";
import { CDI_AA, CATS, CHART_COLORS, INV_TYPES } from "./constants/finance";
import { ThemeContext, useTheme } from "./context/theme";
import Card from "./components/ui/Card";
import Inp from "./components/ui/Inp";
import Btn from "./components/ui/Btn";

// ─── TEMA ─────────────────────────────────────────────────────────────────────

const LIGHT = {
  bg: "#F5F7F2",
  bgCard: "#FFFFFF",
  bgInput: "#F0F4EE",
  bgNav: "rgba(255,255,255,0.95)",
  border: "rgba(0,0,0,0.07)",
  borderInput: "rgba(0,0,0,0.1)",
  text: "#1A2E1A",
  textSub: "#6B7F6B",
  textMuted: "#9EAD9E",
  accent: "#3D8C5F",       // verde-floresta
  accentSoft: "#EAF4EE",
  accentBlue: "#3B7DD8",
  accentBlueSoft: "#EBF2FC",
  positive: "#2E7D52",
  positiveSoft: "#E6F4ED",
  warning: "#C45A1A",
  warningSoft: "#FEF0E6",
  negative: "#C0392B",
  negativeSoft: "#FDECEA",
  heroGrad: "linear-gradient(135deg, #D6EFE1 0%, #E8F4F8 100%)",
  heroBorder: "rgba(61,140,95,0.2)",
  heroText: "#2E7D52",
  shadow: "0 2px 12px rgba(0,0,0,0.07)",
  shadowCard: "0 1px 4px rgba(0,0,0,0.05)",
};
 
const DARK = {
  bg: "#0d1210",
  bgCard: "rgba(255,255,255,0.05)",
  bgInput: "rgba(255,255,255,0.07)",
  bgNav: "rgba(13,18,16,0.97)",
  border: "rgba(255,255,255,0.08)",
  borderInput: "rgba(255,255,255,0.12)",
  text: "#E8F0E8",
  textSub: "#8FA88F",
  textMuted: "#5A705A",
  accent: "#4DBF80",
  accentSoft: "rgba(77,191,128,0.15)",
  accentBlue: "#5BA3E8",
  accentBlueSoft: "rgba(91,163,232,0.15)",
  positive: "#4DBF80",
  positiveSoft: "rgba(77,191,128,0.15)",
  warning: "#F0924A",
  warningSoft: "rgba(240,146,74,0.15)",
  negative: "#E05A4A",
  negativeSoft: "rgba(224,90,74,0.15)",
  heroGrad: "linear-gradient(135deg, rgba(61,140,95,0.2) 0%, rgba(59,125,216,0.2) 100%)",
  heroBorder: "rgba(77,191,128,0.25)",
  heroText: "#4DBF80",
  shadow: "0 2px 12px rgba(0,0,0,0.3)",
  shadowCard: "0 1px 4px rgba(0,0,0,0.2)",
};
 
// ─── UTILS ────────────────────────────────────────────────────────────────────


// ─── CSS GLOBAL ───────────────────────────────────────────────────────────────
const makeCSS = (t) => `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:${t.bg};font-family:'Plus Jakarta Sans',sans-serif;}
  ::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:${t.textMuted};border-radius:4px;opacity:.4;}
  .btn{cursor:pointer;border:none;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;transition:all .18s;}
  .btn:hover{filter:brightness(0.94);transform:translateY(-1px);} .btn:active{transform:scale(0.97);}
  input,select{font-family:'Plus Jakarta Sans',sans-serif;outline:none;}
  input:focus,select:focus{border-color:${t.accent}!important;box-shadow:0 0 0 3px ${t.accentSoft};}
  @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
  .fade-up{animation:fadeUp .3s ease forwards;}
  @keyframes pop{0%{transform:scale(0.95);opacity:0;}100%{transform:scale(1);opacity:1;}}
  .pop{animation:pop .25s ease forwards;}
`;
 
// ─── GRÁFICOS SVG ─────────────────────────────────────────────────────────────
function BarChart({ data }) {
  const t = useTheme();
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
      {data.map((d, i) => (
        <div key={i}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
            <span style={{ fontSize:"12px", color:t.textSub, fontWeight:500 }}>{d.name}</span>
            <span style={{ fontSize:"12px", fontFamily:"'JetBrains Mono'", color:d.color, fontWeight:600 }}>{formatBRL(d.value)}</span>
          </div>
          <div style={{ background:t.bgInput, borderRadius:"6px", height:"8px" }}>
            <div style={{ height:"8px", borderRadius:"6px", width:`${(d.value/max)*100}%`, background:d.color, transition:"width .6s ease" }} />
          </div>
        </div>
      ))}
    </div>
  );
}
 
function PieChart({ data }) {
  const t = useTheme();
  if (!data.length) return null;
  const total = data.reduce((s, d) => s + d.value, 0);
  let cumulative = 0;
  const r = 58, cx = 75, cy = 65;
  const slices = data.map((d) => {
    const pct = d.value / total;
    const start = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += pct;
    const end = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(start), y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end), y2 = cy + r * Math.sin(end);
    return { ...d, path:`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${pct>.5?1:0},1 ${x2},${y2} Z`, pct };
  });
  return (
    <div style={{ display:"flex", alignItems:"center", gap:"16px", flexWrap:"wrap" }}>
      <svg width="150" height="130" viewBox="0 0 150 130">
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke={t.bgCard} strokeWidth="2" />)}
        <circle cx={cx} cy={cy} r="26" fill={t.bgCard} />
      </svg>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:"6px" }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"7px" }}>
            <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:s.color, flexShrink:0 }} />
            <span style={{ fontSize:"11px", color:t.textSub, flex:1 }}>{s.name}</span>
            <span style={{ fontSize:"11px", color:t.textMuted }}>{Math.round(s.pct*100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
  
// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, theme, toggleTheme }) {
  const t = useTheme();
  const [users, setUsers] = useStorage("finchly_users");
  const [step, setStep] = useState("choose");
  const [sel, setSel] = useState(null);
  const [form, setForm] = useState({ name:"", avatar:"😊", password:"", confirm:"" });
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const reg = users || {};
  const avatars = ["😊","👨","👩","🧑","👦","👧","🧔","👱","🧕","🦸","🌟","🐻"];
 
  const doRegister = () => {
    if (!form.name.trim()) return setErr("Digite um nome.");
    if (form.password.length < 4) return setErr("Senha com ao menos 4 caracteres.");
    if (form.password !== form.confirm) return setErr("Senhas não conferem.");
    const id = "u_" + Date.now();
    const updated = { ...reg, [id]: { id, name:form.name, avatar:form.avatar, password:form.password } };
    setUsers(updated); onLogin(updated[id]);
  };
  const doLogin = () => { if (pw === sel.password) onLogin(sel); else setErr("Senha incorreta."); };
 
  return (
    <div style={{ minHeight:"100vh", background:t.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", fontFamily:"'Plus Jakarta Sans',sans-serif", padding:"24px" }}>
      <style>{makeCSS(t)}</style>
 
      {/* Toggle tema */}
      <button className="btn" onClick={toggleTheme}
        style={{ position:"fixed", top:"16px", right:"16px", background:t.bgCard, border:`1px solid ${t.border}`, borderRadius:"10px", padding:"8px 12px", color:t.textSub, fontSize:"16px", boxShadow:t.shadowCard }}>
        {theme === "light" ? "🌙" : "☀️"}
      </button>
 
      <div className="fade-up" style={{ width:"100%", maxWidth:"380px" }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"22px", background:`linear-gradient(135deg, ${t.accent}, #2D6E4A)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"34px", margin:"0 auto 14px", boxShadow:`0 8px 24px ${t.accentSoft}` }}>
            🌿
          </div>
          <h1 style={{ color:t.text, fontSize:"28px", fontWeight:800, letterSpacing:"-0.5px" }}>Finchly</h1>
          <p style={{ color:t.textSub, fontSize:"14px", marginTop:"5px" }}>Suas finanças, com leveza</p>
        </div>
 
        <Card style={{ padding:"28px" }}>
          {step === "choose" && (<>
            <p style={{ color:t.textSub, fontSize:"13px", marginBottom:"14px", textAlign:"center" }}>
              {Object.keys(reg).length === 0 ? "Crie sua conta para começar 🌱" : "Qual perfil é o seu?"}
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"8px", marginBottom:"14px" }}>
              {Object.values(reg).map(u => (
                <button key={u.id} className="btn" onClick={() => { setSel(u); setStep("login"); setErr(""); setPw(""); }}
                  style={{ background:t.bgInput, color:t.text, padding:"13px 16px", textAlign:"left", display:"flex", alignItems:"center", gap:"12px", fontSize:"14px", border:`1.5px solid ${t.border}`, borderRadius:"12px" }}>
                  <span style={{ fontSize:"24px" }}>{u.avatar}</span>
                  <span style={{ fontWeight:600 }}>{u.name}</span>
                  <span style={{ marginLeft:"auto", color:t.textMuted, fontSize:"12px" }}>→</span>
                </button>
              ))}
            </div>
            <Btn onClick={() => { setStep("register"); setErr(""); }}>+ Criar nova conta</Btn>
          </>)}
 
          {step === "register" && (<>
            <h2 style={{ color:t.text, fontSize:"17px", fontWeight:700, marginBottom:"16px" }}>Criar conta</h2>
            <p style={{ fontSize:"12px", color:t.textSub, marginBottom:"9px", fontWeight:500 }}>Escolha um avatar</p>
            <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:"14px" }}>
              {avatars.map(a => (
                <button key={a} className="btn" onClick={() => setForm(f => ({...f,avatar:a}))}
                  style={{ fontSize:"22px", padding:"7px 8px", background:form.avatar===a?t.accentSoft:"transparent", border:form.avatar===a?`2px solid ${t.accent}`:`2px solid ${t.border}`, borderRadius:"10px" }}>
                  {a}
                </button>
              ))}
            </div>
            <Inp placeholder="Seu nome" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
            <Inp type="password" placeholder="Senha (mín. 4 caracteres)" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            <Inp type="password" placeholder="Confirmar senha" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} />
            {err && <p style={{ color:t.negative, fontSize:"13px", marginBottom:"9px" }}>{err}</p>}
            <div style={{ display:"flex", gap:"8px" }}>
              <Btn variant="ghost" onClick={()=>setStep("choose")} style={{ flex:1 }}>Voltar</Btn>
              <Btn onClick={doRegister} style={{ flex:2 }}>Criar conta</Btn>
            </div>
          </>)}
 
          {step === "login" && sel && (<>
            <div style={{ textAlign:"center", marginBottom:"22px" }}>
              <div style={{ fontSize:"52px", marginBottom:"8px" }}>{sel.avatar}</div>
              <h2 style={{ color:t.text, fontSize:"20px", fontWeight:700 }}>Olá, {sel.name}! 👋</h2>
              <p style={{ color:t.textSub, fontSize:"13px", marginTop:"4px" }}>Tudo sob controle por aqui</p>
            </div>
            <Inp type="password" placeholder="Sua senha" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
            {err && <p style={{ color:t.negative, fontSize:"13px", marginBottom:"9px" }}>{err}</p>}
            <div style={{ display:"flex", gap:"8px" }}>
              <Btn variant="ghost" onClick={()=>{ setStep("choose"); setPw(""); setErr(""); }} style={{ flex:1 }}>Voltar</Btn>
              <Btn onClick={doLogin} style={{ flex:2 }}>Entrar</Btn>
            </div>
          </>)}
        </Card>
 
        <p style={{ color:t.textMuted, fontSize:"12px", textAlign:"center", marginTop:"20px" }}>Finchly · Finanças com leveza 🌿</p>
      </div>
    </div>
  );
}
 
// ─── APP ──────────────────────────────────────────────────────────────────────
function App({ user, onLogout, theme, toggleTheme }) {
  const t = useTheme();
  const [data, setData] = useStorage(`finchly_data_${user.id}`);
  const [tab, setTab] = useState("dashboard");
  const d = data || defaultData();
  const save = (patch) => setData({ ...d, ...patch });
 
  const totalExp = d.expenses.reduce((s, e) => s + Number(e.amount), 0);
  const salary = Number(d.salary) || 0;
  const balance = salary - totalExp;
  const remDays = daysInMonth() - dayOfMonth() + 1;
  const daily = remDays > 0 ? balance / remDays : 0;
 
  const tabs = [
    { id:"dashboard", label:"Início",  icon:"🏠" },
    { id:"expenses",  label:"Gastos",  icon:"💳" },
    { id:"debts",     label:"Dívidas", icon:"📋" },
    { id:"invest",    label:"Invest.", icon:"🌱" },
    { id:"settings",  label:"Config",  icon:"⚙️" },
  ];
 
  return (
    <div style={{ minHeight:"100vh", background:t.bg, fontFamily:"'Plus Jakarta Sans',sans-serif", color:t.text, display:"flex", flexDirection:"column" }}>
      <style>{makeCSS(t)}</style>
 
      {/* Header */}
      <div style={{ background:t.bgNav, borderBottom:`1px solid ${t.border}`, padding:"12px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", position:"sticky", top:0, zIndex:50, backdropFilter:"blur(20px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{ width:"36px", height:"36px", borderRadius:"10px", background:`linear-gradient(135deg,${t.accent},#2D6E4A)`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"18px" }}>🌿</div>
          <div>
            <p style={{ fontSize:"11px", color:t.textMuted, letterSpacing:"0.5px", fontWeight:500 }}>Finchly</p>
            <p style={{ fontSize:"14px", fontWeight:700, color:t.text }}>{user.avatar} {user.name}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:"8px", alignItems:"center" }}>
          <button className="btn" onClick={toggleTheme}
            style={{ background:t.bgInput, border:`1px solid ${t.border}`, borderRadius:"9px", padding:"7px 10px", color:t.textSub, fontSize:"15px" }}>
            {theme==="light"?"🌙":"☀️"}
          </button>
          <button className="btn" onClick={onLogout}
            style={{ background:t.bgInput, color:t.textSub, padding:"7px 13px", borderRadius:"9px", fontSize:"12px", border:`1px solid ${t.border}`, fontWeight:600 }}>
            Sair
          </button>
        </div>
      </div>
 
      {/* Conteúdo */}
      <div style={{ flex:1, overflowY:"auto", padding:"20px 16px 108px" }}>
        {tab==="dashboard" && <Dashboard d={d} salary={salary} balance={balance} daily={daily} totalExp={totalExp} remDays={remDays} />}
        {tab==="expenses"  && <Expenses d={d} save={save} />}
        {tab==="debts"     && <Debts d={d} save={save} />}
        {tab==="invest"    && <Investments d={d} save={save} />}
        {tab==="settings"  && <Settings d={d} save={save} user={user} />}
      </div>
 
      {/* Bottom Nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:t.bgNav, backdropFilter:"blur(20px)", borderTop:`1px solid ${t.border}`, display:"flex", padding:"8px 0 14px", boxShadow:`0 -4px 20px rgba(0,0,0,0.06)` }}>
        {tabs.map(tt => (
          <button key={tt.id} className="btn" onClick={() => setTab(tt.id)}
            style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:"3px", background:"none", color:tab===tt.id?t.accent:t.textMuted, padding:"3px 1px", fontSize:"9px", letterSpacing:"0.3px", textTransform:"uppercase", fontWeight:tab===tt.id?700:500 }}>
            <span style={{ fontSize:"18px", filter:tab===tt.id?"none":"grayscale(1) opacity(0.5)" }}>{tt.icon}</span>
            {tt.label}
            {tab===tt.id && <div style={{ width:"18px", height:"3px", borderRadius:"2px", background:t.accent, marginTop:"1px" }} />}
          </button>
        ))}
      </div>
    </div>
  );
}
 
// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ d, salary, balance, daily, totalExp, remDays }) {
  const t = useTheme();
  const totalInv = d.investments.reduce((s, i) => s + Number(i.principal), 0);
  const isHealthy = daily >= 0 && balance >= 0;
 
  return (
    <div className="fade-up">
      <div style={{ marginBottom:"20px" }}>
        <h2 style={{ fontSize:"22px", fontWeight:800, color:t.text }}>Visão Geral</h2>
        <p style={{ color:t.textSub, fontSize:"13px", marginTop:"2px" }}>
          {new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"})}
        </p>
      </div>
 
      {/* Hero Card */}
      <div style={{ background:t.heroGrad, border:`1px solid ${t.heroBorder}`, borderRadius:"22px", padding:"26px 22px", marginBottom:"14px", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20px", right:"-20px", width:"100px", height:"100px", background: isHealthy ? "rgba(61,140,95,0.1)" : "rgba(192,57,43,0.08)", borderRadius:"50%", filter:"blur(30px)" }} />
        <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"10px" }}>
          <span style={{ fontSize:"20px" }}>{isHealthy?"🌿":"⚠️"}</span>
          <p style={{ color:t.textSub, fontSize:"12px", fontWeight:600, letterSpacing:"0.5px", textTransform:"uppercase" }}>
            {isHealthy ? "Planejamento em dia" : "Atenção necessária"}
          </p>
        </div>
        <p style={{ color:t.heroText, fontSize:"11px", fontWeight:500, marginBottom:"6px" }}>Pode gastar por dia</p>
        <p style={{ fontSize:"42px", fontWeight:800, fontFamily:"'JetBrains Mono',monospace", color:daily>=0?t.heroText:t.negative, letterSpacing:"-1px", lineHeight:1 }}>
          {formatBRL(daily < 0 ? 0 : daily)}
        </p>
        <p style={{ color:t.textSub, fontSize:"12px", marginTop:"8px" }}>{remDays} dias restantes neste mês</p>
        {daily < 0 && (
          <div style={{ marginTop:"10px", background:t.negativeSoft, border:`1px solid ${t.negative}30`, borderRadius:"10px", padding:"8px 12px" }}>
            <p style={{ color:t.negative, fontSize:"12px", fontWeight:600 }}>Seus gastos estão acima da receita este mês.</p>
          </div>
        )}
      </div>
 
      {/* Cards 2x2 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"16px" }}>
        {[
          { label:"Receita", value:salary, color:t.positive, soft:t.positiveSoft, icon:"💼" },
          { label:"Gastos",  value:totalExp, color:t.warning, soft:t.warningSoft, icon:"💳" },
          { label:"Saldo",   value:balance, color:balance>=0?t.positive:t.negative, soft:balance>=0?t.positiveSoft:t.negativeSoft, icon:"💰" },
          { label:"Investido",value:totalInv, color:t.accentBlue, soft:t.accentBlueSoft, icon:"🌱" },
        ].map(c => (
          <Card key={c.label} style={{ padding:"14px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"8px" }}>
              <div style={{ width:"30px", height:"30px", borderRadius:"8px", background:c.soft, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px" }}>{c.icon}</div>
              <p style={{ fontSize:"11px", color:t.textSub, fontWeight:600 }}>{c.label}</p>
            </div>
            <p style={{ fontSize:"16px", fontWeight:700, fontFamily:"'JetBrains Mono',monospace", color:c.color }}>{formatBRL(c.value)}</p>
          </Card>
        ))}
      </div>
 
      {/* Últimos gastos */}
      {d.expenses.length > 0 && (<>
        <p style={{ fontSize:"13px", fontWeight:700, color:t.textSub, marginBottom:"10px" }}>Últimos lançamentos</p>
        {d.expenses.slice(-3).reverse().map(e => (
          <Card key={e.id} style={{ padding:"12px 14px", marginBottom:"8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ fontSize:"13px", fontWeight:600, color:t.text }}>{e.description}</p>
              <p style={{ fontSize:"11px", color:t.textMuted }}>{e.category} · {e.date}</p>
            </div>
            <p style={{ fontSize:"14px", fontWeight:700, color:t.warning, fontFamily:"'JetBrains Mono'" }}>{formatBRL(e.amount)}</p>
          </Card>
        ))}
      </>)}
 
      {salary === 0 && (
        <Card style={{ padding:"16px", marginTop:"10px", background:t.accentSoft, border:`1px solid ${t.accent}30` }}>
          <p style={{ fontSize:"13px", color:t.accent, fontWeight:600 }}>💡 Dica: vá em Config e cadastre sua receita mensal para ativar o gasto diário.</p>
        </Card>
      )}
    </div>
  );
}
 
// ─── GASTOS ───────────────────────────────────────────────────────────────────
function Expenses({ d, save }) {
  const t = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ description:"", amount:"", category:CATS[0], date:todayStr() });
  const [filter, setFilter] = useState("todos");
  const [showChart, setShowChart] = useState(false);
  const [err, setErr] = useState("");
 
  const add = () => {
    if (!form.description.trim() || !form.amount) return setErr("Preencha todos os campos.");
    save({ expenses:[...d.expenses,{...form,id:Date.now(),amount:Number(form.amount)}] });
    setForm({description:"",amount:"",category:CATS[0],date:todayStr()}); setShowForm(false); setErr("");
  };
  const remove = (id) => save({ expenses:d.expenses.filter(e=>e.id!==id) });
 
  const months = [...new Set(d.expenses.map(e=>e.date.slice(0,7)))].sort().reverse();
  const filtered = filter==="todos"?d.expenses:d.expenses.filter(e=>e.date.startsWith(filter));
  const total = filtered.reduce((s,e)=>s+Number(e.amount),0);
  const chartData = CATS.map((cat,i)=>({name:cat.replace(/^\S+\s/,""),value:filtered.filter(e=>e.category===cat).reduce((s,e)=>s+Number(e.amount),0),color:CHART_COLORS[i]})).filter(c=>c.value>0).sort((a,b)=>b.value-a.value);
 
  return (
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"16px"}}>
        <div>
          <h2 style={{fontSize:"21px",fontWeight:800,color:t.text}}>Gastos</h2>
          <p style={{color:t.textSub,fontSize:"12px"}}>Total: <span style={{color:t.warning,fontFamily:"'JetBrains Mono'",fontWeight:700}}>{formatBRL(total)}</span></p>
        </div>
        <div style={{display:"flex",gap:"7px"}}>
          <button className="btn" onClick={()=>setShowChart(v=>!v)}
            style={{background:showChart?t.accentSoft:t.bgInput,color:showChart?t.accent:t.textSub,padding:"8px 11px",borderRadius:"10px",fontSize:"15px",border:`1px solid ${showChart?t.accent:t.border}`}}>
            {showChart?"📋":"📊"}
          </button>
          <button className="btn" onClick={()=>setShowForm(v=>!v)}
            style={{background:showForm?t.bgInput:`linear-gradient(135deg,${t.accent},#2D6E4A)`,color:showForm?t.textSub:"#fff",padding:"8px 14px",borderRadius:"10px",fontSize:"13px",border:showForm?`1px solid ${t.border}`:"none"}}>
            {showForm?"Cancelar":"+ Novo"}
          </button>
        </div>
      </div>
 
      {showForm && (
        <Card style={{padding:"18px",marginBottom:"15px"}} >
          <h3 style={{fontSize:"14px",fontWeight:700,color:t.text,marginBottom:"13px"}}>Novo Gasto</h3>
          <Inp placeholder="Descrição" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
          <Inp type="number" placeholder="Valor (R$)" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} />
          <select value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))}
            style={{width:"100%",background:t.bgInput,border:`1.5px solid ${t.borderInput}`,borderRadius:"12px",padding:"11px 14px",color:t.text,fontSize:"14px",marginBottom:"9px"}}>
            {CATS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
          <Inp type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
          {err && <p style={{color:t.negative,fontSize:"12px",marginBottom:"8px"}}>{err}</p>}
          <Btn onClick={add}>Adicionar gasto</Btn>
        </Card>
      )}
 
      {months.length > 0 && (
        <div style={{display:"flex",gap:"6px",overflowX:"auto",paddingBottom:"4px",marginBottom:"14px"}}>
          {["todos",...months].map(m=>(
            <button key={m} className="btn" onClick={()=>setFilter(m)}
              style={{background:filter===m?t.accent:t.bgCard,color:filter===m?"#fff":t.textSub,padding:"5px 12px",borderRadius:"20px",fontSize:"11px",whiteSpace:"nowrap",border:`1px solid ${filter===m?t.accent:t.border}`,fontWeight:600}}>
              {m==="todos"?"Todos":new Date(m+"-01").toLocaleDateString("pt-BR",{month:"short",year:"2-digit"})}
            </button>
          ))}
        </div>
      )}
 
      {showChart && (
        <Card style={{padding:"18px",marginBottom:"14px"}}>
          <p style={{fontSize:"13px",fontWeight:700,color:t.text,marginBottom:"14px"}}>Por Categoria</p>
          {chartData.length===0
            ? <p style={{color:t.textMuted,fontSize:"13px",textAlign:"center",padding:"14px 0"}}>Adicione gastos para ver o gráfico.</p>
            : (<><BarChart data={chartData}/><div style={{marginTop:"20px",paddingTop:"16px",borderTop:`1px solid ${t.border}`}}><PieChart data={chartData}/></div></>)
          }
        </Card>
      )}
 
      {!showChart && (
        filtered.length===0
          ? <div style={{textAlign:"center",padding:"36px 20px",color:t.textMuted}}><p style={{fontSize:"34px",marginBottom:"8px"}}>🧾</p><p style={{fontSize:"13px"}}>Nenhum gasto registrado.</p></div>
          : filtered.slice().reverse().map(e=>(
              <Card key={e.id} style={{padding:"12px 14px",marginBottom:"7px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{flex:1}}>
                  <p style={{fontSize:"13px",fontWeight:600,color:t.text,marginBottom:"2px"}}>{e.description}</p>
                  <p style={{fontSize:"11px",color:t.textMuted}}>{e.category} · {e.date}</p>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"9px"}}>
                  <p style={{fontSize:"13px",fontWeight:700,color:t.warning,fontFamily:"'JetBrains Mono'"}}>{formatBRL(e.amount)}</p>
                  <button className="btn" onClick={()=>remove(e.id)} style={{background:t.negativeSoft,color:t.negative,width:"26px",height:"26px",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",border:`1px solid ${t.negative}30`}}>×</button>
                </div>
              </Card>
            ))
      )}
    </div>
  );
}
 
// ─── DÍVIDAS ──────────────────────────────────────────────────────────────────
function Debts({ d, save }) {
  const t = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({description:"",creditor:"",totalAmount:"",installmentValue:"",totalInstallments:"",remainingInstallments:"",dueDay:""});
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState("");
  const [err, setErr] = useState("");
 
  const add = () => {
    if (!form.description.trim()||!form.totalAmount||!form.installmentValue||!form.totalInstallments||!form.remainingInstallments) return setErr("Preencha os campos obrigatórios (*).");
    save({debts:[...d.debts,{...form,id:Date.now(),totalAmount:Number(form.totalAmount),installmentValue:Number(form.installmentValue),totalInstallments:Number(form.totalInstallments),remainingInstallments:Number(form.remainingInstallments)}]});
    setForm({description:"",creditor:"",totalAmount:"",installmentValue:"",totalInstallments:"",remainingInstallments:"",dueDay:""}); setShowForm(false); setErr("");
  };
  const updateRem = (id) => {
    const v = Number(editVal); if (isNaN(v)||v<0) return;
    save({debts:d.debts.map(dbt=>dbt.id===id?{...dbt,remainingInstallments:v}:dbt)});
    setEditId(null); setEditVal("");
  };
  const remove = (id) => save({debts:d.debts.filter(dbt=>dbt.id!==id)});
  const active = d.debts.filter(dbt=>Number(dbt.remainingInstallments)>0);
  const done = d.debts.filter(dbt=>Number(dbt.remainingInstallments)<=0);
  const totalPending = active.reduce((s,dbt)=>s+Number(dbt.installmentValue)*Number(dbt.remainingInstallments),0);
 
  return (
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px"}}>
        <div>
          <h2 style={{fontSize:"21px",fontWeight:800,color:t.text}}>Dívidas</h2>
          <p style={{color:t.textSub,fontSize:"12px"}}>Valor restante: <span style={{color:t.negative,fontFamily:"'JetBrains Mono'",fontWeight:700}}>{formatBRL(totalPending)}</span></p>
        </div>
        <button className="btn" onClick={()=>setShowForm(v=>!v)}
          style={{background:showForm?t.bgInput:"linear-gradient(135deg,#E05A4A,#C0392B)",color:showForm?t.textSub:"#fff",padding:"8px 14px",borderRadius:"10px",fontSize:"13px",border:showForm?`1px solid ${t.border}`:"none"}}>
          {showForm?"Cancelar":"+ Nova"}
        </button>
      </div>
 
      <Card style={{padding:"10px 14px",marginBottom:"14px",background:t.accentBlueSoft,border:`1px solid ${t.accentBlue}30`}}>
        <p style={{fontSize:"12px",color:t.accentBlue,fontWeight:500}}>ℹ️ Dívidas são para controle pessoal — não afetam seu saldo ou gasto diário.</p>
      </Card>
 
      {showForm && (
        <Card style={{padding:"18px",marginBottom:"15px"}}>
          <h3 style={{fontSize:"14px",fontWeight:700,color:t.text,marginBottom:"12px"}}>Nova Dívida</h3>
          {[["text","Descrição (ex: Cartão Nubank) *","description"],["text","Credor / Banco","creditor"],["number","Valor total da dívida (R$) *","totalAmount"],["number","Valor de cada parcela (R$) *","installmentValue"],["number","Total de parcelas *","totalInstallments"],["number","Parcelas restantes *","remainingInstallments"],["number","Dia do vencimento (ex: 10)","dueDay"]].map(([t2,ph,k])=>(
            <Inp key={k} type={t2} placeholder={ph} value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))} />
          ))}
          {err && <p style={{color:t.negative,fontSize:"12px",marginBottom:"8px"}}>{err}</p>}
          <Btn variant="danger" onClick={add}>Adicionar Dívida</Btn>
        </Card>
      )}
 
      {active.length===0&&done.length===0
        ? <div style={{textAlign:"center",padding:"36px 20px",color:t.textMuted}}><p style={{fontSize:"34px",marginBottom:"8px"}}>🎉</p><p style={{fontSize:"13px"}}>Nenhuma dívida registrada!</p></div>
        : (<>
            {active.map(dbt=><DebtCard key={dbt.id} dbt={dbt} editId={editId} editVal={editVal} setEditId={setEditId} setEditVal={setEditVal} onUpdate={updateRem} onRemove={remove}/>)}
            {done.length>0&&(<>
              <p style={{fontSize:"11px",color:t.textMuted,letterSpacing:"1px",textTransform:"uppercase",margin:"16px 0 7px",fontWeight:600}}>✅ Quitadas</p>
              {done.map(dbt=><DebtCard key={dbt.id} dbt={dbt} editId={editId} editVal={editVal} setEditId={setEditId} setEditVal={setEditVal} onUpdate={updateRem} onRemove={remove}/>)}
            </>)}
          </>)
      }
    </div>
  );
}
 
function DebtCard({ dbt, editId, editVal, setEditId, setEditVal, onUpdate, onRemove }) {
  const t = useTheme();
  const rem = Number(dbt.remainingInstallments);
  const total = Number(dbt.totalInstallments);
  const paid = total - rem;
  const pct = total>0?(paid/total)*100:0;
  const isDone = rem<=0;
  const remValue = Number(dbt.installmentValue)*rem;
 
  return (
    <Card style={{padding:"15px",marginBottom:"8px",opacity:isDone?0.6:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
        <div style={{flex:1}}>
          <p style={{fontSize:"14px",fontWeight:700,color:t.text,marginBottom:"2px",textDecoration:isDone?"line-through":"none"}}>{dbt.description}</p>
          {dbt.creditor&&<p style={{fontSize:"11px",color:t.textMuted}}>{dbt.creditor}{dbt.dueDay?` · Vence dia ${dbt.dueDay}`:""}</p>}
        </div>
        <button className="btn" onClick={()=>onRemove(dbt.id)} style={{background:t.negativeSoft,color:t.negative,width:"26px",height:"26px",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",border:`1px solid ${t.negative}30`}}>×</button>
      </div>
 
      <div style={{background:t.bgInput,borderRadius:"5px",height:"6px",marginBottom:"9px"}}>
        <div style={{height:"6px",borderRadius:"5px",width:`${pct}%`,background:isDone?t.positive:`linear-gradient(90deg,${t.negative},${t.warning})`,transition:"width .5s"}}/>
      </div>
 
      <div style={{display:"flex",gap:"14px",fontSize:"11px",color:t.textSub,flexWrap:"wrap"}}>
        <span>Parcela: <b style={{color:t.text}}>{formatBRL(dbt.installmentValue)}</b></span>
        <span>Pagas: <b style={{color:t.positive}}>{paid}/{total}</b></span>
        <span>Restam: <b style={{color:isDone?t.positive:t.negative}}>{formatBRL(remValue)}</b></span>
      </div>
 
      {!isDone&&(
        <div style={{marginTop:"10px"}}>
          {editId===dbt.id?(
            <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
              <input type="number" value={editVal} onChange={e=>setEditVal(e.target.value)} placeholder={`Restam (atual: ${rem})`}
                style={{flex:1,background:t.bgInput,border:`1.5px solid ${t.borderInput}`,borderRadius:"9px",padding:"8px 11px",color:t.text,fontSize:"12px",fontFamily:"'Plus Jakarta Sans',sans-serif",outline:"none"}}/>
              <button className="btn" onClick={()=>onUpdate(dbt.id)} style={{background:`linear-gradient(135deg,${t.positive},#1E6640)`,color:"#fff",padding:"8px 13px",borderRadius:"9px",fontSize:"12px",whiteSpace:"nowrap"}}>Salvar</button>
              <button className="btn" onClick={()=>setEditId(null)} style={{background:t.bgInput,color:t.textSub,padding:"8px 11px",borderRadius:"9px",fontSize:"12px",border:`1px solid ${t.border}`}}>✕</button>
            </div>
          ):(
            <button className="btn" onClick={()=>{setEditId(dbt.id);setEditVal(String(rem));}}
              style={{background:t.bgInput,color:t.textSub,padding:"8px 13px",borderRadius:"9px",fontSize:"12px",border:`1px solid ${t.border}`,width:"100%",fontWeight:600}}>
              ✏️ Atualizar parcelas restantes
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
 
// ─── INVESTIMENTOS ────────────────────────────────────────────────────────────
function Investments({ d, save }) {
  const t = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({name:"",type:"cdi",principal:"",cdiPct:"100",customRate:""});
  const [err, setErr] = useState("");
 
  const add = () => {
    if(!form.name.trim()||!form.principal) return setErr("Preencha nome e valor.");
    if(form.type==="cdi"&&(Number(form.cdiPct)<80||Number(form.cdiPct)>110)) return setErr("CDI entre 80% e 110%.");
    if(form.type!=="cdi"&&!form.customRate) return setErr("Informe a taxa anual.");
    save({investments:[...d.investments,{...form,id:Date.now(),principal:Number(form.principal)}]});
    setForm({name:"",type:"cdi",principal:"",cdiPct:"100",customRate:""}); setShowForm(false); setErr("");
  };
  const remove = (id) => save({investments:d.investments.filter(inv=>inv.id!==id)});
 
  const totalInv = d.investments.reduce((s,inv)=>s+Number(inv.principal),0);
  const totalMon = d.investments.reduce((s,inv)=>s+calcProj(inv).monthly,0);
  const totalYea = d.investments.reduce((s,inv)=>s+calcProj(inv).yearly,0);
 
  return (
    <div className="fade-up">
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px"}}>
        <div>
          <h2 style={{fontSize:"21px",fontWeight:800,color:t.text}}>Investimentos</h2>
          <p style={{color:t.textSub,fontSize:"12px"}}>CDI atual: <span style={{color:t.accentBlue,fontWeight:700}}>{CDI_AA}% a.a.</span></p>
        </div>
        <button className="btn" onClick={()=>setShowForm(v=>!v)}
          style={{background:showForm?t.bgInput:`linear-gradient(135deg,${t.accentBlue},#2C5FA8)`,color:showForm?t.textSub:"#fff",padding:"8px 14px",borderRadius:"10px",fontSize:"13px",border:showForm?`1px solid ${t.border}`:"none"}}>
          {showForm?"Cancelar":"+ Novo"}
        </button>
      </div>
 
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"8px",marginBottom:"14px"}}>
        {[{label:"Investido",value:totalInv,color:t.accentBlue},{label:"Rend./mês",value:totalMon,color:t.positive},{label:"Rend./ano",value:totalYea,color:"#8E6DC8"}].map(c=>(
          <Card key={c.label} style={{padding:"11px 9px",textAlign:"center"}}>
            <p style={{fontSize:"9px",color:t.textMuted,textTransform:"uppercase",letterSpacing:"0.5px",marginBottom:"4px",fontWeight:600}}>{c.label}</p>
            <p style={{fontSize:"11px",fontWeight:700,fontFamily:"'JetBrains Mono'",color:c.color}}>{formatBRL(c.value)}</p>
          </Card>
        ))}
      </div>
 
      {showForm&&(
        <Card style={{padding:"18px",marginBottom:"14px"}}>
          <h3 style={{fontSize:"14px",fontWeight:700,color:t.text,marginBottom:"12px"}}>Novo Investimento</h3>
          <Inp placeholder="Nome (ex: Tesouro Selic, XPML11...)" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          <Inp type="number" placeholder="Valor investido (R$)" value={form.principal} onChange={e=>setForm(f=>({...f,principal:e.target.value}))}/>
          <p style={{fontSize:"11px",color:t.textSub,marginBottom:"8px",fontWeight:600}}>Tipo de investimento</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px",marginBottom:"11px"}}>
            {INV_TYPES.map(tp=>(
              <button key={tp.id} className="btn" onClick={()=>setForm(f=>({...f,type:tp.id}))}
                style={{background:form.type===tp.id?`${tp.color}15`:t.bgInput,border:form.type===tp.id?`1.5px solid ${tp.color}`:`1.5px solid ${t.border}`,borderRadius:"10px",color:t.text,padding:"9px 7px",fontSize:"12px",display:"flex",alignItems:"center",gap:"6px",fontWeight:600}}>
                <span style={{fontSize:"15px"}}>{tp.icon}</span>{tp.label}
              </button>
            ))}
          </div>
          {form.type==="cdi"?(<>
            <p style={{fontSize:"11px",color:t.textSub,marginBottom:"5px"}}>
              Rendimento: <span style={{color:t.accentBlue,fontWeight:700}}>{form.cdiPct}% do CDI</span> = <span style={{color:t.positive,fontWeight:700}}>{(CDI_AA*Number(form.cdiPct)/100).toFixed(2)}% a.a.</span>
            </p>
            <input type="range" min="80" max="110" step="1" value={form.cdiPct} onChange={e=>setForm(f=>({...f,cdiPct:e.target.value}))}
              style={{width:"100%",marginBottom:"3px",accentColor:t.accentBlue}}/>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:"10px",color:t.textMuted,marginBottom:"10px"}}>
              <span>80%</span><span>95%</span><span>110%</span>
            </div>
          </>):(
            <Inp type="number" placeholder="Taxa de rendimento anual (%)" value={form.customRate} onChange={e=>setForm(f=>({...f,customRate:e.target.value}))}/>
          )}
          {err&&<p style={{color:t.negative,fontSize:"12px",marginBottom:"8px"}}>{err}</p>}
          <Btn variant="blue" onClick={add}>Adicionar investimento</Btn>
        </Card>
      )}
 
      {d.investments.length===0?(
        <div style={{textAlign:"center",padding:"36px 20px",color:t.textMuted}}><p style={{fontSize:"34px",marginBottom:"8px"}}>🌱</p><p style={{fontSize:"13px"}}>Nenhum investimento registrado.</p></div>
      ):d.investments.map(inv=>{
        const proj=calcProj(inv);
        const tp=INV_TYPES.find(x=>x.id===inv.type)||INV_TYPES[0];
        return(
          <Card key={inv.id} style={{padding:"15px",marginBottom:"8px",borderLeft:`3px solid ${tp.color}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"10px"}}>
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"6px",marginBottom:"2px"}}>
                  <span style={{fontSize:"16px"}}>{tp.icon}</span>
                  <p style={{fontSize:"14px",fontWeight:700,color:t.text}}>{inv.name}</p>
                </div>
                <p style={{fontSize:"11px",color:t.textMuted}}>{tp.label}{inv.type==="cdi"?` · ${inv.cdiPct}% CDI`:` · ${inv.customRate}% a.a.`}</p>
              </div>
              <button className="btn" onClick={()=>remove(inv.id)} style={{background:t.negativeSoft,color:t.negative,width:"26px",height:"26px",borderRadius:"7px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",border:`1px solid ${t.negative}30`}}>×</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"7px"}}>
              {[{label:"Investido",value:inv.principal,color:t.text},{label:"Rend./mês",value:proj.monthly,color:t.positive},{label:"Rend./ano",value:proj.yearly,color:"#8E6DC8"}].map(c=>(
                <div key={c.label} style={{background:t.bgInput,borderRadius:"8px",padding:"8px",textAlign:"center"}}>
                  <p style={{fontSize:"9px",color:t.textMuted,marginBottom:"3px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.4px"}}>{c.label}</p>
                  <p style={{fontSize:"11px",fontWeight:700,color:c.color,fontFamily:"'JetBrains Mono'"}}>{formatBRL(c.value)}</p>
                </div>
              ))}
            </div>
            <p style={{fontSize:"10px",color:t.textMuted,marginTop:"7px",textAlign:"right"}}>{formatPct(proj.rateAA)} a.a. · {formatPct(proj.rateAM)} a.m.</p>
          </Card>
        );
      })}
    </div>
  );
}
 
// ─── CONFIGURAÇÕES ────────────────────────────────────────────────────────────
function Settings({ d, save, user }) {
  const t = useTheme();
  const [salary, setSalary] = useState(d.salary||"");
  const [saved, setSaved] = useState(false);
  const handleSave = () => { save({salary:Number(salary)}); setSaved(true); setTimeout(()=>setSaved(false),2000); };
 
  return (
    <div className="fade-up">
      <h2 style={{fontSize:"21px",fontWeight:800,color:t.text,marginBottom:"18px"}}>Configurações</h2>
      <Card style={{padding:"20px",marginBottom:"12px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"18px"}}>
          <div style={{width:"52px",height:"52px",borderRadius:"14px",background:t.accentSoft,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"28px"}}>{user.avatar}</div>
          <div><p style={{fontSize:"16px",fontWeight:700,color:t.text}}>{user.name}</p><p style={{fontSize:"12px",color:t.textMuted}}>Sua conta no Finchly</p></div>
        </div>
        <p style={{fontSize:"11px",color:t.textSub,fontWeight:600,letterSpacing:"0.5px",textTransform:"uppercase",display:"block",marginBottom:"8px"}}>💼 Receita / Salário mensal</p>
        <Inp type="number" placeholder="R$ 0,00" value={salary} onChange={e=>setSalary(e.target.value)} style={{fontFamily:"'JetBrains Mono'",fontSize:"16px"}}/>
        <button className="btn" onClick={handleSave}
          style={{width:"100%",background:saved?`linear-gradient(135deg,${t.positive},#1E6640)`:`linear-gradient(135deg,${t.accent},#2D6E4A)`,color:"#fff",padding:"12px",borderRadius:"12px",fontSize:"14px",transition:"all .3s"}}>
          {saved?"✓ Salvo com sucesso!":"Salvar"}
        </button>
      </Card>
 
      <Card style={{padding:"18px"}}>
        <p style={{fontSize:"11px",fontWeight:700,color:t.textMuted,marginBottom:"12px",letterSpacing:"1px",textTransform:"uppercase"}}>Resumo da conta</p>
        {[["Gastos",d.expenses.length+" lançamentos"],["Dívidas",d.debts.length+" registradas"],["Investimentos",d.investments.length+" ativos"],["CDI (março/2026)",CDI_AA+"% a.a."]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${t.border}`}}>
            <span style={{fontSize:"13px",color:t.textSub}}>{l}</span>
            <span style={{fontSize:"13px",fontWeight:700,color:t.text}}>{v}</span>
          </div>
        ))}
      </Card>
 
      <p style={{fontSize:"12px",color:t.textMuted,textAlign:"center",marginTop:"24px"}}>Finchly · v2.0 🌿</p>
    </div>
  );
}
 
// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Root() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const t = theme === "light" ? LIGHT : DARK;
  const toggleTheme = () => setTheme(th => th === "light" ? "dark" : "light");
 
  return (
    <ThemeContext.Provider value={t}>
      {user
        ? <App user={user} onLogout={()=>setUser(null)} theme={theme} toggleTheme={toggleTheme}/>
        : <LoginScreen onLogin={setUser} theme={theme} toggleTheme={toggleTheme}/>
      }
    </ThemeContext.Provider>
  );
}