import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  HelpCircle,
  MessageSquare,
  Briefcase,
  Package,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { label: "Site Content", icon: FileText, path: "/admin/content" },
  { label: "Portfolios", icon: Briefcase, path: "/admin/portfolios" },
  { label: "Products", icon: Package, path: "/admin/products" },
  { label: "Leaders", icon: Users, path: "/admin/leaders" },
  { label: "FAQs", icon: HelpCircle, path: "/admin/faqs" },
  { label: "Contacts", icon: MessageSquare, path: "/admin/contacts" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-[#f7f3eb] flex">
      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen w-64 bg-[#7b5a42] text-white z-40 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-serif">
            Farmers<span className="text-amber-200">Rice</span>
          </h1>
          <p className="text-xs text-amber-100/70 mt-1 tracking-wider uppercase">
            Admin Panel
          </p>
        </div>

        {/* NAV */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  active
                    ? "bg-white text-[#7b5a42] shadow-md"
                    : "text-white/85 hover:bg-white/10"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* USER + LOGOUT */}
        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2">
            <p className="text-xs text-amber-100/60 uppercase tracking-wider">
              Signed in as
            </p>
            <p className="text-sm font-medium text-white mt-1 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-amber-100/80 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white/85 hover:bg-red-500/20 hover:text-red-200 transition"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* TOPBAR */}
        <header className="bg-white border-b border-[#e3d4c1] sticky top-0 z-20 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[#7b5a42]"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h2 className="font-serif text-[#7b5a42] text-xl md:text-2xl">
              {navItems.find((i) => isActive(i.path))?.label || "Admin"}
            </h2>
            <div className="hidden lg:flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#7b5a42] text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
