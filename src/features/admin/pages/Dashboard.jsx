import { useEffect, useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  Briefcase,
  Users,
  TrendingUp,
  Mail,
} from "lucide-react";
import { dashboardAPI } from "@/api/dashboardApi";

const StatCard = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white border border-[#e3d4c1] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <TrendingUp size={18} className="text-green-600" />
    </div>
    <p className="text-[#9a7c63] text-sm font-medium">{label}</p>
    <p className="text-[#7b5a42] text-3xl font-bold font-serif mt-1">{value}</p>
    {sub && <p className="text-xs text-[#9a7c63] mt-2">{sub}</p>}
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await dashboardAPI.getStats();
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-[#7b5a42]">Loading stats...</div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-20 text-red-700">
        Failed to load dashboard stats
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* WELCOME */}
      <div className="bg-gradient-to-r from-[#7b5a42] to-[#9a6b4d] rounded-2xl p-8 text-white">
        <h1 className="font-serif text-3xl md:text-4xl mb-2">
          Welcome to Admin Dashboard
        </h1>
        <p className="text-amber-100/90">
          Manage your content, monitor contacts, and update website data.
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          icon={HelpCircle}
          label="Total FAQs"
          value={stats.faqs.total}
          sub={`${stats.faqs.active} active`}
          color="bg-blue-500"
        />
        <StatCard
          icon={MessageSquare}
          label="Total Contacts"
          value={stats.contacts.total}
          sub={`${stats.contacts.new} new messages`}
          color="bg-green-500"
        />
        <StatCard
          icon={Briefcase}
          label="Portfolios"
          value={stats.portfolios.total}
          sub={`${stats.portfolios.active} active`}
          color="bg-purple-500"
        />
        <StatCard
          icon={Users}
          label="Leaders"
          value={stats.leaders.total}
          sub="Team members"
          color="bg-orange-500"
        />
      </div>

      {/* RECENT CONTACTS */}
      <div className="bg-white border border-[#e3d4c1] rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-[#e3d4c1] flex items-center gap-3">
          <Mail size={18} className="text-[#7b5a42]" />
          <h3 className="font-serif text-[#7b5a42] text-xl">
            Recent Contact Messages
          </h3>
        </div>

        {stats.recentContacts && stats.recentContacts.length > 0 ? (
          <div className="divide-y divide-[#e3d4c1]">
            {stats.recentContacts.map((contact) => (
              <div
                key={contact._id}
                className="p-5 hover:bg-[#f8f3ec] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#6d513d]">{contact.name}</p>
                    <p className="text-sm text-[#9a7c63]">{contact.email}</p>
                    <p className="text-sm text-[#7a6656] mt-2 line-clamp-2">
                      {contact.message}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                      contact.status === "new"
                        ? "bg-blue-100 text-blue-800"
                        : contact.status === "read"
                        ? "bg-gray-100 text-gray-700"
                        : contact.status === "replied"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {contact.status}
                  </span>
                </div>
                <p className="text-xs text-[#9a7c63] mt-3">
                  {new Date(contact.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center text-[#9a7c63]">
            No contact messages yet
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
