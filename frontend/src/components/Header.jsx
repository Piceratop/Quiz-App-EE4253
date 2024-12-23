import { Link } from "react-router-dom";

function Header() {
   const linkStyle =
      "px-1 py-1 transition duration-500 ease-in-out border-b-2 border-transparent hover:border-b-2 hover:border-primary";
   return (
      <header className="py-4 px-12 flex justify-between items-center border-b border-primary">
         <Link className="text-3xl font-bold" to="/">
            Quiz App
         </Link>
         <nav className="flex space-x-8 text-lg">
            <Link className={linkStyle} to="/auth">
               Login
            </Link>
            <Link className={linkStyle} to="/auth">
               Register
            </Link>
            {/* <Link className={linkStyle} to="/explore">
               Explore
            </Link>

            <Link className={linkStyle} to="/create">
               Create
            </Link> */}
         </nav>
      </header>
   );
}

export default Header;
