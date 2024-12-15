import { Link } from "react-router-dom";

function Header() {
   return (
      <header className="py-4 px-12 flex justify-between items-center border-b border-primary">
         <h1 className="text-3xl font-bold">Quiz App</h1>
         <nav>
            <ul className="flex space-x-8 text-lg">
               <li>
                  <Link
                     className="px-1 py-1 transition duration-500 ease-in-out hover:border-b-2 hover:border-primary"
                     to="/"
                  >
                     Explore
                  </Link>
               </li>
               <li>
                  <Link
                     className="px-1 py-1 transition duration-500 ease-in-out hover:border-b-2 hover:border-primary"
                     to="/create"
                  >
                     Create
                  </Link>
               </li>
            </ul>
         </nav>
      </header>
   );
}

export default Header;
