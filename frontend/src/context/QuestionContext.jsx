import { createContext, useState, useContext } from 'react';

export const QuestionContext = createContext({
   questions: [],
   setType: '',
   totalCount: 0,
   userResponses: [],
   userResponsesEvaluation: [],
   updateQuestions: () => {},
   updateUserResponses: () => {},
});

export const QuestionProvider = ({ children }) => {
   const [state, setState] = useState({
      questions: [],
      setType: '',
      totalCount: 0,
      userResponses: [],
      userResponsesEvaluation: [],
   });

   const updateQuestions = (quiz_data, setType) => {
      setState({
         ...state,
         setType,
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
