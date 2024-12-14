function QuestionBox(question, type, answers = "") {
   if (type === "MCQ") {
      return (
         <div>
            <div>{question}</div>
            <div>
               {answers.map((answer) => (
                  <div key={answer}>{answer}</div>
               ))}
            </div>
         </div>
      );
   }
}

function Explore() {
   return (
      <div>
         <h2 className="page-title">Explore</h2>
         <QuestionBox
            question="Question 1"
            type="MCQ"
            answers={["Answer 1", "Answer 2", "Answer 3", "Answer 4"]}
         />
      </div>
   );
}

export default Explore;
