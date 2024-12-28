import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestion } from '../../context/QuestionContext';

function PracticePlay() {
   const {
      questions,
      userResponses,
      userResponsesEvaluation,
      updateUserResponses,
   } = useQuestion();
   const [correctAnswersArray, setCorrectAnswersArray] = useState([]);
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [possibleAnswers, setPossibleAnswers] = useState([]);
   const [userChoice, setUserChoice] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      updateUserResponses([], []);
   }, []);

   useEffect(() => {
      let tempPossibleAnswers = JSON.parse(
         questions[currentQuestionIndex].possible_answers
      );
      if (questions[currentQuestionIndex].shuffle) {
         tempPossibleAnswers = tempPossibleAnswers.sort(
            () => Math.random() - 0.5
         );
      }
      setPossibleAnswers(tempPossibleAnswers);
      setCorrectAnswersArray(
         JSON.parse(questions[currentQuestionIndex].correct_answers)
      );
   }, [currentQuestionIndex]);

   return (
      <form className="w-full border-4 border-primary">
         <div className="min-h-[20rem] py-12 px-8 bg-primary text-background flex justify-center items-center text-3xl text-center">
            {questions[currentQuestionIndex].question}
         </div>
         <div
            className="grid gap-4 p-4"
            style={{
               gridTemplateColumns: `repeat(${possibleAnswers.length}, 1fr)`,
            }}
         >
            {possibleAnswers.map((answer, i) => (
               <label
                  key={i}
                  className={`p-4 min-h-[12rem] h-full border-4 border-primary text-center flex justify-center items-center text-xl overflow-auto transition duration-400 ease-in-out ${
                     isSubmitted
                        ? correctAnswersArray.includes(answer)
                           ? 'bg-primary text-background'
                           : userChoice == answer
                             ? 'bg-wrong text-background border-wrong'
                             : ''
                        : userChoice === answer
                          ? 'bg-secondary'
                          : ''
                  } ${userChoice === answer ? 'font-bold' : ''}`}
               >
                  <input
                     type="radio"
                     name={questions[currentQuestionIndex].question}
                     value={answer}
                     className="hidden"
                     onChange={(e) => setUserChoice(e.target.value)}
                     checked={userChoice === answer}
                     disabled={isSubmitted}
                  />
                  {answer}
               </label>
            ))}
         </div>

         <button
            type="submit"
            onClick={(e) => {
               e.preventDefault();
               if (isSubmitted) {
                  if (currentQuestionIndex === questions.length - 1) {
                     navigate('/practice/end');
                  } else {
                     setCurrentQuestionIndex(currentQuestionIndex + 1);
                     setIsSubmitted(false);
                     setUserChoice(null);
                  }
               } else {
                  setIsSubmitted(true);
                  updateUserResponses(
                     [...userResponses, userChoice],
                     [
                        ...userResponsesEvaluation,
                        correctAnswersArray.includes(userChoice),
                     ]
                  );
               }
            }}
            className={`w-full border-t border-primary hover:bg-primary hover:text-background transition duration-400 ease-in-out p-2 text-2xl`}
            disabled={!userChoice}
         >
            {isSubmitted ? 'Continue' : 'Submit my answer'}
         </button>
      </form>
   );
}

export default PracticePlay;
