import { useEffect, useState } from "react";
import api from "../services/api";
import ProductModal from "../components/ProductModal";
import Toast from "../components/Toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState({});
  const [modal, setModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/api/admin/products");
      setProducts(res.data);
    } catch {
      setToast({ message: "Failed to load products", type: "error" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  const del = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      await api.delete(`/api/admin/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setToast({ message: "Product deleted", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  return (
    <>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold text-green-700">Products</h1>
        <button
          onClick={() => {
            setSelected(null);
            setModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      <table className="w-full bg-white border border-green-200 rounded">
        <thead className="bg-green-100">
          <tr>
            {["Name", "Category", "Price", "Stock", "Actions"].map((h) => (
              <th key={h} className="p-3 text-left">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td className="p-3">{p.category}</td>
              <td className="p-3">₹{p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3 space-x-3">
                <button
                  className="text-green-600"
                  onClick={() => {
                    setSelected(p);
                    setModal(true);
                  }}
                >
                  Edit
                </button>
                <button className="text-red-500" onClick={() => del(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductModal
        isOpen={modal}
        product={selected}
        onClose={() => setModal(false)}
        onSuccess={load}
      />

      <Toast {...toast} onClose={() => setToast({})} />
    </>
  );
};

export default Products;
