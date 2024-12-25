import { ImShuffle } from 'react-icons/im';

function Choice({ icon, paragraph, title }) {
   return (
      <div className="choice">
         <div className="p-2 bg-primary text-background flex flex-col items-center justify-center gap-2">
            <span>{icon}</span>
            <span className="text-3xl font-bold">{title}</span>
         </div>
         <div className="p-4 py-8">
            <p className="text-xl text-center">{paragraph}</p>
         </div>
      </div>
   );
}

export default function Practice() {
   return (
      <div className="min-h-screen">
         <h2 className="page-title mb-4">Practice Mode</h2>
         <section className="grid grid-cols-2 gap-4">
            <Choice
               title="Test your knowledge"
               icon={<ImShuffle size={48} />}
               paragraph={'Test your knowledge by answering these randomly-picked questions.'}
            />
            <Choice
               title="Review your mistakes"
               icon={<></>}
               paragraph={'Review your mistakes and try to improve your knowledge.'}
            />
         </section>
      </div>
   );
}
