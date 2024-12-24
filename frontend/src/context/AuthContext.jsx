import { createContext, useState, useContext } from "react";

export const AuthContext = createContext({
   isAuthenticated: false,
   id: null,
   user: null,
   login: (id, user) => {},
   logout: () => {},
});

export const AuthProvider = ({ children }) => {
   const [state, setState] = useState({
      isAuthenticated: false,
      id: null,
      user: null,
   });

   const login = (id, user) => setState({ isAuthenticated: true, id, user });
   const logout = () =>
      setState({ isAuthenticated: false, id: null, user: null });

   return (
      <AuthContext.Provider value={{ ...state, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
