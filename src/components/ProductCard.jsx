import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useCartActions } from "../hooks/useCart";
import formatCurrency from "../utils/formatCurrency";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { addToCart } = useCartActions();
  const [message, setMessage] = useState("");
  const handleAddToCart = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const added = addToCart(currentUser.id, product);
    setMessage(
      added
        ? `${product.name} added to your cart.`
        : `${product.name} is at the available stock limit.`,
    );
  };

  return (
    <div className="group overflow-hidden rounded-xl border border-[#E8E6DD] bg-[#FCFCF8] p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4D8CC] hover:shadow-lg hover:shadow-[#293E30]/5 sm:p-4 ">
      <div>
        <Link to={`/products/${product.id}`} className="block">
          <div className="overflow-hidden rounded-lg bg-[#F0EFE8]">
            <img
              src={product.image}
              alt={product.name}
              className="h-36 w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] sm:h-48"
            />
          </div>

          <div className="px-1 pt-4">
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-[#85877C]">
              {product.category}
            </p>

            <h2 className="line-clamp-2 min-h-6 text-base font-semibold leading-6 text-[#292D28]">
              {product.name}
            </h2>

            <p className=" text-sm text-[#777A70]">{product.description}</p>

            <div className="mt-3 flex items-center justify-between gap-2">
              <p className="text-lg font-semibold tracking-tight text-[#293E30]">
                {formatCurrency(product.price)}
              </p>
            </div>

            <p
              className={`mt-2 text-sm font-medium ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </p>
          </div>
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`mt-4 w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#293E30] focus:ring-offset-2 ${
            product.stock > 0
              ? "bg-[#293E30] text-white  cursor-pointer hover:bg-[#3A5140]"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          {product.stock > 0 ? "Add to Cart" : "Unavailable"}
        </button>
        {message && (
          <p
            role={message.includes("stock limit") ? "alert" : "status"}
            aria-live={message.includes("stock limit") ? "assertive" : "polite"}
            className={`mt-2 text-center text-sm font-medium ${
              message.includes("stock limit")
                ? "text-[#A34D3D]"
                : "text-[#36563B]"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
