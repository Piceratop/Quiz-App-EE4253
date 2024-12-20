import { useState } from "react";
import { FaCheckCircle, FaPlus, FaTrash } from "react-icons/fa";
import apiClient from "../../configs/apiClient";

async function createQuestion(question) {
   const response = await apiClient.post("/questions", question);
   return response.data;
}

function CreateQuestion() {
   const [answerArray, setAnswerArray] = useState(["", "", "", ""]);
   const [correctAnswer, setCorrectAnswer] = useState(-1);
   const [error, setError] = useState("");
   const [question, setQuestion] = useState("");
   return (
      <form className="my-4 grid grid-cols-3 gap-4">
         <section className="col-span-1 p-4 border-4 border-primary">
            <fieldset className="p-2 mb-4 rounded-md border border-1 border-primary">
               <legend>Question</legend>
               <textarea
                  name="question"
                  placeholder="Type your question here."
                  className="w-full resize-none bg-transparent outline-none"
                  rows={6}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
               ></textarea>
            </fieldset>
            {answerArray.map((answer, i) => (
               <fieldset
                  className="pb-2 px-2 rounded-md border border-1 border-primary flex items-center"
                  key={i}
               >
                  <legend>{`Answer ${i + 1}`}</legend>
                  <input
                     type="text"
                     name={`answer${i}`}
                     placeholder="Type your answer choice here."
                     className="w-full bg-transparent outline-none"
                     value={answer}
                     onChange={(e) =>
                        setAnswerArray(
                           answerArray.map((a, j) =>
                              j === i ? e.target.value : a
                           )
                        )
                     }
                  />
                  <span
                     className={`${
                        correctAnswer === i ? "text-primary" : "text-gray-400"
                     } pr-1 hover:text-primary transition duration-250  ease-in-out`}
                     onClick={(e) => {
                        e.preventDefault();
                        setCorrectAnswer(i);
                     }}
                  >
                     <FaCheckCircle />
                  </span>
                  <span
                     className={`text-gray-400 hover:text-primary transition duration-250 ease-in-out ${
                        answerArray.length <= 2 ? "hidden" : ""
                     }`}
                     onClick={(e) => {
                        e.preventDefault();
                        setAnswerArray(answerArray.filter((_, j) => j !== i));
                     }}
                  >
                     <FaTrash />
                  </span>
               </fieldset>
            ))}
            <button
               className="w-full mt-2 p-2 rounded-md border border-1 border-primary flex items-center justify-center hover:bg-secondary transition duration-250 ease-in-out cursor-pointer"
               onClick={(e) => {
                  e.preventDefault();
                  setAnswerArray([...answerArray, ""]);
               }}
            >
               <span className="mr-2">
                  <FaPlus />
               </span>
               <span>Add an answer.</span>
            </button>

            <p className="mt-2 mb-2 text-wrong">{error}</p>

            <button
               className="w-full p-2 rounded-md border border-1 border-primary flex items-center justify-center bg-primary text-background"
               type="submit"
               onClick={(e) => {
                  e.preventDefault();
                  if (!question) {
                     setError("Question cannot be empty.");
                     return;
                  }
                  for (const answer of answerArray) {
                     if (!answer) {
                        setError("Answer choices cannot be empty.");
                        return;
                     }
                  }
                  if (correctAnswer === -1) {
                     setError("Please select a correct answer.");
                     return;
                  }
                  setError("");
                  createQuestion({
                     question,
                     question_type: "MCQ",
                     choices: answerArray
                        .map((answer) => `'${answer}'`)
                        .join(","),
                     correct_answer: answerArray[correctAnswer],
                  });
               }}
            >
               Create
            </button>
         </section>
         <section className="col-span-2 border-4 border-primary"></section>
      </form>
   );
}

export default CreateQuestion;
