import { useState } from "react";
import { CategoryFilter } from "../componenets/CategoryFilter";
import ProductCard from "../componenets/ProductCard";
import SearchFilter from "../componenets/SearchFilter";
import { useCart } from "../context/CartContext";

const ProductList = () => {
  const { products, loading } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filterProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      product.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto px-4 md:px-8 pt-8">

      {/* Search */}
      <SearchFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Product Heading */}
      <h2 className="font-bold text-2xl mx-auto px-4 md:px-8 pt-5">
        Featured ({products.length} Items)
      </h2>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div
            className="w-12 h-12 border-4 border-gray-700
                       border-t-orange-500 rounded-full animate-spin"
          ></div>

          <p className="mt-4 text-gray-400 text-lg">
            Loading products...
          </p>
        </div>
      ) : filterProducts.length === 0 ? (
        /* No Products Found */
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">
            No products found.
          </p>
        </div>
      ) : (
        /* Products */
        <div
          className="mt-7 grid grid-cols-1 sm:grid-cols-2
                     lg:grid-cols-3 xl:grid-cols-4
                     gap-8 justify-center items-center"
        >
          {filterProducts.map((product) => (
            <div key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default ProductList;