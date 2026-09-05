import { Link } from "react-router-dom";
import React from "react";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 shadow-xl flex flex-col h-full group transition-all duration-500 hover:scale-[1.03] hover:shadow-orange-900/40">

      <Link to={`/product/${product._id}`} className="block">
        {/* Image Container */}
        <div className="relative h-54 bg-white overflow-hidden flex items-center justify-center">

          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />

          {/* Price */}
          <div className="absolute bottom-0 left-0 bg-orange-600 text-white px-4 py-2 rounded-tr-xl font-bold">
            ₹{Number(product.price).toFixed(2)}
          </div>

          {/* Out Of Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
              OUT OF STOCK
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4 flex flex-col grow">

        <Link to={`/product/${product._id}`}>
          <h3 className="text-white font-bold text-lg text-center line-clamp-1 hover:text-orange-400 cursor-pointer">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        {/* Category + Stock */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 gap-2">

          <span className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full font-semibold">
            {product.category}
          </span>

          <span
            className={
              product.stock > 0
                ? "text-green-400 font-semibold"
                : "text-red-400 font-semibold"
            }
          >
            {product.stock > 0
              ? `${product.stock} left`
              : "Out of stock"}
          </span>

        </div>

        {/* Add To Cart */}
        <button
          onClick={() => addToCart(product)}
          disabled={isOutOfStock}
          className={`w-full py-3 text-white font-bold rounded-full shadow-lg
            flex items-center justify-center space-x-2 uppercase tracking-wider
            transition duration-300
            ${
              isOutOfStock
                ? "bg-gray-700 cursor-not-allowed opacity-60"
                : "bg-orange-600 shadow-orange-800/50 cursor-pointer hover:bg-orange-700 hover:ring-4 hover:ring-pink-600/50"
            }`}
        >
          <ShoppingCart className="w-5 h-5" />

          <span>
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </span>
        </button>

      </div>
    </div>
  );
};

export default ProductCard;