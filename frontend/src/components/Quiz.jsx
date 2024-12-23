import { Route, Routes } from "react-router-dom";
import Create from "./Create";
import Explore from "./Explore";
import Landing from "./Landing";
import Auth from "./Auth";

function Quiz() {
   return (
      <main className="py-4 px-12">
         <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
         </Routes>
      </main>
   );
}

export default Quiz;
