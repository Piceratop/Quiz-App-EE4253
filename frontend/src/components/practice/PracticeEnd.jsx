import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuestion } from '../../context/QuestionContext';

async function handleUpdateWrongResponses() {}

function PracticeEnd() {
   const { questions, userResponses, userResponsesEvaluation } = useQuestion();
   const [wrongId, setWrongId] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      setWrongId(
         userResponsesEvaluation
            .filter((evaluation) => evaluation.is_correct === false)
            .map((evaluation) => evaluation.question_id)
      );
   }, [userResponsesEvaluation]);

   return (
      <div>
         <h2 className="page-title">Review</h2>
         <button className="my-4 py-2 min-w-[20rem] bg-primary text-background hover:bg-primary-dark transition duration-400 ease-in-out" onClick={handleUpdateWrongResponses}>Finish</button>
         
      </div>
   );
}

export default PracticeEnd;
