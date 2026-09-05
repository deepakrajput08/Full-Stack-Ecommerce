
import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";

import { toast, Bounce } from "react-toastify";

const CartContext = createContext();

const CartProvider = (props) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    setLoading(true);

    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      });
  }, []);

  // ================= TOAST OPTIONS =================
  const toastOptions = {
    position: "top-right",
    autoClose: 1500,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    transition: Bounce,
  };

  // ================= ADD TO CART =================
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productId = product._id || product.id;

      const existingItem = prevCart.find(
        (item) => (item._id || item.id) === productId
      );

      // Stock check
      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          toast.error(
            `Only ${product.stock} items available in stock`,
            toastOptions
          );

          return prevCart;
        }

        toast.success("Item Added to Cart", toastOptions);

        return prevCart.map((item) =>
          (item._id || item.id) === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      // Product completely out of stock
      if (product.stock <= 0) {
        toast.error(
          "This product is out of stock",
          toastOptions
        );

        return prevCart;
      }

      toast.success("Item Added to Cart", toastOptions);

      return [
        ...prevCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  };

  // ================= ADD PRODUCT =================
  const addProduct = async (product) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...product,
            price: Number(product.price),
            stock: Number(product.stock),
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();

        console.log(
          "ADD PRODUCT BACKEND ERROR:",
          res.status,
          errorData
        );

        throw new Error(
          errorData.message || "Failed to add product"
        );
      }

      const data = await res.json();

      setProducts((prevProducts) => [
        ...prevProducts,
        data,
      ]);

      toast.success(
        "Product added successfully!",
        toastOptions
      );

      return data;
    } catch (error) {
      console.error("Failed to add product:", error);
      throw error;
    }
  };

  // ================= UPDATE PRODUCT =================
  const updateProduct = async (id, productData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({
            ...productData,
            price: Number(productData.price),
            stock: Number(productData.stock),
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update product");
      }

      const updatedProduct = await res.json();

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === id ? updatedProduct : product
        )
      );

      toast.success(
        "Product updated successfully!",
        toastOptions
      );

      return updatedProduct;
    } catch (error) {
      console.error("Failed to update product:", error);
      throw error;
    }
  };

  // ================= DELETE PRODUCT =================
  const deleteProduct = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(
        `http://localhost:5000/api/products/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((prevProducts) =>
        prevProducts.filter(
          (product) => product._id !== id
        )
      );

      // Remove deleted product from cart too
      setCart((prevCart) =>
        prevCart.filter(
          (item) => (item._id || item.id) !== id
        )
      );

      toast.success(
        "Product deleted successfully!",
        toastOptions
      );
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // ================= REMOVE FROM CART =================
  const removeFromCart = (
    productId,
    removeAll = false
  ) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => (item._id || item.id) === productId
      );

      if (!existingItem) {
        return prevCart;
      }

      if (
        removeAll ||
        existingItem.quantity === 1
      ) {
        toast.success(
          "Item Removed From Cart",
          toastOptions
        );

        return prevCart.filter(
          (item) => (item._id || item.id) !== productId
        );
      }

      return prevCart.map((item) =>
        (item._id || item.id) === productId
          ? {
              ...item,
              quantity: item.quantity - 1,
            }
          : item
      );
    });
  };

  // ================= CLEAR CART =================
  const clearCart = () => {
    setCart([]);
  };

  // ================= CART COUNT =================
  const cartCount = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      ),
    [cart]
  );

  // ================= CART TOTAL =================
  const cartTotal = useMemo(
    () =>
      cart.reduce(
        (total, item) =>
          total +
          item.price * item.quantity,
        0
      ),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        products,
        loading,
        cart,
        clearCart,
        addToCart,
        addProduct,
        updateProduct,
        deleteProduct,
        removeFromCart,
        cartTotal,
        cartCount,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () =>
  useContext(CartContext);
