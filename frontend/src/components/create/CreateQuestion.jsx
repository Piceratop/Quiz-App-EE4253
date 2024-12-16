import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import apiClient from "../../configs/apiClient";

function CreateQuestion() {
   const [answerArray, setAnswerArray] = useState(["", "", "", ""]);
   const [question, setQuestion] = useState({});
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
               ></textarea>
            </fieldset>
            {answerArray.map((answer, i) => (
               <fieldset
                  className="pb-2 px-2 rounded-md border border-1 border-primary"
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
               </fieldset>
            ))}
            <button
               className="w-full mt-4 p-2 rounded-md border border-1 border-primary flex items-center justify-center hover:bg-primary hover:text-background transition duration-250 ease-in-out cursor-pointer"
               onClick={(e) => {
                  e.preventDefault();
               }}
            >
               <span className="mr-2">
                  <FaPlus />
               </span>
               <span>Add an answer.</span>
            </button>
         </section>
         <section className="col-span-2 border-4 border-primary"></section>
      </form>
   );
}

export default CreateQuestion;
