import { useEffect, useState } from "react";
import apiClient from "../configs/apiClient";
import QuestionBox from "./questions/QuestionBox";

/**
 * Fetches questions from the API and returns the response data.
 *
 * @param {number} page The page number to fetch. Defaults to 1.
 * @returns {Promise<import("../types/api").Question[]>} The response data, an array of questions.
 */
async function getQuestions(page) {
   const response = await apiClient.get("/questions?page=" + page);
   return response.data;
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
               choices={question.choices}
               correctAnswer={question.correct_answer}
               question={question.question}
               type={question.question_type}
            />
         ))}
      </div>
   );
}

export default Explore;
