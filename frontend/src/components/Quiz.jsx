import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Explore from "./Explore";
import Create from "./Create";
import Landing from "./Landing";
import Auth from "./Auth";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
   const { isAuthenticated } = useAuth();
   return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function Quiz() {
   return (
      <main className="py-4 px-12">
         <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
               path="/explore"
               element={
                  <PrivateRoute>
                     <Explore />
                  </PrivateRoute>
               }
            />
            <Route
               path="/create"
               element={
                  <PrivateRoute>
                     <Create />
                  </PrivateRoute>
               }
            />
         </Routes>
      </main>
   );
}

export default Quiz;
