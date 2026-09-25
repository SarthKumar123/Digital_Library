import React, { useState, useEffect } from "react";
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

  if (mode === "admin") {
    return <AdminDashboard onExitAdmin={() => setMode("site")} />;
  }

  return <DigitalLibrary onOpenAdmin={() => setMode("admin")} />;
}

export default App;
