import React, { useState, useEffect } from "react";
import { DEMO_MODE, resetDemo } from "./demo";
import "./demo.css";
import DigitalLibrary from "./DigitalLibrary";
import AdminDashboard from "./pages/AdminDashboard";
import "./theme-dark.css";

function App() {
  const [mode, setMode] = useState("site"); // "site" | "admin"

  // Restore the person's saved theme/compact-mode preference the
  // instant the app loads, before anything else renders -- so
  // there's no flash of the wrong theme.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    const compact = localStorage.getItem("settings.compact") === "true";
    document.documentElement.classList.toggle("compact-mode", compact);
  }, []);

  return <>
    {DEMO_MODE && <aside className="demo-banner" aria-label="Demo controls">
      <span><strong>Interactive demo</strong> · Sample data saved in this browser. No real login or payments.</span>
      <div><button onClick={() => { localStorage.setItem("userId", "1"); setMode("site"); }}>Reader Demo</button>
      <button onClick={() => setMode("admin")}>Admin Demo</button>
      <button onClick={resetDemo}>Reset Demo</button></div>
    </aside>}
    {mode === "admin" ? <AdminDashboard onExitAdmin={() => setMode("site")} /> : <DigitalLibrary onOpenAdmin={() => setMode("admin")} />}
  </>;
}
export default App;
