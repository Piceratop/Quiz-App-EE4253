import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaXmark, FaCheck } from 'react-icons/fa6';
import { useQuestion } from '../../context/QuestionContext';
import apiClient from '../../configs/apiClient';

async function handleUpdateWrongResponses(
   questions,
   userResponsesEvaluation,
   setType
) {
   const token = localStorage.getItem('token');
   const correctIds = questions
      .map((question, index) => {
         if (userResponsesEvaluation[index]) {
            return question.id;
         }
      })
      .filter((id) => id !== undefined);
   const wrongIds = questions
      .map((question, index) => {
         if (!userResponsesEvaluation[index]) {
            return question.id;
         }
      })
      .filter((id) => id !== undefined);
   if (setType === 'shuffle') {
      await apiClient.post('/wrong-responses', wrongIds, {
         headers: { Authorization: `Bearer ${token}` },
      });
   } else if (setType === 'wrong') {
      await apiClient.delete('/wrong-responses', {
         data: correctIds,
         headers: { Authorization: `Bearer ${token}` },
      });
   }
}

function PracticeEnd() {
   const { questions, setType, userResponses, userResponsesEvaluation } =
      useQuestion();
   const navigate = useNavigate();

   useEffect(() => {
      handleUpdateWrongResponses(questions, userResponsesEvaluation, setType);
   }, []);

   return (
      <>
         <h2 className="page-title">Review</h2>
         <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
               {questions.map((question, index) => {
                  return (
                     <div
                        key={index}
                        className={`p-4 mb-4 rounded-md border border-1 ${
                           userResponsesEvaluation[index]
                              ? 'border-primary'
                              : 'border-wrong'
                        }`}
                     >
                        <div className="flex items-center">
                           <span className="mr-2">
                              {userResponsesEvaluation[index] ? (
                                 <FaCheck size={40} />
                              ) : (
                                 <span className="text-wrong">
                                    <FaXmark size={40} />
                                 </span>
                              )}
                           </span>
                           <p>{question.question}</p>
                        </div>
                        <p>
                           Your Answer:{' '}
                           <span
                              className={`${userResponsesEvaluation[index] ? '' : 'line-through'}`}
                           >
                              {userResponses[index]
                                 ? userResponses[index]
                                 : 'Not Answered'}
                           </span>
                        </p>
                        <p>
                           Correct Answer:{' '}
                           <span className="font-bold">
                              {JSON.parse(question.correct_answers).join(', ')}
                           </span>
                        </p>
                     </div>
                  );
               })}
            </div>
            <div className="h-fit p-4 rounded-md border border-1 border-primary">
               <p>
                  You got{' '}
                  <span className="font-bold">
                     {userResponsesEvaluation.filter(Boolean).length}
                  </span>{' '}
                  out of <span className="font-bold">{questions.length}</span>{' '}
                  correct.
               </p>
               <button
                  className="mt-4 py-2 w-full bg-primary text-background hover:bg-primary-dark transition duration-400 ease-in-out"
                  onClick={() => navigate('/explore')}
               >
                  Finish Reviewing
               </button>
            </div>
         </div>
      </>
   );
}

export default PracticeEnd;
