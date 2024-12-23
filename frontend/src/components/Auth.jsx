function handleAuth(type) {}

function AuthPartition({ type }) {
   const fieldSetStyle =
      "pb-2 px-2 mb-4 rounded-md border border-1 border-primary";
   return (
      <form className="col-span-1 p-4">
         <h1 className="text-2xl font-bold mb-4">{type}</h1>
         <fieldset className={fieldSetStyle}>
            <legend className="px-1">Username</legend>
            <input type="text" className="w-full bg-transparent outline-none" />
         </fieldset>
         <fieldset className={fieldSetStyle}>
            <legend className="px-1">Password</legend>
            <input
               type="password"
               className="w-full bg-transparent outline-none"
            />
         </fieldset>
         {type === "Register" && (
            <fieldset className={fieldSetStyle}>
               <legend className="px-1">Repeat Password</legend>
               <input
                  type="password"
                  className="w-full bg-transparent outline-none"
               />
            </fieldset>
         )}
         <button
            type="submit"
            className=" bg-primary text-background p-2 rounded-md"
            onClick={(e) => e.preventDefault()}
         >
            {type}
         </button>
      </form>
   );
}

export default function Auth() {
   return (
      <div className="min-h-screen grid grid-cols-2">
         <AuthPartition type="Login" />
         <AuthPartition type="Register" />
      </div>
   );
}
