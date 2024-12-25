import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
   const { isAuthenticated, logout } = useAuth();
   const navigate = useNavigate();

   const linkStyle =
      'px-1 py-1 transition duration-500 ease-in-out border-b-2 border-transparent hover:border-b-2 hover:border-primary';

   const handleLogout = () => {
      logout();
      localStorage.removeItem('token');
      navigate('/auth');
   };

   return (
      <header className="py-4 px-12 flex justify-between items-center border-b border-primary">
         <Link className="text-3xl font-bold" to="/">
            Quiz App
         </Link>
         <nav className="flex space-x-8 text-lg">
            {isAuthenticated ? (
               <>
                  <Link className={linkStyle} to="/explore">
                     Explore
                  </Link>
                  <Link className={linkStyle} to="/create">
                     Create
                  </Link>
                  <Link className={linkStyle} to="/profile">
                     Profile
                  </Link>
                  <button
                     className={`${linkStyle} text-wrong hover:border-wrong`}
                     onClick={handleLogout}
                  >
                     Logout
                  </button>
               </>
            ) : (
               <>
                  <Link className={linkStyle} to="/auth">
                     Login
                  </Link>
                  <Link className={linkStyle} to="/auth">
                     Register
                  </Link>
               </>
            )}
         </nav>
      </header>
   );
}

export default Header;
