import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Public layout & pages
import UserLayout from "@/features/public/components/layout/UserLayout";
import Home from "@/features/public/pages/Home";
import About from "@/features/public/pages/AboutPage";
import PortfolioPage from "@/features/public/pages/PortfolioPage";
import PortfolioCategory from "@/features/public/pages/PortfolioCategory";
import ExploreRice from "@/features/public/pages/ExploreRice";
import Contact from "@/features/public/pages/Contact";
import FAQs from "@/features/public/pages/FAQs";

// Admin
import AdminLayout from "@/features/admin/components/AdminLayout";
import Login from "@/features/admin/pages/Login";
import Dashboard from "@/features/admin/pages/Dashboard";
import FAQsAdmin from "@/features/admin/pages/FAQsAdmin";
import ContactsAdmin from "@/features/admin/pages/ContactsAdmin";
import PortfoliosAdmin from "@/features/admin/pages/PortfoliosAdmin";
import ProductsAdmin from "@/features/admin/pages/ProductsAdmin";
import LeadersAdmin from "@/features/admin/pages/LeadersAdmin";
import ContentAdmin from "@/features/admin/pages/ContentAdmin";

// Context
import { AuthProvider } from "@/context/AuthContext";
import { SiteContentProvider } from "@/context/SiteContentContext";
import ProtectedRoute from "@/routes/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <SiteContentProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#7b5a42",
                color: "#fff",
                fontFamily: "system-ui",
              },
              success: { iconTheme: { primary: "#fff", secondary: "#7b5a42" } },
              error: { style: { background: "#dc2626", color: "#fff" } },
            }}
          />
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="about" element={<About />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="portfolio/:category" element={<PortfolioCategory />} />
              <Route path="explore-rice" element={<ExploreRice />} />
              <Route path="contact-us" element={<Contact />} />
              <Route path="FAQS" element={<FAQs />} />
              <Route path="faqs" element={<FAQs />} />
            </Route>

            {/* ADMIN LOGIN */}
            <Route path="/admin/login" element={<Login />} />

            {/* ADMIN PROTECTED ROUTES */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="faqs" element={<FAQsAdmin />} />
              <Route path="contacts" element={<ContactsAdmin />} />
              <Route path="portfolios" element={<PortfoliosAdmin />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="leaders" element={<LeadersAdmin />} />
              <Route path="content" element={<ContentAdmin />} />
            </Route>

            {/* 404 -> home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </SiteContentProvider>
    </AuthProvider>
  );
}

export default App;
