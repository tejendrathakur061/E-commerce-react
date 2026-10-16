import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AuthContext from "./AuthContext";
import { CartActionsContext, CartContext } from "./CartContext";
import OrdersContext from "./OrdersContext";
import ProductsContext from "./ProductsContext";
import UsersContext from "./UsersContext";
import {
  getCart,
  getOrders,
  getProducts,
  getUsers,
  currentUser as getCurrentUser,
  saveCart,
  saveOrder,
  saveProducts,
  saveUser,
  setAdminInfo,
  setCurrentUser as persistCurrentUser,
  signOut as persistSignOut,
} from "../utils/LocalHelper";

const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(() => getProducts());
  const productsRef = useRef(products);
  const [users, setUsers] = useState(() => getUsers());
  const usersRef = useRef(users);
  const [cart, setCart] = useState(() => getCart());
  const cartRef = useRef(cart);
  const [orders, setOrders] = useState(() => getOrders());
  const ordersRef = useRef(orders);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());

  useEffect(() => {
    setAdminInfo();
  }, []);

  const addProduct = useCallback(
    (product) => {
      const updatedProducts = [...productsRef.current, product];
      productsRef.current = updatedProducts;
      saveProducts(updatedProducts);
      setProducts(updatedProducts);
    },
    [],
  );

  const registerUser = useCallback(
    (user) => {
      saveUser(user);
      const updatedUsers = [...usersRef.current, user];
      usersRef.current = updatedUsers;
      setUsers(updatedUsers);
    },
    [],
  );

  const login = useCallback((user) => {
    persistCurrentUser(user);
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    persistSignOut();
    setCurrentUser(null);
  }, []);

  const commitCart = useCallback((nextCart) => {
    cartRef.current = nextCart;
    saveCart(nextCart);
    setCart(nextCart);
  }, []);

  const addToCart = useCallback(
    (userId, product) => {
      const currentCart = cartRef.current;
      const cartIndex = currentCart.findIndex(
        (userCart) => userCart.userId === userId,
      );
      const nextCart = [...currentCart];
      const userCart =
        cartIndex === -1 ? null : nextCart[cartIndex];
      const item = userCart?.items.find(
        (cartItem) => cartItem.id === product.id,
      );
      const latestProduct = productsRef.current.find(
        (savedProduct) => savedProduct.id === product.id,
      );

      if (
        latestProduct &&
        Number.isFinite(latestProduct.stock) &&
        (item?.qty ?? 0) >= latestProduct.stock
      ) {
        return false;
      }

      if (cartIndex === -1) {
        nextCart.push({ userId, items: [{ ...product, qty: 1 }] });
      } else {
        const itemIndex = userCart.items.findIndex(
          (item) => item.id === product.id,
        );
        const items = [...userCart.items];

        if (itemIndex === -1) {
          items.push({ ...product, qty: 1 });
        } else {
          items[itemIndex] = {
            ...items[itemIndex],
            qty: items[itemIndex].qty + 1,
          };
        }

        nextCart[cartIndex] = { ...userCart, items };
      }

      commitCart(nextCart);
      return true;
    },
    [commitCart],
  );

  const removeFromCart = useCallback(
    (userId, productId) => {
      const currentCart = cartRef.current;
      const cartIndex = currentCart.findIndex(
        (userCart) => userCart.userId === userId,
      );
      if (cartIndex === -1) return;

      const nextCart = [...currentCart];
      nextCart[cartIndex] = {
        ...nextCart[cartIndex],
        items: nextCart[cartIndex].items.filter(
          (item) => item.id !== productId,
        ),
      };
      commitCart(nextCart);
    },
    [commitCart],
  );

  const updateCartQuantity = useCallback(
    (userId, productId, action) => {
      if (action !== "inc" && action !== "dec") return;

      const currentCart = cartRef.current;
      const cartIndex = currentCart.findIndex(
        (userCart) => userCart.userId === userId,
      );  
      if (cartIndex === -1) return false;

      const userCart = currentCart[cartIndex];
      const item = userCart.items.find((cartItem) => cartItem.id === productId);
      if (!item) return false;

      if (action === "inc") {
        const product = productsRef.current.find(
          (savedProduct) => savedProduct.id === productId,
        );
        if (
          product &&
          Number.isFinite(product.stock) &&
          item.qty >= product.stock
        ) {
          return false;
        }
      }

      const nextCart = [...currentCart];
      const items =
        action === "dec" && item.qty <= 1
          ? userCart.items.filter((cartItem) => cartItem.id !== productId)
          : userCart.items.map((cartItem) =>
              cartItem.id === productId
                ? {
                    ...cartItem,
                    qty: action === "inc" ? cartItem.qty + 1 : cartItem.qty - 1,
                  }
                : cartItem,
            );

      nextCart[cartIndex] = { ...userCart, items };
      commitCart(nextCart);
      return true;
    },
    [commitCart],
  );

  const clearUserCart = useCallback(
    (userId) => {
      const nextCart = cartRef.current.filter(
        (userCart) => userCart.userId !== userId,
      );
      commitCart(nextCart);
    },
    [commitCart],
  );

  const getUserCart = useCallback(
    (userId) =>
      cart.find((userCart) => userCart.userId === userId)?.items ?? [],
    [cart],
  );

  const placeOrder = useCallback(
    (order) => {
      const duplicate = ordersRef.current.some(
        (savedOrder) =>
          savedOrder.userId === order.userId &&
          JSON.stringify(savedOrder.items) === JSON.stringify(order.items),
      );

      if (duplicate) return "duplicate";

      const currentProducts = productsRef.current;
      const purchasedQuantities = order.items.reduce((quantities, item) => {
        quantities.set(
          item.id,
          (quantities.get(item.id) || 0) + item.qty,
        );
        return quantities;
      }, new Map());
      const insufficientStock = [...purchasedQuantities].some(
        ([productId, quantity]) => {
          const product = currentProducts.find(
            (savedProduct) => savedProduct.id === productId,
          );
          return (
            product &&
            Number.isFinite(product.stock) &&
            quantity > product.stock
          );
        },
      );

      if (insufficientStock) return "out-of-stock";

      const saved = saveOrder(order);
      if (!saved) return "duplicate";

      const updatedProducts = currentProducts.map((product) =>
        purchasedQuantities.has(product.id) &&
        Number.isFinite(product.stock)
          ? {
              ...product,
              stock: Math.max(
                0,
                product.stock - purchasedQuantities.get(product.id),
              ),
            }
          : product,
      );

      saveProducts(updatedProducts);
      productsRef.current = updatedProducts;
      setProducts(updatedProducts);
      const updatedOrders = [...ordersRef.current, order];
      ordersRef.current = updatedOrders;
      setOrders(updatedOrders);
      return "success";
    },
    [],
  );

  const productsValue = useMemo(
    () => ({ products, addProduct }),
    [products, addProduct],
  );
  
  const usersValue = useMemo(
    () => ({ users, registerUser }),
    [users, registerUser],
  );

  const authValue = useMemo(
    () => ({ currentUser, login, logout }),
    [currentUser, login, logout],
  );

  const cartValue = useMemo(() => ({ cart, getUserCart }), [cart, getUserCart]);
  const cartActionsValue = useMemo(
    () => ({ addToCart, removeFromCart, updateCartQuantity, clearUserCart }),
    [addToCart, removeFromCart, updateCartQuantity, clearUserCart],
  );

  const ordersValue = useMemo(
    () => ({ orders, placeOrder }),
    [orders, placeOrder],
  );

  return (
    <AuthContext.Provider value={authValue}>
      <UsersContext.Provider value={usersValue}>
        <ProductsContext.Provider value={productsValue}>
          <CartContext.Provider value={cartValue}>
            <CartActionsContext.Provider value={cartActionsValue}>
              <OrdersContext.Provider value={ordersValue}>
                {children}
              </OrdersContext.Provider>
            </CartActionsContext.Provider>
          </CartContext.Provider>
        </ProductsContext.Provider>
      </UsersContext.Provider>
    </AuthContext.Provider>
  );
};

export default AppProvider;
