import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Quiz from "./components/Quiz";

const App = () => {
   return (
      <BrowserRouter>
         <Header />
         <Quiz />
      </BrowserRouter>
   );
};

export default App;
