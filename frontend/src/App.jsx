import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Quiz from "./components/Quiz";

const App = () => {
   return (
      <div className="bg-background text-primary min-h-screen">
         <BrowserRouter>
            <Header />
            <Quiz />
         </BrowserRouter>
      </div>
   );
};

export default App;
