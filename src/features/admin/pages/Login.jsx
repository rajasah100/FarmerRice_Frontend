import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/dashboard";

  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error("Please fill in both email and password");
      return;
    }
    try {
      setLoading(true);
      const user = await login(credentials.email, credentials.password);
      if (user.role !== "admin") {
        toast.error("Admin access required");
        return;
      }
      toast.success(`Welcome back, ${user.name}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3eb] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-green-700">
            Farmers<span className="text-gray-700">Rice</span>
          </h1>
          <p className="text-[#7a6656] mt-2 text-sm tracking-wider uppercase">
            Admin Portal
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-[#e3d4c1] p-8 md:p-10">
          <h2 className="font-serif text-[#7b5a42] text-2xl md:text-3xl mb-2">
            Welcome Back
          </h2>
          <p className="text-[#9a7c63] text-sm mb-8">
            Sign in to access the admin dashboard
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[#6d513d] text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a7c63]"
                />
                <input
                  type="email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  placeholder="Email"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e3d4c1] bg-[#fff9f0] text-[#6d513d] placeholder-[#c4a888] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30 focus:border-[#7b5a42] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#6d513d] text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a7c63]"
                />
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border border-[#e3d4c1] bg-[#fff9f0] text-[#6d513d] placeholder-[#c4a888] focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30 focus:border-[#7b5a42] transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#7b5a42] hover:bg-[#68452d] text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          
        </div>

        <p className="text-center text-[#9a7c63] text-sm mt-6">
          ← <a href="/" className="hover:text-[#7b5a42] hover:underline">Back to website</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
