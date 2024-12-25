import { Routes, Route, Navigate } from 'react-router-dom';
import Auth from './Auth';
import Create from './Create';
import Explore from './Explore';
import Landing from './Landing';
import Practice from './Practice';
import PracticePlay from './practice/PracticePlay';
import Profile from './Profile';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
   const { isAuthenticated } = useAuth();
   return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function Quiz() {
   const privateRoutes = [
      { path: '/explore', element: <Explore /> },
      { path: '/create', element: <Create /> },
      { path: '/profile', element: <Profile /> },
      { path: '/practice', element: <Practice /> },
      { path: '/practice/play', element: <PracticePlay /> },
   ];

   return (
      <main className="py-4 px-12">
         <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            {privateRoutes.map((route) => (
               <Route
                  key={route.path}
                  path={route.path}
                  element={<PrivateRoute>{route.element}</PrivateRoute>}
               />
            ))}
         </Routes>
      </main>
   );
}

export default Quiz;
