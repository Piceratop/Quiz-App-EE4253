import { createContext, useState, useContext } from 'react';

export const QuestionContext = createContext({
   questions: [],
   totalCount: 0,
   userResponsesEvaluation: [],
   updateQuestions: () => {},
   updateUserResponsesEvaluation: () => {},
});

export const QuestionProvider = ({ children }) => {
   const [state, setState] = useState({
      questions: [],
      totalCount: 0,
      userResponsesEvaluation: [],
   });

   const updateQuestions = (quiz_data) => {
      setState({ ...state, questions: quiz_data, totalCount: quiz_data.length });
   };

   return (
      <QuestionContext.Provider value={{ ...state, updateQuestions }}>
         {children}
      </QuestionContext.Provider>
   );
};

export const useQuestion = () => useContext(QuestionContext);
