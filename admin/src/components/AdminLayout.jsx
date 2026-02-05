import { NavLink, useNavigate } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-green-50">
      <aside className="w-64 bg-white border-r border-green-200 flex flex-col">
        <div className="p-6 text-2xl font-bold text-green-700 border-b border-green-200">
          Admin Panel
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {["products", "orders"].map((route) => (
            <NavLink
              key={route}
              to={`/${route}`}
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${
                  isActive
                    ? "bg-green-100 text-green-700 font-medium"
                    : "text-gray-700 hover:bg-green-50"
                }`
              }
            >
              {route.charAt(0).toUpperCase() + route.slice(1)}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={logout}
          className="m-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
