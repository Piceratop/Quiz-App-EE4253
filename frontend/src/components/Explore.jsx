import { useEffect, useState } from "react";
import apiClient from "../configs/apiClient";

async function getQuestions(page) {
   const response = await apiClient.get("/questions?page=" + page);
   console.log(response.data);
   return response.data;
}

function QuestionBox({ question, type, choices }) {
   const choiceArray = JSON.parse(choices);
   if (type === "MCQ") {
      return (
         <div className="my-4">
            <div className="text-xl flex items-center justify-center py-12 px-4 my-2 border-2 border-primary">
               {question}
            </div>
            <div className="grid grid-cols-4 gap-4">
               {choiceArray.map((choice) => (
                  <div
                     className="flex items-center justify-center py-8 px-4 border border-primary text-center text-align-center"
                     key={choice}
                  >
                     {choice}
                  </div>
               ))}
            </div>
         </div>
      );
   }
}

function Explore() {
   const [page, setPage] = useState(1);
   const [questions, setQuestions] = useState({});

   useEffect(() => {
      const fetchQuestions = async (page) => {
         const data = await getQuestions(page);
         setQuestions(data);
      };

      fetchQuestions(page);
   }, []);

   return (
      <div>
         <h2 className="page-title">Explore</h2>
         {Object.entries(questions).map(([id, question]) => (
            <QuestionBox
               key={id}
               question={question.question}
               type={question.question_type}
               choices={question.choices}
            />
         ))}
      </div>
   );
}

export default Explore;
