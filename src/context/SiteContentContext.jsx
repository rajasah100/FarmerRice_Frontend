import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { contentAPI } from "@/api/contentApi";

const SiteContentContext = createContext(null);

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await contentAPI.getAll();
      setContent(data.data || {});
      setError("");
    } catch (err) {
      setError("Failed to load site content");
      console.error("Content fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const value = {
    content,
    loading,
    error,
    refresh: fetchContent,
    // Helper: get content for a section with optional fallback
    get: (section, fallback = {}) => content[section] || fallback,
  };

  return (
    <SiteContentContext.Provider value={value}>
      {children}
    </SiteContentContext.Provider>
  );
};

export const useSiteContent = () => {
  const ctx = useContext(SiteContentContext);
  if (!ctx) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return ctx;
};
