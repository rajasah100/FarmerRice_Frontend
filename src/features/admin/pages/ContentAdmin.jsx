import { useEffect, useState } from "react";
import {
  Save,
  RefreshCw,
  FileText,
  Plus,
  Trash2,
  Upload,
  Image as ImageIcon,
  Video as VideoIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import { contentAPI } from "@/api/contentApi";
import { uploadAPI } from "@/api/uploadApi";
import { useSiteContent } from "@/context/SiteContentContext";

/* ---------------------------------------------------------------- *
 * Helpers for inferring field types from key names                  *
 * ---------------------------------------------------------------- */

const IMAGE_KEYS = [
  "image",
  "img",
  "photo",
  "banner",
  "poster",
  "logo",
  "avatar",
  "picture",
  "thumb",
  "thumbnail",
  "cover",
  "backgroundimage",
  "circleimage",
  "heroimage",
  "videoposter",
];

const VIDEO_KEYS = ["video"];

const isImageKey = (key = "") => {
  const k = key.toLowerCase();
  return IMAGE_KEYS.some((needle) => k.includes(needle));
};

const isVideoKey = (key = "") => {
  const k = key.toLowerCase();
  // exact "video" or ends with "video"
  return VIDEO_KEYS.some((needle) => k === needle || k.endsWith(needle));
};

const isLongTextKey = (key = "") => {
  const k = key.toLowerCase();
  return (
    k.includes("desc") ||
    k.includes("body") ||
    k.includes("text") ||
    k.includes("address") ||
    k.includes("paragraph") ||
    k.includes("subtext") ||
    k.includes("circletext")
  );
};

// Heuristic: array of strings is treated as a list of strings.
// Array of objects gets recursed into per-item.
const arrayItemType = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return "string";
  const first = arr.find((x) => x !== null && x !== undefined);
  if (first === undefined) return "string";
  if (typeof first === "object") return "object";
  return typeof first;
};

const humanLabel = (key = "") =>
  key
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());

/* ---------------------------------------------------------------- *
 * Upload widgets                                                    *
 * ---------------------------------------------------------------- */

function ImageUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    try {
      setUploading(true);
      setProgress(0);
      const { data } = await uploadAPI.uploadImage(file, (evt) => {
        if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total));
      });
      onChange(data.data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = "";
    }
  };

  return (
    <div className="border border-[#e3d4c1] rounded-lg p-3 bg-[#fff9f0]">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-24 h-24 bg-[#f8f3ec] border border-[#e3d4c1] rounded-md overflow-hidden flex items-center justify-center">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageIcon size={28} className="text-[#c4a888]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {value && (
            <p className="text-xs text-[#9a7c63] truncate font-mono mb-2">
              {value}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[#7b5a42] hover:bg-[#68452d] text-white text-xs font-medium rounded-md transition">
              <Upload size={13} />
              {uploading ? `Uploading ${progress}%` : value ? "Replace" : "Upload"}
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#e3d4c1] text-[#7b5a42] text-xs font-medium rounded-md hover:bg-[#f8f3ec] transition"
              >
                <Trash2 size={13} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VideoUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("video/")) {
      toast.error("Please choose a video file");
      return;
    }
    try {
      setUploading(true);
      setProgress(0);
      const { data } = await uploadAPI.uploadVideo(file, (evt) => {
        if (evt.total) setProgress(Math.round((evt.loaded * 100) / evt.total));
      });
      onChange(data.data.url);
      toast.success("Video uploaded");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = "";
    }
  };

  return (
    <div className="border border-[#e3d4c1] rounded-lg p-3 bg-[#fff9f0]">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-32 h-24 bg-[#f8f3ec] border border-[#e3d4c1] rounded-md overflow-hidden flex items-center justify-center">
          {value ? (
            <video
              src={value}
              className="w-full h-full object-cover"
              muted
              loop
              autoPlay
              playsInline
            />
          ) : (
            <VideoIcon size={28} className="text-[#c4a888]" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          {value && (
            <p className="text-xs text-[#9a7c63] truncate font-mono mb-2">
              {value}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 bg-[#7b5a42] hover:bg-[#68452d] text-white text-xs font-medium rounded-md transition">
              <Upload size={13} />
              {uploading ? `Uploading ${progress}%` : value ? "Replace" : "Upload"}
              <input
                type="file"
                accept="video/*"
                onChange={handleFile}
                disabled={uploading}
                className="hidden"
              />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-3 py-1.5 border border-[#e3d4c1] text-[#7b5a42] text-xs font-medium rounded-md hover:bg-[#f8f3ec] transition"
              >
                <Trash2 size={13} />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Recursive field renderer                                          *
 * ---------------------------------------------------------------- */

function FieldRenderer({ keyName, value, onChange, level = 0 }) {
  // VIDEO field
  if (typeof value === "string" && isVideoKey(keyName)) {
    return <VideoUploader value={value} onChange={onChange} />;
  }

  // IMAGE field
  if (typeof value === "string" && isImageKey(keyName)) {
    return <ImageUploader value={value} onChange={onChange} />;
  }

  // BOOLEAN
  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 accent-[#7b5a42]"
        />
        <span className="text-sm text-[#6d513d]">
          {value ? "Enabled" : "Disabled"}
        </span>
      </label>
    );
  }

  // NUMBER
  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const n = e.target.value === "" ? "" : Number(e.target.value);
          onChange(Number.isNaN(n) ? value : n);
        }}
        className="w-full px-3 py-2 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
      />
    );
  }

  // ARRAY
  if (Array.isArray(value)) {
    return (
      <ArrayEditor
        keyName={keyName}
        value={value}
        onChange={onChange}
        level={level}
      />
    );
  }

  // OBJECT
  if (value && typeof value === "object") {
    return (
      <ObjectEditor
        keyName={keyName}
        value={value}
        onChange={onChange}
        level={level}
      />
    );
  }

  // STRING (default)
  const isLong = isLongTextKey(keyName) || (typeof value === "string" && value.length > 120);
  if (isLong) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-3 py-2 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30 resize-y"
      />
    );
  }

  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border border-[#e3d4c1] rounded-lg bg-[#fff9f0] text-[#6d513d] text-sm focus:outline-none focus:ring-2 focus:ring-[#7b5a42]/30"
    />
  );
}

/* ---------------------------------------------------------------- *
 * Object editor                                                     *
 * ---------------------------------------------------------------- */

function ObjectEditor({ value, onChange, level = 0 }) {
  const entries = Object.entries(value);

  return (
    <div
      className={`space-y-3 ${
        level > 0
          ? "border-l-2 border-[#e3d4c1] pl-4 ml-1 mt-2"
          : ""
      }`}
    >
      {entries.map(([k, v]) => (
        <div key={k}>
          <label className="block text-[#6d513d] text-sm font-medium mb-1.5">
            {humanLabel(k)}
          </label>
          <FieldRenderer
            keyName={k}
            value={v}
            level={level + 1}
            onChange={(newV) => {
              onChange({ ...value, [k]: newV });
            }}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Array editor                                                      *
 * ---------------------------------------------------------------- */

function ArrayEditor({ keyName, value, onChange, level = 0 }) {
  const itemType = arrayItemType(value);
  // For media-style array keys (e.g. "slides"), treat string items as images
  const stringKeyForItems =
    keyName.toLowerCase() === "slides" ? "image" : "item";

  const updateItem = (idx, newVal) => {
    const next = [...value];
    next[idx] = newVal;
    onChange(next);
  };

  const removeItem = (idx) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const moveItem = (idx, dir) => {
    const next = [...value];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next);
  };

  const addItem = () => {
    // Best-effort: use a template based on existing first item
    if (value.length > 0) {
      const first = value[0];
      if (first && typeof first === "object" && !Array.isArray(first)) {
        const blank = {};
        Object.keys(first).forEach((k) => {
          const fv = first[k];
          if (Array.isArray(fv)) blank[k] = [];
          else if (typeof fv === "object" && fv !== null) blank[k] = {};
          else if (typeof fv === "number") blank[k] = 0;
          else if (typeof fv === "boolean") blank[k] = false;
          else blank[k] = "";
        });
        onChange([...value, blank]);
        return;
      }
      if (typeof first === "number") return onChange([...value, 0]);
      if (typeof first === "boolean") return onChange([...value, false]);
    }
    onChange([...value, ""]);
  };

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="text-xs text-[#9a7c63] italic">No items yet.</p>
      )}

      {value.map((item, idx) => (
        <div
          key={idx}
          className="bg-[#fdfaf3] border border-[#e3d4c1] rounded-lg p-3"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#9a7c63] font-semibold">
              #{idx + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(idx, -1)}
                disabled={idx === 0}
                className="px-2 py-1 text-xs text-[#7b5a42] hover:bg-[#f8f3ec] rounded disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveItem(idx, +1)}
                disabled={idx === value.length - 1}
                className="px-2 py-1 text-xs text-[#7b5a42] hover:bg-[#f8f3ec] rounded disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {itemType === "object" ? (
            <ObjectEditor
              value={item}
              onChange={(newVal) => updateItem(idx, newVal)}
              level={level + 1}
            />
          ) : (
            <FieldRenderer
              keyName={stringKeyForItems}
              value={item}
              level={level + 1}
              onChange={(newVal) => updateItem(idx, newVal)}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="inline-flex items-center gap-1.5 px-3 py-2 border border-dashed border-[#7b5a42] text-[#7b5a42] text-sm rounded-lg hover:bg-[#f8f3ec] transition"
      >
        <Plus size={14} />
        Add item
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Main page                                                         *
 * ---------------------------------------------------------------- */

const ContentAdmin = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(null);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { refresh } = useSiteContent();

  const fetchSections = async () => {
    try {
      setLoading(true);
      const { data } = await contentAPI.getAllAdmin();
      setSections(data.data || []);
      if (data.data && data.data.length > 0) {
        // Keep the same active section if possible
        const stillActive =
          activeSection &&
          data.data.find((s) => s.section === activeSection.section);
        const next = stillActive || data.data[0];
        setActiveSection(next);
        setFormData(next.data || {});
      }
    } catch (err) {
      toast.error("Failed to load content sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectSection = (section) => {
    setActiveSection(section);
    setFormData(section.data || {});
  };

  const handleSave = async () => {
    if (!activeSection) return;
    try {
      setSaving(true);
      await contentAPI.upsert(activeSection.section, {
        label: activeSection.label,
        data: formData,
        isActive: activeSection.isActive,
      });
      toast.success("Content saved");
      await refresh();
      await fetchSections();
    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (activeSection) {
      setFormData(activeSection.data || {});
      toast.success("Reset to last saved version");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-[#7b5a42]">
        Loading content sections...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-[#7b5a42] text-2xl md:text-3xl">
            Site Content
          </h1>
          <p className="text-[#9a7c63] text-sm mt-1">
            Edit any text or media on the public site. Images and videos upload
            directly to the cloud.
          </p>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden px-3 py-2 border border-[#e3d4c1] rounded-lg text-sm text-[#7b5a42] hover:bg-[#f8f3ec] inline-flex items-center gap-2"
        >
          {sidebarOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          Sections
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SECTION LIST */}
        <aside
          className={`lg:col-span-1 bg-white border border-[#e3d4c1] rounded-xl p-3 h-fit ${
            sidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <h3 className="px-3 py-2 text-xs uppercase tracking-wider text-[#9a7c63] font-semibold">
            Sections
          </h3>
          <ul className="space-y-1">
            {sections.map((sec) => (
              <li key={sec._id}>
                <button
                  onClick={() => selectSection(sec)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition flex items-center gap-2 ${
                    activeSection?._id === sec._id
                      ? "bg-[#7b5a42] text-white"
                      : "text-[#6d513d] hover:bg-[#f8f3ec]"
                  }`}
                >
                  <FileText size={14} className="flex-shrink-0" />
                  <span className="truncate">{sec.label || sec.section}</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* EDITOR */}
        <div className="lg:col-span-3">
          {activeSection ? (
            <div className="bg-white border border-[#e3d4c1] rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-[#e3d4c1] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-0 bg-white z-10">
                <div>
                  <h3 className="font-serif text-[#7b5a42] text-xl">
                    {activeSection.label || activeSection.section}
                  </h3>
                  <p className="text-xs text-[#9a7c63] font-mono mt-1">
                    section: {activeSection.section}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 border border-[#e3d4c1] text-[#7b5a42] rounded-lg text-sm font-medium hover:bg-[#f8f3ec] flex items-center gap-2"
                  >
                    <RefreshCw size={14} />
                    Reset
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-5 py-2 bg-[#7b5a42] hover:bg-[#68452d] text-white rounded-lg text-sm font-medium flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <Save size={14} />
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <div className="p-5 max-h-[75vh] overflow-y-auto">
                {Object.keys(formData).length === 0 ? (
                  <p className="text-sm text-[#9a7c63] italic">
                    This section has no fields yet.
                  </p>
                ) : (
                  <ObjectEditor
                    value={formData}
                    onChange={(next) => setFormData(next)}
                  />
                )}

                <div className="mt-6 p-4 bg-[#f8f3ec] rounded-lg text-xs text-[#7a6656] space-y-1">
                  <p className="font-semibold text-[#6d513d]">Tips:</p>
                  <p>• Image and video fields upload directly to the cloud.</p>
                  <p>• Use ↑ / ↓ on array items to reorder.</p>
                  <p>• Click <strong>Save</strong> after editing — public site updates immediately.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#e3d4c1] rounded-xl p-12 text-center text-[#9a7c63]">
              Select a section from the left to edit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentAdmin;
