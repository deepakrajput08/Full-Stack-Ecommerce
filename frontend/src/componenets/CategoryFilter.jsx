import { initialProducts } from "../data/Product";
import { Tag } from "lucide-react";
import ProductCard from "./ProductCard";

const availableCategories = [
  "All",
  ...new Set(initialProducts.map((p) => p.category)),
];

export const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <>
      <div className="flex flex-wrap gap-3 border-b border-gray-800 pb-6">
        <Tag className="w-5 h-5 text-orange-500 mt-2 mr-2 hidden sm:block" />
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2 font-bold transition duration-200 rounded-full shadow-md ${
              selectedCategory == category
                ? "bg-orange-600 text-white shadow-orange-800/50"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-orange-400 border border-gray-700"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </>
  );
};
