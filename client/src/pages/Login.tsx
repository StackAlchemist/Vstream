import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const toggleForm = () => {
    setIsLogin((prev) => !prev);
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    try {
      if (isLogin){
        const response = await axios.post(import.meta.env.VITE_API_URL + '/auth/login', { email, password });
        console.log('login:',response.data);
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('name', response.data.user.name)
        localStorage.setItem('userId', response.data.user.id)
        toast.success(response.data.message)
      }else{
        const response = await axios.post(import.meta.env.VITE_API_URL + '/auth/signup', { name, email, password });
        console.log('signup:',response.data);
        localStorage.setItem('authToken', response.data.token)
        localStorage.setItem('name', response.data.user.name)
        localStorage.setItem('userId', response.data.user.id)
        toast.success(response.data.message)
      } 
    } catch (err: any) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        // Validation errors from backend
        setErrors(err.response.data.errors || {});
      } else {
        // Other (network/server) errors
        console.error('Signup error:', err);
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    };
  };

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background Image */}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/10 bg-opacity-60" />

      {/* Auth Form */}
      <div className="relative z-10 flex justify-center items-center h-full">
        <div className="bg-black bg-opacity-75 p-10 rounded-md w-[90%] max-w-md text-white">
          <h2 className="text-3xl font-bold mb-6">
            {isLogin ? "Sign In" : "Sign Up"}
          </h2>

          <form className="flex flex-col gap-4" onSubmit={onSubmitHandler}>
            {!isLogin && (
              <>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-zinc-800 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
                />
                {errors.name && <p className="text-red-500 text-sm  text-right -mt-3">{errors.name}</p>}
              </>
            )}
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-zinc-800 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.email && <p className="text-red-500 text-sm  text-right -mt-3">{errors.email}</p>}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-zinc-800 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.password && <p className="text-red-500 text-sm  text-right -mt-3">{errors.password}</p>}
            {/* {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="bg-zinc-800 p-3 rounded outline-none focus:ring-2 focus:ring-red-500"
              />
            )} */}
            <button type="submit" className="bg-red-600 hover:bg-red-700 transition-colors p-3 rounded font-semibold">
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          {/* {isLogin && (
            <div className="flex justify-between items-center mt-4 text-sm text-zinc-400">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="accent-red-600" />
                Remember me
              </label>
              <span className="hover:underline cursor-pointer">Need help?</span>
            </div>
          )} */}

          <div className="mt-8 text-sm text-zinc-400">
            {isLogin ? "New to Vstream?" : "Already have an account?"}{" "}
            <span
              className="text-white hover:underline cursor-pointer"
              onClick={toggleForm}
            >
              {isLogin ? "Signup now" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
