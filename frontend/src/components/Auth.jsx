import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../configs/apiClient';
import { useAuth } from '../context/AuthContext';

function handleAuth(username, password, type, setError, login, navigate) {
   if (type === 'Login') {
      apiClient
         .post('/login', { username, password })
         .then((response) => {
            localStorage.setItem('token', response.data.token);
            login(response.data.id, response.data.user);
            navigate('/explore');
         })
         .catch((error) => setError(error.response.data.error || 'Invalid login'));
   } else if (type === 'Register') {
      apiClient
         .post('/register', { username, password })
         .then((response) => {
            localStorage.setItem('token', response.data.token);
            login(response.data.id, response.data.user);
            navigate('/explore');
         })
         .catch((error) => setError(error.response.data.error || 'Invalid register'));
   }
}

function AuthPartition({ type }) {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [repeatPassword, setRepeatPassword] = useState('');
   const [error, setError] = useState('');
   const { login } = useAuth();
   const navigate = useNavigate();

   const fieldSetStyle = 'pb-2 px-2 mb-2 rounded-md border border-1 border-primary';
   const inputStyle = 'w-full bg-transparent outline-none';

   return (
      <form className="col-span-1 p-4">
         <h1 className="text-2xl font-bold mb-4">{type}</h1>
         <fieldset className={fieldSetStyle}>
            <legend className="px-1">Username</legend>
            <input
               type="text"
               className={inputStyle}
               onChange={(e) => setUsername(e.target.value)}
            />
         </fieldset>
         <fieldset className={fieldSetStyle}>
            <legend className="px-1">Password</legend>
            <input
               type="password"
               className={inputStyle}
               onChange={(e) => setPassword(e.target.value)}
            />
         </fieldset>
         {type === 'Register' && (
            <fieldset className={fieldSetStyle}>
               <legend className="px-1">Repeat Password</legend>
               <input
                  type="password"
                  className={inputStyle}
                  onChange={(e) => setRepeatPassword(e.target.value)}
               />
            </fieldset>
         )}
         <p className="mb-2 text-wrong">{error}</p>
         <button
            type="submit"
            className=" bg-primary text-background p-2 rounded-md"
            onClick={(e) => {
               e.preventDefault();
               if (type === 'Register' && password !== repeatPassword) {
                  setError('Passwords do not match.');
                  return;
               }
               setError('');
               handleAuth(username, password, type, setError, login, navigate);
            }}
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
