
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
