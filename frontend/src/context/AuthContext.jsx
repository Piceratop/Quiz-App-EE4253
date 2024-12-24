import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext({
   isAuthenticated: false,
   id: null,
   user: null,
   login: (id, user) => {},
   logout: () => {},
   updateUser: (id, user) => {},
});

export const AuthProvider = ({ children }) => {
   const [state, setState] = useState({
      isAuthenticated: false,
      id: null,
      user: null,
   });

   const login = (id, user) => setState({ isAuthenticated: true, id, user });
   const logout = () => setState({ isAuthenticated: false, id: null, user: null });
   const updateUser = (id, user) => setState({ ...state, id, user });

   return (
      <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
         {children}
      </AuthContext.Provider>
   );
};

export const useAuth = () => useContext(AuthContext);
