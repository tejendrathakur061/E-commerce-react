  import { useContext } from "react";
  import OrdersContext from "../context/OrdersContext";

  const useOrders = () => {
    const context = useContext(OrdersContext);

    if (!context) {
      throw new Error("useOrders must be used within an AppProvider.");
    }

    return context;
  };

  export default useOrders;
