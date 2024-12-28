import { fetchQuestionsCount, fetchQuestions } from './Explore';

function SearchBar({ search, setPage, setQuestions, setSearch, setTotalPage }) {
   return (
      <form className="mt-2 flex items-center border border-primary rounded-md">
         <input
            type="text"
            placeholder="Search for questions..."
            className="w-full p-2 bg-transparent outline-none"
            onChange={(e) => setSearch(e.target.value)}
         />
         <button
            type="submit"
            className="p-2 bg-primary text-background border-l border-primary"
            onClick={(e) => {
               e.preventDefault();
               fetchQuestionsCount(search, setTotalPage);
               setPage(1);
               fetchQuestions(1, search, setQuestions);
            }}
         >
            Search
         </button>
      </form>
   );
}

export default SearchBar;
