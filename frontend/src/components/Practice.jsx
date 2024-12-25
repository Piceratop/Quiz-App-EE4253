import { useEffect, useState } from 'react';
import { RiShuffleFill } from 'react-icons/ri';
import { MdOutlineErrorOutline } from 'react-icons/md';
import apiClient from '../configs/apiClient';

async function handleGetQuestionCount(setTotalQuestionCount) {
   const token = localStorage.getItem('token');
   const response = await apiClient.get('/questions/count', {
      headers: { Authorization: `Bearer ${token}` },
   });
   setTotalQuestionCount(response.data.count);
}

// async function handleGetQuestion(page, setQuestions) {
//    const token = localStorage.getItem('token');
//    const response = await apiClient.get(`/questions?page=${page}`, {
//       headers: { Authorization: `Bearer ${token}` },
//    });
//    setQuestions(response.data);
// }

function Choice({ icon, paragraph, title }) {
   return (
      <div className="choice">
         <div className="p-2 bg-primary text-background flex flex-col items-center justify-center gap-2">
            <span>{icon}</span>
            <span className="text-3xl font-bold">{title}</span>
         </div>
         <div className="p-4 py-8">{paragraph}</div>
      </div>
   );
}

export default function Practice() {
   const [totalQuestionCount, setTotalQuestionCount] = useState(0);
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
               paragraph={
                  <>
                     <p className={pStyle}>
                        Test your knowledge by answering these randomly-picked questions.
                     </p>
                     <p className={pStyle}>
                        You can have at most {totalQuestionCount} questions to practice.
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
