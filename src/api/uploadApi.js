import axios from "./axios";

export const uploadAPI = {
  /**
   * Uploads an image file to Cloudinary via the backend.
   * Returns the response data: { url, publicId, ... }
   */
  uploadImage: (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    });
  },

  /**
   * Uploads a video file to Cloudinary via the backend.
   */
  uploadVideo: (file, onProgress) => {
    const formData = new FormData();
    formData.append("file", file);
    return axios.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress,
    });
  },
};
