import { useState } from "react";
import { Upload, Image as ImageIcon, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { uploadAPI } from "@/api/uploadApi";

/**
 * Reusable image upload field. Uploads directly to Cloudinary via the
 * backend `/api/upload/image` endpoint and writes the resulting URL back
 * to the parent via `onChange(url)`.
 */
export default function ImageUpload({ value, onChange, label }) {
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
    <div>
      {label && (
        <label className="block text-[#6d513d] text-sm font-medium mb-2">
          {label}
        </label>
      )}
      <div className="border border-[#e3d4c1] rounded-lg p-3 bg-[#fff9f0] flex items-start gap-3">
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
              {uploading
                ? `Uploading ${progress}%`
                : value
                ? "Replace image"
                : "Upload image"}
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
