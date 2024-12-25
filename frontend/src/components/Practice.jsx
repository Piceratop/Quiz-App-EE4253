import { useEffect, useState } from 'react';
import { RiShuffleFill } from 'react-icons/ri';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import apiClient from '../configs/apiClient';
import { useQuestion } from '../context/QuestionContext';

async function handleGetQuestionCount(setTotalQuestionCount) {
   const token = localStorage.getItem('token');
   const response = await apiClient.get('/questions/count', {
      headers: { Authorization: `Bearer ${token}` },
   });
   setTotalQuestionCount(Math.min(response.data.count, 100));
}

function handleGetQuestion(count, navigate, updateQuestions) {
   const token = localStorage.getItem('token');
   apiClient
      .get(`/questions-set?count=${count}`, {
         headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
         updateQuestions(response.data);
         navigate('/practice/play');
      });
}

function Choice({ icon, onSubmit, paragraph, title }) {
   return (
      <form className="choice relative">
         <div className="p-2 bg-primary text-background flex flex-col items-center justify-center gap-2">
            <span>{icon}</span>
            <span className="text-3xl font-bold">{title}</span>
         </div>
         <div className="p-4 pt-8 pb-16">{paragraph}</div>
         <button
            type="submit"
            className="absolute bottom-0 w-full p-2 border-t border-primary text-2xl hover:bg-primary hover:text-background transition duration-400 ease-in-out"
            onClick={onSubmit}
         >
            Start the set
         </button>
      </form>
   );
}

export default function Practice() {
   const { updateQuestions } = useQuestion();
   const [questionSetCount, setQuestionSetCount] = useState(1);
   const [totalQuestionCount, setTotalQuestionCount] = useState(0);
   const navigate = useNavigate();
   const pStyle = 'text-xl text-center my-4';

   useEffect(() => {
      handleGetQuestionCount(setTotalQuestionCount);
   }, []);

   return (
      <div className="min-h-screen">
         <h2 className="page-title mb-4">Practice Mode</h2>
         <section className="grid grid-cols-2 gap-4">
            <Choice
               title="Test your knowledge"
               icon={<RiShuffleFill size={48} />}
               onSubmit={(e) => {
                  e.preventDefault();
                  handleGetQuestion(questionSetCount, navigate, updateQuestions);
               }}
               paragraph={
                  <>
                     <p className={pStyle}>
                        Test your knowledge by answering these randomly-picked questions.
                     </p>
                     <p className={pStyle}>
                        You can have at most {totalQuestionCount} questions to practice.
                     </p>
                     <p className={pStyle}>
                        Number of questions in this set:
                        <input
                           type="number"
                           className="p-2 ml-2 bg-transparent outline-none border border-primary"
                           value={questionSetCount}
                           onChange={(e) => {
                              if (e.target.value > totalQuestionCount) {
                                 setQuestionSetCount(totalQuestionCount);
                              } else setQuestionSetCount(e.target.value);
                           }}
                        />
                     </p>
                  </>
               }
            />
            <Choice
               title="Review your mistakes"
               icon={<MdOutlineErrorOutline size={48} />}
               paragraph={
                  <>
                     <p className={pStyle}>
                        Review your mistakes and try to improve your knowledge.
                     </p>
                  </>
               }
            />
         </section>
      </div>
   );
}
