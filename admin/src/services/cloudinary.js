const CLOUD_NAME = "dizsxdpky";
const UPLOAD_PRESET = "admin_products";

export const uploadImagesToCloudinary = async (files) => {
  const uploadPromises = Array.from(files).map(async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  });

  return Promise.all(uploadPromises);
};
