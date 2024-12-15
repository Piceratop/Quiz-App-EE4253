import { useEffect, useState } from "react";
import apiClient from "../configs/apiClient";

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

/**
 * QuestionBox is a component that renders a single question and its choices.
 *
 * It takes 3 props: question, type, and choices. question is the question string,
 * type is the type of the question (currently only supports "MCQ"),
 * and choices is a stringified array of choices.
 *
 * It renders the question in a large, centered box with a border, and then renders
 * the choices in a grid of 4 columns, each choice being a centered, bordered box.
 *
 * @param {{ question: string, type: string, choices: string }} props
 * @returns {JSX.Element}
 */
function QuestionBox({ question, type, choices }) {
   const choiceArray = JSON.parse(choices);
   const [userChoice, setUserChoice] = useState(null);

   if (type === "MCQ") {
      return (
         <form className="my-6">
            <div className="text-xl flex items-center justify-center py-12 px-4 my-2 border-2 border-primary">
               {question}
            </div>
            <div
               className="grid gap-2"
               style={{
                  gridTemplateColumns: `repeat(${choiceArray.length}, 1fr)`,
               }}
            >
               {choiceArray.map((choice) => (
                  <label
                     className={`flex items-center justify-center py-8 px-4 border border-primary text-center ${
                        userChoice === choice
                           ? "bg-secondary text-background"
                           : ""
                     }`}
                     key={choice}
                  >
                     <input
                        className="appearance-none"
                        type="radio"
                        name={`${question}`}
                        value={choice}
                        onChange={(e) => setUserChoice(e.target.value)}
                     />
                     {choice}
                  </label>
               ))}
            </div>
         </form>
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
