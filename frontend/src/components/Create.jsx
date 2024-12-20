import { useState } from "react";

import CreateQuestion from "./create/CreateQuestion";
import QuestionDisplay from "./questions/QuestionDisplay";

function Create() {
   const [answerArray, setAnswerArray] = useState(["", "", "", ""]);
   const [correctAnswer, setCorrectAnswer] = useState(-1);
   const [question, setQuestion] = useState("");
   return (
      <div>
         <h2 className="page-title">Create</h2>
         <form className="my-4 grid grid-cols-3 gap-4">
            <CreateQuestion
               answerArray={answerArray}
               correctAnswer={correctAnswer}
               question={question}
               setAnswerArray={setAnswerArray}
               setCorrectAnswer={setCorrectAnswer}
               setQuestion={setQuestion}
            />
            <QuestionDisplay
               answerArray={answerArray}
               correctAnswer={correctAnswer}
               question={question}
            />
         </form>
      </div>
   );
}

export default Create;
