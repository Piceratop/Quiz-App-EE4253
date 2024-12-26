import { createContext, useState, useContext } from 'react';

export const QuestionContext = createContext({
   questions: [],
   totalCount: 0,
   userResponses: [],
   userResponsesEvaluation: [],
   updateQuestions: () => {},
   updateUserResponses: () => {},
});

export const QuestionProvider = ({ children }) => {
   const [state, setState] = useState({
      questions: [],
      totalCount: 0,
      userResponses: [],
      userResponsesEvaluation: [],
   });

   const updateQuestions = (quiz_data) => {
      setState({
         ...state,
         questions: quiz_data,
         totalCount: quiz_data.length,
      });
   };

   const updateUserResponses = (responses, evaluation) => {
      setState({
         ...state,
         userResponses: responses,
         userResponsesEvaluation: evaluation,
      });
   };

   return (
      <QuestionContext.Provider
         value={{
            ...state,
            updateQuestions,
            updateUserResponses,
         }}
      >
         {children}
      </QuestionContext.Provider>
   );
};

export const useQuestion = () => useContext(QuestionContext);
