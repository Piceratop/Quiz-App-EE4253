import { createContext, useState, useContext } from 'react';

export const QuestionContext = createContext({
   questions: [],
   totalCount: 0,
   userResponses: [],
   userResponsesEvaluation: [],
   updateQuestions: () => {},
   updateUserResponses: () => {},
   updateUserResponsesEvaluation: () => {},
});

export const QuestionProvider = ({ children }) => {
   const [state, setState] = useState({
      questions: [],
      totalCount: 0,
      userResponsesEvaluation: [],
   });

   const updateQuestions = (quiz_data) => {
      setState({
         ...state,
         questions: quiz_data,
         totalCount: quiz_data.length,
      });
   };

   const updateUserResponses = (responses) => {
      setState({ ...state, userResponses: responses });
   };

   const updateUserResponsesEvaluation = (evaluation) => {
      setState({ ...state, userResponsesEvaluation: evaluation });
   };

   return (
      <QuestionContext.Provider
         value={{
            ...state,
            updateQuestions,
            updateUserResponses,
            updateUserResponsesEvaluation,
         }}
      >
         {children}
      </QuestionContext.Provider>
   );
};

export const useQuestion = () => useContext(QuestionContext);
