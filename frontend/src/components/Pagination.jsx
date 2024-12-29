import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

function Pagination({ page, setPage, totalPage }) {
   return (
      <div className="mt-4 flex justify-center items-center">
         <button
            className={`mr-2 p-4 rounded-full border-2 border-primary text-xl transition duration-400 ${
               page === 1 ? 'opacity-50' : ''
            }`}
            onClick={() => setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1))}
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
            onClick={() => setPage((prevPage) => 
               prevPage < totalPage ? prevPage + 1 : prevPage
            )}
         >
            <FaArrowRight />
         </button>
      </div>
   );
}

export default Pagination;
