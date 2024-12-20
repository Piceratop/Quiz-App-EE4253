import { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import apiClient from "../configs/apiClient";
import MultipleChoiceQuestion from "./questions/MultipleChoiceQuestion";

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

async function getQuestionsCount() {
   const response = await apiClient.get("/questions/count");
   return response.data.count;
}

function Explore() {
   const [page, setPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);
   const [questions, setQuestions] = useState({});

   useEffect(() => {
      const fetchQuestionsCount = async () => {
         const data = await getQuestionsCount();
         setTotalPage(Math.ceil(data / 5));
      };

      fetchQuestionsCount();
   });

   useEffect(() => {
      const fetchQuestions = async (page) => {
         const data = await getQuestions(page);
         setQuestions(data);
      };

      fetchQuestions(page);
   }, [page]);

   return (
      <div>
         <h2 className="page-title">Explore</h2>
         {Object.entries(questions)
            .sort(([idA], [idB]) => parseInt(idB, 10) - parseInt(idA, 10))
            .map(([id, question]) => (
               question.question_type === "MCQ" && (
                  <MultipleChoiceQuestion
                     key={id}
                     question={question.question}
                     possibleAnswers={question.possible_answers}
                     correctAnswers={question.correct_answers}
                     shuffle={question.shuffle}
                  />
               )
            ))}
         <div className="mt-4 flex justify-center items-center">
            <button
               className={`mr-2 p-4 rounded-full border-2 border-primary text-xl transition duration-400 ${
                  page === 1 ? "opacity-50" : ""
               }`}
               onClick={() =>
                  setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1))
               }
            >
               <FaArrowLeft />
            </button>
            <p className="mx-2 text-xl">
               {page} / {totalPage}
            </p>
            <button
               className={`ml-2 p-4 text-xl rounded-full border-2 border-primary transition duration-400 ${
                  page === totalPage ? "opacity-50" : ""
               }`}
               onClick={() =>
                  setPage((prevPage) =>
                     prevPage < totalPage ? prevPage + 1 : prevPage
                  )
               }
            >
               <FaArrowRight />
            </button>
         </div>
      </div>
   );
}

export default Explore;
