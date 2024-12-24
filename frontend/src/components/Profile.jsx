import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
   const { user } = useAuth();
   const [username, setUsername] = useState("");
   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [repeatPassword, setRepeatPassword] = useState("");

   useEffect(() => {
      setUsername(user);
      console.log(username === user);
   }, [user]);

   const fieldsetStyle =
      "pb-2 px-2 mb-2 rounded-md border border-1 border-primary";
   const updateButtonStyle =
      "p-2 mb-4 rounded-md bg-primary text-background border-l border-primary";

   return (
      <div>
         <h2 className="page-title">Profile</h2>
         <form>
            <h3 className="text-xl font-bold my-4">Profile Description</h3>
            <fieldset className={fieldsetStyle}>
               <legend className="px-1">Username</legend>
               <input
                  type="text"
                  className="w-full bg-transparent outline-none"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
               />
            </fieldset>
            <button
               type="submit"
               className={`${updateButtonStyle} ${username === user ? "opacity-50" : ""}`}
               disabled={username === user}
               onClick={(e) => {
                  e.preventDefault();
                  console.log(username);
               }}
            >
               Update username
            </button>
            <div className="grid grid-cols-3 gap-4">
               <fieldset className={`${fieldsetStyle} col-span-1`}>
                  <legend className="px-1">Old Password</legend>
                  <input
                     type="password"
                     className="w-full bg-transparent outline-none"
                     onChange={(e) => setOldPassword(e.target.value)}
                  />
               </fieldset>
               <fieldset className={`${fieldsetStyle} col-span-1`}>
                  <legend className="px-1">New Password</legend>
                  <input
                     type="password"
                     className="w-full bg-transparent outline-none"
                     onChange={(e) => setNewPassword(e.target.value)}
                  />
               </fieldset>
               <fieldset className={`${fieldsetStyle} col-span-1`}>
                  <legend className="px-1">Repeat Password</legend>
                  <input
                     type="password"
                     className="w-full bg-transparent outline-none"
                     onChange={(e) => setRepeatPassword(e.target.value)}
                  />
               </fieldset>
            </div>
         </form>
      </div>
   );
}

export default Profile;
