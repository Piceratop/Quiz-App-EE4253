function QuestionDisplay({ answerArray, correctAnswer, question }) {
   return (
      <section className="col-span-2 border-4 border-primary h-full grid grid-rows-2">
         <div className="row-span-1 p-4 bg-primary text-background flex justify-center items-center">
            <p
               className={`text-4xl text-center ${question ? "" : "opacity-50"}`}
            >
               {question ? question : "Type your question in the left panel."}
            </p>
         </div>
         <div
            className="row-span-1 p-4 grid gap-4"
            style={{
               gridTemplateColumns: `repeat(${answerArray.length}, 1fr)`,
            }}
         >
            {answerArray.map((answer, i) => (
               <div
                  key={i}
                  className="p-2 h-full border-4 border-primary text-center flex justify-center items-center overflow-auto"
                  style={{ wordBreak: "break-word" }}
               >
                  <span
                     style={{
                        fontSize:
                           answer.length === 0
                              ? "1.25rem"
                              : Math.max(
                                   1.25,
                                   3 - Math.ceil(answer.length / 4) * 0.25,
                                ) + "rem",
                        opacity: answer.length === 0 ? 0.5 : 1,
                     }}
                  >{`${
                     answer
                        ? answer
                        : `Type your answer ${i + 1} in the left panel.`
                  }`}</span>
               </div>
            ))}
         </div>
      </section>
   );
}

export default QuestionDisplay;
