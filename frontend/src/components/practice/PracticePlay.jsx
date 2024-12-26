import { useState } from 'react';
import { useQuestion } from '../../context/QuestionContext';


function PracticePlay() {
   const { questions } = useQuestion();
   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

   console.log(questions);

   

   return (<div className='w-full'>
   <div className='bg-primary text-background flex justify-center items-center'></div>
   
</div>);
}

export default PracticePlay;
