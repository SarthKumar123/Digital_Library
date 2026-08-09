import React, { useState } from "react";
import DigitalLibrary from "./DigitalLibrary";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [mode, setMode] = useState("site"); // "site" | "admin"

  if (mode === "admin") {
    return <AdminDashboard onExitAdmin={() => setMode("site")} />;
  }

  return <DigitalLibrary onOpenAdmin={() => setMode("admin")} />;
}

export default App;
