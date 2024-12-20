import { useEffect, useState } from "react";

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
export default function QuestionBox({
   question,
   correctAnswer,
   choices,
   shuffle,
   type,
}) {
   const [choiceArray, setChoiceArray] = useState([]);
   useEffect(() => {
      setChoiceArray(JSON.parse(choices).sort(() => Math.random() - 0.5));
   }, []);

   const [isSubmitted, setIsSubmitted] = useState(false);
   const [userChoice, setUserChoice] = useState(null);

   if (type === "MCQ") {
      return (
         <form className="my-6">
            <div className="my-2 border-primary border-2 transition duration-500 ease-in-out">
               <div className="text-xl flex items-center justify-center py-12 px-4">
                  <p>{question}</p>
               </div>
               <button
                  className={`w-full py-2 transition duration-500 ease-in-out ${
                     isSubmitted
                        ? "bg-background text-primary "
                        : userChoice
                        ? "bg-primary text-background"
                        : "bg-gray-400 text-background disabled"
                  }`}
                  type="submit"
                  onClick={(e) => {
                     e.preventDefault();
                     console.log(userChoice);
                     if (userChoice) {
                        setIsSubmitted(true);
                     }
                  }}
                  disabled={isSubmitted || !userChoice}
               >
                  {isSubmitted ? "Submitted" : "Submit"}
               </button>
            </div>
            <div
               className="grid gap-2"
               style={{
                  gridTemplateColumns: `repeat(${choiceArray.length}, 1fr)`,
               }}
            >
               {choiceArray.map((choice) => (
                  <label
                     className={`flex items-center justify-center py-8 px-4 border border-primary text-center transition duration-500 ease-in-out ${
                        isSubmitted
                           ? choice === correctAnswer
                              ? "bg-primary text-background"
                              : userChoice === choice
                              ? "bg-wrong text-background border-wrong"
                              : ""
                           : userChoice === choice
                           ? "bg-secondary"
                           : ""
                     } ${userChoice === choice ? "font-bold" : ""}`}
                     key={choice}
                  >
                     <input
                        className="appearance-none"
                        type="radio"
                        name={`${question}`}
                        value={choice}
                        onChange={(e) => setUserChoice(e.target.value)}
                        disabled={isSubmitted}
                     />
                     {choice}
                  </label>
               ))}
            </div>
         </form>
      );
   }
}
