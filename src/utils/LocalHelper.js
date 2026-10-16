// ---------------- USERS ----------------
export const getUsers = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};

export const saveUser = (user) => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
};

// ---------------- PRODUCTS ----------------
export const getProducts = () => {
  return JSON.parse(localStorage.getItem("products")) || [];
};

export const saveProducts = (products) => {
  localStorage.setItem("products", JSON.stringify(products));
};

// ---------------- CART ----------------
export const getCart = () => {
  return JSON.parse(localStorage.getItem("cart")) || [];
};

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

export const getOrders = () => {
  return JSON.parse(localStorage.getItem("orders")) || [];
};

// saved order 
export const saveOrder = (newOrder) => {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const exists = orders.some(
    (order) =>
      order.userId === newOrder.userId &&
      JSON.stringify(order.items) === JSON.stringify(newOrder.items),
  );

  if (exists) {
    return false; 
  }

  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  return true; 
};

// ---------------- ADMIN ----------------
export const ADMIN_CREDENTIALS = {
  id: "admin-1",
  email: "admin@gmail.com",
  password: "admin",
  role: "admin",
};

export const setAdminInfo = () => {
  return localStorage.setItem("admin", JSON.stringify(ADMIN_CREDENTIALS));
};

// ---------------- CURRENT USER ----------------
export const currentUser = () => {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem("currentUser", JSON.stringify(user));
};

export const signOut = () => {
  localStorage.removeItem("currentUser");
};
