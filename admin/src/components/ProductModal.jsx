import { useEffect, useState } from "react";
import api from "../services/api";
import Toast from "./Toast";
import { uploadImagesToCloudinary } from "../services/cloudinary";

const ProductModal = ({ isOpen, onClose, onSuccess, product }) => {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [fileCount, setFileCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({});
useEffect(() => {
  if (product) {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
    });
    setExistingImages(product.images || []);
  } else {
    
    setForm({
      name: "",
      description: "",
      price: "",
      stock: "",
      category: "",
    });
    setExistingImages([]);
    setNewImages([]);
    setFileCount(0);
  }
}, [product, isOpen]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const removeExistingImage = (url) => {
    setExistingImages(existingImages.filter((img) => img !== url));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let uploadedUrls = [];

      if (newImages.length > 0) {
        uploadedUrls = await uploadImagesToCloudinary(newImages);
      }

      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: [...existingImages, ...uploadedUrls],
      };

      if (isEdit) {
        await api.put(`/api/admin/products/${product._id}`, payload);
      } else {
        await api.post("/api/admin/products", payload);
      }

      setToast({ message: "Product saved successfully", type: "success" });

      setNewImages([]);
      setFileCount(0);

      onSuccess();
      onClose();
    } catch (err) {
      setToast({ message: "Failed to save product", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          {isEdit ? "Edit Product" : "Add Product"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          <div className="grid grid-cols-2 gap-3">
            <input
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded"
            />
            <input
              name="stock"
              placeholder="Stock"
              value={form.stock}
              onChange={handleChange}
              required
              className="border px-3 py-2 rounded"
            />
          </div>

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />

          {/* IMAGE UPLOAD (STYLED) */}
          <div>
            <label className="block font-medium text-gray-700 mb-2">
              Product Images
            </label>

            <label
              htmlFor="imageUpload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-green-300 rounded-lg cursor-pointer bg-green-50 hover:bg-green-100 transition"
            >
              <svg
                className="w-8 h-8 text-green-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 8v-6m0 6l4-4m-4 4l-4-4"
                />
              </svg>

              <p className="text-sm text-gray-600">
                {fileCount > 0
                  ? `${fileCount} file${fileCount > 1 ? "s" : ""} selected`
                  : "Click to upload images"}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP • Multiple allowed
              </p>
            </label>

            <input
              id="imageUpload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                setNewImages(e.target.files);
                setFileCount(e.target.files.length);
              }}
            />
          </div>

          {/* EXISTING IMAGE PREVIEW */}
          {existingImages.length > 0 && (
            <div>
              <p className="font-medium mb-2">Existing Images</p>
              <div className="flex flex-wrap gap-3">
                {existingImages.map((img) => (
                  <div key={img} className="relative">
                    <img
                      src={img}
                      alt=""
                      className="w-24 h-24 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 rounded"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>

      <Toast {...toast} onClose={() => setToast({})} />
    </div>
  );
};

export default ProductModal;
