import { useState } from "react";
import useProducts from "../hooks/useProducts";

const AdminDashboard = () => {
  const { addProduct, products } = useProducts();
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.category.trim() ||
      !formData.image.trim() ||
      formData.price === "" ||
      formData.stock === ""
    ) {
      setError("Complete every field before saving the product.");
      return;
    }

    const price = Number(formData.price);
    const stock = Number(formData.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a whole number of zero or more.");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Price must be greater than zero.");
      return;
    }
    setError("");

    const productExists = products.some(
      (product) =>
        product.name?.trim().toLowerCase() ===
        formData.name.trim().toLowerCase(),
    );

    if (productExists) {
      setError("A product with this name already exists.");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      category: formData.category.trim(),
      image: formData.image.trim(),
      stock,
    };

    addProduct(newProduct);

    setError("");
    setSuccessMessage("Product added to your inventory.");

    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
    });
  };

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <main className="rounded-2xl border border-[#E7E5DC] bg-[#FCFCF8] p-5 shadow-sm sm:p-7 lg:p-8">
        <div className="mb-7 border-b border-[#E8E6DD] pb-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#7C8576]">
            Inventory Management
          </p>

          <h3 className="text-xl font-semibold tracking-tight text-[#293E30] sm:text-2xl">
            Add Product
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#777A70]">
            Enter product details to maintain your store inventory.
          </p>
        </div>

        <form
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            aria-label="Product name"
            required
            value={formData.name}
            onChange={handleOnChange}
            placeholder="Product Name"
            className="w-full rounded-lg border border-[#DEDED4] bg-white px-4 py-3 text-sm text-[#292D28] outline-none transition placeholder:text-[#96988E] focus:border-[#526B54] focus:ring-2 focus:ring-[#293E30]/10"
          />

          <input
            type="number"
            name="price"
            aria-label="Price"
            required
            min="0.01"
            step="0.01"
            value={formData.price}
            onChange={handleOnChange}
            placeholder="Price"
            className="w-full rounded-lg border border-[#DEDED4] bg-white px-4 py-3 text-sm text-[#292D28] outline-none transition placeholder:text-[#96988E] focus:border-[#526B54] focus:ring-2 focus:ring-[#293E30]/10"
          />

          <div className="md:col-span-2">
            <textarea
              aria-label="Product description"
              required
              placeholder="Description"
              name="description"
              value={formData.description}
              onChange={handleOnChange}
              className="min-h-32 w-full resize-y rounded-lg border border-[#DEDED4] bg-white px-4 py-3 text-sm leading-6 text-[#292D28] outline-none transition placeholder:text-[#96988E] focus:border-[#526B54] focus:ring-2 focus:ring-[#293E30]/10"
            />
          </div>

          <input
            type="text"
            name="category"
            aria-label="Category"
            required
            value={formData.category}
            onChange={handleOnChange}
            placeholder="Category"
            className="w-full rounded-lg border border-[#DEDED4] bg-white px-4 py-3 text-sm text-[#292D28] outline-none transition placeholder:text-[#96988E] focus:border-[#526B54] focus:ring-2 focus:ring-[#293E30]/10"
          />

          <input
            type="number"
            name="stock"
            aria-label="Stock quantity"
            required
            min="0"
            step="1"
            value={formData.stock}
            onChange={handleOnChange}
            placeholder="Stock Quantity"
            className="w-full rounded-lg border border-[#DEDED4] bg-white px-4 py-3 text-sm text-[#292D28] outline-none transition placeholder:text-[#96988E] focus:border-[#526B54] focus:ring-2 focus:ring-[#293E30]/10"
          />

          <div className="md:col-span-2">
            <input
              type="url"
              name="image"
              aria-label="Image URL"
              required
              value={formData.image}
              onChange={handleOnChange}
              placeholder="Image URL"
              className="w-full rounded-lg border border-[#DEDED4] bg-white px-4 py-3 text-sm text-[#292D28] outline-none transition placeholder:text-[#96988E] focus:border-[#526B54] focus:ring-2 focus:ring-[#293E30]/10"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 md:col-span-2"
            >
              {error}
            </p>
          )}

          {successMessage && (
            <p
              role="status"
              className="rounded-lg border border-green-200 bg-green-50 px-3 py-2.5 text-sm text-green-700 md:col-span-2"
            >
              {successMessage}
            </p>
          )}

          <button
            type="submit"
            className="mt-1 w-full rounded-lg bg-[#293E30] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#3A5140] focus:outline-none focus:ring-2 focus:ring-[#293E30] focus:ring-offset-2 md:col-span-2 cursor-pointer"
          >
            Save Product
          </button>
        </form>
      </main>
    </div>
  );
};

export default AdminDashboard;
