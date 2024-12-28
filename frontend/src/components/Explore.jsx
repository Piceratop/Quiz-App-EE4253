import { useEffect, useState } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import apiClient from '../configs/apiClient';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import SearchBar from './SearchBar';

async function getQuestions(page = 1, search = '') {
   const token = localStorage.getItem('token');
   let apiDirectory = `/questions?page=${page}`;
   if (search) {
      apiDirectory += `&search=${search}`;
   }
   const response = await apiClient.get(apiDirectory, {
      headers: { Authorization: `Bearer ${token}` },
   });
   return response.data;
}

async function getQuestionsCount(search) {
   const token = localStorage.getItem('token');
   let apiDirectory = '/questions/count';
   if (search) {
      apiDirectory += `?search=${search}`;
   }
   const response = await apiClient.get(apiDirectory, {
      headers: { Authorization: `Bearer ${token}` },
   });
   return response.data.count;
}

async function fetchQuestions(page, search, setQuestions) {
   const data = await getQuestions(page, search);
   setQuestions(data);
}

async function fetchQuestionsCount(search, setTotalPage) {
   const data = await getQuestionsCount(search);
   setTotalPage(Math.ceil(data / 5));
}

export { fetchQuestions, fetchQuestionsCount };

function Explore() {
   const [page, setPage] = useState(1);
   const [totalPage, setTotalPage] = useState(1);
   const [questions, setQuestions] = useState({});
   const [search, setSearch] = useState('');

   useEffect(() => {
      fetchQuestionsCount(search, setTotalPage);
   }, []);

   useEffect(() => {
      fetchQuestions(page, search, setQuestions);
   }, [page]);

   return (
      <div>
         <h2 className="page-title">Explore</h2>
         <SearchBar
            search={search}
            setPage={setPage}
            setQuestions={setQuestions}
            setSearch={setSearch}
            setTotalPage={setTotalPage}
         />
         {Object.entries(questions)
            .sort(([idA], [idB]) => parseInt(idB, 10) - parseInt(idA, 10))
            .map(
               ([id, question]) =>
                  question.question_type === 'MCQ' && (
                     <MultipleChoiceQuestion
                        key={id}
                        question={question.question}
                        possibleAnswers={question.possible_answers}
                        correctAnswers={question.correct_answers}
                        shuffle={question.shuffle}
                     />
                  )
            )}
         <div className="mt-4 flex justify-center items-center">
            <button
               className={`mr-2 p-4 rounded-full border-2 border-primary text-xl transition duration-400 ${
                  page === 1 ? 'opacity-50' : ''
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
                  page === totalPage ? 'opacity-50' : ''
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
