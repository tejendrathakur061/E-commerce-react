import { useContext } from "react";
import UsersContext from "../context/UsersContext";

const useUsers = () => {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error("useUsers must be used within an AppProvider.");
  }

  return context;
};

export default useUsers;
