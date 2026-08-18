import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

export const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        >
          {/* Sidebar */}
          <div className="flex h-screen overflow-hidden">
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}

            <div className="flex flex-1 flex-col overflow-hidden">
              <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
              <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                <Outlet />
              </main>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
