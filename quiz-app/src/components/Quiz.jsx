import { Route, Routes } from "react-router-dom";
import Explore from "./Explore";
import Create from "./Create";

function Quiz() {
   return (
      <main className="py-4 px-12">
         <Routes>
            <Route path="/" element={<Explore />} />
            <Route path="/create" element={<Create />} />
         </Routes>
      </main>
   );
}

export default Quiz;
